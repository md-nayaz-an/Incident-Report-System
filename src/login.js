import React, { useState } from 'react';
import {
  Grid,
  TextField,
  FormControlLabel,
  FormControl,
  Radio,
  RadioGroup,
  Paper,
  Button,
  Alert
} from '@mui/material';

import { useNavigate } from 'react-router';


const LoginPage = () => {

  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setType] = useState('admin');
  const [err, setErr] = useState({
    severity: 'success',
    msg: 'Login Successful',
    show: false
  });

  const navigate = useNavigate();

  async function onLogin() {
    const url = `${process.env.REACT_APP_SERVER_URL}`;
    const response = await fetch(
      `${url}/login?userid=${userid}`,
      );
    
    
    let result = await response.json();
    
    if(result.password === password){
      setErr({
        severity: 'success',
        msg: 'Login Successful',
        show: true
      })

      if( loginType === 'admin')
        navigate(`/admin?username=${result.username}`);
      else
        navigate(`/user?userid=${result.id}&username=${result.username}`);
    }
    else {
      setErr({
        severity: 'error',
        msg: 'Invalid Login',
        show: true
      })
    }
  }

  return (
    <div style={{ padding: 100 , minWidth: 350}}>
      <Paper style={{padding: 50}}>
        <Grid
          container
          spacing={3}
          direction={'column'}
          justify={'center'}
          alignItems={'center'}
        >
          <Grid item xs={12}>
            <TextField 
              value={userid}
              onChange={(e)=>{
                setUserid(e.target.value)
                setErr({...err, show: false})
                }}
              label="UserID"></TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField 
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              label="Password" type={'password'}></TextField>
          </Grid>
          <Grid item xs={12}>
          <FormControl>
            <RadioGroup row onChange={(e) => setType(e.target.value)}>
              <FormControlLabel value="admin" control={<Radio />} label="Admin" />
              <FormControlLabel value="user" control={<Radio />} label="User" />
            </RadioGroup>
          </FormControl>
          </Grid>
          <Grid item xs={12}>
            { err.show && <Alert severity={err.severity}>{err.msg}</Alert> }
            <Button onClick={onLogin} fullWidth variant="outlined"> Login </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default LoginPage;
