import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { api } from '../util/api';
import { selectUserInfo } from '../features/user/userSlice';

const AuditionListPage = () => {
  const navigate = useNavigate();
  const [auditions, setAuditions] = useState([]);
  const [filteredAuditions, setFilteredAuditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('전체');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const userInfo = useSelector(selectUserInfo);

  const categories = ['전체', '장편영화', '단편영화', 'OTT', '독립영화', '드라마', '웹드라마', '유튜브', '기타'];

  const loadAuditions = async () => {
    try {
      const response = await api({ cmd: 'load_audition_list' });
      if (response.status === 200) {
        setAuditions(response.data);
        setFilteredAuditions(response.data);
      }
    } catch (error) {
      console.error('Error loading auditions:', error.message);
      alert('Failed to load auditions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuditions();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredAuditions(
      auditions.filter((audition) =>
        Object.values(audition).some((value) =>
          value.toString().toLowerCase().includes(query)
        )
      )
    );
    setCurrentPage(1);
  };

  const handleCategoryChange = (newValue) => {
    setCategory(newValue);
    if (newValue === '전체') {
      setFilteredAuditions(auditions);
    } else {
      setFilteredAuditions(auditions.filter((audition) => audition.project_type === newValue));
    }
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredAuditions.length / itemsPerPage);
  const paginatedData = filteredAuditions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-full bg-gray-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-4xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
          오디션 리스트
        </h1>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                category === cat
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search and Options */}
        <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
          <input
            type="text"
            placeholder="검색어를 입력하세요."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full md:w-3/4 px-4 py-2 rounded-lg bg-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <div className="flex items-center gap-4">
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 focus:ring-2 focus:ring-blue-400"
            >
              <option value="10">10개씩 보기</option>
              <option value="20">20개씩 보기</option>
              <option value="30">30개씩 보기</option>
              <option value="50">50개씩 보기</option>
              <option value={filteredAuditions.length}>전체</option>
            </select>
            {userInfo?.casting_mode === 1 && (
              <button
                onClick={() => navigate('/write-audition')}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
              >
                글쓰기
              </button>
            )}
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-auto bg-gray-800 rounded-lg shadow-lg">
          <table className="w-full text-left table-auto min-w-[600px]">
            <thead>
              <tr className="bg-blue-500 text-gray-900">
                <th className="p-3">작품유형</th>
                <th className="p-3">제목</th>
                <th className="p-3">배역</th>
                <th className="p-3">작성자</th>
                <th className="p-3">작성일</th>
                <th className="p-3">조회 수</th>
                <th className="p-3">지원 수</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((audition, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-700 transition-all border-b border-gray-700"
                >
                  <td className="p-3">{audition.project_type}</td>
                  <td
                    className="p-3 text-blue-400 underline cursor-pointer"
                    onClick={() => navigate(`/audition-view/${audition.idx}`)}
                  >
                    {audition.project_name}
                  </td>
                  <td className="p-3">{audition.project_casting}</td>
                  <td className="p-3">{audition.project_writer}</td>
                  <td className="p-3">{audition.writer_date}</td>
                  <td className="p-3">{audition.view_count}</td>
                  <td className="p-3">{audition.apply_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`mx-1 px-4 py-2 rounded-lg text-sm font-medium ${
                currentPage === page
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuditionListPage;
