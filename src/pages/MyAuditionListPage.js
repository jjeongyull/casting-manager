import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../features/user/userSlice';
import { api } from '../util/api';
import Profile_modal from '../components/Profile_modal';

function MyAuditionListPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [myAuditionList, setMyAuditionList] = useState([]);
  const [expandedAudition, setExpandedAudition] = useState(null);
  const [applicantProfiles, setApplicantProfiles] = useState([]);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const userInfo = useSelector(selectUserInfo);

  const fetchProfiles = async () => {
    try {
      const response = await api({
        cmd: 'load_my_audition',
        mem_id: id,
      });
      setMyAuditionList(response.data || []);
    } catch (error) {
      console.error('Failed to load my auditions:', error);
      setMyAuditionList([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteAudition = async (auditionIdx) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        const response = await api({
          cmd: 'delete_audition',
          idx: auditionIdx,
        });
        if (response.status === 200) {
          alert('공고가 삭제되었습니다.');
          fetchProfiles(); // 삭제 후 리스트 새로 불러오기
        }
      } catch (error) {
        console.error('Failed to delete audition:', error);
        alert('삭제에 실패했습니다.');
      }
    }
  };

  const fetchApplicantProfiles = async (auditionIdx) => {
    try {
      const applyResponse = await api({
        cmd: 'load_apply_list',
        apply_idx: auditionIdx,
      });

      const memIds = applyResponse.data.map((apply) => apply.mem_id);
      const profileResponse = await api({
        cmd: 'load_profiles_by_mem_ids',
        mem_ids: memIds,
      });

      setApplicantProfiles(profileResponse.data || []);
    } catch (error) {
      console.error('Failed to load applicant profiles:', error);
      setApplicantProfiles([]);
    }
  };

  const handleExpandAudition = (audition) => {
    if (expandedAudition === audition.idx) {
      setExpandedAudition(null);
    } else {
      setExpandedAudition(audition.idx);
      fetchApplicantProfiles(audition.idx);
    }
  };

  const handleViewProfileDetails = (profile) => {
    setSelectedProfile(profile);
    setProfileModalOpen(true);
  };

  useEffect(() => {
    if (userInfo?.mem_id !== id) {
      console.log('잘못된 접근입니다.');
      navigate('/');
      return;
    }
    fetchProfiles();
  }, [id, userInfo?.mem_id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-full bg-gray-900 text-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
          내가 작성한 오디션 리스트
        </h1>

        {myAuditionList.length > 0 ? (
          <div>
            {myAuditionList.map((audition) => (
              <div
                key={audition.idx}
                className="bg-gray-800 rounded-lg shadow-md mb-4 p-4 transition-transform transform hover:scale-105"
              >
                {/* 오디션 제목 */}
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => handleExpandAudition(audition)}
                >
                  <div>
                    <h2 className="text-xl font-semibold text-blue-400">{audition.project_name}</h2>
                    <p className="text-sm text-gray-400">
                      작성일: {new Date(audition.writer_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    {expandedAudition === audition.idx ? (
                      <span className="text-blue-400">▲</span>
                    ) : (
                      <span className="text-blue-400">▼</span>
                    )}
                  </div>
                </div>

                {/* 수정/삭제 버튼 */}
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => navigate(`/edit-audition`, { state: audition })}
                    className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => deleteAudition(audition.idx)}
                    className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    삭제
                  </button>
                </div>

                {/* Collapse Section */}
                {expandedAudition === audition.idx && (
                  <div className="mt-4 bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3 text-green-400">지원 현황</h3>
                    {applicantProfiles.length > 0 ? (
                      <ul className="space-y-2">
                        {applicantProfiles.map((profile) => (
                          <li
                            key={profile.idx}
                            className="flex justify-between items-center bg-gray-800 p-2 rounded-lg hover:bg-gray-600 cursor-pointer"
                            onClick={() => handleViewProfileDetails(profile)}
                          >
                            <span>{profile.profile_name}</span>
                            <span className="text-gray-400 text-sm">
                              {profile.profile_body_height}cm / {profile.profile_body_weight}kg
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400">아직 지원자가 없습니다.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-8">작성한 오디션 공고가 없습니다.</p>
        )}

        {/* 프로필 모달 */}
        <Profile_modal
          profile={selectedProfile}
          open={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
        />
      </div>
    </div>
  );
}

export default MyAuditionListPage;
