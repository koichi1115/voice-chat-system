# 音声対話Webシステム

子供向けのAI音声チャットシステムです。音声で質問すると、AIが音声で回答してくれます。

## 機能

- 🎤 **音声入力**: ボタンを押して質問を話す
- 🧠 **AI回答**: OpenAI GPT/Claude等のLLMが回答を生成
- 🔊 **音声出力**: AIの回答を音声で再生
- 👤 **個人化**: 子供の情報を記憶して個別対応

## 技術仕様

- **フロントエンド**: HTML5, CSS3, Vanilla JavaScript
- **音声処理**: Web Speech API (Speech Recognition & Speech Synthesis)
- **AI連携**: OpenAI API, Claude API
- **データ保存**: LocalStorage (初期版)

## セットアップ

### 1. 環境要件
- Node.js 16.0.0以上
- npm 8.0.0以上
- モダンブラウザ (Chrome, Firefox, Safari, Edge)

### 2. インストール
```bash
# プロジェクトのクローン
git clone <repository-url>
cd voice-chat-system

# 依存関係のインストール
npm install
```

### 3. API設定
```bash
# 設定ファイルをコピー
cp config/config.example.js config/config.js

# config/config.jsを編集してAPIキーを設定
```

### 4. 開発サーバー起動
```bash
# 開発サーバー起動（ライブリロード付き）
npm run dev

# または通常のサーバー起動
npm start
```

## API キー設定

### OpenAI API
1. [OpenAI Platform](https://platform.openai.com/)でアカウント作成
2. API キーを生成
3. `config/config.js`の`OPENAI.API_KEY`に設定

### Claude API (オプション)
1. [Anthropic Console](https://console.anthropic.com/)でアカウント作成
2. API キーを生成
3. `config/config.js`の`CLAUDE.API_KEY`に設定

## ディレクトリ構造

```
voice-chat-system/
├── index.html          # メインHTML
├── css/                # スタイルシート
├── js/                 # JavaScript モジュール
├── config/             # 設定ファイル
├── docs/               # ドキュメント
├── package.json        # プロジェクト設定
└── README.md           # このファイル
```

## 開発コマンド

```bash
npm start       # サーバー起動
npm run dev     # 開発サーバー（ライブリロード）
npm run lint    # コード品質チェック
npm test        # テスト実行（実装予定）
```

## ブラウザサポート

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

**注意**: Web Speech APIの対応状況によって機能が制限される場合があります。

## セキュリティ

- APIキーは`config/config.js`に保存（Gitにコミットしないこと）
- 個人情報はローカルストレージに暗号化して保存
- 音声データは一時的な処理のみで永続化しない

## ライセンス

MIT License

## 開発者向け情報

- WBS: `wbs.html`
- 要件定義: `requirements.html`
- 設計書: `docs/`ディレクトリ内