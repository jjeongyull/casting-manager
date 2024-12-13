import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Header = ({loginState, Logout, myId, castingMode}) => {
  const navigate = useNavigate();
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} onClick={() => navigate('/')}>
          Casting Manager
        </Typography>
        {
          loginState !== true?(
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
              <Button color="inherit" onClick={() => navigate('/sign')}>Sign Up</Button>
            </>
          ) : (
            <>
              {
                castingMode === 1 ?(
                  <Button color="inherit" onClick={() => navigate(`/my_list/${myId}`)}>내 공고보기</Button>
                ) : (
                  <Button color="inherit" onClick={() => navigate(`/actor/${myId}`)}>마이페이지</Button>
                )
              }
              <Button color="inherit" onClick={() => navigate(`/audition`)}>오디션 리스트</Button>
              <Button color="inherit"onClick={() => Logout()}>Logout</Button>
            </>
          )
        }
        
      </Toolbar>
    </AppBar>
  );
};

export default Header;
