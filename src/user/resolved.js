import * as React from 'react';
import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Chip } from '@mui/material';

function colorReturn(val) {
  if(val === "Triggered")
    return "red";
  if(val === "Resolved")
    return "green";
  if(val === "Acknowledged")
    return "#e8e005";
}

export default function Resolved(props) {

  const [rows, setRows] = useState([]);
  useEffect(() => {
    async function getRows() {
      const url = `${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}`;
      const response = await fetch(
        `${url}/incident?userid=${props.userid}&status=Resolved`,
        );
      const rows = await response.json();
      setRows(rows);
    }

    getRows();

    return;
  }, [props.userid]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>#ID</TableCell>
            <TableCell align="right">Title</TableCell>
            <TableCell align="right">Service</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Priority</TableCell>
            <TableCell align="right">Created</TableCell>
            <TableCell align="right">Resolved</TableCell>
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
              <TableCell align="right">{row.resolved}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}