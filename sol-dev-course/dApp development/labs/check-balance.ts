import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import dotenv from 'dotenv';
dotenv.config();
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

// const publicKey = new PublicKey('<you pubkey>');// 写死公钥 但这样会被其他人看到

// // 输入公钥的形式加载 npx esrun check-balance.ts (某钱包地址)
// const suppliedPublicKey = process.argv[2];
// if (!suppliedPublicKey) {
//   throw new Error("Provide a public key to check the balance of!");
// }

const publicKey = getKeypairFromEnvironment("SECRET_KEY").publicKey;
let DEVNET_RPC = process.env.DEVNET_RPC || ''

const connection = new Connection(DEVNET_RPC, "confirmed");

const balanceInLamports = await connection.getBalance(publicKey);

const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;

console.log(`💰 Finished! The balance for the wallet at address ${publicKey} is
 ${balanceInLamports} lamports (${balanceInSOL} SOL)`);