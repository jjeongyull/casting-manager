import React from 'react';

function Profile_modal({ profile, open, onClose }) {
  if (!profile || !open) return null;

  const mainImgUrl = profile.profile_main_img
    ? `https://addit.menteimo.com/casting_manager_server/files/${profile.mem_id}/${profile.profile_main_img}`
    : null;

  const otherImgUrls = profile.profile_others_img
    ? profile.profile_others_img.split(',').map(
        (img) =>
          `https://addit.menteimo.com/casting_manager_server/files/${profile.mem_id}/${img}`
      )
    : [];

  const videoLinks = profile.profile_video_link
    ? JSON.parse(profile.profile_video_link)
    : [];

  const jobs = profile.profile_job ? profile.profile_job.split(',') : [];

  const history = profile.profile_history
    ? JSON.parse(profile.profile_history)
    : [];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 text-white rounded-lg shadow-lg overflow-y-auto max-w-4xl w-full max-h-[95vh] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
          {profile.profile_name}'s Profile
        </h2>

        {/* 이미지 및 기본 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center">
            {mainImgUrl ? (
              <img
                src={mainImgUrl}
                alt={profile.profile_name}
                className="w-full rounded-lg shadow-md"
              />
            ) : (
              <p className="text-gray-400">이미지가 없습니다.</p>
            )}
          </div>

          <div className="md:col-span-2 space-y-4">
            <p>
              <strong className="text-blue-400">전화번호:</strong>{' '}
              {profile.profile_phone || 'N/A'}
            </p>
            <p>
              <strong className="text-blue-400">이메일:</strong>{' '}
              {profile.profile_email || 'N/A'}
            </p>
            <p>
              <strong className="text-blue-400">키:</strong>{' '}
              {profile.profile_body_height || 'N/A'} cm
            </p>
            <p>
              <strong className="text-blue-400">몸무게:</strong>{' '}
              {profile.profile_body_weight || 'N/A'} kg
            </p>
            <p>
              <strong className="text-blue-400">특기:</strong>{' '}
              {profile.profile_specialty || 'N/A'}
            </p>
            <p>
              <strong className="text-blue-400">취미:</strong>{' '}
              {profile.profile_hobby || 'N/A'}
            </p>
          </div>
        </div>

        {/* 직업 */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-blue-400 mb-2">전문분야</h3>
          <div className="flex gap-2 flex-wrap">
            {jobs.length > 0 ? (
              jobs.map((job, index) => (
                <span
                  key={index}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm"
                >
                  {job}
                </span>
              ))
            ) : (
              <p className="text-gray-400">등록된 역할이 없습니다.</p>
            )}
          </div>
        </div>

        {/* SNS 링크 */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-blue-400 mb-2">SNS 링크</h3>
          <div className="flex gap-4">
            {profile.profile_instagram_link && (
              <a
                href={profile.profile_instagram_link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg"
              >
                Instagram
              </a>
            )}
            {profile.profile_youtube_link && (
              <a
                href={profile.profile_youtube_link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                YouTube
              </a>
            )}
          </div>
        </div>

        {/* 기타 이미지 */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-blue-400 mb-2">기타 이미지</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {otherImgUrls.length > 0 ? (
              otherImgUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Other ${index + 1}`}
                  className="w-full object-cover rounded-lg shadow-md"
                />
              ))
            ) : (
              <p className="text-gray-400">이미지가 없습니다.</p>
            )}
          </div>
        </div>

        {/* 비디오 링크 */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-blue-400 mb-2">영상 링크</h3>
          {videoLinks.length > 0 ? (
            <ul className="space-y-2">
              {videoLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">비디오 링크가 없습니다.</p>
          )}
        </div>

        {/* 작업 이력 */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-blue-400 mb-2">경력</h3>
          {history.length > 0 ? (
            <ul className="space-y-2">
              {history.map((item, index) => (
                <li key={index} className="text-gray-300">
                  <strong className="text-green-400">Month:</strong> {item.month} <br />
                  {item.text}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">작업 이력이 없습니다.</p>
          )}
        </div>

        {/* 닫기 버튼 */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile_modal;
