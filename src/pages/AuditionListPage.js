import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  TextField
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { api } from '../util/api';
import { selectUserInfo } from '../features/user/userSlice';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AuditionListPage = () => {
  const navigate = useNavigate();
  const [auditions, setAuditions] = useState([]);
  const [filteredAuditions, setFilteredAuditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const userInfo = useSelector(selectUserInfo);

  const loadAuditions = async () => {
    try {
      const response = await api({ cmd: 'load_audition_list' });
      if (response.status === 200) {
        setAuditions(response.data);
        setFilteredAuditions(response.data);
      }
    } catch (error) {
      console.error('Error loading auditions:', error.message);
      alert('Failed to load auditions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredAuditions(
      auditions.filter((audition) =>
        Object.values(audition).some((value) =>
          value.toString().toLowerCase().includes(query)
        )
      )
    );
  };

  useEffect(() => {
    loadAuditions();
  }, []);

  const columns = [
    { field: 'project_type', headerName: '작품유형', flex: 1 },
    {
      field: 'project_name',
      headerName: 'Title',
      flex: 2,
      renderCell: (params) => (
        <span
          style={{ cursor: 'pointer', color: '#3498db', textDecoration: 'underline' }}
          onClick={() => navigate(`/audition-view/${params.row.idx}`)}
        >
          {params.value}
        </span>
      ),
    },
    { field: 'project_casting', headerName: '배역', flex: 1 },
    { field: 'project_writer', headerName: '작성자', flex: 1 },
    { field: 'writer_date', headerName: '작성일', flex: 1},
    { field: 'view_count', headerName: '조회 수', flex: 1}
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
        오디션 리스트
      </Typography>

      <TextField
        fullWidth
        placeholder="검색어를 입력하세요."
        value={searchQuery}
        onChange={handleSearch}
        sx={{ marginBottom: 2, backgroundColor: '#ecf0f1', borderRadius: '5px' }}
      />

      <Box sx={{ height: 600, width: '100%', marginTop: 4 }}>
        <DataGrid
          rows={filteredAuditions.map((audition, index) => ({ id: index, ...audition }))}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          disableSelectionOnClick
          sx={{ 
            boxShadow: 2, 
            border: 1, 
            borderColor: '#bdc3c7', 
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#3498db',
              color: '#000',
              fontSize: 16,
              fontWeight: 'bold',
            },
            '& .MuiDataGrid-cell': {
              color: '#2c3e50',
              fontSize: 14,
            },
          }}
        />
      </Box>

      {userInfo?.casting_mode === 1 && (
        <Box sx={{ textAlign: 'center', marginTop: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/write-audition')}
            sx={{ fontWeight: 'bold', backgroundColor: '#1abc9c' }}
          >
            글쓰기
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default AuditionListPage;