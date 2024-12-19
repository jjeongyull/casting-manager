import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../util/api';

import functions from '../util/functions';
import Confirm from '../components/ConfirmComponent';
import AlertComponent from '../components/AlertComponent';

function SignPage() {
  const navigate = useNavigate();
  const [modalMainText, setModalMainText] = useState('');
  const [modalSubText, setModalSubText] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    castingMode: 0,
  });

  const signInCon = (e) => {
    e.preventDefault();
    setModalMainText('회원가입');
    setModalSubText('회원가입을 진행하시겠습니까?');
    setConfirmOpen(true);
  }

  const inputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      setForm({ ...form, [name]: functions.formatPhoneNumber(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };


  const castingModeChange = (e) => {
    setForm({ ...form, castingMode: e.target.checked ? 1 : 0 });
  };

  const signApi = async () => {
    setConfirmOpen(false);
    const { name, phone, email, username, password, confirmPassword } = form;
    if (!name.trim()) {
      setModalSubText('이름 입력하세요.');
      setAlertOpen(true);
      return;
    }
    if (!username.trim()) {
      setModalSubText('아이디를 입력하세요.');
      setAlertOpen(true);
      return;
    }
    if (!phone.trim()) {
      setModalSubText('전화번호를 입력하세요.');
      setAlertOpen(true);
      return;
    }
    if (!email.trim()) {
      setModalSubText('이메일을 입력하세요.');
      setAlertOpen(true);
      return;
    }

    if (!password.trim()) {
      setModalSubText('비밀번호를 입력하세요.');
      setAlertOpen(true);
      return;
    }
    if (!confirmPassword.trim()) {
      setModalSubText('비밀번호 확인을 입력하세요.');
      setAlertOpen(true);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setModalSubText('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      setAlertOpen(true);
      return;
    }

    try {
      const result = await api({
        cmd: 'sign_member',
        mem_name: form.name,
        mem_phone: form.phone,
        mem_email: form.email,
        mem_id: form.username,
        mem_password: form.password,
        casting_mode: form.castingMode,
      });
      if (result.status === 200) {
        setModalSubText('회원가입이 완료되었습니다.');
        setAlertOpen(true);
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      }
    } catch (error) {
      setModalSubText('회원가입 에러: ' + error.message);
      setAlertOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      {
        alertOpen && (
          <AlertComponent 
            onClose={() => setAlertOpen(false)}
            mainText={modalMainText}
            subText={modalSubText}
          />
        )
      }
      {
        confirmOpen && (
          <Confirm 
            onConfirm={signApi}
            onClose={() => setConfirmOpen(false)}
            mainText={modalMainText}
            subText={modalSubText}
          />
        )
      }
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
          회원가입
        </h1>
        <form onSubmit={signInCon} className="space-y-4">
          {/* 이름 */}
          <div>
            <label className="block mb-1 text-gray-300">이름</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={inputChange}
              placeholder="이름"
              className="w-full px-4 py-2 bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          
          {/* 아이디 */}
          <div>
            <label className="block mb-1 text-gray-300">아이디</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={inputChange}
              placeholder="아이디"
              className="w-full px-4 py-2 bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* 전화번호 */}
          <div>
            <label className="block mb-1 text-gray-300">전화번호</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={inputChange}
              placeholder="전화번호"
              className="w-full px-4 py-2 bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* 이메일 */}
          <div>
            <label className="block mb-1 text-gray-300">이메일</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={inputChange}
              placeholder="이메일"
              className="w-full px-4 py-2 bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block mb-1 text-gray-300">비밀번호</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={inputChange}
              placeholder="비밀번호"
              className="w-full px-4 py-2 bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="block mb-1 text-gray-300">비밀번호 확인</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={inputChange}
              placeholder="비밀번호 확인"
              className="w-full px-4 py-2 bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          
          {/* 캐스팅 모드 */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.castingMode === 1}
              onChange={castingModeChange}
              className="h-5 w-5 text-green-500"
              id='cast_mode'
            />
            <label for='cast_mode' className="text-gray-300">캐스팅 디렉터</label>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition-all"
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignPage;
