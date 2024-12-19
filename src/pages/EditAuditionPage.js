import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../util/api';
import Confirm from '../components/ConfirmComponent';
import AlertComponent from '../components/AlertComponent';

function EditAuditionPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [modalMainText, setModalMainText] = useState('');
  const [modalSubText, setModalSubText] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  // state로 넘어온 오디션 데이터
  const audition = location.state || {};

  const updateAuditionCon = () => {
    setModalMainText('공고 수정');
    setModalSubText('위 내용으로 공고를 수정겠습니까?');
    setConfirmOpen(true);
  }

  const checkInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'project_active') {
      setFormData({ ...formData, [name]: value === 'progress' ? 0 : 1 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const [formData, setFormData] = useState({
    project_name: '',
    project_type: '',
    project_casting: '',
    project_pay: '',
    project_info: '',
    project_active: 0
  });

  useEffect(() => {
    if (!audition) {
      console.log('잘못된 접근입니다.');
      navigate('/');
      return;
    }
    setFormData({
      project_name: audition.project_name || '',
      project_type: audition.project_type || '',
      project_casting: audition.project_casting || '',
      project_pay: audition.project_pay || '',
      project_info: audition.project_info || '',
      project_active: audition.project_active || 0,
    });
  }, [audition, navigate]);

  // 입력값 변경 핸들러
  const InputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 수정 API 호출
  const updateAuditionApi = async () => {
    setConfirmOpen(false);
    try {
      const { project_name, project_type, project_pay, project_casting, project_info } = formData;
      if (!project_name.trim()) {
        setModalSubText('작품명을 입력하세요.');
        setAlertOpen(true);
        return;
      }
      if (!project_type) {
        setModalSubText('작품 유형을 선택하세요.');
        setAlertOpen(true);
        return;
      }
      if (!project_casting.trim()) {
        setModalSubText('배역을 입력하세요.');
        setAlertOpen(true);
        return;
      }
      if (!project_pay.trim()) {
        setModalSubText('프로젝트 페이를 입력하세요.');
        setAlertOpen(true);
        return;
      }
      if (!project_info.trim()) {
        setModalSubText('세부 내용을 입력하세요.');
        setAlertOpen(true);
        return;
      }
      const response = await api({
        cmd: 'update_audition',
        project_name: formData.project_name,
        project_type: formData.project_type,
        project_pay: formData.project_pay,
        project_casting: formData.project_casting,
        project_info: formData.project_info,
        project_active: formData.project_active,
        idx: audition.idx
      });

      if (response.status === 200) {
        setModalSubText('공고가 수정되었습니다.');
        setAlertOpen(true);
        setTimeout(() => {
          navigate(`/my-audition/${audition.project_writer_id}`); // 이전 페이지로 이동
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to update audition:', error);
      setModalSubText('수정에 실패했습니다.');
      setAlertOpen(true);
    }
  };

  return (
    <div className="max-w-full mx-auto bg-gray-900 text-white min-h-screen">
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
            onConfirm={updateAuditionApi}
            onClose={() => setConfirmOpen(false)}
            mainText={modalMainText}
            subText={modalSubText}
          />
        )
      }
      <div className="max-w-4xl mx-auto p-8 bg-gray-900 text-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 mb-6">
          오디션 공고 수정
        </h1>

        <div className="space-y-4">
          {/* 제목 */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-300">공고 제목</label>
            <input
              type="text"
              name="project_name"
              value={formData.project_name}
              onChange={InputChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* 유형 */}
          <div>
            <label className="block text-sm font-semibold mb-2">작품 유형</label>
            <select
              name="project_type"
              value={formData.project_type}
              onChange={InputChange}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value={formData.project_type} disabled>
                {formData.project_type}
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
            <label className="block mb-2 text-sm font-semibold text-gray-300">배역</label>
            <input
              type="text"
              name="project_casting"
              value={formData.project_casting}
              onChange={InputChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* 작성자 */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-300">페이</label>
            <input
              type="text"
              name="project_pay"
              value={formData.project_pay}
              onChange={InputChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* 상세 내용 */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-300">상세 내용</label>
            <textarea
              name="project_info"
              value={formData.project_info}
              onChange={InputChange}
              rows="5"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
                  onChange={checkInputChange}
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
                  onChange={checkInputChange}
                  className="form-radio text-blue-400 focus:ring-2 focus:ring-blue-400"
                />
                <span>마감</span>
              </label>
            </div>
          </div>

        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => updateAuditionCon()}
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

export default EditAuditionPage;
