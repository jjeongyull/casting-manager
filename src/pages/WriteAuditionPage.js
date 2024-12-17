import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../features/user/userSlice';
import { api } from '../util/api';
import { useNavigate } from 'react-router-dom';

const WriteAuditionPage = () => {
  const navigate = useNavigate();
  const userInfo = useSelector(selectUserInfo);

  const [formData, setFormData] = useState({
    project_name: '',
    project_type: '',
    project_casting: '',
    project_pay: '',
    project_info: '',
    project_active: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'project_active') {
      setFormData({ ...formData, [name]: value === 'progress' ? 0 : 1 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const createAudition = async () => {
    const { project_name, project_type, project_pay, project_casting, project_info } = formData;
    if (!project_name.trim()) {
      alert('작품명을 입력하세요.');
      return;
    }
    if (!project_type) {
      alert('작품 유형을 선택하세요.');
      return;
    }
    if (!project_casting.trim()) {
      alert('배역을 입력하세요.');
      return;
    }
    if (!project_pay.trim()) {
      alert('프로젝트 페이를 입력하세요.');
      return;
    }
    if (!project_info.trim()) {
      alert('세부 내용을 입력하세요.');
      return;
    }


    const response = await api({
      cmd: 'insert_audition',
      project_name: formData.project_name,
      project_type: formData.project_type,
      project_pay: formData.project_pay,
      project_casting: formData.project_casting,
      project_writer: userInfo?.mem_name,
      project_writer_id: userInfo?.mem_id,
      project_info: formData.project_info,
      project_active: formData.project_active,
    });

    if (response.status === 200) {
      alert('공고가 등록되었습니다.');
      navigate('/audition');
    }
  };

  return (
    <div className="max-w-full min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12 bg-gray-900 text-white rounded-lg shadow-lg">
        {/* 헤더 */}
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
          공고 작성
        </h1>

        {/* 입력 필드 */}
        <div className="space-y-6">
          {/* 작품 명 */}
          <div>
            <label className="block text-sm font-semibold mb-2">작품 명</label>
            <input
              type="text"
              name="project_name"
              value={formData.project_name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="작품 명을 입력하세요"
            />
          </div>

          {/* 작품 유형 */}
          <div>
            <label className="block text-sm font-semibold mb-2">작품 유형</label>
            <select
              name="project_type"
              value={formData.project_type}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="" disabled>
                유형을 선택하세요
              </option>
              {[
                '단편영화',
                '장편영화',
                'OTT',
                '독립영화',
                '드라마',
                '웹드라마',
                '유튜브',
                '기타',
              ].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* 배역 */}
          <div>
            <label className="block text-sm font-semibold mb-2">배역</label>
            <input
              type="text"
              name="project_casting"
              value={formData.project_casting}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="배역을 입력하세요"
            />
          </div>

          {/* 페이 */}
          <div>
            <label className="block text-sm font-semibold mb-2">페이</label>
            <input
              type="text"
              name="project_pay"
              value={formData.project_pay}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="배역을 입력하세요"
            />
          </div>

          {/* 세부 내용 */}
          <div>
            <label className="block text-sm font-semibold mb-2">세부 내용</label>
            <textarea
              name="project_info"
              value={formData.project_info}
              onChange={handleInputChange}
              rows="5"
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="세부 내용을 입력하세요"
            ></textarea>
          </div>

          {/* 공고 상태 */}
          <div>
            <label className="block text-sm font-semibold mb-2">공고 상태</label>
            <div className="flex space-x-6">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="project_active"
                  value="progress"
                  checked={formData.project_active === 0}
                  onChange={handleInputChange}
                  className="form-radio text-blue-400 focus:ring-2 focus:ring-blue-400"
                />
                <span>진행중</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="project_active"
                  value="closed"
                  checked={formData.project_active === 1}
                  onChange={handleInputChange}
                  className="form-radio text-blue-400 focus:ring-2 focus:ring-blue-400"
                />
                <span>마감</span>
              </label>
            </div>
          </div>

          {/* 버튼 */}
          <div className="text-center mt-8">
            <button
              onClick={createAudition}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-md transition-all"
            >
              글쓰기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteAuditionPage;
