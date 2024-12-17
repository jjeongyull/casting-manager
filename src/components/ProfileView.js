import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../features/user/userSlice';
import { api } from '../util/api';

function ProfileView({ profiles }) {
  const userInfo = useSelector(selectUserInfo);
  const navigate = useNavigate();

  if (!profiles) return <p className="text-center text-gray-300">Loading...</p>;

  const {
    profile_name,
    profile_phone,
    profile_email,
    profile_birth,
    profile_main_img,
    profile_others_img,
    profile_youtube_link,
    profile_instagram_link,
    profile_job,
    profile_video_link,
    profile_body_height,
    profile_body_weight,
    profile_specialty,
    profile_hobby,
    profile_history,
    mem_id,
  } = profiles;

  const mainImgUrl = `https://addit.menteimo.com/casting_manager_server/files/${mem_id}/${profile_main_img}`;
  const otherImgUrls = profile_others_img.split(',').map(
    (img) => `https://addit.menteimo.com/casting_manager_server/files/${mem_id}/${img}`
  );
  const videoLinks = JSON.parse(profile_video_link);
  const jobs = profile_job.split(',');
  const history = JSON.parse(profile_history);

  const handleEdit = () => {
    navigate(`/edit-profile`, { state: { profile: profiles } });
  };

  const handleDelete = async () => {
    if (window.confirm('프로필을 정말 삭제하시겠습니까?')) {
      const response = await api({ cmd: 'delete_profile', mem_id: mem_id });
      if (response.status === 200) {
        alert('삭제가 완료되었습니다.');
        navigate(`/`);
      }
    }
  };

  return (
    <div className="max-w-full bg-gray-900 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-6 py-10 bg-gray-900 text-white rounded-lg shadow-lg">
        {/* 프로필 타이틀 */}
        <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
          {profile_name}'s Profile
        </h1>

        {/* 메인 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 메인 이미지 */}
          <div>
            <img
              src={mainImgUrl}
              alt={profile_name}
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          {/* 정보 섹션 */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-blue-400">연락처</h2>
              <p>
                Phone: {userInfo && userInfo.mem_id === mem_id ? profile_phone : '열람불가'}
              </p>
              <p>
                Email: {userInfo && userInfo.mem_id === mem_id ? profile_email : '열람불가'}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-blue-400">생년월일</h2>
              <p>{profile_birth}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-blue-400">키 / 몸무게</h2>
              <p>Height: {profile_body_height} cm</p>
              <p>Weight: {profile_body_weight} kg</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-blue-400">특기 / 취미</h2>
              <p>특기: {profile_specialty}</p>
              <p>취미: {profile_hobby}</p>
            </div>


            <div>
              <h2 className="text-lg font-semibold text-blue-400">전문 분야</h2>
              <div className="flex flex-wrap gap-2">
                {jobs.map((job, index) => (
                  <span
                    key={index}
                    className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {job}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-blue-400">SNS 계정</h2>
              <div className="flex gap-4">
                {profile_instagram_link && (
                  <a
                    href={profile_instagram_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition"
                  >
                    Instagram
                  </a>
                )}
                {profile_youtube_link && (
                  <a
                    href={profile_youtube_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    YouTube
                  </a>
                )}
              </div>
            </div>

            {/* 수정/삭제 버튼 */}
            {userInfo && userInfo.mem_id === mem_id && (
              <div className="flex gap-4 justify-end">
                <button
                  onClick={handleEdit}
                  className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  프로필 수정
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  프로필 삭제
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 프로필 사진 */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-blue-400 mb-4">프로필 사진</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {otherImgUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Other Image ${index + 1}`}
                className="w-full rounded-lg shadow-lg"
              />
            ))}
          </div>
        </div>

        {/* 영상 링크 */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-blue-400 mb-4">영상 링크</h2>
          <ul className="space-y-2">
            {videoLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* 경력 */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-blue-400 mb-4">경력</h2>
          <ul className="space-y-2">
            {history.map((item, index) => (
              <li key={index}>
                <p className="text-sm">
                  <strong>{item.month}</strong>: {item.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProfileView;
