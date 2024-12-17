import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ loginState, Logout, myId, castingMode }) => {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-md">
      <nav className="flex items-center justify-between px-6 py-4">
        {/* 로고 */}
        <div
          className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 cursor-pointer"
          onClick={() => navigate('/')}
        >
          Casting Manager
        </div>

        {/* 메뉴 */}
        <div className="flex items-center space-x-4">
          {loginState !== true ? (
            <>
              <button
                onClick={() => navigate('/login')}
                className="text-gray-300 hover:text-white transition duration-300"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/sign')}
                className="text-gray-300 hover:text-white transition duration-300"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              {castingMode === 1 ? (
                <button
                  onClick={() => navigate(`/my-audition/${myId}`)}
                  className="text-gray-300 hover:text-white transition duration-300"
                >
                  내 공고보기
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/actor/${myId}`)}
                  className="text-gray-300 hover:text-white transition duration-300"
                >
                  마이페이지
                </button>
              )}
              <button
                onClick={() => navigate(`/audition`)}
                className="text-gray-300 hover:text-white transition duration-300"
              >
                오디션 리스트
              </button>
              <button
                onClick={() => Logout()}
                className="text-red-400 hover:text-red-500 transition duration-300"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
