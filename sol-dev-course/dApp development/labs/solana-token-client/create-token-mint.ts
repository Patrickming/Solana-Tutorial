import { createMint } from "@solana/spl-token";
import dotenv from 'dotenv';
dotenv.config();
import {
  getKeypairFromEnvironment,
  getExplorerLink,
} from "@solana-developers/helpers";
import { Connection } from "@solana/web3.js";

let DEVNET_RPC = process.env.DEVNET_RPC || ''
const connection = new Connection(DEVNET_RPC, "confirmed");

const user = getKeypairFromEnvironment("SECRET_KEY");

console.log(
  `🔑 Loaded our keypair securely, using an env file! Our public key is: ${user.publicKey.toBase58()}`
);

// 这是运行以下两个的快捷方式：
// SystemProgram.createAccount
// token.createInitializeMintInstruction
const tokenMint = await createMint(connection, user, user.publicKey, null, 2);

const link = getExplorerLink("address", tokenMint.toString(), "devnet");

console.log(`✅ Finished! Created token mint: ${link}`);