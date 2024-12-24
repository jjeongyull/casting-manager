import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { api } from '../util/api';

import AlertComponent from '../components/AlertComponent';

const ValidationPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // 이메일 값을 URL에서 받아옴
  const [email, setEmail] = useState('');

  const [modalMainText, setModalMainText] = useState('');
  const [modalSubText, setModalSubText] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    if (id) {
      setEmail(id);
    }
  }, [id]);

  const EmailValidation = async () => {
    try {
      const result = await api({
        cmd: 'validation_email',
        mem_email: id,
      });

      if(result.status === 200){
        setModalSubText('인증이 완료되었습니다. 로그인을 진행 해보세요.');
        setAlertOpen(true);
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      }
    }catch (error) {
      setModalSubText('인증 에러: ' + error.message);
      setAlertOpen(true);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      {
        alertOpen && (
          <AlertComponent 
            onClose={() => setAlertOpen(false)}
            mainText={modalMainText}
            subText={modalSubText}
          />
        )
      }
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-blue-400 mb-4">CTM입니다</h1>
        <p className="text-center text-gray-300 mb-6">
          아래 버튼을 눌러 이메일 인증을 완료해주세요.
        </p>

        <div className="bg-gray-700 p-4 rounded-lg mb-6 overflow-hidden">
          <p className="text-center text-gray-200 font-medium truncate">{email}</p>
        </div>

        <button
          onClick={EmailValidation}
          className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all"
        >
          이메일 인증하기
        </button>
      </div>
    </div>
  );
};

export default ValidationPage;
