import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import LinearProgress from '@mui/material/LinearProgress'
import ReactTimeAgo from 'react-time-ago'

const ResultsTable = ({
    accounts,
    areAccountsLoading,
}: {
    accounts: any[]
    areAccountsLoading: boolean
}) => {
    return (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
            {areAccountsLoading ? <LinearProgress /> : null}
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Account</TableCell>
                        <TableCell>Karma</TableCell>
                        <TableCell>Balance</TableCell>
                        <TableCell>Last received</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {accounts.map((acc, i) => (
                        <TableRow
                            key={acc.account}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {i + 1}
                            </TableCell>
                            <TableCell>{acc.account}</TableCell>
                            <TableCell>{acc.karma.toString()}</TableCell>
                            <TableCell>{acc.box.toString()}</TableCell>
                            <TableCell>
                                {acc.lockedAt.eq(0) ? (
                                    '—'
                                ) : (
                                    <ReactTimeAgo
                                        date={new Date(acc.lockedAt.toNumber() * 1000)}
                                        locale="en-US"
                                    />
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default ResultsTable
