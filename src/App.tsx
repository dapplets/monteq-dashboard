import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import LinearProgress from "@mui/material/LinearProgress";
import React, { useEffect, useState } from "react";
import { CircularProgress, CssBaseline } from "@mui/material";
import * as ethers from "ethers";
import { CHAIN_ID, CONTRACT_ADDRESS, JSON_RPC_URL } from "./constants";
import ABI from "./EdconGame.json";

const provider = new ethers.providers.JsonRpcProvider(JSON_RPC_URL, CHAIN_ID);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

function App() {
  const [areTokensLoading, setAreTokensLoading] = useState(true);
  const [areAccountsLoading, setAreAccountsLoading] = useState(false);
  const [tokenInfos, setTokenInfos] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);

  const [selectedTokenId, setSelectedTokenId] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTokenId(newValue);
  };

  useEffect(() => {
    (async () => {
      try {
        setAreTokensLoading(true);
        const tokens = await contract.readToken();
        setTokenInfos(tokens);
      } catch (err) {
        console.log(err);
      } finally {
        setAreTokensLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setAreAccountsLoading(true);

        // ToDo: paginate
        const users = await contract.getAccounts(
          selectedTokenId,
          0,
          1000,
          true
        );

        // sort by karma desc
        setAccounts(
          [...users.out].sort((a, b) => b.karma.sub(a.karma).toNumber())
        );
      } catch (err) {
        console.log(err);
      } finally {
        setAreAccountsLoading(false);
      }
    })();
  }, [selectedTokenId]);

  if (areTokensLoading) {
    return (
      <React.Fragment>
        <CssBaseline />
        <Container sx={{ mt: 3 }}>
          <CircularProgress />
        </Container>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Container sx={{ mt: 3 }}>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={selectedTokenId}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              {tokenInfos.map((token, i) => (
                <Tab
                  tabIndex={i}
                  key={i}
                  label={token.ticker}
                  icon={
                    <Avatar
                      src={token.iconUrl}
                      sx={{ width: 24, height: 24 }}
                    />
                  }
                  iconPosition="start"
                />
              ))}
            </Tabs>
          </Box>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            {areAccountsLoading ? <LinearProgress /> : null}
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Account</TableCell>
                  <TableCell>Karma</TableCell>
                  <TableCell>Balance</TableCell>
                  <TableCell>Locked At</TableCell>
                  <TableCell>Ambassador Rank</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accounts.map((acc, i) => (
                  <TableRow
                    key={acc.account}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {i + 1}
                    </TableCell>
                    <TableCell>{acc.account}</TableCell>
                    <TableCell>{acc.karma.toString()}</TableCell>
                    <TableCell>{acc.box.toString()}</TableCell>
                    <TableCell>
                      {acc.lockedAt.eq(0)
                        ? "—"
                        : new Date(
                            acc.lockedAt.toNumber() * 1000
                          ).toLocaleString()}
                    </TableCell>
                    <TableCell>{acc.ambassadorRank}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default App;
