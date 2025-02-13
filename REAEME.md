# **📌 プロジェクト名**
**AI Knowledge Assistant - CosmosDB を活用したパーソナル AI アシスタント**

---

## **📌 プロジェクト概要**
このプロジェクトは、**CosmosDB を「もう一つの脳みそ」として活用し、ユーザーの知識を蓄積・検索・活用する AI アシスタント** です。  
LINE Bot を通じて、ユーザーが質問をすると、**関連する情報を CosmosDB から取得し、OpenAI API を使って記事を生成** します。  

---

## **📌 技術スタック**
| **カテゴリ** | **技術** |
|-------------|---------|
| **バックエンド** | Node.js (Express) |
| **データベース** | Azure CosmosDB |
| **AI モデル** | OpenAI API (GPT-4, text-embedding-ada-002) |
| **決済** | Stripe (クレジットカード決済) |
| **メッセージング** | LINE Bot API |
| **デプロイ** | Azure App Service |

---

## **📌 フォルダ構成**
```
backend/
 ├── routes/
 │   ├── tweets.js        # ツイート関連のAPI（取得・追加）
 │   ├── payments.js      # 決済関連のAPI（チャージ・残高管理）
 │   ├── line.js          # LINE Bot の処理
 │   ├── generate.js      # 記事生成のAPI
 ├── services/
 │   ├── openaiService.js # OpenAI API の処理
 │   ├── cosmosService.js # CosmosDB の処理
 ├── config/
 │   ├── lineConfig.js    # LINE Bot の設定
 │   ├── cosmosConfig.js  # CosmosDB の設定
 ├── index.js             # メインのエントリーポイント
 ├── .env                 # 環境変数
 ├── package.json         # Node.js の依存関係
 ├── README.md            # プロジェクトの説明書
```

✅ **この構成なら、各機能ごとにファイルを分けて管理できる！**

---

## **📌 環境変数（`.env`）**
このプロジェクトでは、以下の環境変数を `.env` に設定する必要があります。

📄 **`.env`**
```env
COSMOSDB_ENDPOINT=https://your-cosmosdb-endpoint
COSMOSDB_KEY=your-cosmosdb-key
DATABASE_ID=brain
CONTAINER_ID=tweets

OPENAI_API_KEY=your-openai-api-key

STRIPE_SECRET_KEY=your-stripe-secret-key

LINE_CHANNEL_ACCESS_TOKEN=your-line-channel-access-token
LINE_CHANNEL_SECRET=your-line-channel-secret
```

✅ **この `.env` を `backend/` に配置してください！**

---

## **📌 セットアップ手順**
### **① 必要なツールをインストール**
- [Node.js](https://nodejs.org/)（LTS バージョン推奨）
- [Azure CosmosDB](https://portal.azure.com/)（Azure アカウントが必要）
- [Stripe](https://stripe.com/jp)（決済用）
- [LINE Developers](https://developers.line.biz/)（LINE Bot 用）

---

### **② プロジェクトをクローン**
```sh
git clone https://github.com/your-repo/your-project.git
cd backend
```

---

### **③ 依存関係をインストール**
```sh
npm install
```

---

### **④ `.env` を設定**
`.env` ファイルを作成し、必要な環境変数を設定してください。

---

### **⑤ サーバーを起動**
```sh
node index.js
```
✅ **「✅ Server running on http://localhost:3000」** と表示されればOK！

---

## **📌 API エンドポイント**
### **① ツイート関連**
| **エンドポイント** | **メソッド** | **説明** |
|----------------|----------|----------|
| `/tweets` | `GET` | CosmosDB からツイートを取得 |
| `/tweets/add-batch` | `POST` | ツイートをバッチで追加 |

---

### **② 記事生成**
| **エンドポイント** | **メソッド** | **説明** |
|----------------|----------|----------|
| `/generate/from-question` | `POST` | ユーザーの質問を元に記事を生成 |

---

### **③ 決済（事前チャージ）**
| **エンドポイント** | **メソッド** | **説明** |
|----------------|----------|----------|
| `/create-checkout-session` | `POST` | Stripe で決済ページを作成 |
| `/confirm-payment` | `POST` | 支払い完了を確認し、ユーザーの残高を更新 |

---

### **④ LINE Bot**
| **エンドポイント** | **メソッド** | **説明** |
|----------------|----------|----------|
| `/line/webhook` | `POST` | LINE からのメッセージを受け取り、記事を送信 |

---

## **📌 開発フロー**
1. **ユーザーが LINE で質問を送信**
2. **バックエンド API (`POST /generate/from-question`) で記事を生成**
3. **生成された記事を LINE Bot でユーザーに送信**
4. **質問ごとに 100円を消費（事前チャージ式）**
5. **残高が足りない場合は、Stripe でチャージを促す**

✅ **このフローで、LINE で質問し、記事を受け取ることができる！**

---

## **📌 今後の拡張**
- **CosmosDB を「もう一つの脳みそ」として成長させる**
- **漫画や音楽の生成を可能にする**
- **対話型 AI として進化し、ユーザーの創造プロセスをサポートする**
- **サブスクリプションプランの導入**

✅ **このプロジェクトは、知識を蓄積し、創造的なアウトプットを生み出す AI アシスタントへ進化する！**

---

## **📌 ライセンス**
MIT License

---

## **📌 お問い合わせ**
開発者: **Your Name**  
GitHub: [Your GitHub](https://github.com/your-profile)  
お問い合わせ: **your-email@example.com**

---

## **🎯 まとめ**
✅ **プロジェクトの概要を説明**  
✅ **セットアップ手順を明確に記載**  
✅ **API エンドポイントを整理**  
✅ **開発フローを明確にし、今後の拡張も記載**  

