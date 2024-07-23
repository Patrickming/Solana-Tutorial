| 目标                                                         |            实验            |
| ------------------------------------------------------------ | :------------------------: |
| 1. 解释交易<br/>2. 解释交易费用<br/>3. 使用 `@solana/web3.js` 发送 SOL<br/>4. 使用 `@solana/web3.js` 签署交易<br/>5. 使用 Solana Explorer 查看交易 | 进行交易并使用区块链浏览器 |

# [在Solana网络中创建交易](https://www.soldev.app/course/intro-to-writing-data)

## 概述

所有对链上数据的修改都是通过交易完成的。交易主要是一组调用 Solana 程序的指令。交易是原子的，这意味着如果所有指令都正确执行，交易才会成功，否则会失败然后回滚状态，仿佛根本没有运行过一样。

## 课程内容

### 交易是原子的

对链上数据的任何修改都是通过发送到程序的交易完成的。

Solana 上的交易类似于其他地方的交易：它是原子的。原子意味着整个交易要么运行成功，要么失败。

想象一下在线支付：

- 从你的账户扣款
- 银行将资金转给商家

这两个步骤都需要成功才能完成交易。如果其中一个步骤失败，则整个交易不会进行，而不是支付给商家但不扣款，或者扣款但不支付给商家。

原子意味着要么交易成功 - 意味着所有步骤都成功 - 要么整个交易失败。

### 交易包含指令

Solana 上交易中的步骤称为指令。

每条指令包含：

- 账户数组：用于读取和/或写入。这使得 Solana 速度很快 - 影响不同账户的交易会同时处理。
- 地址：要调用的程序的公钥（地址）
- 数据：传递给被调用程序的数据，结构为字节数组

当运行交易时，一个或多个 Solana 程序会根据交易中的指令被调用。

如你所料，`@solana/web3.js` 提供了创建交易和指令的辅助函数。你可以使用构造函数 `new Transaction()` 创建一个新交易。一旦创建，你可以使用 `add()` 方法向交易中添加指令。

其中一个辅助函数是 `SystemProgram.transfer()`，它为 `SystemProgram` 创建一个指令来转一些 SOL ：

```javascript
const transaction = new Transaction()

const sendSolInstruction = SystemProgram.transfer({
  fromPubkey: sender,
  toPubkey: recipient,
  lamports: LAMPORTS_PER_SOL * amount
})

transaction.add(sendSolInstruction)
```

`SystemProgram.transfer()` 函数需要以下参数：

- 发送者账户的公钥
- 接收者账户的公钥
- 要发送的 SOL 数量，以 lamports 为单位

`SystemProgram.transfer()` 返回从发送者到接收者发送 SOL 的指令。

该指令中使用的程序将是`系统程序`（地址为 11111111111111111111111111111111），数据将是要转移的 SOL 数量（以 Lamports 计），账户将基于发送者和接收者。

然后添加指令到交易中。

一旦添加了所有指令，交易需要发送到集群并确认：

```javascript
const signature = sendAndConfirmTransaction(
  connection,
  transaction,
  [senderKeypair]
)
```

`sendAndConfirmTransaction()` 函数需要以下参数：

- 一个集群的连接
- 一个交易
- 一组将作为交易签名者的密钥对数组——在此示例中，我们只有一个签名者：发送者。

### 交易存在费用

交易费是 Solana 经济的一部分，用于补偿验证者网络处理交易所需的 CPU 和 GPU 资源。Solana 交易费是确定的。

交易中第一个包含在签名者数组中的签名者负责支付交易费用。如果该签名者账户中没有足够的 SOL 来支付交易费用，交易将因类似以下错误而被丢弃：

```bash
> Transaction simulation failed: Attempt to debit an account but found no record of a prior credit.
```

如果你遇到此错误，是因为你的密钥对是全新的，没有任何 SOL 来支付交易费用。让我们通过在设置连接之后添加以下几行来解决此问题：

```javascript
await airdropIfRequired(
  connection,
  keypair.publicKey,
  1 * LAMPORTS_PER_SOL,
  0.5 * LAMPORTS_PER_SOL,
);
```

这将向你的账户存入 1 SOL 来用于测试。这在主网上不可行，因为它有实际价值。但在本地和 Devnet 上进行测试非常方便。

