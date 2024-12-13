import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

import { formDataFunction } from '../util/formData';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../features/user/userSlice';

function CreateProfilePage() {
  const userInfo = useSelector(selectUserInfo);
  
  // 전체 프로필 데이터
  const [profile, setProfile] = useState({
    profile_name: '',
    profile_phone: '',
    profile_email: '',
    profile_main_img: null,
    profile_others_img: [],
    profile_youtube_link: '',
    profile_instagram_link: '',
    profile_job: [],
    profile_video_link: [],
    profile_body_height: '',
    profile_body_weight: '',
    profile_specialty: '',
    profile_hobby: '',
    profile_history: [{ month: '', text: '' }]
  });

  // 메인이미지 파일
  const [mainImgFile, setMainImgFile] = useState(null);
  const [mainImgPreview, setMainImgPreview] = useState(null);

  // 다른 이미지 파일
  const [otherImgFiles, setOtherImgFiles] = useState([]);
  const [otherImgPreview, setOtherImgPreview] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const files = e.target.files;
    if (name === 'profile_main_img') {
      const file = files[0];
      setProfile({ ...profile, profile_main_img: file.name });
      setMainImgFile(file);
      setMainImgPreview(URL.createObjectURL(file));
    } else if (name === 'profile_others_img') {
      const newImages = Array.from(files).map(file => ({
        name: file.name,
        preview: URL.createObjectURL(file),
      }));
      setProfile({
        ...profile,
        profile_others_img: [...profile.profile_others_img, ...newImages.map(img => img.name)],
      });
      setOtherImgFiles([...otherImgFiles, ...files]);
      setOtherImgPreview([...otherImgPreview, ...newImages.map(img => img.preview)]);
    }
  };


  const handleJobChange = (e) => {
    const { value, checked } = e.target;
    setProfile((prevState) => {
      const newJobs = checked
        ? [...prevState.profile_job, value]
        : prevState.profile_job.filter((job) => job !== value);
      return { ...prevState, profile_job: newJobs };
    });
  };

  const handleRemoveOtherImage = (index) => {
    const updatedImages = [...profile.profile_others_img];
    updatedImages.splice(index, 1);
    setProfile({ ...profile, profile_others_img: updatedImages });

    const updatedFiles = [...otherImgFiles];
    updatedFiles.splice(index, 1);
    setOtherImgFiles(updatedFiles);

    const updatedPreviews = [...otherImgPreview];
    updatedPreviews.splice(index, 1);
    setOtherImgPreview(updatedPreviews);
  };


  const handleAddVideoLink = () => {
    setProfile({ ...profile, profile_video_link: [...profile.profile_video_link, ''] });
  };

  const handleVideoLinkChange = (index, value) => {
    const updatedLinks = [...profile.profile_video_link];
    updatedLinks[index] = value;
    setProfile({ ...profile, profile_video_link: updatedLinks });
  };

  const handleRemoveVideoLink = (index) => {
    const updatedLinks = [...profile.profile_video_link];
    updatedLinks.splice(index, 1);
    setProfile({ ...profile, profile_video_link: updatedLinks });
  };

  const handleAddHistory = () => {
    setProfile({
      ...profile,
      profile_history: [...profile.profile_history, { month: '', text: '' }],
    });
  };

  const handleHistoryChange = (index, field, value) => {
    const updatedHistory = [...profile.profile_history];
    updatedHistory[index][field] = value;
    setProfile({ ...profile, profile_history: updatedHistory });
  };

  const handleRemoveHistory = (index) => {
    const updatedHistory = [...profile.profile_history];
    updatedHistory.splice(index, 1);
    setProfile({ ...profile, profile_history: updatedHistory });
  };

  // 프로필 올리기
  const InsertProfile = async () => {
    const formData = new FormData();
    formData.append("profile_name", profile.profile_name);
    formData.append("profile_phone", profile.profile_phone);
    formData.append("profile_email", profile.profile_email);
    formData.append("profile_main_img", profile.profile_main_img);
    formData.append("profile_others_img", profile.profile_others_img.join(','));
    formData.append("profile_youtube_link", profile.profile_youtube_link);
    formData.append("profile_instagram_link", profile.profile_instagram_link);
    formData.append("profile_job", profile.profile_job.join(','));
    formData.append("profile_video_link", profile.profile_video_link.join(','));
    formData.append("profile_body_height", profile.profile_body_height);
    formData.append("profile_body_weight", profile.profile_body_weight);
    formData.append("profile_specialty", profile.profile_specialty);
    formData.append("profile_hobby", profile.profile_hobby);
    formData.append("profile_history", JSON.stringify(profile.profile_history));
    formData.append("mem_id", userInfo?.mem_id);
    formData.append("cmd", 'insert_profile');

    formData.append(`main_files`, mainImgFile);

    for (var i = 0; i < otherImgFiles.length; i++) {
      formData.append(`other_files[]`, otherImgFiles[i]);
    }

    const response = await formDataFunction(formData);
    console.log(response)

  }

  return (
    <Box sx={{ padding: 4, maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        프로필 만들기
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="이름"
            name="profile_name"
            value={profile.profile_name}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="전화번호"
            name="profile_phone"
            value={profile.profile_phone}
            onChange={handleInputChange}
            type="number"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="이메일"
            name="profile_email"
            value={profile.profile_email}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">직업 유형</FormLabel>
            <FormGroup row>
              {['Actor', 'Model', 'Influencer'].map((job) => (
                <FormControlLabel
                  key={job}
                  control={
                    <Checkbox
                      value={job}
                      checked={profile.profile_job.includes(job)}
                      onChange={handleJobChange}
                    />
                  }
                  label={job}
                />
              ))}
            </FormGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="키 (cm)"
            name="profile_body_height"
            value={profile.profile_body_height}
            onChange={handleInputChange}
            type="number"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="몸무게 (kg)"
            name="profile_body_weight"
            value={profile.profile_body_weight}
            onChange={handleInputChange}
            type="number"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="특기"
            name="profile_specialty"
            value={profile.profile_specialty}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="취미"
            name="profile_hobby"
            value={profile.profile_hobby}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 2 }}>
            <Box
              sx={{
                width: 200,
                height: 200,
                border: '1px dashed gray',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 2,
                backgroundImage: mainImgPreview ? `url(${mainImgPreview})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {!mainImgPreview && <Typography>메인이미지</Typography>}
            </Box>
            <Button variant="contained" component="label">
              메인이미지 추가
              <input
                type="file"
                name="profile_main_img"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <FormLabel component="legend">이미지 (10개 까지 첨부 가능)</FormLabel>
          <Grid container spacing={2}>
            {otherImgPreview.map((img, index) => (
              <Grid item xs={3} key={index}>
                <Box
                  sx={{
                    width: '100%',
                    paddingTop: '75%',
                    position: 'relative',
                    border: '1px solid gray',
                    borderRadius: 2,
                    overflow: 'hidden',
                    backgroundImage: `url(${img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveOtherImage(index)}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Button variant="contained" component="label" sx={{ marginTop: 2 }}>
            이미지
            <input
              type="file"
              name="profile_others_img"
              accept="image/*"
              hidden
              multiple
              onChange={handleFileChange}
            />
          </Button>
        </Grid>

        <Grid item xs={12}>
          <FormLabel component="legend">영상 링크</FormLabel>
          {profile.profile_video_link.map((link, index) => (
            <Box key={index} display="flex" alignItems="center" mb={2}>
              <TextField
                fullWidth
                value={link}
                onChange={(e) => handleVideoLinkChange(index, e.target.value)}
                placeholder={`Video Link ${index + 1}`}
              />
              <IconButton color="error" onClick={() => handleRemoveVideoLink(index)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleAddVideoLink}
            variant="contained"
            sx={{ marginTop: 2 }}
          >
            영상 링크 추가
          </Button>
        </Grid>

        <Grid item xs={12}>
          <FormLabel component="legend">경력</FormLabel>
          {profile.profile_history.map((history, index) => (
            <Box key={index} display="flex" alignItems="center" mb={2}>
              <TextField
                label="Month"
                value={history.month}
                onChange={(e) => handleHistoryChange(index, 'month', e.target.value)}
                sx={{ marginRight: 2 }}
                type="month"
              />
              <TextField
                label="Description"
                value={history.text}
                onChange={(e) => handleHistoryChange(index, 'text', e.target.value)}
                sx={{ flex: 1 }}
              />
              <IconButton color="error" onClick={() => handleRemoveHistory(index)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleAddHistory}
            variant="contained"
            sx={{ marginTop: 2 }}
          >
            경력 추가
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" color="primary" size="large" onClick={InsertProfile}>
            프로필 생성
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CreateProfilePage;
