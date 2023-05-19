import * as ethers from 'ethers'
import { CHAIN_ID, CONTRACT_ADDRESS, JSON_RPC_URL } from './constants.js'
import ABI from './EdconGame.json'

export async function getData() {
  const provider = new ethers.providers.JsonRpcProvider(JSON_RPC_URL, CHAIN_ID)
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider)
  const accounts = await contract.accounts()

  return { accounts }
}
