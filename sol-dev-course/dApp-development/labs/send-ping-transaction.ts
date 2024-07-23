// Adapted from https://github.com/Unboxed-Software/solana-ping-client

import {
    Connection,
    LAMPORTS_PER_SOL,
    PublicKey,
    Transaction,
    TransactionInstruction,
    clusterApiUrl,
    sendAndConfirmTransaction,
} from "@solana/web3.js";
import dotenv from 'dotenv';
dotenv.config();
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

// 定义使用的集群名称为开发网络
const CLUSTER_NAME = "devnet";

// 定义 Ping 程序的地址
const PING_PROGRAM_ADDRESS = new PublicKey(
    "ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa"
);
// 定义 Ping 程序数据的地址
const PING_PROGRAM_DATA_ADDRESS = new PublicKey(
    "Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod"
);

// 加载环境变量
dotenv.config();

// 从环境变量中获取密钥对
const payer = getKeypairFromEnvironment("SECRET_KEY");
console.log(`🔑 Loaded keypair ${payer.publicKey.toBase58()}!`);

// 创建与 Solana 集群的连接
let DEVNET_RPC = process.env.DEVNET_RPC || ''
const connection = new Connection(DEVNET_RPC, "confirmed");
console.log(`⚡️ Connected to Solana ${CLUSTER_NAME} cluster!`);

// 注意：第一次可能不会立即生效，因为 await 在 Lamports 确认之前就返回了。
// Being fixed in https://github.com/solana-labs/solana-web3.js/issues/1579
// 请求空投 1 SOL
await connection.requestAirdrop(payer.publicKey, LAMPORTS_PER_SOL * 1);
console.log(`💸 Got some ${CLUSTER_NAME} lamports!`);

// 创建新的交易
const transaction = new Transaction();

// 设置程序 ID 和程序数据 ID
const programId = new PublicKey(PING_PROGRAM_ADDRESS);
const pingProgramDataId = new PublicKey(PING_PROGRAM_DATA_ADDRESS);

// 创建交易指令
const instruction = new TransactionInstruction({
    keys: [
        {
            pubkey: pingProgramDataId,
            isSigner: false,
            isWritable: true,
        },
    ],
    programId,
});

// 将指令添加到交易中
transaction.add(instruction);

// 发送并确认交易
const signature = await sendAndConfirmTransaction(connection, transaction, [
    payer,
]);

// 输出交易完成的消息
console.log(
    `✅ Transaction completed! You can view your transaction on the Solana Explorer at:`
);
// 输出在 Solana Explorer 上查看交易的链接
console.log(
    `https://explorer.solana.com/tx/${signature}?cluster=${CLUSTER_NAME}`
);