import React, { useState } from 'react';

import { formDataFunction } from '../util/formData';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../features/user/userSlice';
import { useNavigate } from 'react-router-dom';

import functions from '../util/functions';

function CreateProfilePage() {
  const navigate = useNavigate();
  const userInfo = useSelector(selectUserInfo);
  
  // 전체 프로필 데이터
  const [profile, setProfile] = useState({
    profile_name: '',
    profile_phone: '',
    profile_email: '',
    profile_birth: '',
    profile_main_img: null,
    profile_others_img: [],
    profile_youtube_link: '',
    profile_instagram_link: '',
    profile_job: [],
    profile_video_link: [],
    profile_body_height: '',
    profile_body_weight: '',
    profile_specialty: '',
    profile_hobby: '',
    profile_history: [{ month: '', text: '' }]
  });

  // 메인이미지 파일
  const [mainImgFile, setMainImgFile] = useState(null);
  const [mainImgPreview, setMainImgPreview] = useState(null);

  // 다른 이미지 파일
  const [otherImgFiles, setOtherImgFiles] = useState([]);
  const [otherImgPreview, setOtherImgPreview] = useState([]);

  const inputChange = (e) => {
    const { name, value } = e.target;
    if(name === 'profile_phone'){
      setProfile({ ...profile, [name]: functions.formatPhoneNumber(value) });
    }else{
      setProfile({ ...profile, [name]: value });
    }
  };

  const fileChange = (e) => {
    const { name } = e.target;
    const files = e.target.files;
    if (name === 'profile_main_img') {
      const file = files[0];
      setProfile({ ...profile, profile_main_img: file.name });
      setMainImgFile(file);
      setMainImgPreview(URL.createObjectURL(file));
    } else if (name === 'profile_others_img') {
      const newImages = Array.from(files).map(file => ({
        name: file.name,
        preview: URL.createObjectURL(file),
      }));
      setProfile({
        ...profile,
        profile_others_img: [...profile.profile_others_img, ...newImages.map(img => img.name)],
      });
      setOtherImgFiles([...otherImgFiles, ...files]);
      setOtherImgPreview([...otherImgPreview, ...newImages.map(img => img.preview)]);
    }
  };


  const projectJobChange = (e) => {
    const { value, checked } = e.target;
    setProfile((prevState) => {
      const newJobs = checked
        ? [...prevState.profile_job, value]
        : prevState.profile_job.filter((job) => job !== value);
      return { ...prevState, profile_job: newJobs };
    });
  };

  const removeOtherImage = (index) => {
    const updatedImages = [...profile.profile_others_img];
    updatedImages.splice(index, 1);
    setProfile({ ...profile, profile_others_img: updatedImages });

    const updatedFiles = [...otherImgFiles];
    updatedFiles.splice(index, 1);
    setOtherImgFiles(updatedFiles);

    const updatedPreviews = [...otherImgPreview];
    updatedPreviews.splice(index, 1);
    setOtherImgPreview(updatedPreviews);
  };


  const addVideoLink = () => {
    setProfile({
      ...profile,
      profile_video_link: [...profile.profile_video_link, { title: '', link: '' }],
    });
  };

  const videoLinkChange = (index, field, value) => {
    const updatedLinks = [...profile.profile_video_link];
    updatedLinks[index][field] = value;
    setProfile({ ...profile, profile_video_link: updatedLinks });
  };

  const removeVideoLink = (index) => {
    const updatedLinks = [...profile.profile_video_link];
    updatedLinks.splice(index, 1);
    setProfile({ ...profile, profile_video_link: updatedLinks });
  };

  const addHistory = () => {
    setProfile({
      ...profile,
      profile_history: [...profile.profile_history, { month: '', text: '' }],
    });
  };

  const historyChange = (index, field, value) => {
    const updatedHistory = [...profile.profile_history];
    updatedHistory[index][field] = value;
    setProfile({ ...profile, profile_history: updatedHistory });
  };

  const removeHistory = (index) => {
    const updatedHistory = [...profile.profile_history];
    updatedHistory.splice(index, 1);
    setProfile({ ...profile, profile_history: updatedHistory });
  };

  // 프로필 올리기
  const InsertProfile = async () => {
    const formData = new FormData();
    formData.append("profile_name", profile.profile_name);
    formData.append("profile_phone", profile.profile_phone);
    formData.append("profile_email", profile.profile_email);
    formData.append("profile_birth", profile.profile_birth);
    formData.append("profile_main_img", profile.profile_main_img);
    formData.append("profile_others_img", profile.profile_others_img.join(','));
    formData.append("profile_youtube_link", profile.profile_youtube_link);
    formData.append("profile_instagram_link", profile.profile_instagram_link);
    formData.append("profile_job", profile.profile_job.join(','));
    formData.append("profile_video_link", JSON.stringify(profile.profile_video_link));
    formData.append("profile_body_height", profile.profile_body_height);
    formData.append("profile_body_weight", profile.profile_body_weight);
    formData.append("profile_specialty", profile.profile_specialty);
    formData.append("profile_hobby", profile.profile_hobby);
    formData.append("profile_history", JSON.stringify(profile.profile_history));
    formData.append("mem_id", userInfo?.mem_id);
    formData.append("cmd", 'insert_profile');

    formData.append(`main_files`, mainImgFile);

    for (var i = 0; i < otherImgFiles.length; i++) {
      formData.append(`other_files[]`, otherImgFiles[i]);
    }

    const response = await formDataFunction(formData);
    const {status} = response;

    if(status === 200){
      navigate(`/actor/${userInfo?.mem_id}`);
    }

  }

  return (
    <div className="max-w-full mx-auto px-6 py-10 bg-gray-900 text-white">
      <div className='max-w-6xl mx-auto'>
      <div className="space-y-6">
          <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
            프로필 만들기
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-2">
            {/* 이름 */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-300">이름</label>
              <input
                type="text"
                name="profile_name"
                value={profile.profile_name}
                onChange={inputChange}
                placeholder="이름을 입력하세요"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {/* 전화번호 */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-300">전화번호</label>
              <input
                type="text"
                name="profile_phone"
                value={profile.profile_phone}
                onChange={inputChange}
                placeholder="전화번호를 입력하세요"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {/* 이메일 */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-300">이메일</label>
              <input
                type="email"
                name="profile_email"
                value={profile.profile_email}
                onChange={inputChange}
                placeholder="이메일을 입력하세요"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {/* 생일 */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-300">생년월일</label>
              <input
                type="date"
                name="profile_birth"
                value={profile.profile_birth}
                onChange={inputChange}
                placeholder="생년월일을 입력하세요"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {/* 인스타그램 링크 */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-300">인스타그램 링크</label>
              <input
                type="text"
                name="profile_instagram_link"
                value={profile.profile_instagram_link}
                onChange={inputChange}
                placeholder="인스타그램 링크를 입력하세요"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {/* 유튜브 링크 */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-300">유튜브 채널 링크</label>
              <input
                type="text"
                name="profile_youtube_link"
                value={profile.profile_youtube_link}
                onChange={inputChange}
                placeholder="유튜브 링크를 입력하세요"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-300">
                직업 유형
              </label>
              <div className="flex flex-wrap gap-4">
                {["Actor", "Model", "Influencer"].map((job) => (
                  <label key={job} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={job}
                      checked={profile.profile_job.includes(job)}
                      onChange={projectJobChange}
                      className="w-4 h-4 text-blue-500 focus:ring-2 focus:ring-blue-400"
                    />
                    <span className="text-sm text-gray-200">{job}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-300">
                키 (cm)
              </label>
              <input
                type="number"
                name="profile_body_height"
                value={profile.profile_body_height}
                onChange={inputChange}
                placeholder="키를 입력하세요"
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-300">
                몸무게 (kg)
              </label>
              <input
                type="number"
                name="profile_body_weight"
                value={profile.profile_body_weight}
                onChange={inputChange}
                placeholder="몸무게를 입력하세요"
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-300">특기</label>
              <input
                type="text"
                name="profile_specialty"
                value={profile.profile_specialty}
                onChange={inputChange}
                placeholder="특기를 입력하세요"
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-300">취미</label>
              <input
                type="text"
                name="profile_hobby"
                value={profile.profile_hobby}
                onChange={inputChange}
                placeholder="취미를 입력하세요"
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
          </div>
        </div>


        <div className="space-y-6 my-10">
          {/* 메인이미지 추가 */}
          <div className="flex flex-col items-center space-y-4">
            <div
              className="w-48 border-2 border-dashed rounded-lg flex items-center justify-center border-gray-500 text-gray-400"
            >
              {mainImgPreview && (
                <img
                  src={mainImgPreview}
                  alt="Main Preview"
                  className="w-40 object-cover rounded-lg shadow-md"
                />
              )}
              {!mainImgPreview && <span className="text-sm">메인이미지</span>}
            </div>
            <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all">
              메인이미지 추가
              <input
                type="file"
                name="profile_main_img"
                accept="image/*"
                onChange={fileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* 추가 이미지 업로드 */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-300">
              이미지 (최대 10개까지 첨부 가능)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {otherImgPreview.map((img, index) => (
                   <div key={index} className="relative group">
                     <img
                      src={img}
                      alt={`Other Preview ${index + 1}`}
                      className="w-full object-cover rounded-lg shadow-md"
                    />
                     <button
                    type="button"
                    onClick={() => removeOtherImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              </div>
              ))}
            </div>
            <label className="inline-block mt-4 cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all">
              이미지 추가
              <input
                type="file"
                name="profile_others_img"
                accept="image/*"
                onChange={fileChange}
                multiple
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="space-y-8">
          {/* 영상 링크 및 제목 섹션 */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-300">
              영상 링크와 제목
            </label>
            {profile.profile_video_link.map((video, index) => (
              <div key={index} className="flex items-center gap-4 mb-4">
                {/* 영상 제목 입력 */}
                <input
                  type="text"
                  placeholder={`영상 제목 ${index + 1}`}
                  value={video.title}
                  onChange={(e) => videoLinkChange(index, 'title', e.target.value)}
                  className="w-1/3 px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />

                {/* 영상 링크 입력 */}
                <input
                  type="text"
                  placeholder={`영상 링크 ${index + 1}`}
                  value={video.link}
                  onChange={(e) => videoLinkChange(index, 'link', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />

                {/* 삭제 버튼 */}
                <button
                  type="button"
                  onClick={() => removeVideoLink(index)}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}

            {/* 추가 버튼 */}
            <button
              type="button"
              onClick={addVideoLink}
              className="flex items-center text-blue-400 hover:underline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 mr-2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              영상 추가
            </button>
          </div>

          {/* 경력 섹션 */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-300">경력</label>
            {profile.profile_history.map((history, index) => (
              <div key={index} className="flex items-center gap-4 mb-4">
                <input
                  type="month"
                  value={history.month}
                  onChange={(e) => historyChange(index, "month", e.target.value)}
                  className="px-3 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <input
                  type="text"
                  value={history.text}
                  onChange={(e) => historyChange(index, "text", e.target.value)}
                  placeholder="경력 설명"
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeHistory(index)}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addHistory}
              className="flex items-center text-blue-400 hover:underline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 mr-2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              경력 추가
            </button>
          </div>

          {/* 프로필 생성 버튼 */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={InsertProfile}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition-all"
            >
              프로필 생성
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateProfilePage;
