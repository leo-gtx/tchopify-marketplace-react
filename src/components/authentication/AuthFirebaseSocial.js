import { useState } from 'react';
import { Icon } from '@iconify/react';
import googleFill from '@iconify/icons-eva/google-fill';
import facebookFill from '@iconify/icons-eva/facebook-fill';
// material
import { Stack, Button, Divider, Typography, Alert } from '@material-ui/core';
// actions
import { loginWithFaceBook, loginWithGoogle } from '../../redux/actions/authedUser';
// ----------------------------------------------------------------------
export default function AuthFirebaseSocials() {
  const [ error, setError] = useState()
  const handleLoginGoogle = async () => {
    try {
      await loginWithGoogle((error)=>setError(error));
    } catch (error) {
      console.error(error);
    }
  };

  const handleLoginFaceBook =() => {
     loginWithFaceBook((error)=>setError(error));
  };
  /**
   *const handleLoginTwitter = async () => {
    try {
      // await loginWithTwitter();
    } catch (error) {
      console.error(error);
    }
  }; 
   */
  

  return (
    <>
      <Stack direction="row" spacing={2}>
        <Button fullWidth size="large" color="inherit" variant="outlined" onClick={handleLoginGoogle}>
          <Icon icon={googleFill} color="#DF3E30" height={24} />
        </Button>

        <Button fullWidth size="large" color="inherit" variant="outlined" onClick={handleLoginFaceBook}>
          <Icon icon={facebookFill} color="#1877F2" height={24} />
        </Button>
        {/**
         * <Button fullWidth size="large" color="inherit" variant="outlined" onClick={handleLoginTwitter}>
          <Icon icon={twitterFill} color="#1C9CEA" height={24} />
        </Button>
         */}
      </Stack>
         { error && <Alert severity='error'>{error}</Alert>}
      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          OR
        </Typography>
      </Divider>
    </>
  );
}
