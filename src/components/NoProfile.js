import React from 'react';
import { useNavigate } from 'react-router-dom';

function NoProfile() {
  const navigate = useNavigate();

  const handleCreateProfile = () => {
    navigate('/create_profile'); // 프로필 작성 페이지로 이동
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white text-center px-6">
      {/* 아이콘이나 이미지 추가 (선택 사항) */}
      <div className="mb-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-24 w-24 text-blue-400 animate-bounce"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </div>

      {/* 메시지 영역 */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
        프로필이 없습니다.
      </h1>
      <p className="text-lg text-gray-300 mb-8">
        지금 바로 프로필을 만들어 나만의 매력을 보여주세요!
      </p>

      {/* 버튼 */}
      <button
        onClick={handleCreateProfile}
        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
      >
        프로필 만들기
      </button>
    </div>
  );
}

export default NoProfile;
