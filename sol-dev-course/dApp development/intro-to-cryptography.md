| 目标                                                         |       实验       |
| ------------------------------------------------------------ | :--------------: |
| 1. 了解对称和非对称加密<br/>2. 解释密钥对<br/>3. 生成新密钥对<br/>4. 从 env 文件加载密钥对 | 创建并加载密钥对 |

# [密码学和Solana网络](https://www.soldev.app/course/intro-to-cryptography)

## 概述

- 一个**密钥对**由**公钥**和私钥组成。
- **公钥**用作 Solana 网络上账户的“地址”。公钥可以与任何人共享。
- **私钥**用于验证对账户的控制权。顾名思义，你应始终保密私钥。
- `@solana/web3.js` 提供了生成新密钥对或使用现有私钥构建密钥对的辅助函数。

## 课程内容

### 对称和非对称加密

“密码学”从字面上看就是研究如何隐藏信息。您每天都会遇到两种主要类型的加密：

- **对称加密**
  - 同一个密钥用于加密和解密。这种方法已有几百年历史，从古埃及到伊丽莎白一世都曾使用过。
  - 最常见的是 AES 和 Chacha20。

- **非对称加密**

  非对称加密，又称‘公钥密码学’，是在 1970 年代发展起来的。在非对称加密中，参与者拥有成对的密钥（即密钥对）。每个密钥对由一个私钥和一个公钥组成。非对称加密与对称加密不同，能做不同的事情：

    - **加密**：如果用公钥加密，只有同一密钥对的私钥可以解密。

    - **签名**：如果用私钥加密，同一密钥对的公钥可以验证私钥持有者的签名。

  - 非对称加密还可以用于生成对称加密的密钥。这被称为**密钥交换**，你可以使用你的公钥和接收者的公钥生成一个“会话”密钥。

  - 常见的非对称加密算法包括 ECC 和 RSA 的各种变体。

- 非对称加密非常流行：

  - 你的银行卡内含有一个私钥，用于签署交易。

    你的银行可以通过匹配的公钥确认你进行了交易。

  - 网站的证书中包含一个公钥。你的浏览器会使用这个公钥加密发送到网页的数据（如个人信息、登录详情和信用卡号码）。

    该网站有匹配的私钥，能够读取这些数据。

  - 你的电子护照由发证国签名，确保护照未被伪造。

    电子护照门可以使用发证国的公钥验证。

  - 你的手机消息应用使用密钥交换生成会话密钥。


简而言之，加密技术无处不在。Solana 和其他区块链不过是加密技术的一种应用。

### Solana 使用公钥作为地址

