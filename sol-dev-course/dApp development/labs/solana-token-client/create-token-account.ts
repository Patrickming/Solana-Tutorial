import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import dotenv from 'dotenv';
dotenv.config();
import {
    getExplorerLink,
    getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { Connection, PublicKey } from "@solana/web3.js";

let DEVNET_RPC = process.env.DEVNET_RPC || ''
const connection = new Connection(DEVNET_RPC, "confirmed");
const user = getKeypairFromEnvironment("SECRET_KEY");

console.log(
    `🔑 Loaded our keypair securely, using an env file! Our public key is: ${user.publicKey.toBase58()}`
);

// 替换为您的代币铸造账户
const tokenMintAccount = new PublicKey(
    "Cu4VMRe8sVcciNs9TAkzhSj5ynsHBLBaHPFkGDi4AeGr"
);

// 在此我们为自己的地址创建关联代币账户，但我们也可以在devnet上为任何其他钱包创建ATA！
// const recipient = new PublicKey("SOMEONE_ELSES_DEVNET_ADDRESS");
const recipient = user.publicKey;

const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    user,
    tokenMintAccount,
    recipient
);

console.log(`Token Account: ${tokenAccount.address.toBase58()}`);

const link = getExplorerLink(
    "address",
    tokenAccount.address.toBase58(),
    "devnet"
);

console.log(`✅ Created token Account: ${link}`);
