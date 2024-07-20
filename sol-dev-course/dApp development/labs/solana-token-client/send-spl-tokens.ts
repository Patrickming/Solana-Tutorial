import dotenv from 'dotenv';
dotenv.config();
import {
    getExplorerLink,
    getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

let DEVNET_RPC = process.env.DEVNET_RPC || ''
const connection = new Connection(DEVNET_RPC, "confirmed");

const sender = getKeypairFromEnvironment("SECRET_KEY");

console.log(
    `🔑 Loaded our keypair securely, using an env file! Our public key is: ${sender.publicKey.toBase58()}`
);

// 添加接收者的公钥
const recipient = new PublicKey("HekxQd1SGHP33Pg8y2u1SVM3iE39mDnj5kBJQN3c7hX3");

// 替换你的代币铸币账户地址
const tokenMintAccount = new PublicKey("Cu4VMRe8sVcciNs9TAkzhSj5ynsHBLBaHPFkGDi4AeGr");

// 我们的代币有两位小数
const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);

console.log(`💸 Attempting to send 1 token to ${recipient.toBase58()}...`);

// 获取源ATA账户（刚刚 mint-token.ts 的mint目标地址）来准备发送
const sourceTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    sender,
    tokenMintAccount,
    sender.publicKey
);
// 获取或创建目标ATA账户来存储这个代币
const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    sender,
    tokenMintAccount,
    recipient
);

// 转移代币
const signature = await transfer(
    connection,
    sender,
    sourceTokenAccount.address,
    destinationTokenAccount.address,
    sender,
    1 * MINOR_UNITS_PER_MAJOR_UNITS
);

const explorerLink = getExplorerLink("transaction", signature, "devnet");

console.log(`✅ Transaction confirmed, explorer link is: ${explorerLink}!`);