![Solana wallet addresses](https://www.soldev.app/assets/wallet-addresses.svg)

参与 Solana 网络的人至少有一个密钥对。在 Solana 中：

- **公钥**用作指向 Solana 网络上账户的“地址”。即使是友好名称（如 `example.sol`）也指向类似 `dDCQNnDmNbFVi8cQhKAgXhyhXeJ625tvwsunRyRc7c8` 的地址。
- **私钥**用于验证对该密钥对的控制权。如果你拥有某个地址的私钥，你就能控制该地址中的代币。因此，正如名称所示，你应始终保密私钥。

### 使用 @solana/web3.js 创建密钥对

你可以通过浏览器或 node.js 使用 `@solana/web3.js` npm包来操作 Solana 区块链。按照常规方法设置项目，然后使用 `npm` 安装 `@solana/web3.js`。

```shell
npm i @solana/web3.js
```

我们将在整个课程中逐步介绍 web3.js 的很多内容，但你也可以查看官方 web3.js 文档。

要发送代币、发送 NFT 或读取和写入 Solana 的数据，你需要自己的密钥对。要生成新密钥对，使用 `@solana/web3.js` 的 `Keypair.generate()` 函数：

```javascript
import { Keypair } from "@solana/web3.js";

const keypair = Keypair.generate();

console.log(`The public key is: `, keypair.publicKey.toBase58());
console.log(`The secret key is: `, keypair.secretKey);
```

### ⚠️不要在源代码中包含私钥

由于密钥对可以从私钥重新生成，我们通常只存储私钥，并从私钥恢复密钥对。此外，由于私钥赋予了对地址的控制权，我们不在源代码中存储私钥。相反，我们：

- 将私钥放在 `.env` 文件中
- 将 `.env` 文件添加到 `.gitignore` 中，以确保 `.env` 文件不会被提交

### 加载现有密钥对

如果你已有想使用的密钥对，可以从文件系统或 `.env` 文件中存储的现有私钥加载`密钥对`。在 node.js 中，`@solana-developers/helpers` npm包提供了一些额外的函数：

```bash
npm i @solana-developers/helpers
```

要使用 `.env` 文件，请使用 `getKeypairFromEnvironment()` 函数。
要使用 Solana CLI 文件，请使用 `getKeypairFromFile()` 函数。

```javascript
import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

const keypair = getKeypairFromEnvironment("SECRET_KEY");
```

你已经知道如何生成和加载密钥对了！让我们练习一下所学内容。

## 实验

### 安装

创建一个新目录，安装 TypeScript、Solana web3.js 和 esrun：

```shell
mkdir generate-keypair
cd generate-keypair
npm init -y
npm install typescript @solana/web3.js esrun @solana-developers/helpers
```

新建一个名为 `generate-keypair.ts` 的文件

```typescript
import { Keypair } from "@solana/web3.js";

const keypair = Keypair.generate();

console.log(`✅ Generated keypair!`);
```

运行 `npx esrun generate-keypair.ts`。你应该会看到以下文字：

```shell
✅ Generated keypair!
```

每个 `Keypair` 都有 `publicKey` 和 `secretKey` 属性。更新文件：

```typescript
import { Keypair } from "@solana/web3.js";

const keypair = Keypair.generate();

console.log(`The public key is: `, keypair.publicKey.toBase58());
console.log(`The secret key is: `, keypair.secretKey);
console.log(`✅ Finished!`);
```

运行 `npx esrun generate-keypair.ts`。你应该会看到以下文字：

```shell
The public key is:  764CksEAZvm7C1mg2uFmpeFvifxwgjqxj2bH6Ps7La4F
The secret key is:  Uint8Array(64) [
  (一长串数字)
]
✅ Finished!
```

### 从 .env 文件加载现有密钥对

为了确保你的私钥安全，我们建议使用 `.env` 文件注入私钥：

新建一个名为 `.env` 的文件，并填入之前生成的密钥：

```js
SECRET_KEY="[(一串数字)]"
```

然后我们可以从环境中加载密钥对。更新 `generate-keypair.ts` 文件：

```typescript
import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

const keypair = getKeypairFromEnvironment("SECRET_KEY");

console.log(
  `✅ Finished! We've loaded our secret key securely, using an env file!`
);
```

运行 `npx esrun generate-keypair.ts`。你应该会看到以下结果：

```shell
✅ Finished! We've loaded our secret key securely, using an env file!
```

我们现在已经学习了 Solana 上的密钥对以及如何安全地存储私钥。在下一章节中，我们将使用它们！

## 完成实验了吗？

将代码推送到 GitHub 并[告诉我们你对这节课的看法吧](https://form.typeform.com/to/IPH0UGz7#answers-lesson=ee06a213-5d74-4954-846e-cba883bc6db1)！



## 注意事项！

1. **随后的每一节[注意事项](#注意事项)的设置和规则都会延续**

   1. 实验中的目录结构并未按教程来，而是单独放在相应目录文件夹的`/labs`下
   2. 与实验中使用的包管理工具不同，为`pnpm`

2. **根据实际运行时报错结果，对实验代码进行修改：**

   1. 在运行实验时需要下载 `dotenv` 依赖

      ```bash
      pnpm i dotenv
      ```

   2. 将`import "dotenv/config"` 替换为 

        ```ts
         import dotenv from 'dotenv';
         dotenv.config();
        ```

   3. ~~在`package.json` 中添加  `"type": "module"`~~
