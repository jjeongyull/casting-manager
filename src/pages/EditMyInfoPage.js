import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../util/api';

function EditMyInfoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const userDetails = location.state;

  const [formData, setFormData] = useState({
    mem_name: '',
    mem_phone: '',
    mem_email: '',
    casting_mode: 0,
  });

  useEffect(() => {
    if (!userDetails) {
      alert('잘못된 접근입니다.');
      navigate('/');
      return;
    }

    setFormData({
      mem_name: userDetails.mem_name || '',
      mem_phone: userDetails.mem_phone || '',
      mem_email: userDetails.mem_email || '',
      casting_mode: userDetails.casting_mode || 0,
    });
  }, [userDetails, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCastingModeChange = () => {
    setFormData((prev) => ({ ...prev, casting_mode: prev.casting_mode === 1 ? 0 : 1 }));
  };

  const handleSubmit = async () => {
    try {
      const response = await api({
        cmd: 'update_my_info',
        mem_id: userDetails.mem_id,
        mem_name: formData.mem_name,
        mem_phone: formData.mem_phone,
        mem_email: formData.mem_email,
        casting_mode: formData.casting_mode
      });

      if (response.status === 200) {
        alert('내 정보가 성공적으로 수정되었습니다.');
        navigate('/my-page');
      } else {
        throw new Error('정보 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error(error.message);
      alert('정보 수정 중 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="max-w-full bg-gray-900 text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
          내 정보 수정
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-300">이름</label>
            <input
              type="text"
              name="mem_name"
              value={formData.mem_name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-300">전화번호</label>
            <input
              type="text"
              name="mem_phone"
              value={formData.mem_phone}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-300">이메일</label>
            <input
              type="email"
              name="mem_email"
              value={formData.mem_email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-300">권한</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-gray-300">
                <input
                  type="checkbox"
                  checked={formData.casting_mode === 1}
                  onChange={handleCastingModeChange}
                  className="w-5 h-5 text-blue-500 focus:ring-2 focus:ring-blue-400"
                />
                캐스팅 디렉터
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
          >
            수정하기
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditMyInfoPage;