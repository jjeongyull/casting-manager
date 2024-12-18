import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { api } from '../util/api';
import cookiesFunction from '../util/cookie';
import { setUserInfo } from '../features/user/userSlice';

const LoginPage = ({ setLoginState, setMyId, setCastingMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    mem_id: '',
    mem_password: '',
  });

  const [errors, setErrors] = useState({
    mem_id: '',
    mem_password: '',
  });

  const InputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const EnterLogin = (e) => {
    if (e.key === 'Enter') {
      login();
    }
  };

  const login = async () => {
    const { mem_id, mem_password } = form;
    if (!mem_id.trim()) {
      alert('아이디를 입력하세요.');
      return;
    }
    if (!mem_password.trim()) {
      alert('비밀번호를 입력하세요.');
      return;
    }

    try {
      const result = await api({
        cmd: 'login',
        mem_id: form.mem_id,
        mem_password: form.mem_password,
      });
      if (result.status === 200) {
        cookiesFunction.setCookie('casting_manager', result.token, 1);
        dispatch(setUserInfo(result.data));
        setLoginState(true);
        setMyId(form.mem_id);
        setCastingMode(result.data.casting_mode);
        navigate('/');
      }
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
          로그인
        </h1>

        <div className="space-y-4">
          {/* 아이디 입력 */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">아이디</label>
            <input
              type="text"
              name="mem_id"
              value={form.mem_id}
              onChange={InputChange}
              onKeyDown={EnterLogin}
              placeholder="ID"
              className="w-full px-4 py-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">비밀번호</label>
            <input
              type="password"
              name="mem_password"
              value={form.mem_password}
              onChange={InputChange}
              onKeyDown={EnterLogin}
              placeholder="Password"
              className="w-full px-4 py-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* 로그인 버튼 */}
          <div>
            <button
              onClick={login}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition-all"
            >
              로그인
            </button>
          </div>

          {/* 회원가입 버튼 */}
          <div>
            <button
              onClick={() => navigate('/sign')}
              className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-2 rounded-md transition-all"
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
