| 目标                                                         |             实验             |
| ------------------------------------------------------------ | :--------------------------: |
| 1. 了解账户及其地址<br/>2. 了解 SOL 和 lampors<br/>3. 使用 web3.js 连接到 Solana 并读取账户余额 | 连接到 Solana 并查看账户余额 |

# [在Solana网络中读取数据](https://www.soldev.app/course/intro-to-reading-data)

## 概述

- **SOL** 是 Solana 的原生代币名称。每个 SOL 由 10 亿单位 **Lamports** 组成。
- **账户**存储代币、NFT、程序和数据。我们现在将重点关注存储 SOL 的账户。
- **地址**指向 Solana 网络上的账户。任何人都可以读取给定地址的数据。大多数地址也是**公钥**。

## 课程内容

### 账户

所有存储在 Solana 上的数据都存储在账户中。账户可以存储：

- SOL
- 其他代币，如 USDC
- NFT
- 程序，如本课程中制作的电影评论程序
- 程序数据，如上述程序的电影评论

### SOL

SOL 是 Solana 的原生代币，用于支付交易费用、支付账户租金等。SOL 有时会用 `◎` 符号表示。每个 SOL 由 10 亿 **Lamports** 组成。

类似于金融应用通常以美分（USD）和便士（GBP）进行计算，Solana 应用通常以 Lamports 传输、消费、存储和处理 SOL，仅在显示给用户时转换为完整的 SOL。

### 地址

地址唯一标识账户。地址通常显示为 base-58 编码的字符串，如 `dDCQNnDmNbFVi8cQhKAgXhyhXeJ625tvwsunRyRc7c8`。Solana 上的大多数地址也是**公钥**。如前一章所述，控制地址匹配私钥的人控制该账户——例如，拥有私钥的人可以从账户中发送代币。

## 从 Solana 区块链读取数据

### 安装

我们使用名为 `@solana/web3.js` 的 npm包来处理 Solana 的大部分工作。我们还将安装 TypeScript 和 `esrun`，以便在命令行运行 `.ts` 文件：

```bash
npm install typescript @solana/web3.js esrun
```

### 连接到网络

使用 `@solana/web3.js` 与 Solana 网络的每次交互都将通过 `Connection` 对象进行。`Connection` 对象与特定的 Solana 网络（称为“cluster - 集群”）建立连接。我们将使用 `Devnet` - 开发网 集群而不是 `Mainnet`。`Devnet` 设计用于开发人员使用和测试，`Devnet` 代币没有实际价值。

```javascript
import { Connection, clusterApiUrl } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));
console.log(`✅ Connected!`)
```

运行此 TypeScript 文件（`npx esrun example.ts`），显示：

```bash
✅ Connected!
```

### 从网络读取数据

读取账户余额：

```javascript
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));
const address = new PublicKey('CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN');
const balance = await connection.getBalance(address);

console.log(`The balance of the account at ${address} is ${balance} lamports`); 
console.log(`✅ Finished!`)
```

如前所述，返回的余额以 Lamports 为单位。Web3.js 提供了常量 `LAMPORTS_PER_SOL` 用于将 Lamports 显示为 SOL：

```javascript
import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));
const address = new PublicKey('CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN');
const balance = await connection.getBalance(address);
const balanceInSol = balance / LAMPORTS_PER_SOL;

console.log(`The balance of the account at ${address} is ${balanceInSol} SOL`); 
console.log(`✅ Finished!`)
```

运行 `npx esrun example.ts` 会显示如下内容：

```bash
The balance of the account at CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN is 0.00114144 SOL
✅ Finished!
```

就这样，我们从 Solana 区块链读取了数据！

## 实验

让我们练习我们学到的知识，并检查特定地址的余额。

### 加载密钥对

记住上一章中的公钥。

新建一个名为 `check-balance.ts` 的文件，将`<your public key>`替换为你的公钥。

该脚本加载公钥，连接到 DevNet，并检查余额：

```javascript
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

const publicKey = new PublicKey("<your public key>");

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

const balanceInLamports = await connection.getBalance(publicKey);

const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;

console.log(
  `💰 Finished! The balance for the wallet at address ${publicKey} is ${balanceInSOL}!`
);
```

保存此文件，并运行 `npx esrun check-balance.ts`。你应该会看到如下内容：

```bash
💰 Finished! The balance for the wallet at address 31ZdXAvhRQyzLC2L97PC6Lnf2yWgHhQUKKYoUo9MLQF5 is 0!
```

### 获取 Devnet Sol

在 Devnet 上，你可以免费获取用于开发的 SOL。将 Devnet SOL 看作游戏货币——它看起来有价值，但实际上没有价值。

[获取一些 Devnet SOL](https://faucet.solana.com/)，并使用你密钥对的公钥作为地址。

选择任意数量的 SOL。

### 查看余额

重新运行脚本。你应该会看到你的余额更新：

```bash
💰 Finished! The balance for the wallet at address 31ZdXAvhRQyzLC2L97PC6Lnf2yWgHhQUKKYoUo9MLQF5 is 0.5!
```

### 查看其他同学的余额

你可以修改脚本检查任何钱包的余额。

```javascript
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

const suppliedPublicKey = process.argv[2];
if (!suppliedPublicKey) {
  throw new Error("Provide a public key to check the balance of!");
}

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

const publicKey = new PublicKey(suppliedPublicKey);

const balanceInLamports = await connection.getBalance(publicKey);

const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;

console.log(
  `✅ Finished! The balance for the wallet at address ${publicKey} is ${balanceInSOL}!`
);
```

在聊天中与同学交换钱包地址并检查他们的余额。

```bash
% npx esrun check-balance.ts (某钱包地址)
✅ Finished! The balance for the wallet at address 31ZdXAvhRQyzLC2L97PC6Lnf2yWgHhQUKKYoUo9MLQF5 is 3!
```

并检查一些同学的余额。

## 挑战

按如下要求修改脚本：

- 添加处理无效钱包地址的说明。
- 修改脚本以连接到`主网`，并查找一些著名的 Solana 钱包。例如 `toly.sol`、`shaq.sol`或 `mccann.sol`。
- 我们将在下一课中转移 SOL！

## 完成实验了吗？

将代码推送到 GitHub，并告诉我们你对这节课的看法吧！

## 注意事项！

1. 我更改了代码以及添加了注释 请在仓库中查看代码详情
2. 在```const connection = new Connection("https://api.devnet.solana.com", "confirmed");```中https://api.devnet.solana.com是官方rpc，很卡会失败所以一般不用它 而是选用第三方rpc服务商比如说：
   1. [Helius - The Developer Platform for Solana](https://dev.helius.xyz/dashboard/app)
   2. [QuickNode - Home](https://dashboard.quicknode.com/)

这里我把rpc的api粘到了`.env`文件中，因为一般rpc也不公开（免费的有配额限制，付费的就 额...嗯）