import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function NoProfile() {
  const navigate = useNavigate();

  const handleCreateProfile = () => {
    navigate('/create_profile'); // 프로필 작성 페이지로 이동
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" gutterBottom>
        프로필이 없습니다.
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        프로필 만들기를 클릭해서 나만의 프로필을 만드세요!
      </Typography>
      <Button variant="contained" color="primary" onClick={handleCreateProfile}>
        프로필 만들기
      </Button>
    </Box>
  );
}

export default NoProfile;
