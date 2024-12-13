import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../features/user/userSlice';

const ProfileImage = styled('img')({
  width: '100%',
  borderRadius: '8px',
  objectFit: 'cover',
});

function ProfileView({ profiles }) {
  const userInfo = useSelector(selectUserInfo);
  const navigate = useNavigate();

  if (!profiles) return <Typography>Loading...</Typography>;

  const {
    profile_name,
    profile_phone,
    profile_email,
    profile_main_img,
    profile_others_img,
    profile_youtube_link,
    profile_instagram_link,
    profile_job,
    profile_video_link,
    profile_body_height,
    profile_body_weight,
    profile_specialty,
    profile_hobby,
    profile_history,
    mem_id,
  } = profiles;

  const mainImgUrl = `https://addit.menteimo.com/casting_manager_server/files/${mem_id}/${profile_main_img}`;
  const otherImgUrls = profile_others_img.split(',').map(img => `https://addit.menteimo.com/casting_manager_server/files/${mem_id}/${img}`);
  const videoLinks = profile_video_link.split(',');
  const jobs = profile_job.split(',');
  const history = JSON.parse(profile_history);

  const handleEdit = () => {
    navigate(`/edit-profile`, { state: { profile: profiles } });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      // Add deletion logic here
      console.log('Profile deleted:', profiles.idx);
    }
  };

  return (
    <Box sx={{ padding: 4, maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        {profile_name}'s Profile
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Avatar
            src={mainImgUrl}
            alt={profile_name}
            variant="rounded"
            sx={{ width: '100%', height: 'auto' }}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Typography variant="h6">Contact Information</Typography>
          <Typography>Phone: {profile_phone}</Typography>
          <Typography>Email: {profile_email}</Typography>

          <Divider sx={{ marginY: 2 }} />

          <Typography variant="h6">Physical Attributes</Typography>
          <Typography>Height: {profile_body_height} cm</Typography>
          <Typography>Weight: {profile_body_weight} kg</Typography>

          <Divider sx={{ marginY: 2 }} />

          <Typography variant="h6">Specialty & Hobby</Typography>
          <Typography>Specialty: {profile_specialty}</Typography>
          <Typography>Hobby: {profile_hobby}</Typography>

          <Divider sx={{ marginY: 2 }} />

          <Typography variant="h6" gutterBottom>
            Professional Roles
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {jobs.map((job, index) => (
              <Chip key={index} label={job} color="primary" />
            ))}
          </Box>

          <Divider sx={{ marginY: 2 }} />

          {
            userInfo && userInfo.mem_id === mem_id && (
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEdit}
              >
                Edit Profile
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDelete}
              >
                Delete Profile
              </Button>
            </Box>
            )
          }
        </Grid>
      </Grid>



      <Divider sx={{ marginY: 4 }} />

      <Typography variant="h6" gutterBottom>
        Other Images
      </Typography>
      <Grid container spacing={2}>
        {otherImgUrls.map((url, index) => (
          <Grid item xs={6} sm={4} md={3} key={index}>
            <ProfileImage src={url} alt={`Other Image ${index + 1}`} />
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ marginY: 4 }} />

      <Typography variant="h6" gutterBottom>
        Video Links
      </Typography>
      <List>
        {videoLinks.map((link, index) => (
          <ListItem key={index} component="a" href={link} target="_blank" rel="noopener noreferrer">
            <ListItemText primary={`Video ${index + 1}`} secondary={link} />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ marginY: 4 }} />

      <Typography variant="h6" gutterBottom>
        Work History
      </Typography>
      <List>
        {history.map((item, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={item.text}
              secondary={`Month: ${item.month}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default ProfileView;
