import * as React from 'react';
import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Chip, Button, TextField } from '@mui/material';

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

export default function Acknowledged(props) {

  const [rows, setRows] = useState([]);

  const [date, setDate] = useState(dayjs());

  const [changed, onChanged] = useState(false);

  useEffect(() => {
    async function getRows() {
      const url = `${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}`;
      const response = await fetch(
        `${url}/incident?userid=${props.userid}&status=Acknowledged`,
        );
      const rows = await response.json();
      setRows(rows);
    }

    getRows();

    return;
  }, [changed, props.userid]);
 
  const handleChange = (e) => {
    setDate(e);
  };

  const handleClick = async(userid) => {
    const url = `${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}`;
    const response = await fetch(
      `${url}/update/status?id=${userid}&status=Resolved&date=${date.format('DD MMM YYYY')}`,
      );
    let result = await response.json();
    if(result.acknowledged)
      onChanged(!changed);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>#ID </TableCell>
            <TableCell align="right">Title</TableCell>
            <TableCell align="right">Service</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Priority</TableCell>
            <TableCell align="right">Created</TableCell>
            <TableCell />
            <TableCell />
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
                <Chip label={row.status} color="primary" style={{backgroundColor: colorReturn(row.status)}} />
              </TableCell>
              <TableCell align="right">{row.priority}</TableCell>
              <TableCell align="right">{row.created}</TableCell>
              <TableCell align="right">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      disableMaskedInput
                      size="small"
                      label="Resolved on"
                      value={date}
                      inputFormat="DD MMM YYYY"
                      renderInput={(params) => <TextField {...params} />}
                      onChange={handleChange}
                    />
                  </LocalizationProvider>
                </TableCell>
                <TableCell>
                <Button onClick={() => handleClick(row.id)}>
                  Resolved
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
