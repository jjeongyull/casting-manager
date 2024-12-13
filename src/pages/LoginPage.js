import React, { useState } from 'react';
import { Typography, Button, Container, TextField, Paper, Box, Grid } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { api } from '../util/api';
import cookiesFunction from '../util/cookie';
import { setUserInfo } from '../features/user/userSlice';

const LoginPage = ({setLoginState, setMyId}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    mem_id: '',
    mem_password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const login = async () => {
    try {
      const result = await api({
        cmd: 'login',
        mem_id: form.mem_id,
        mem_password: form.mem_password
      });
      console.log(result)
      if (result.status === 200) {
        cookiesFunction.setCookie('casting_manager', result.token, 1);
        dispatch(setUserInfo(result.data));
        setLoginState(true);
        setMyId(form.mem_id);
        navigate('/');
      }
    } catch (error) {
      console.log(error)
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 3, marginTop: 5 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Login
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="ID"
                  name="mem_id"
                  value={form.mem_id}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  name="mem_password"
                  type="password"
                  value={form.mem_password}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" fullWidth onClick={login}>
                  Login
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button variant="outlined" fullWidth onClick={() => navigate('/sign')}>
                  Create Account
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default LoginPage;
