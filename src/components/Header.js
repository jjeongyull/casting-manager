import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Confirm from './ConfirmComponent';

const Header = ({ loginState, myId, castingMode, Logout, setModalOpen, ModalOpen }) => {
  const navigate = useNavigate();
  const [modalMainText, setModalMainText] = useState('');
  const [modalSubText, setModalSubText] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const LogoutModalOpen = () => {
    setModalMainText('로그아웃');
    setModalSubText('로그아웃 하시겠습니까?');
    setModalOpen(true);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <header className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-md">
      <nav className="flex items-center justify-between px-6 py-4">
        {/* 로고 */}
        <div
          className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 cursor-pointer"
          onClick={() => navigate('/')}
        >
          CTM
        </div>

        {/* 햄버거 메뉴 버튼 */}
        <div className="lg:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-300 hover:text-white focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* 데스크톱 메뉴 */}
        <div className="hidden lg:flex space-x-4">
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
                <>
                  <button
                  onClick={() => navigate(`/my-apply`)}
                  className="text-gray-300 hover:text-white transition duration-300"
                  >
                    지원현황
                  </button>
                  <button
                    onClick={() => navigate(`/actor/${myId}`)}
                    className="text-gray-300 hover:text-white transition duration-300"
                  >
                    내 프로필
                  </button>
                </>
              )}
              
              <button
                onClick={() => navigate(`/audition`)}
                className="text-gray-300 hover:text-white transition duration-300"
              >
                오디션 리스트
              </button>
              <button
                onClick={() => navigate(`/my-page`)}
                className="text-gray-300 hover:text-white transition duration-300"
              >
                내 정보
              </button>
              <button
                onClick={LogoutModalOpen}
                className="text-red-400 hover:text-red-500 transition duration-300"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-90 z-50 flex flex-col items-center justify-center space-y-4 text-center lg:hidden">
          {loginState !== true ? (
            <>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate('/login');
                }}
                className="text-white text-lg"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate('/sign');
                }}
                className="text-white text-lg"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              {castingMode === 1 ? (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate(`/my-audition/${myId}`);
                  }}
                  className="text-white text-lg"
                >
                  내 공고보기
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate(`/my-apply`);
                    }}
                    className="text-white text-lg"
                  >
                    지원현황
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate(`/actor/${myId}`);
                    }}
                    className="text-white text-lg"
                  >
                    내 프로필
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate(`/audition`);
                }}
                className="text-white text-lg"
              >
                오디션 리스트
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate(`/my-page`);
                }}
                className="text-white text-lg"
              >
                내 정보
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  LogoutModalOpen();
                }}
                className="text-red-400 text-lg"
              >
                Logout
              </button>
            </>
          )}
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-400 hover:text-white mt-6"
          >
            닫기
          </button>
        </div>
      )}

      {/* Confirm Modal */}
      {ModalOpen && (
        <Confirm
          onConfirm={Logout}
          onClose={() => setModalOpen(false)}
          mainText={modalMainText}
          subText={modalSubText}
        />
      )}
    </header>
  );
};

export default Header;