你还可以使用 Solana CLI 命令 `solana airdrop 1` 来获取免费测试 SOL 到你的账户，无论是在本地还是在 Devnet 上测试时。

## Solana 区块链浏览器

![Solana Explorer set to Devnet](https://www.soldev.app/assets/solana-explorer-devnet.png)

区块链上的所有交易在 Solana Explorer 上都是公开可见的。例如，你可以在上面的示例中使用 `sendAndConfirmTransaction()` 返回的签名，在 Solana Explorer 中搜索该签名，然后查看：

- 发生的时间
- 包含在哪个区块中
- 交易费用
- 以及更多信息！

![Solana Explorer with details about a transaction](https://www.soldev.app/assets/solana-explorer-transaction-overview.png)

## 实验

我们将创建一个脚本来向其他学生发送 SOL。

### 基本结构

我们将使用在 [密码学介绍](./intro-to-cryptography)课程中创建的相同包和`.env`文件。

创建一个名为 `transfer.ts` 的文件：

```javascript
import {
  Connection,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  PublicKey,
} from "@solana/web3.js";
import "dotenv/config"
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

const suppliedToPubkey = process.argv[2] || null;

if (!suppliedToPubkey) {
  console.log(`Please provide a public key to send to`);
  process.exit(1);
}

const senderKeypair = getKeypairFromEnvironment("SECRET_KEY");

console.log(`suppliedToPubkey: ${suppliedToPubkey}`);

const toPubkey = new PublicKey(suppliedToPubkey);

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

console.log(
  `✅ Loaded our own keypair, the destination public key, and connected to Solana`
);
```

运行脚本以确保它连接、加载你的密钥对并加载：

```bash
npx esrun transfer.ts (目标钱包地址)
```

### 创建交易并运行

添加以下内容以完成交易并发送：

```javascript
console.log(
  `✅ Loaded our own keypair, the destination public key, and connected to Solana`
);

const transaction = new Transaction();

const LAMPORTS_TO_SEND = 5000;

const sendSolInstruction = SystemProgram.transfer({
  fromPubkey: senderKeypair.publicKey,
  toPubkey,
  lamports: LAMPORTS_TO_SEND,
});

transaction.add(sendSolInstruction);

const signature = await sendAndConfirmTransaction(connection, transaction, [
  senderKeypair,
]);

console.log(
  `💸 Finished! Sent ${LAMPORTS_TO_SEND} to the address ${toPubkey}. `
);
console.log(`Transaction signature is ${signature}!`);
```

### 发送交易！

向班上的其他学生发送 SOL。

```bash
npx esrun transfer.ts (目标钱包地址)
```

## 挑战

回答以下问题：

1. 这笔转账花费了多少 SOL？换算成美元是多少？
2. 你能在 https://explorer.solana.com 上找到你的交易吗？记得我们使用的是 devnet 网络。
3. 转账需要多长时间？
4. 你认为“确认”是什么意思？

## 完成实验了吗？

将代码推送到 GitHub，并告诉我们你对这节课的看法吧！

## 注意事项！

1. 创建一个新的账户时（不管是api生成还是 Solana CLI生成） 都是unfunded的账户，也就是没有钱的账户

   没有钱的账户是没有租金来承担的，所以在cli和web3jsAPI中不能转账，但钱包可以直接转

   1. 用`solana CLI`来进行操作时 要加上 `--allow-unfunded-recipient `才能转账成功

      > root@xrm:/mnt/d/web3_code/solana_learn/solana# solana transfer -h
      > solana-transfer
      > Transfer funds between system accounts
      >
      > USAGE:
      >  solana transfer [FLAGS] [OPTIONS] <RECIPIENT_ADDRESS> <AMOUNT>
      >
      > FLAGS:
      >      **--allow-unfunded-recipient       Complete the transfer even if the recipient address is not funded**
      >      --dump-transaction-message       Display the base64 encoded binary transaction message in sign-only 

      ```bash
      solana transfer --allow-unfunded-recipient 9w4egkmzj6Byop2iEA8ecP3m65zVn9ayNFFD1DNSdNPA 0.1
      ```

   2. 在操作之后就不是unfunded的了 就可以直接用教程代码进行转账

