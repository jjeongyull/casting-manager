import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUserInfo } from '../features/user/userSlice';
import { api } from '../util/api';

import PasswordChangePopup from '../components/PasswordChangePopup';

function MyPage({Logout}) {
  const userInfo = useSelector(selectUserInfo);
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [isPasswordPopupOpen, setIsPasswordPopupOpen] = useState(false);
  // 사용자 정보 호출
  const loadMyInfo = async () => {
    try {
      const response = await api({
        cmd: 'load_my_info',
        mem_id: userInfo?.mem_id,
      });
      if (response.status === 200) {
        console.log(response);
        setUserDetails(response.data);
      } else {
        throw new Error('내 정보를 불러오는데 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error(error.message);
      alert('사용자 정보를 불러오지 못했습니다.');
    }
  };

  const memberSecession = async () => {
    if (window.confirm('정말로 회원 탈퇴를 진행하시겠습니까?\n회원을 탈퇴하면 작성한 모든 정보가 사라집니다.')) {
      try {
        const response = await api({
          cmd: 'secession_member',
          mem_id: userInfo?.mem_id,
        });
        if (response.status === 200) {
          Logout();
          navigate('/');
        } else {
          throw new Error('회원탈퇴에 오류가 발생했습니다.');
        }
      } catch (error) {
        console.error(error.message);
        alert('회원탈퇴가 이루어지지 못했습니다.');
      }
    }
  }

  useEffect(() => {
    if (!userInfo) {
      console.log('사용자 정보가 없습니다.');
      navigate('/');
      return;
    }
    loadMyInfo();
  }, [userInfo, navigate]);

  if (!userDetails) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-full bg-gray-900 text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
          내 정보
        </h1>

        {/* 사용자 정보 표 */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-blue-400 mb-4 text-center">안녕하세요, {userDetails.mem_name}님!</h2>
          <table className="w-full text-left text-gray-300 border-collapse">
            <tbody>
              <tr className="border-b border-gray-700">
                <th className="p-3 text-blue-400 font-medium">이름</th>
                <td className="p-3">{userDetails.mem_name}</td>
              </tr>
              <tr className="border-b border-gray-700">
                <th className="p-3 text-blue-400 font-medium">아이디</th>
                <td className="p-3">{userDetails.mem_id}</td>
              </tr>
              <tr className="border-b border-gray-700">
                <th className="p-3 text-blue-400 font-medium">전화번호</th>
                <td className="p-3">{userDetails.mem_phone}</td>
              </tr>
              <tr className="border-b border-gray-700">
                <th className="p-3 text-blue-400 font-medium">이메일</th>
                <td className="p-3">{userDetails.mem_email}</td>
              </tr>
              <tr className="border-b border-gray-700">
                <th className="p-3 text-blue-400 font-medium">가입일</th>
                <td className="p-3">{userDetails.sign_date}</td>
              </tr>
              <tr className="border-b border-gray-700">
                <th className="p-3 text-blue-400 font-medium">권한</th>
                <td className="p-3">
                  {userDetails.casting_mode === 1 ? (
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-lg mr-2">캐스팅 디렉터</span>
                    ) : (
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-lg mr-2">탤런트</span>
                    )
                  }
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 버튼 섹션 */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/edit-my',  { state: userDetails })}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-all"
          >
            내 정보 수정
          </button>
          <button
            onClick={() => setIsPasswordPopupOpen(true)}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-all"
          >
            비밀번호 변경
          </button>
          <button
            onClick={() => memberSecession()}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-all"
          >
            회원 탈퇴
          </button>
        </div>
      </div>

      <PasswordChangePopup isOpen={isPasswordPopupOpen} onClose={() => setIsPasswordPopupOpen(false)} memId={userInfo?.mem_id} />
    </div>
  );
}

export default MyPage;