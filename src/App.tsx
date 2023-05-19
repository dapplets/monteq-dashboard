import './App.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import React, { useEffect, useState, useMemo } from 'react'
import Container from '@mui/material/Container'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import { CircularProgress, CssBaseline } from '@mui/material'
import Table from './components/Table'
import { useNavigate } from 'react-router-dom'
import * as ethers from 'ethers'
import { CHAIN_ID, CONTRACT_ADDRESS, JSON_RPC_URL } from './constants'
import ABI from './EdconGame.json'
import { useParams } from 'react-router-dom'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'

TimeAgo.addDefaultLocale(en)

const provider = new ethers.providers.JsonRpcProvider(JSON_RPC_URL, CHAIN_ID)
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider)

const App = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [areTokensLoading, setAreTokensLoading] = useState(true)
    const [areAccountsLoading, setAreAccountsLoading] = useState(false)
    const [tokenInfos, setTokenInfos] = useState<any[]>([])
    const [accounts, setAccounts] = useState<any[]>([])

    const [selectedTokenId, setSelectedTokenId] = React.useState(0)
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        navigate('/' + tokenInfos[newValue].ticker.toLowerCase())
        setSelectedTokenId(newValue)
    }

    const tokensPromise = useMemo(async () => contract.readToken(), [])

    useEffect(() => {
        ;(async () => {
            try {
                setAreTokensLoading(true)
                const tokens = await tokensPromise
                let newSelectedTokenId = -1
                for (let i = 0; i < tokens.length; i++) {
                    if (id?.toLowerCase() === tokens[i].ticker.toLowerCase()) {
                        newSelectedTokenId = i
                    }
                }
                if (newSelectedTokenId === -1) {
                    navigate('/')
                    newSelectedTokenId = 0
                }
                setTokenInfos(tokens)
                setSelectedTokenId(newSelectedTokenId)
            } catch (err) {
                console.log(err)
            } finally {
                setAreTokensLoading(false)
            }
        })()
    }, [id, navigate, tokensPromise])

    useEffect(() => {
        ;(async () => {
            try {
                setAreAccountsLoading(true)

                // ToDo: paginate
                const users = await contract.getAccounts(selectedTokenId, 0, 1000, true)

                setAccounts(
                    [...users.out]
                        .filter((x) => x.ambassadorRank === 0) // ambassadors are not participated
                        .sort((a, b) => b.karma.sub(a.karma).toNumber()) // sort by karma desc
                )
            } catch (err) {
                console.log(err)
            } finally {
                setAreAccountsLoading(false)
            }
        })()
    }, [selectedTokenId])

    if (areTokensLoading) {
        return (
            <>
                <CssBaseline />
                <Container sx={{ mt: 3 }}>
                    <CircularProgress />
                </Container>
            </>
        )
    }
    return (
        <>
            <CssBaseline />
            <Container sx={{ mt: 3 }}>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
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
                    <Table accounts={accounts} areAccountsLoading={areAccountsLoading} />
                </Box>
            </Container>
        </>
    )
}

export default App
