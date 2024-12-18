import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../util/api';

function PasswordChangePopup({ isOpen, onClose, memId }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!newPassword.trim()) {
      alert('새 비밀번호를 입력하세요.');
      return;
    }
    if (!confirmPassword.trim()) {
      alert('새 비밀번호 확인을 입력하세요.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await api({
        cmd: 'change_password',
        mem_id: memId,
        mem_password: newPassword
      });

      if (response.status === 200) {
        alert('비밀번호가 성공적으로 변경되었습니다.');
        onClose();
      } else {
        throw new Error('비밀번호 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
      alert('비밀번호 변경 중 오류가 발생했습니다.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white w-96">
        <h2 className="text-xl font-bold mb-4">비밀번호 변경</h2>
        <div className="mb-4">
          <label className="block text-sm mb-2">새 비밀번호</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder='새 비밀번호를 입력하세요.'
            className="w-full px-4 py-2 rounded-lg bg-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm mb-2">새 비밀번호 확인</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder='새 비밀번호 확인을 입력하세요.'
            className="w-full px-4 py-2 rounded-lg bg-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
          >
            변경하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default PasswordChangePopup;