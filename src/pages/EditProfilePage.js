import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Chip,
  IconButton,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLocation, useNavigate } from 'react-router-dom';

import { formDataFunction } from '../util/formData';

function EditProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = location.state || {};

  const [formData, setFormData] = useState({
    profile_name: '',
    profile_phone: '',
    profile_email: '',
    profile_main_img: '',
    profile_others_img: [],
    profile_youtube_link: '',
    profile_instagram_link: '',
    profile_job: [],
    profile_video_link: [],
    profile_body_height: '',
    profile_body_weight: '',
    profile_specialty: '',
    profile_hobby: '',
    profile_history: [],
  });
  const [mainImgFile, setMainImgFile] = useState(null);
  const [mainImgPreview, setMainImgPreview] = useState(null);
  const [otherImgFiles, setOtherImgFiles] = useState([]);
  const [otherImgPreviews, setOtherImgPreviews] = useState([]);

  useEffect(() => {
    if (profile) {
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
      } = profile;

      setFormData({
        profile_name,
        profile_phone,
        profile_email,
        profile_main_img,
        profile_others_img: profile_others_img.split(','),
        profile_youtube_link,
        profile_instagram_link,
        profile_job: profile_job.split(','),
        profile_video_link: profile_video_link.split(','),
        profile_body_height,
        profile_body_weight,
        profile_specialty,
        profile_hobby,
        profile_history: JSON.parse(profile_history),
      });
      setMainImgPreview(`https://addit.menteimo.com/casting_manager_server/files/${profile.mem_id}/${profile_main_img}`);
      setOtherImgPreviews(
        profile_others_img.split(',').map(img => `https://addit.menteimo.com/casting_manager_server/files/${profile.mem_id}/${img}`)
      );
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMainImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImgFile(file);
      setMainImgPreview(URL.createObjectURL(file));
    }
  };

  const handleOtherImgChange = (e) => {
    const files = Array.from(e.target.files);
    setOtherImgFiles([...otherImgFiles, ...files]);
    setOtherImgPreviews([...otherImgPreviews, ...files.map(file => URL.createObjectURL(file))]);
  };

  const handleRemoveOtherImage = (index) => {
    const updatedFiles = [...otherImgFiles];
    const updatedPreviews = [...otherImgPreviews];
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setOtherImgFiles(updatedFiles);
    setOtherImgPreviews(updatedPreviews);
  };

  const handleJobChange = (job) => {
    setFormData((prev) => {
      const isSelected = prev.profile_job.includes(job);
      const updatedJobs = isSelected
        ? prev.profile_job.filter((j) => j !== job)
        : [...prev.profile_job, job];
      return { ...prev, profile_job: updatedJobs };
    });
  };

  const handleVideoChange = (index, value) => {
    const updatedVideos = [...formData.profile_video_link];
    updatedVideos[index] = value;
    setFormData({ ...formData, profile_video_link: updatedVideos });
  };

  const handleAddVideo = () => {
    setFormData((prev) => ({
      ...prev,
      profile_video_link: [...prev.profile_video_link, ''],
    }));
  };

  const handleRemoveVideo = (index) => {
    const updatedVideos = [...formData.profile_video_link];
    updatedVideos.splice(index, 1);
    setFormData({ ...formData, profile_video_link: updatedVideos });
  };

  const handleHistoryChange = (index, field, value) => {
    const updatedHistory = [...formData.profile_history];
    updatedHistory[index][field] = value;
    setFormData({ ...formData, profile_history: updatedHistory });
  };

  const handleAddHistory = () => {
    setFormData((prev) => ({
      ...prev,
      profile_history: [...prev.profile_history, { month: '', text: '' }],
    }));
  };

  const handleRemoveHistory = (index) => {
    const updatedHistory = [...formData.profile_history];
    updatedHistory.splice(index, 1);
    setFormData({ ...formData, profile_history: updatedHistory });
  };

  const handleSubmit = async () => {
    const formDataApi = new FormData();
    formDataApi.append("profile_name", formData.profile_name);
    formDataApi.append("profile_phone", formData.profile_phone);
    formDataApi.append("profile_email", formData.profile_email);
    formDataApi.append("profile_main_img", formData.profile_main_img);
    formDataApi.append("profile_others_img", formData.profile_others_img.join(','));
    formDataApi.append("profile_youtube_link", formData.profile_youtube_link);
    formDataApi.append("profile_instagram_link", formData.profile_instagram_link);
    formDataApi.append("profile_job", formData.profile_job.join(','));
    formDataApi.append("profile_video_link", formData.profile_video_link.join(','));
    formDataApi.append("profile_body_height", formData.profile_body_height);
    formDataApi.append("profile_body_weight", formData.profile_body_weight);
    formDataApi.append("profile_specialty", formData.profile_specialty);
    formDataApi.append("profile_hobby", formData.profile_hobby);
    formDataApi.append("profile_history", JSON.stringify(formData.profile_history));
    formDataApi.append("mem_id", profile?.mem_id);
    formDataApi.append("cmd", 'update_profile');

    formDataApi.append(`main_files`, mainImgFile);

    for (var i = 0; i < otherImgFiles.length; i++) {
      formDataApi.append(`other_files[]`, otherImgFiles[i]);
    }
    console.log(formDataApi)
    const response = await formDataFunction(formDataApi);
    console.log(response)
  };

  return (
    <Box sx={{ padding: 4, maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Edit Profile
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Name"
            name="profile_name"
            value={formData.profile_name}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone"
            name="profile_phone"
            value={formData.profile_phone}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            name="profile_email"
            value={formData.profile_email}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="YouTube Link"
            name="profile_youtube_link"
            value={formData.profile_youtube_link}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Instagram Link"
            name="profile_instagram_link"
            value={formData.profile_instagram_link}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Main Image
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {mainImgPreview && (
              <img
                src={mainImgPreview}
                alt="Main Preview"
                style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
              />
            )}
            <Button variant="contained" component="label">
              Change Main Image
              <input
                type="file"
                hidden
                onChange={handleMainImgChange}
                accept="image/*"
              />
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Other Images
          </Typography>
          <Grid container spacing={2}>
            {otherImgPreviews.map((preview, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Box sx={{ position: 'relative' }}>
                  <img
                    src={preview}
                    alt={`Other Preview ${index + 1}`}
                    style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <IconButton
                    color="error"
                    sx={{ position: 'absolute', top: '5px', right: '5px' }}
                    onClick={() => handleRemoveOtherImage(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Button variant="contained" component="label" startIcon={<AddCircleOutlineIcon />} sx={{ mt: 2 }}>
            Add Other Images
            <input
              type="file"
              hidden
              multiple
              onChange={handleOtherImgChange}
              accept="image/*"
            />
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Professional Roles
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {['Actor', 'Model', 'Influencer'].map((job) => (
              <Chip
                key={job}
                label={job}
                color={formData.profile_job.includes(job) ? 'primary' : 'default'}

                onClick={() => handleJobChange(job)}
                clickable
              />
            ))}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Video Links
          </Typography>
          {formData.profile_video_link.map((link, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
              <TextField
                fullWidth
                value={link}
                onChange={(e) => handleVideoChange(index, e.target.value)}
                label={`Video ${index + 1}`}
              />
              <IconButton onClick={() => handleRemoveVideo(index)} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button startIcon={<AddCircleOutlineIcon />} onClick={handleAddVideo}>
            Add Video
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Work History
          </Typography>
          {formData.profile_history.map((history, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
              <TextField
                value={history.month}
                onChange={(e) => handleHistoryChange(index, 'month', e.target.value)}
                label="Month"
                sx={{ marginRight: 1 }}
              />
              <TextField
                value={history.text}
                onChange={(e) => handleHistoryChange(index, 'text', e.target.value)}
                label="Description"
                fullWidth
              />
              <IconButton onClick={() => handleRemoveHistory(index)} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button startIcon={<AddCircleOutlineIcon />} onClick={handleAddHistory}>
            Add History
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ marginTop: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
        <Button variant="contained" color="error" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
}

export default EditProfilePage;