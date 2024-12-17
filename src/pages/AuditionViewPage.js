import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../util/api';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../features/user/userSlice';

function AuditionViewPage() {
  const userInfo = useSelector(selectUserInfo);
  const [auditionData, setAuditionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [viewCountUpdated, setViewCountUpdated] = useState(false);

  const loadAuditionData = async () => {
    try {
      const response = await api({ cmd: 'load_audition_data', idx: id });
      if (response.status === 200) {
        setAuditionData(response.data);
      }
    } catch (error) {
      console.error('Error loading audition data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const load_profile = async () => {
    try {
      const response = await api({
        cmd: 'load_my_profile',
        mem_id: userInfo?.mem_id,
      });
      if (response.data.mem_id) {
        setProfile(response.data);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('Failed to fetch profiles:', error);
      setProfile(null);
    }
  };

  const updateViewCount = async () => {
    if (!viewCountUpdated) {
      await api({ cmd: 'update_view_count', idx: id });
      setViewCountUpdated(true);
    }
  };

  const insertApply = async () => {
    const response = await api({
      cmd: 'apply_profile',
      apply_idx: auditionData?.idx,
      mem_id: userInfo?.mem_id,
    });
    alert(response.statusText);
  };

  useEffect(() => {
    loadAuditionData();
    if (!viewCountUpdated) {
      updateViewCount();
      setViewCountUpdated(true);
    }
    if (userInfo) {
      load_profile();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-400"></div>
      </div>
    );
  }

  if (!auditionData) {
    return (
      <div className="text-center text-red-500 mt-10 text-xl">
        공고 정보를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div className="max-w-full min-h-screen bg-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-10 bg-gray-800 rounded-lg shadow-lg">
        {/* 제목 */}
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
          {auditionData.project_name}
        </h1>

        {/* 상세 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-gray-300 text-sm mb-1">작품 유형</p>
            <p className="text-lg font-semibold">{auditionData.project_type}</p>
          </div>
          <div>
            <p className="text-gray-300 text-sm mb-1">배역</p>
            <p className="text-lg font-semibold">{auditionData.project_casting}</p>
          </div>
          <div>
            <p className="text-gray-300 text-sm mb-1">작성자</p>
            <p className="text-lg font-semibold">{auditionData.project_writer}</p>
          </div>
          <div>
            <p className="text-gray-300 text-sm mb-1">페이</p>
            <p className="text-lg font-semibold">{auditionData.project_pay?auditionData.project_pay:"미기재"}</p>
          </div>
          <div>
            <p className="text-gray-300 text-sm mb-1">작성일</p>
            <p className="text-lg font-semibold">
              {new Date(auditionData.writer_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-300 text-sm mb-1">진행 상태</p>
            <p className="text-lg font-semibold">
              {auditionData.project_active === 0 ? '진행중' : '마감'}
            </p>
          </div>
        </div>

        {/* 상세 내용 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-400 mb-2">상세 내용</h2>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {auditionData.project_info}
          </p>
        </div>

        {/* 버튼 */}
        {profile && (
          <div className="text-center mt-6">
            <button
              onClick={insertApply}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold shadow-lg transition-all"
            >
              지원하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuditionViewPage;

