import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../util/api';
import ProfileView from '../components/ProfileView';
import NoProfile from '../components/NoProfile';
import { CircularProgress, Box } from '@mui/material';

function ActorProfile() {
  const { id } = useParams();
  const [profiles, setProfiles] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await api({
          cmd: 'load_my_profile',
          mem_id: id,
        });
        console.log(response);
        if(response.data.mem_id){
          setProfiles(response.data);
        }else{
          setProfiles(null);
        }
      } catch (error) {
        console.error('Failed to fetch profiles:', error);
        setProfiles(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfiles();
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      {profiles ? (
        <ProfileView profiles={profiles} />
      ) : (
        <NoProfile />
      )}
    </div>
  );
}

export default ActorProfile;