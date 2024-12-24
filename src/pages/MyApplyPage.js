import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../features/user/userSlice";
import { api } from "../util/api";

const MyApplyPage = () => {
  const userInfo = useSelector(selectUserInfo);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [myApplyList, setMyApplyList] = useState([]);
  const [myApplyNoticeList, setMyApplyNoticeList] = useState([]);
  const [combinedList, setCombinedList] = useState([]);

  const loadMyApplyList = async () => {
    try {
      const response = await api({
        cmd: "load_my_apply",
        mem_id: userInfo?.mem_id,
      });

      const idx = response.data.map((apply) => apply.apply_idx);
      const noticeResponse = await api({
        cmd: "load_apply_notice_list",
        idx: idx,
      });

      setMyApplyList(response.data || []);
      setMyApplyNoticeList(noticeResponse.data || []);
    } catch (error) {
      console.error("Failed to load my apply:", error);
      setMyApplyList([]);
      setMyApplyNoticeList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userInfo?.mem_id) {
      console.log("잘못된 접근입니다.");
      navigate("/");
      return;
    }
    loadMyApplyList();
  }, [userInfo?.mem_id, navigate]);

  useEffect(() => {
    const combined = myApplyNoticeList.map((notice) => {
      const matchingApply = myApplyList.find(
        (apply) => apply.apply_idx === notice.idx
      );
      return {
        ...notice,
        apply_view: matchingApply?.apply_view,
        apply_date: matchingApply?.apply_date,
      };
    });
    setCombinedList(combined);
  }, [myApplyList, myApplyNoticeList]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-full bg-gray-900 text-white min-h-screen px-6 py-10">
      <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
        내가 지원한 공고
      </h1>
      {combinedList.length > 0 ? (
        <div className="space-y-4">
          {combinedList.map((item, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg shadow-md p-6 flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-bold text-blue-400">
                  {item.project_name}
                </h2>
                <p className="text-gray-400 text-sm">
                  지원일: {new Date(item.apply_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                {item.apply_view === 1 ? (
                  <span className="px-3 py-1 bg-green-500 text-white rounded-lg">
                    확인됨
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-red-500 text-white rounded-lg">
                    미확인
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 mt-8">
          지원한 공고가 없습니다.
        </p>
      )}
    </div>
  );
};

export default MyApplyPage;
