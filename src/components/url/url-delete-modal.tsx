'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';

interface UrlDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  urlTitle?: string;
}

export function UrlDeleteModal({ open, onClose, onConfirm, urlTitle }: UrlDeleteModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">URL 삭제</h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {urlTitle ? `"${urlTitle}"` : '이 URL'}을(를) 삭제하시겠습니까?
        <br />
        삭제된 데이터는 복구할 수 없습니다.
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          취소
        </Button>
        <Button variant="danger" onClick={handleConfirm} loading={loading}>
          삭제
        </Button>
      </div>
    </Modal>
  );
}
