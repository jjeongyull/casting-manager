import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../util/api';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
} from '@mui/material';

import { useSelector } from 'react-redux';
import { selectUserInfo } from '../features/user/userSlice';

function AuditionViewPage() {
  const userInfo = useSelector(selectUserInfo);
  const [auditionData, setAuditionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  const loadAuditionData = async () => {
    try {
      const response = await api({ cmd: 'load_audition_data', idx: id });
      if (response.status === 200) {
        setAuditionData(response.data);
      }
    } catch (error) {
      console.error('Error loading audition data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const load_profile = async () => {
    try {
      const response = await api({
        cmd: 'load_my_profile',
        mem_id: userInfo?.mem_id
      });
      console.log(response);
      if(response.data.mem_id){
        setProfile(response.data);
      }else{
        setProfile(null);
      }
    } catch (error) {
      console.error('Failed to fetch profiles:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  const insertApply = async () => {
    alert('준비중입니다.')
  }


  useEffect(() => {
    loadAuditionData();
    if(userInfo){
      load_profile();
    }
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!auditionData) {
    return (
      <Container>
        <Typography variant="h5" align="center" color="error" sx={{ marginTop: 4 }}>
          공고 정보를 불러올 수 없습니다.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
            {auditionData.project_name}
          </Typography>

          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="textSecondary">
                <strong>유형:</strong> {auditionData.project_type}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="textSecondary">
                <strong>배역:</strong> {auditionData.project_casting}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="textSecondary">
                <strong>작성자:</strong> {auditionData.project_writer}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="textSecondary">
                <strong>작성일:</strong> {new Date(auditionData.writer_date).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="textSecondary">
                <strong>진행 상태:</strong> {auditionData.project_active === 0 ? '진행중' : '마감'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="textSecondary">
                <strong>상세 내용:</strong>
              </Typography>
              <Typography variant="body1" sx={{ marginTop: 1, whiteSpace: 'pre-wrap', color: '#34495e' }}>
                {auditionData.project_info}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {
        profile&&(
          <Button
            onClick={insertApply}
            sx={{ marginTop: 2 }}
          >
            지원하기
          </Button>
        )
      }
    </Container>
  );
}

export default AuditionViewPage;
