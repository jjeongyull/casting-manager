import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { formDataFunction } from '../util/formData';
import functions from '../util/functions';
import Confirm from '../components/ConfirmComponent';
import AlertComponent from '../components/AlertComponent';

function EditProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = location.state || {};

  const [modalMainText, setModalMainText] = useState('');
  const [modalSubText, setModalSubText] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const updateProfileConfirm = () => {
    setModalMainText('프로필 수정');
    setModalSubText('작성하신 정보로 프로필을 수정 하시겠습니까?');
    setConfirmOpen(true);
  }

  const [formData, setFormData] = useState({
    profile_name: '',
    profile_phone: '',
    profile_email: '',
    profile_birth: '',
    profile_main_img: '',
    profile_others_img: [],
    profile_youtube_link: '',
    profile_instagram_link: '',
    profile_job: [],
    profile_video_link: [{ title: '', link: '' }],
    profile_body_height: '',
    profile_body_weight: '',
    profile_specialty: '',
    profile_hobby: '',
    profile_history: [],
  });
  const [mainImgFile, setMainImgFile] = useState(null);
  const [mainImgPreview, setMainImgPreview] = useState(null);
  const [otherImgFiles, setOtherImgFiles] = useState([]);
  const [otherImgPreviews, setOtherImgPreviews] = useState([]);

  useEffect(() => {
    if (profile) {
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
      } = profile;

      setFormData({
        profile_name,
        profile_phone,
        profile_email,
        profile_birth,
        profile_main_img,
        profile_others_img: profile_others_img.split(','),
        profile_youtube_link,
        profile_instagram_link,
        profile_job: profile_job.split(','),
        profile_video_link: JSON.parse(profile_video_link || '[]'),
        profile_body_height,
        profile_body_weight,
        profile_specialty,
        profile_hobby,
        profile_history: JSON.parse(profile_history || '[]'),
      });
      setMainImgPreview(`https://addit.menteimo.com/casting_manager_server/files/${mem_id}/${profile_main_img}`);
      setOtherImgPreviews(
        profile_others_img.split(',').map(img => `https://addit.menteimo.com/casting_manager_server/files/${mem_id}/${img}`)
      );
    }
  }, [profile]);

  const inputChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'profile_phone') {
      setFormData({ ...formData, [name]: functions.formatPhoneNumber(value) });
    } else if (!isNaN(value) && name !== 'profile_email') {
      // 숫자인 경우 양수만 허용
      setFormData({ ...formData, [name]: functions.allowOnlyPositiveNumbers(value) });
    } else {
      // 일반 입력 처리
      setFormData({ ...formData, [name]: value });
    }
  };

  const mainImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImgFile(file);
      setMainImgPreview(URL.createObjectURL(file));
      setFormData({ ...formData, ['profile_main_img']: file.name });
    }
  };

  const otherImgChange = (e) => {
    const files = Array.from(e.target.files);
    setOtherImgFiles([...otherImgFiles, ...files]);
    setOtherImgPreviews([...otherImgPreviews, ...files.map(file => URL.createObjectURL(file))]);
    const updateList = [...formData.profile_others_img];
    updateList.push(files[0].name)
    setFormData({ ...formData, ['profile_others_img']: updateList });
  };

  const removeOtherImage = (index, text) => {
    const updatedFiles = [...otherImgFiles];
    const updatedPreviews = [...otherImgPreviews];
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setOtherImgFiles(updatedFiles);
    setOtherImgPreviews(updatedPreviews);
    const updateList = formData.profile_others_img.filter((items) => {
      return String(items) !== String(text);
    });
    setFormData({ ...formData, ['profile_others_img']: updateList });
  };

  const jobChange = (job) => {
    setFormData((prev) => {
      const isSelected = prev.profile_job.includes(job);
      const updatedJobs = isSelected
        ? prev.profile_job.filter((j) => j !== job)
        : [...prev.profile_job, job];
      return { ...prev, profile_job: updatedJobs };
    });
  };

  const videoChange = (index, field, value) => {
    const updatedVideos = [...formData.profile_video_link];
    updatedVideos[index][field] = value;
    setFormData({ ...formData, profile_video_link: updatedVideos });
  };

  const addVideo = () => {
    setFormData({
      ...formData,
      profile_video_link: [...formData.profile_video_link, { title: '', link: '' }],
    });
  };

  const removeVideo = (index) => {
    const updatedVideos = [...formData.profile_video_link];
    updatedVideos.splice(index, 1);
    setFormData({ ...formData, profile_video_link: updatedVideos });
  };

  const historyChange = (index, field, value) => {
    const updatedHistory = [...formData.profile_history];
    updatedHistory[index][field] = value;
    setFormData({ ...formData, profile_history: updatedHistory });
  };

  const addHistory = () => {
    setFormData((prev) => ({
      ...prev,
      profile_history: [...prev.profile_history, { month: '', text: '' }],
    }));
  };

  const removeHistory = (index) => {
    const updatedHistory = [...formData.profile_history];
    updatedHistory.splice(index, 1);
    setFormData({ ...formData, profile_history: updatedHistory });
  };

  const updateProfile = async () => {
    setConfirmOpen(false);
    const formDataApi = new FormData();
    formDataApi.append("profile_name", formData.profile_name);
    formDataApi.append("profile_phone", formData.profile_phone);
    formDataApi.append("profile_email", formData.profile_email);
    formDataApi.append("profile_birth", formData.profile_birth);
    formDataApi.append("profile_main_img", formData.profile_main_img);
    formDataApi.append("profile_others_img", formData.profile_others_img.join(','));
    formDataApi.append("profile_youtube_link", formData.profile_youtube_link);
    formDataApi.append("profile_instagram_link", formData.profile_instagram_link);
    formDataApi.append("profile_job", formData.profile_job.join(','));
    formDataApi.append("profile_video_link", JSON.stringify(formData.profile_video_link));
    formDataApi.append("profile_body_height", formData.profile_body_height);
    formDataApi.append("profile_body_weight", formData.profile_body_weight);
    formDataApi.append("profile_specialty", formData.profile_specialty);
    formDataApi.append("profile_hobby", formData.profile_hobby);
    formDataApi.append("profile_history", JSON.stringify(formData.profile_history));
    formDataApi.append("mem_id", profile?.mem_id);
    formDataApi.append("cmd", 'update_profile');

    formDataApi.append(`main_files`, mainImgFile);

    for (var i = 0; i < otherImgFiles.length; i++) {
      formDataApi.append(`other_files[]`, otherImgFiles[i]);
    }
    console.log(formDataApi)
    const response = await formDataFunction(formDataApi);

    
    if(response.status === 200){
      setModalMainText('프로필 수정');
      setModalSubText('프로필 수정이 완료되었습니다.');
      setAlertOpen(true);
      setTimeout(() => {
        navigate(`/actor/${profile?.mem_id}`);
      }, 1000);
    }else{
      setModalMainText('프로필 수정');
      setModalSubText('프로필 수정 중 오류가 발생하였습니다.');
      setAlertOpen(true);
    }

  };

  return (
      <div className="max-w-full bg-gray-900 text-white shadow-lg">
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
              onConfirm={updateProfile}
              onClose={() => setConfirmOpen(false)}
              mainText={modalMainText}
              subText={modalSubText}
            />
          )
        }
        <div className="max-w-6xl mx-auto px-6 py-10 bg-gray-900 text-white rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
            프로필 수정
          </h1>

          {/* Grid 레이아웃 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-300">이름</label>
              <input
                type="text"
                name="profile_name"
                value={formData.profile_name}
                onChange={inputChange}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-300">전화번호</label>
              <input
                type="text"
                name="profile_phone"
                value={formData.profile_phone}
                onChange={inputChange}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-300">이메일</label>
              <input
                type="email"
                name="profile_email"
                value={formData.profile_email}
                onChange={inputChange}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {/* 생일 */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-300">생년월일</label>
              <input
                type="date"
                name="profile_birth"
                value={formData.profile_birth}
                onKeyDown={(e) => e.preventDefault()}
                onChange={inputChange}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {/* YouTube Link */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-300">유튜브 채널 링크</label>
              <input
                type="text"
                name="profile_youtube_link"
                value={formData.profile_youtube_link}
                onChange={inputChange}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {/* Instagram Link */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-300">인스타그램 링크</label>
              <input
                type="text"
                name="profile_instagram_link"
                value={formData.profile_instagram_link}
                onChange={inputChange}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {/* 키 / 몸무게 */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-300">키 (cm)</label>
              <input
                type="number"
                name="profile_body_height"
                value={formData.profile_body_height}
                onChange={inputChange}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-300">몸무게 (kg)</label>
              <input
                type="number"
                name="profile_body_weight"
                value={formData.profile_body_weight}
                onChange={inputChange}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

          </div>

          {/* Main Image */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2 text-blue-400">메인 이미지</h2>
            <div className="flex items-center gap-4">
              {mainImgPreview && (
                <img
                  src={mainImgPreview}
                  alt="Main Preview"
                  className="w-40 h-40 object-cover rounded-lg shadow-md"
                />
              )}
              <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all">
                메인이미지 변경
                <input
                  type="file"
                  hidden
                  onChange={mainImgChange}
                  accept="image/*"
                />
              </label>
            </div>
          </div>

          {/* Other Images */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2 text-blue-400">기타 이미지</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {otherImgPreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Other Preview ${index + 1}`}
                    className="w-full object-cover rounded-lg shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeOtherImage(index, formData.profile_others_img[index])}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 mt-4 rounded-lg inline-flex items-center transition-all">
              <span>이미지 추가</span>
              <input
                type="file"
                hidden
                multiple
                onChange={otherImgChange}
                accept="image/*"
              />
            </label>
          </div>

          {/* Professional Roles */}
          <div className="mt-6 mb-6">
            <h2 className="text-lg font-semibold mb-2 text-blue-400">전문 분야</h2>
            <div className="flex gap-2 flex-wrap">
              {['Actor', 'Model', 'Influencer'].map((job) => (
                <span
                  key={job}
                  onClick={() => jobChange(job)}
                  className={`px-4 py-1 rounded-lg text-sm cursor-pointer ${
                    formData.profile_job.includes(job)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {job}
                </span>
              ))}
            </div>
          </div>

          {/* 영상 링크와 제목 */}
          <div className="mb-6">
            <label className="block text-blue-300 mb-2">영상 링크와 제목</label>
            {formData.profile_video_link.map((video, index) => (
              <div key={index} className="flex gap-4 mb-2">
                <input
                  type="text"
                  placeholder="영상 제목"
                  value={video.title}
                  onChange={(e) => videoChange(index, 'title', e.target.value)}
                  className="p-2 w-1/3 bg-gray-800 rounded"
                />
                <input
                  type="text"
                  placeholder="영상 링크"
                  value={video.link}
                  onChange={(e) => videoChange(index, 'link', e.target.value)}
                  className="p-2 w-full bg-gray-800 rounded"
                />
                <button onClick={() => removeVideo(index)} className="text-red-400">
                &times;
                </button>
              </div>
            ))}
            <button onClick={addVideo} className="text-blue-400 underline">
              + 영상 추가
            </button>
          </div>

          {/* Work History */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2 text-blue-400">경력</h2>
            {formData.profile_history.map((history, index) => (
              <div key={index} className="flex gap-4 items-center mb-2">
                <input
                  type="month"
                  value={history.month}
                  onKeyDown={(e) => e.preventDefault()}
                  onChange={(e) => historyChange(index, 'month', e.target.value)}
                  className="w-1/4 px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <input
                  type="text"
                  value={history.text}
                  onChange={(e) => historyChange(index, 'text', e.target.value)}
                  placeholder="Description"
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <button
                  onClick={() => removeHistory(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              onClick={addHistory}
              className="text-blue-400 hover:underline"
            >
              + 경력추가
            </button>
          </div>

          {/* Save/Cancel Buttons */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={updateProfileConfirm}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
            >
              수정하기
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
            >
              취소
            </button>
          </div>
        </div>
      </div>

  );
}

export default EditProfilePage;