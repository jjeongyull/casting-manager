import './style/default.style.css';

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserInfo, clearUserInfo } from './features/user/userSlice';
import cookiesFunction from './util/cookie';
import { api } from './util/api';
import { CircularProgress, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

// pages
import HomePage from './pages/HomePage';
import ActorProfile from './pages/ActorProfile';
import LoginPage from './pages/LoginPage';
import SignPage from './pages/SignPage';
import CreateProfilePage from './pages/CreateProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import AuditionListPage from './pages/AuditionListPage';
import MyAuditionListPage from './pages/MyAuditionListPage';
import WriteAuditionPage from './pages/WriteAuditionPage';
import AuditionViewPage from './pages/AuditionViewPage';
import EditAuditionPage from './pages/EditAuditionPage';
import MyPage from './pages/MyPage';
import EditMyInfoPage from './pages/EditMyInfoPage';

// component
import Header from './components/Header';
import { useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

/**
 * 0. 헤더: 배우로 로그인 시 오디션 리스트 버튼 추가 / 캐스팅 디렉터 로그인시 오디션리스트 버튼 및 내 공고보기 버튼 추가
 * 1. 메인페이지: 카드 리스트
 * 2. 마이페이지(캐스팅 디렉터 제외): 내 프로필 추가 및 수정(프로필은 하나만)
 * 3: 오디션 리스트: 프로필이 있는 계정은 오디션 지원 버튼 추가 / 캐스팅 디렉터는 글쓰기 버튼 추가
 * 4. 내 공고보기: 캐스팅디렉터(본인)이 작성한 공고 열람 가능
 * 
 */

function App() {
  const navigate = useNavigate();
  const [loginState, setLoginState] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [myId, setMyId] = useState(null);
  const [castingMode, setCastingMode] = useState(null);
  const dispatch = useDispatch();

  const checkToken = async () => {
    try {
      const cookie = cookiesFunction.getCookie('casting_manager');
      const response = await api({ cmd: 'loginChk', jwt: cookie });
      if (response.status === 200) {
        dispatch(setUserInfo(response.data));
        setMyId(response.data.mem_id);
        setCastingMode(response.data.casting_mode);
        cookiesFunction.setCookie('casting_manager', response.token, 1);
        setLoginState(true);
      } else if(response.status === 401) {
        alert('로그인 기간이 만료되었습니다.')
        dispatch(clearUserInfo());
        setMyId(null);
        setCastingMode(null);
        setLoginState(false);
        navigate('/');
      }else{
        dispatch(clearUserInfo());
        setMyId(null);
        setCastingMode(null);
        setLoginState(false);
        navigate('/');
      }
    } catch (error) {
      console.error('토큰 에러:', error);
      dispatch(clearUserInfo());
      setLoginState(false);
      setMyId(null);
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  const Logout = () => {
    cookiesFunction.deleteCookie('casting_manager');
    dispatch(clearUserInfo());
    setLoginState(false);
    setMyId(null);
    setLogoutDialogOpen(false);
    navigate('/');
  };

  const openLogoutDialog = () => {
    setLogoutDialogOpen(true);
  };

  const closeLogoutDialog = () => {
    setLogoutDialogOpen(false);
  };

  useEffect(() => {
    const jwtFromCookie = cookiesFunction.getCookie('casting_manager');
    if (jwtFromCookie) {
      checkToken();
    } else {
      setLoginState(false);
      setMyId(null);
      setLoading(false); // 쿠키가 없을 경우 로딩 종료
    }
  }, [dispatch]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Header loginState={loginState} Logout={openLogoutDialog} myId={myId} castingMode={castingMode}/>
      <Routes>
        <Route path="/" element={<HomePage/>} />

        {/* 배우 상세 프로필 페이지 */}
        <Route path="/actor/:id" element={<ActorProfile/>} />

        {/* 로그인 페이지 */}
        <Route path="/login" element={<LoginPage setLoginState={setLoginState} setMyId={setMyId} setCastingMode={setCastingMode}/>} />

        {/* 회원가입 페이지 */}
        <Route path="/sign" element={<SignPage/>} />

        {/* 프로필 만들기 페이지 */}
        <Route path="/create_profile" element={<CreateProfilePage/>} />

        {/* 프로필 수정 페이지 */}
        <Route path="/edit-profile" element={<EditProfilePage/>} />

        {/* 오디션 리스트 페이지 */}
        <Route path="/audition" element={<AuditionListPage/>} />

        {/* 내가 작성한 공고 */}
        <Route path="/my-audition/:id" element={<MyAuditionListPage/>} />

        {/* 오디션 작성 페이지 */}
        <Route path="/write-audition" element={<WriteAuditionPage/>} />

        {/* 오디션 수정 페이지 */}
        <Route path="/edit-audition" element={<EditAuditionPage/>} />

        {/* 오디션 보기 */}
        <Route path="/audition-view/:id" element={<AuditionViewPage/>} />

        {/* 마이페이지 */}
        <Route path="/my-page" element={<MyPage Logout={Logout}/>} />

        {/* 마이페이지 수정 */}
        <Route path="/edit-my" element={<EditMyInfoPage/>} />

      </Routes>

      <Dialog
        open={logoutDialogOpen}
        onClose={closeLogoutDialog}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">로그아웃</DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            로그아웃 하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeLogoutDialog} color="primary">
            취소
          </Button>
          <Button onClick={Logout} color="primary" autoFocus>
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;
