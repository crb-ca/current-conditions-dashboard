import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

// import {DataGrid} from '@mui/x-data-grid';

const round = (v, r) => Math.round(v * r) / r;

import chroma from 'chroma-js';

// Create a color scale from red to blue
const colorScale = chroma.scale('RdYlBu');

// Function to get color for a given value
const getColor = (value) => {
    // Clamp value between 0 and 100
    value = Math.max(0, Math.min(100, value));
    return colorScale(value).hex(); // or use .rgb(), .hsl(), etc.
}

const ReservoirStorageTable: React.FC<ReservoirStorageTableProps> = ({reservoirs, conditions}) => {
    // return <div>
    //     <DataGrid columns={columns}/>
    // </div>
    return <TableContainer component={Paper}>
        <Table sx={{minWidth: 600}} aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell>Reservoir</TableCell>
                    {/*<TableCell align="right">Storage (MAF)</TableCell>*/}
                    <TableCell align="right">Storage (MAF/%)</TableCell>
                    <TableCell align="right">1-month change (MAF/%)</TableCell>
                    <TableCell align="right">1-year change (MAF/%)</TableCell>
                    <TableCell align="right">Capacity (MAF)</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {reservoirs.map(({name, capacity, system}) => {
                    const condition = conditions[name];
                    if (!condition) {
                        return null;
                    }
                    const {storage, time} = condition;
                    const percentCapacity = Math.round(storage / capacity * 100);
                    const color = getColor(percentCapacity / 100);
                    const diff30abs = condition.storage - condition.storage30;
                    const diff365abs = condition.storage - condition.storage365;
                    const diff30rel = round(diff30abs / condition.storage30 * 100, 10);
                    const diff365rel = round(diff365abs / condition.storage365 * 100, 10);
                    const diff30sign = diff30abs < 0 ? '' : '+';
                    const diff365sign = diff365rel < 0 ? '' : '+';

                    return <TableRow
                        key={name}
                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        style={{background: color}}
                    >
                        <TableCell component="th" scope="row">{`${name}${system ? "*" : ""}`}</TableCell>
                        {/*<TableCell align="right">{storage}</TableCell>*/}
                        <TableCell align="right">
                            <div>
                                {`${storage} (${percentCapacity}%)`}
                            </div>
                        </TableCell>
                        <TableCell align="right">{`${round(diff30abs, 100)} (${diff30sign}${diff30rel}%)`}</TableCell>
                        <TableCell align="right">{`${round(diff365abs, 100)} (${diff365sign}${diff365rel}%)`}</TableCell>
                        <TableCell align="right">{round(capacity, 1000)}</TableCell>
                    </TableRow>
                })}
            </TableBody>
        </Table>
    </TableContainer>
}

export default ReservoirStorageTable;