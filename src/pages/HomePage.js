import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import { api } from '../util/api';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [profileList, setProfileList] = useState([]);

  const loadProfileList = async () => {
    try {
      const result = await api({
        cmd: 'load_profile',
      });
      if (result.status === 200) {
        setProfileList(result.data);
      }
    } catch (error) {
      alert('Error loading profiles: ' + error.message);
    }
  };

  useEffect(() => {
    loadProfileList();
  }, []);

  const viewProfilePage = (mem_id) => {
    navigate(`/actor/${mem_id}`);
  }

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Typography variant="h3" gutterBottom align="center">
        Talent DB
      </Typography>
      <Typography variant="h6" gutterBottom align="center" color="textSecondary">
        다양한 재능 있는 배우, 모델, 인플루언서를 만나보세요.
      </Typography>

      {profileList.length > 0 ? (
        <Grid container spacing={4} sx={{ marginTop: 4 }}>
          {profileList.map((profile) => (
            <Grid item xs={12} sm={6} md={4} key={profile.idx}>
              <Card onClick={() => viewProfilePage(profile.mem_id)}>
                <CardMedia
                  component="img"
                  height="auto"
                  image={`https://addit.menteimo.com/casting_manager_server/files/${profile.mem_id}/${profile.profile_main_img}`}
                  alt={profile.profile_name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {profile.profile_name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', marginTop: 4 }}>
          <Typography variant="h6" color="textSecondary">
            No profiles available. Check back later!
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default HomePage;
