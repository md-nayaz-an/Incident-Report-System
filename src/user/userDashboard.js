import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Incidents from './incidents';
import Triggered from './triggered';
import Acknowledged from './acknowledged';
import Resolved from './resolved';
import { Chip, Avatar, Button } from '@mui/material';

import { useNavigate, useSearchParams } from 'react-router-dom';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={'div'}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function UserDash() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const navigate = useNavigate();
  const [searchParams] = useSearchParams()
  const avatar = searchParams.get('username');
  return (
    <Box sx={{ width: '100%' }}>
      <Box position='absolute' right='20px' zIndex='1'>  
        <Chip avatar={<Avatar>{avatar[0]}</Avatar>} label={avatar}
          style={{marginRight: '10px'}}
        />
        <Button variant='outlined' size='small'
          onClick={()=>navigate('/')}
        >
          Sign Out
        </Button>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Incidents" {...a11yProps(0)} />
          <Tab label="Triggered" {...a11yProps(1)} />
          <Tab label="Acknowledged" {...a11yProps(2)} />
          <Tab label="Resolved" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Incidents userid={searchParams.get('userid')}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Triggered userid={searchParams.get('userid')}/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Acknowledged userid={searchParams.get('userid')}/>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Resolved userid={searchParams.get('userid')}/>
      </TabPanel>
    </Box>
  );
} 