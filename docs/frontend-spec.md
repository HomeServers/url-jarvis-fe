# URL Jarvis Frontend Specification

## 1. 프로젝트 개요

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **상태 관리**: React Context 또는 Zustand
- **HTTP Client**: fetch (Next.js 내장)

### 배포 환경
- **K8s**: `jarvis` 네임스페이스 (BE와 동일)
- **도메인**: `url-jarvis.nuhgnod.site`
- **BE 통신**: ClusterIP `url-jarvis:8080` (같은 ns 내부)

---

## 2. 페이지 구조 및 라우팅

```
/                           → 랜딩 페이지 (미인증 시) / 대시보드 리다이렉트 (인증 시)
/login                      → 소셜 로그인 페이지
/oauth/callback/google      → Google OAuth 콜백
/oauth/callback/kakao       → Kakao OAuth 콜백 (추후)
/oauth/callback/naver       → Naver OAuth 콜백 (추후)
/dashboard                  → URL 목록 (메인)
/dashboard/search           → 전체 검색
/dashboard/urls/{id}        → URL 상세 + 개별 검색
```

---

## 3. 인증 흐름

### OAuth 로그인
```
1. 사용자가 /login에서 "Google로 로그인" 클릭
2. Google OAuth 인증 페이지로 리다이렉트
   - client_id: 469407659650-5291ms90hc5v4fgjuvs9455eebrckiqp.apps.googleusercontent.com
   - redirect_uri: https://url-jarvis.nuhgnod.site/oauth/callback/google
   - response_type: code
   - scope: openid email profile
3. Google이 /oauth/callback/google?code=xxx 로 리다이렉트
4. 콜백 페이지에서 BE API 호출:
   POST /api/auth/google { code, redirectUri }
5. 응답의 accessToken, refreshToken을 저장
6. /dashboard로 리다이렉트
```

### 토큰 관리
- **저장**: localStorage 또는 메모리 (accessToken), localStorage (refreshToken)
- **API 요청**: `Authorization: Bearer {accessToken}` 헤더
- **만료**: accessToken 1시간, refreshToken 14일
- **갱신**: accessToken 만료 전 `POST /api/auth/refresh` 호출

---

## 4. BE API 연동 명세

### 4.1 인증

#### OAuth 로그인
```
POST /api/auth/{provider}
Content-Type: application/json

Request:
{
  "code": "authorization_code_from_oauth",
  "redirectUri": "https://url-jarvis.nuhgnod.site/oauth/callback/google"
}

Response (202):
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

#### 토큰 갱신
```
POST /api/auth/refresh
Content-Type: application/json

Request:
{ "refreshToken": "eyJ..." }

Response (200):
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

### 4.2 URL 관리

#### URL 등록
```
POST /api/urls
Authorization: Bearer {token}

Request:
{ "url": "https://example.com/article" }

Response (202):
{
  "success": true,
  "data": {
    "id": 1,
    "url": "https://example.com/article",
    "title": null,
    "description": null,
    "domain": "example.com",
    "status": "PENDING",
    "failReason": null,
    "createdAt": "2026-02-16T12:00:00",
    "updatedAt": "2026-02-16T12:00:00"
  }
}

Error (409 - 중복):
{
  "success": false,
  "data": { "existingUrlId": 1 },
  "error": "이미 등록된 URL입니다 (id: 1)"
}
```

#### URL 목록 조회
```
GET /api/urls?page=0&size=20
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "content": [ ...UrlResponse ],
    "page": 0,
    "size": 20,
    "totalElements": 45,
    "totalPages": 3
  }
}
```

#### URL 상세 조회
```
GET /api/urls/{id}
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": { ...UrlResponse }
}
```

#### URL 삭제
```
DELETE /api/urls/{id}
Authorization: Bearer {token}

Response: 204 No Content
```

#### URL 재크롤링
```
POST /api/urls/{id}/recrawl
Authorization: Bearer {token}

Response (202):
{
  "success": true,
  "data": { ...UrlResponse (status: "PENDING") }
}

Error (409 - 크롤링 중):
{
  "success": false,
  "error": "현재 크롤링이 진행 중입니다 (id: 1)"
}
```

### 4.3 검색

