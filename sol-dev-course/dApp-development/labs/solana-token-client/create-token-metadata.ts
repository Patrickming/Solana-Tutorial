import dotenv from 'dotenv';
dotenv.config();
import {
    getKeypairFromEnvironment,
    getExplorerLink,
} from "@solana-developers/helpers";
import {
    Connection,
    PublicKey,
    Transaction,
    sendAndConfirmTransaction,
} from "@solana/web3.js";
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";  // 使用 Metaplex 创建元数据账户的函数

// 从环境变量中安全加载用户的密钥对
const user = getKeypairFromEnvironment("SECRET_KEY");

let DEVNET_RPC = process.env.DEVNET_RPC || ''
const connection = new Connection(DEVNET_RPC, "confirmed");

console.log(
    `🔑 We've loaded our keypair securely, using an env file! Our public key is: ${user.publicKey.toBase58()}`
);

// Token Metadata 程序的 ID
const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

// 替换成您的特定代币铸造账户地址
// const tokenMintAccount = new PublicKey("YOUR_TOKEN_MINT_ADDRESS_HERE");
const tokenMintAccount = new PublicKey("Cu4VMRe8sVcciNs9TAkzhSj5ynsHBLBaHPFkGDi4AeGr");

// 元数据信息
const metadataData = {
    name: "Solana Training Token",  // 代币名称
    symbol: "TRAINING",  // 代币符号
    // 使用 Metaplex 标准的链外数据链接（Arweave / IPFS / Pinata 等）//必须浏览器显示为json形式的链接
    uri: "https://ipfs.io/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/1",  // 元数据链接
    sellerFeeBasisPoints: 0,  // 卖家手续费基点
    creators: null,  // 创建者列表
    collection: null,  // 收藏品信息
    uses: null,  // 使用说明
};

// 查找元数据的程序派生地址（PDA）及其增量
const metadataPDAAndBump = PublicKey.findProgramAddressSync(
    [
        Buffer.from("metadata"),  // 元数据标识
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),  // Token Metadata 程序 ID
        tokenMintAccount.toBuffer(),  // 代币铸造账户地址
    ],
    TOKEN_METADATA_PROGRAM_ID
);

const metadataPDA = metadataPDAAndBump[0];  // 元数据的程序派生地址

// 创建一个新的 Solana 交易
const transaction = new Transaction();

// 添加创建元数据账户的指令，使用 Metaplex
const createMetadataAccountInstruction =
    createCreateMetadataAccountV3Instruction(
        {
            metadata: metadataPDA,  // 元数据地址
            mint: tokenMintAccount,  // 代币铸造账户地址
            mintAuthority: user.publicKey,  // 代币铸造权限的公钥
            payer: user.publicKey,  // 付款者的公钥
            updateAuthority: user.publicKey,  // 更新权限的公钥
        },
        {
            createMetadataAccountArgsV3: {
                collectionDetails: null,  // 收藏品详细信息
                data: metadataData,  // 元数据的数据信息
                isMutable: true,  // 是否可变
            },
        }
    );

transaction.add(createMetadataAccountInstruction);  // 将创建元数据账户的指令添加到交易中

// 发送并确认在 Solana 网络上的交易
const transactionSignature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [user]  // 使用者的密钥对列表
);

// 获取交易的区块链浏览器链接
const transactionLink = getExplorerLink(
    "transaction",
    transactionSignature,
    "devnet"
);

console.log(`✅ Transaction confirmed, explorer link is: ${transactionLink}!`);

// 获取代币铸造地址的区块链浏览器链接
const tokenMintLink = getExplorerLink(
    "address",
    tokenMintAccount.toString(),
    "devnet"
);

console.log(`✅ Look at the token mint again: ${tokenMintLink}!`);
