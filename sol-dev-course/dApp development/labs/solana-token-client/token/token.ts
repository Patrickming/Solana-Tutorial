import { initializeKeypair } from "./initializeKeypair";
import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";

//创建铸币厂
async function createNewMint(
  connection: web3.Connection,
  payer: web3.Keypair,
  mintAuthority: web3.PublicKey,
  freezeAuthority: web3.PublicKey,
  decimals: number
): Promise<web3.PublicKey> {
  const tokenMint = await token.createMint(
    connection, //连接到集群的 JSON-RPC 连接
    payer,   //交易的付款人账户
    mintAuthority,  //授权执行从铸币厂中实际铸造代币的账户
    freezeAuthority, //授权冻结功能的账户，可以冻结相关代币的代币账户。如果不需要冻结功能，则可以将参数设置为 null
    decimals  //指定代币的所需小数精度
  );

  console.log(
    `Token Mint: https://explorer.solana.com/address/${tokenMint}?cluster=devnet`
  );

  return tokenMint;
}

//创建代币账户
async function createTokenAccount(
  connection: web3.Connection,
  payer: web3.Keypair,
  mint: web3.PublicKey,
  owner: web3.PublicKey
) {
  const tokenAccount = await token.getOrCreateAssociatedTokenAccount(//创建一个ATA账户
    connection,
    payer,
    mint,  //新代币账户关联的 铸币厂账户
    owner, //新代币账户的   所有者账户
    //keyarir 这是一个可选参数，用于指定新代币账户的地址。如果没有提供 keypair，`createAccount` 函数将默认从关联的 `mint` 和 `owner` 账户派生（其实就是指定地址）
  )
  // console.log("Token Account: ", tokenAccount);
  console.log(
    `Token Account: https://explorer.solana.com/address/${tokenAccount.address}?cluster=devnet`
  )

  return tokenAccount
}

//铸造代币
async function mintTokens(
  connection: web3.Connection,
  payer: web3.Keypair,
  mint: web3.PublicKey,
  destination: web3.PublicKey,
  authority: web3.Keypair,
  amount: number
) {
  const transactionSignature = await token.mintTo(
    connection,
    payer,
    mint, //关联的铸币厂
    destination, //接收币的代币账户
    authority,//被授权铸造代币的账户 mintAuthority
    amount // 金额
  )

  console.log(
    `Mint Token Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
  )
}

//批准委托
async function approveDelegate(
  connection: web3.Connection,
  payer: web3.Keypair,
  account: web3.PublicKey,
  delegate: web3.PublicKey,
  owner: web3.Signer | web3.PublicKey,
  amount: number
) {
  const transactionSignature = await token.approve(
    connection,
    payer,
    account, //要委托代币的ATA账户 -  `from`
    delegate, //被授权的账户 - `to`
    owner,//ATA账户的所有者
    amount //approve的数量
  )

  console.log(
    `Approve Delegate Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
  )
}

// 转移代币
async function transferTokens(
  connection: web3.Connection,
  payer: web3.Keypair,
  source: web3.PublicKey,
  destination: web3.PublicKey,
  owner: web3.Keypair,
  amount: number
) {
  const transactionSignature = await token.transfer(
    connection,
    payer,
    source, //发送代币的**代币账户**
    destination, //接收代币的**代币账户**
    owner,  //代币账户的所有者账户 ->发送的ATA账户（委托者或者真正的代币所有账户都可以）
    amount //转移的金额
  )

  console.log(
    `Transfer Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
  )
}

//撤销委托
async function revokeDelegate(
  connection: web3.Connection,
  payer: web3.Keypair,
  account: web3.PublicKey,
  owner: web3.Signer | web3.PublicKey,
) {
  const transactionSignature = await token.revoke(
    connection,
    payer,
    account, //要撤销委托权限的代币账户 撤销源头
    owner, //代币ATA账户的所有者
  )

  console.log(
    `Revote Delegate Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
  )
}

//销毁代币
async function burnTokens(
  connection: web3.Connection,
  payer: web3.Keypair,
  account: web3.PublicKey,
  mint: web3.PublicKey,
  owner: web3.Keypair,
  amount: number
) {
  const transactionSignature = await token.burn(
    connection,
    payer,
    account,
    mint,
    owner,
    amount
  )

  console.log(
    `Burn Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
  )
}


async function main() {
  //创建铸币厂
  let DEVNET_RPC = process.env.DEVNET_RPC || ''

  const connection = new web3.Connection(DEVNET_RPC, "confirmed");
  const user = await initializeKeypair(connection);

  const mint = await createNewMint(
    connection,
    user,
    user.publicKey,
    user.publicKey,
    2
  );
  //getMint 获取账户数据
  /**
   * {
address: PublicKey [PublicKey(CMLuecXuCR4Q8nnnYMq7xcSb6WZ8iSqaBN3usWBAqqSv)] {
  _bn: <BN: a8a6ae9f2ef4c75cb152c2e4c79cf0281f3783e700831397573a3dc0e3edb02f>
},
mintAuthority: PublicKey [PublicKey(EggqQXLrEfDnxX5nHPB7KxPNpXDyMyPEQaDYFyUhH8jS)] {
  _bn: <BN: cb529f69290d2eb900fcdf3bc5409e92b86353b98d053f394b04ebcfea12ee79>
},
supply: 0n,
decimals: 2,
isInitialized: true,
freezeAuthority: PublicKey [PublicKey(EggqQXLrEfDnxX5nHPB7KxPNpXDyMyPEQaDYFyUhH8jS)] {
  _bn: <BN: cb529f69290d2eb900fcdf3bc5409e92b86353b98d053f394b04ebcfea12ee79>
},
tlvData: <Buffer >
}
   */
  const mintInfo = await token.getMint(connection, mint);
  // console.log(mintInfo);

  //创建代币账户 ATA账户
  const tokenAccount = await createTokenAccount(
    connection,
    user,
    mint,
    user.publicKey
  )

  //铸造代币
  await mintTokens(
    connection,
    user,
    mint,
    tokenAccount.address,
    user,
    100 * 10 ** mintInfo.decimals //100个代币
  )

  //批准委托
  const delegate = web3.Keypair.generate();  //这里生成一个新的账户

  await approveDelegate(
    connection,
    user,
    tokenAccount.address,
    delegate.publicKey,
    user.publicKey,
    50 * 10 ** mintInfo.decimals //50个代币
  )

  //生成接收者的ATA代币账户
  const receiver = web3.Keypair.generate().publicKey
  const receiverTokenAccount = await createTokenAccount(
    connection,
    user,
    mint,
    receiver
  )

  // 转移代币
  await transferTokens(
    connection,
    user,
    tokenAccount.address,
    receiverTokenAccount.address,
    delegate,
    50 * 10 ** mintInfo.decimals
  )

  //撤销委托
  await revokeDelegate(
    connection,
    user,
    tokenAccount.address,
    user.publicKey,
  )

  //销毁代币
  await burnTokens(
    connection,
    user,
    tokenAccount.address,
    mint,
    user,
    25 * 10 ** mintInfo.decimals //销毁25个代币
  )
}








main()
  .then(() => {
    console.log("-----------------Finished successfully---------------");
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