#### 전체 검색
```
POST /api/search
Authorization: Bearer {token}

Request:
{
  "query": "검색어",
  "topK": 5
}

Response (200):
{
  "success": true,
  "data": {
    "answer": "LLM이 생성한 답변...",
    "sources": [
      {
        "urlId": 1,
        "url": "https://example.com/article",
        "title": "Article Title",
        "thumbnail": "https://example.com/og-image.jpg",
        "domain": "example.com",
        "matchedContent": "관련 텍스트 청크...",
        "similarity": 0.89
      }
    ]
  }
}
```

#### URL별 검색
```
POST /api/urls/{urlId}/search
Authorization: Bearer {token}

Request: { "query": "검색어", "topK": 5 }
Response: (전체 검색과 동일한 형태)
```

---

## 5. 에러 응답 형식

모든 에러는 동일한 형식으로 반환:

```json
{
  "success": false,
  "data": null,
  "error": "에러 메시지"
}
```

| HTTP 상태 | 의미 |
|-----------|------|
| 400 | 잘못된 요청 (유효성 검증 실패, 잘못된 토큰 등) |
| 401 | 인증 필요 (토큰 없음/만료) |
| 404 | 리소스 없음 |
| 409 | 충돌 (URL 중복, 크롤링 진행 중) |
| 500 | 서버 내부 오류 |

---

## 6. 핵심 기능별 화면 흐름

### 6.1 URL 등록 + 크롤링 상태
```
1. 사용자가 URL 입력 후 등록
2. POST /api/urls → 202 응답 (status: PENDING)
3. 목록에 PENDING 상태로 표시
4. 주기적으로 GET /api/urls/{id}로 폴링 (3~5초 간격)
5. status 변화 감지:
   - PENDING → CRAWLING: "크롤링 중..." 표시
   - CRAWLING → CRAWLED: 완료 표시 (title, description 업데이트)
   - CRAWLING → FAILED: 실패 표시 (failReason 노출) + 재크롤링 버튼
```

### 6.2 RAG 검색
```
1. 검색창에 자연어 질문 입력
2. POST /api/search → 로딩 표시
3. 응답 수신:
   - answer: LLM 답변을 메인에 표시
   - sources: 출처 URL 카드 목록 (thumbnail, title, domain, similarity)
4. 출처 카드 클릭 → /dashboard/urls/{urlId}로 이동
```

### 6.3 URL 상세 + 개별 검색
```
1. URL 상세 정보 표시 (title, description, domain, status)
2. 해당 URL 내에서 검색 가능 (POST /api/urls/{id}/search)
3. 재크롤링 버튼 (FAILED 상태일 때)
4. 삭제 버튼 (확인 모달)
```

---

## 7. 크롤링 상태 표시

| Status | UI 표시 | 색상 |
|--------|---------|------|
| `PENDING` | 대기 중 | gray |
| `CRAWLING` | 크롤링 중... (스피너) | blue |
| `CRAWLED` | 완료 | green |
| `FAILED` | 실패 (failReason 표시) | red |

---

## 8. K8s 배포 설정

### Dockerfile
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

### K8s 매니페스트

#### Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: url-jarvis-web
  namespace: jarvis
spec:
  replicas: 1
  selector:
    matchLabels:
      app: url-jarvis-web
  template:
    spec:
      containers:
        - name: url-jarvis-web
          image: nuhgnod/url-jarvis-web:latest
          ports:
            - containerPort: 3000
          env:
            - name: NEXT_PUBLIC_API_URL
              value: "http://url-jarvis:8080"
          resources:
            requests:
              memory: 128Mi
              cpu: 100m
            limits:
              memory: 256Mi
              cpu: 200m
```

#### Service
```yaml
apiVersion: v1
kind: Service
metadata:
  name: url-jarvis-web
  namespace: jarvis
spec:
  type: ClusterIP
  selector:
    app: url-jarvis-web
  ports:
    - port: 3000
      targetPort: 3000
```

#### Ingress
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: url-jarvis-ingress
  namespace: jarvis
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - url-jarvis.nuhgnod.site
      secretName: url-jarvis-tls
  rules:
    - host: url-jarvis.nuhgnod.site
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: url-jarvis
                port:
                  number: 8080
          - path: /
            pathType: Prefix
            backend:
              service:
                name: url-jarvis-web
                port:
                  number: 3000
```

---

## 9. 환경변수

| 변수 | 설명 | 값 |
|------|------|-----|
| `NEXT_PUBLIC_API_URL` | BE API 기본 URL | `http://url-jarvis:8080` (K8s 내부) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth Client ID | `469407659650-...` |
