import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  MenuItem,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../features/user/userSlice';
import { api } from '../util/api';
import { useNavigate } from 'react-router-dom';

const WriteAuditionPage = () => {
  const navigate = useNavigate();
  const userInfo = useSelector(selectUserInfo);
  const [formData, setFormData] = useState({
    project_name: '',
    project_type: '',
    project_casting: '',
    project_info: '',
    project_active: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'project_active') {
      setFormData({ ...formData, [name]: value === 'progress' ? 0 : 1 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const createAudition = async () => {
    const response = await api({
      cmd: 'insert_audition',
      project_name: formData.project_name,
      project_type: formData.project_type,
      project_casting: formData.project_casting,
      project_writer: userInfo?.mem_name,
      project_writer_id: userInfo?.mem_id,
      project_info: formData.project_info,
      project_active: formData.project_active
    });

    console.log(response)
    if(response.status === 200){
      alert('공고가 등록되었습니다.');
      navigate('/audition');
    }
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        공고작성
      </Typography>

      <Box sx={{ marginTop: 4 }}>
        <TextField
          fullWidth
          label="작품 명"
          name="project_name"
          value={formData.project_name}
          onChange={handleInputChange}
          margin="normal"
        />

        <TextField
          fullWidth
          select
          label="작품 유형"
          name="project_type"
          value={formData.project_type}
          onChange={handleInputChange}
          margin="normal"
        >
          {['단편영화', '장편영화', 'OTT', '독립영화', '드라마', '웹드라마', '유튜브', '기타'].map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="배역"
          name="project_casting"
          value={formData.project_casting}
          onChange={handleInputChange}
          margin="normal"
        />

        <TextField
          fullWidth
          multiline
          minRows={4}
          label="세부 내용"
          name="project_info"
          value={formData.project_info}
          onChange={handleInputChange}
          margin="normal"
        />

        <FormControl sx={{ marginTop: 2 }}>
          <FormLabel>공고 상태</FormLabel>
          <RadioGroup
            row
            name="project_active"
            value={formData.project_active === 0 ? 'progress' : 'closed'}
            onChange={handleInputChange}
          >
            <FormControlLabel value="progress" control={<Radio />} label="진행중" />
            <FormControlLabel value="closed" control={<Radio />} label="마감" />
          </RadioGroup>
        </FormControl>

        <Box sx={{ marginTop: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={createAudition}
          >
            글쓰기
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default WriteAuditionPage;
