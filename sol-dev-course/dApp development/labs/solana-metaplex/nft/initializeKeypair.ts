import * as web3 from "@solana/web3.js"
import * as fs from "fs"
import dotenv from "dotenv"
dotenv.config()

//得到密钥对
export async function initializeKeypair(
    connection: web3.Connection //传入参数
): Promise<web3.Keypair> {//返回类型
    //如果没有.env文件创建一个自动加入生成的私钥PRIVATE_KEY并且空投
    if (!process.env.PRIVATE_KEY) {
        console.log("Creating .env file")
        const signer = web3.Keypair.generate()
        fs.writeFileSync(".env", `PRIVATE_KEY=[${signer.secretKey.toString()}]`)
        await airdropSolIfNeeded(signer, connection)
        //返回密钥对
        return signer
    }

    const secret = JSON.parse(process.env.PRIVATE_KEY ?? "") as number[]
    const secretKey = Uint8Array.from(secret)
    const keypairFromSecretKey = web3.Keypair.fromSecretKey(secretKey)
    //空投然后返回密钥对
    await airdropSolIfNeeded(keypairFromSecretKey, connection)
    return keypairFromSecretKey
}

async function airdropSolIfNeeded(
    signer: web3.Keypair,
    connection: web3.Connection
) {
    const balance = await connection.getBalance(signer.publicKey)
    console.log("Current balance is", balance / web3.LAMPORTS_PER_SOL)
    //账户小于1sol的话就会触发空投
    if (balance < web3.LAMPORTS_PER_SOL) {
        console.log("Airdropping 1 SOL...")
        const airdropSignature = await connection.requestAirdrop(signer.publicKey, web3.LAMPORTS_PER_SOL)
        const latestBlockHash = await connection.getLatestBlockhash()
        //只传递signature的方法已被弃用
        //为什么要blockhash 因为判断这个指令是不是重复或者延迟很多的 因为发rpc是udp方式的 所以需要blockhash来确认指令是否已经被确认
        //超过150个块60秒就需要这些别的来确定  一个块是400ms
        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: airdropSignature,
        })
        const newBalance = await connection.getBalance(signer.publicKey)
        console.log("New balance is", newBalance / web3.LAMPORTS_PER_SOL)
    }

}
