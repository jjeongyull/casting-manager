import React, { useEffect, useState } from 'react';
import { api } from '../util/api';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [profileList, setProfileList] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [category, setCategory] = useState('전체');

  const categories = [
    { items: '전체', value: '전체' },
    { items: '배우', value: 'Actor' },
    { items: '모델', value: 'Model' },
    { items: '인플루언서', value: 'Influencer' },
  ];

  const loadProfileList = async () => {
    try {
      const result = await api({ cmd: 'load_profile' });
      if (result.status === 200) {
        setProfileList(result.data);
        setFilteredProfiles(result.data);
      }
    } catch (error) {
      alert('Error loading profiles: ' + error.message);
    }
  };

  useEffect(() => {
    loadProfileList();
  }, []);

  const categoryChange = (newValue) => {
    setCategory(newValue);
    if (newValue === '전체') {
      setFilteredProfiles(profileList);
    } else {
      setFilteredProfiles(profileList.filter(profile => profile.profile_job.split(',').includes(newValue)));
    }
  };

  const viewProfilePage = (mem_id) => {
    navigate(`/actor/${mem_id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className='max-w-7xl mx-auto'>
        {/* 헤더 */}
        <div className="text-center py-12">
          <h1 className="text-5xl font-bold mb-4 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
            CTM's Talent DB
          </h1>
          <p className="text-lg text-gray-300">다양한 재능 있는 배우, 모델, 인플루언서를 만나보세요.</p>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex justify-center mb-8 flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.items}
              onClick={() => categoryChange(cat.value)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all 
                ${category === cat.value ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              {cat.items}
            </button>
          ))}
        </div>

        {/* 프로필 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 px-8 py-8">
          {filteredProfiles.map((profile) => (
            <div
              key={profile.idx}
              onClick={() => viewProfilePage(profile.mem_id)}
              className="cursor-pointer transform hover:scale-105 transition duration-500 ease-in-out bg-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-col justify-between"
            >
              <img
                src={`https://addit.menteimo.com/casting_manager_server/files/${profile.mem_id}/${profile.profile_main_img}`}
                alt={profile.profile_name}
                className="w-full object-contain"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-white">
                  {profile.profile_name}
                </h3>
                <p className="text-sm text-gray-400">탭해서 자세히 보기</p>
              </div>
            </div>
          ))}
        </div>

        {/* 데이터 없음 */}
        {filteredProfiles.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">사용 가능한 프로필이 없습니다. 나중에 다시 확인해 보세요!</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default HomePage;
