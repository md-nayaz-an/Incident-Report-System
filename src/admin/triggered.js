import * as React from 'react';
import { useState, useEffect, useReducer } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Avatar,Button, Typography, Chip, Divider, Box, TextField, Slider } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);


function colorReturn(val) {
  if(val === "Triggered")
    return "red";
  if(val === "Resolved")
    return "green";
  if(val === "Acknowledged")
    return "#e8e005";
}

export default function Triggered() {

  const [changed, onChanged] = useState(false);
  const [rows, setRows] = useState([]);
  useEffect(() => {
    async function getRows() {
      const url = `${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}`;
      const response = await fetch(
        `${url}/incident?status=Triggered`,
        );
      const rows = await response.json();
      setRows(rows);
    }

    getRows();

    return;
  }, [changed]);


  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>#ID</TableCell>
              <TableCell align="right">Title</TableCell>
              <TableCell align="right">Service</TableCell>
              <TableCell align="right">Assigned</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Priority</TableCell>
              <TableCell align="right">Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="right">{row.title}</TableCell>
                <TableCell align="right">{row.service}</TableCell>
                <TableCell align="right">
                  <Chip avatar={<Avatar>{row.userDetails[0].username[0]}</Avatar>} label={row.userDetails[0].username} />
                </TableCell>
                <TableCell align="right">
                  <Chip label={row.status} color="primary" style={{backgroundColor: colorReturn(row.status)}} />
                </TableCell>
                <TableCell align="right">{row.priority}</TableCell>
                <TableCell align="right">{row.created}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <br />
      <Divider>
        <Chip label="Add new Trigger" />
      </Divider>

      <InputComp 
        onChanged={onChanged}
        changed={changed}
      />
    </>
  );
}

function reducer(state, action) {
  switch (action.type) {
    case 'id':
      return { ...state, id: action.payload}
    case 'title':
      return { ...state, title: action.payload}
    case 'service':
      return {...state, service: action.payload}
    case 'assigned':
      return {...state, assigned: action.payload}
    case 'priority':
      return {...state, priority: action.payload}
    case 'created':
      return {...state};
    default:
      throw new Error();
  }
}

function InputComp(props) {

  let initial = {
    id: 0,
    title: "Error",
    service: "Service Down",
    assigned: '',
    status: "Triggered",
    priority: "3",
    created: dayjs().format('DD MMM YYYY').toString()
  }

  const [state, dispatch] = useReducer(reducer, initial);
  const [details, setDetails] = useState([]);

  useEffect(() => {
    async function getSeq() {
      const url = `${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}`;
      const response = await fetch(
        `${url}/sequence`,
        );
      let result = await response.json();
      dispatch({type: 'id', payload: result.current});
    }

    getSeq();
    getUserDetails();
    return 
  }, [props.changed])  

  async function onSubmit(e) {
    e.preventDefault();
    props.onChanged(!props.changed);
    const url = `${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}`;
      await fetch(`${url}/incident/add`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(state),
      })
    }
    
  async function getUserDetails() {
    const url = `${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}`;
    const response = await fetch(
      `${url}/userdetails`,
      );
    let result = await response.json();
    setDetails(result);
    return result
  }
  return(
    <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableBody>
              <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                    <TextField
                      readOnly
                      id="outlined-read-only-input"
                      label="#ID"
                      value={state.id}
                    />
                </TableCell>
                <TableCell>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      disableMaskedInput
                      label="Created"
                      value={dayjs()}
                      inputFormat="DD MMM YYYY"
                      renderInput={(params) => <TextField {...params} />}
                      onChange={() => dispatch({type: 'created'}) }
                    />
                  </LocalizationProvider>
                </TableCell>
                <TableCell />
              </TableRow>

              <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="left">
                  <TextField
                    id="title"
                    label="Title"
                    variant="outlined"
                    onChange={(e)=> dispatch({type: 'title', payload: e.target.value})}
                    />
                </TableCell>
                <TableCell align="left">
                  <TextField 
                    id="service"
                    label="Service"
                    variant="outlined"
                    onChange={(e)=> dispatch({type: 'service', payload: e.target.value})}
                    />
                </TableCell>
                <TableCell />

              </TableRow>

              <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="left">
                  <Box sx={{width: 300}}>
                    <Typography id="input-slider" gutterBottom>
                      Priority
                    </Typography>
                    <Slider
                      defaultValue={3}
                      step={1}
                      marks={
                        [
                          { value: 1, label: "high"},
                          ...[2,3,4,5,6,7,8,9].map(n => {
                            return {
                              value: n,
                              label: n.toString()
                            }
                          }),
                          { value: 10, label: "low"},
                        ]
                      }
                      min={1}
                      max={10}
                      onChange={(e)=> dispatch({type: 'priority', payload: e.target.value})}
                    />
                  </Box>
                </TableCell>

                <TableCell align="right">
                  <FormControl fullWidth >
                    <InputLabel>Assign to</InputLabel>
                    <Select
                      align="left"
                      id="assigned"
                      label="Assign to"
                      value={state.assigned}
                      defaultValue=""
                      onChange={(e)=> dispatch({type: 'assigned', payload: e.target.value})}
                    >
                    {details.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        <Chip avatar={<Avatar>{user.username[0]}</Avatar>} label={user.username} />
                      </MenuItem>
                    ))}
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
              <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>
                <Button
                  variant="outlined"
                  onClick={onSubmit}
                >
                  Add Trigger
                </Button>
                </TableCell>
              </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
  )
}