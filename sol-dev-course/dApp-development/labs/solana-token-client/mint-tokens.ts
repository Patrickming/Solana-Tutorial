import { mintTo } from "@solana/spl-token";
import dotenv from 'dotenv';
dotenv.config();
import {
    getExplorerLink,
    getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { Connection, PublicKey } from "@solana/web3.js";

let DEVNET_RPC = process.env.DEVNET_RPC || ''
const connection = new Connection(DEVNET_RPC, "confirmed");

// 我们的代币有两位小数
const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);

const user = getKeypairFromEnvironment("SECRET_KEY");

// 替换为您的代币铸造账户（从 create-token-mint.ts 获取）
const tokenMintAccount = new PublicKey(
    "Cu4VMRe8sVcciNs9TAkzhSj5ynsHBLBaHPFkGDi4AeGr"
);

// 根据之前步骤替换为您自己或朋友的代币账户地址
//这里我们用自己的，也就是（从 create-token-account.ts 获取）
const recipientAssociatedTokenAccount = new PublicKey(
    "2MGuz98TAyVL4zugtBShfPcfycjujUwgJEsQqSBGhKrZ"
);

const transactionSignature = await mintTo(
    connection,
    user,
    tokenMintAccount,
    recipientAssociatedTokenAccount,
    user,
    10 * MINOR_UNITS_PER_MAJOR_UNITS  // 铸币的数量，以最小单位表示
);

const link = getExplorerLink("transaction", transactionSignature, "devnet");

console.log(`✅ Success! Mint Token Transaction: ${link}`);
