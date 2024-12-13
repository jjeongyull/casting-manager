import React, { useState } from 'react';
import '../style/SignPage.style.css';

import { api } from '../util/api';
import { Typography, Button, Container, Box, TextField, Checkbox, FormControlLabel, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function SignPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    actor_active: 0,
    model_active: 0,
    influencer_active: 0,
    username: '',
    password: '',
    confirmPassword: '',
    castingMode: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleRoleChange = (e) => {
    const { name, checked } = e.target;
    setForm({ ...form, [name]: checked ? 1 : 0 });
  };

  const handleCastingModeChange = (e) => {
    setForm({ ...form, castingMode: e.target.checked ? 1 : 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const result = await api({
        cmd: 'sign_member',
        mem_name: form.name,
        mem_phone: form.phone,
        mem_email: form.email,
        actor_active: form.actor_active,
        model_active: form.model_active,
        influencer_active: form.influencer_active,
        mem_id: form.username,
        mem_password: form.password,
        casting_mode: form.castingMode
      });
      if (result.status === 200) {
        navigate('/login');
      }
    } catch (error) {
      alert('회원가입 에러: ' + error.message);
    }
  };

  return (
    <>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 3, marginTop: 5 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Sign Up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="actor_active"
                      checked={form.actor_active === 1}
                      onChange={handleRoleChange}
                    />
                  }
                  label="배우"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="model_active"
                      checked={form.model_active === 1}
                      onChange={handleRoleChange}
                    />
                  }
                  label="모델"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="influencer_active"
                      checked={form.influencer_active === 1}
                      onChange={handleRoleChange}
                    />
                  }
                  label="인플루언서"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.castingMode === 1}
                      onChange={handleCastingModeChange}
                    />
                  }
                  label="캐스팅 디렉터"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" fullWidth>
                  Sign Up
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </>
  );
}


export default SignPage