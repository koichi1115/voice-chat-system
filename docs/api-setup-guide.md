# API設定ガイド

このドキュメントでは、音声対話システムで使用するLLM APIの設定方法を説明します。

## 必要なAPIキー

### 1. OpenAI API （必須）

#### 取得手順
1. [OpenAI Platform](https://platform.openai.com/)にアクセス
2. アカウントを作成またはサインイン
3. 右上のアカウントメニューから「API keys」を選択
4. 「Create new secret key」をクリック
5. キーの名前を入力（例：「voice-chat-system」）
6. 生成されたAPIキーをコピー（**注意：再表示されません**）

#### 料金プラン
- 新規アカウントには無料クレジットが付与されます
- 使用量に応じた従量課金制
- 詳細は[OpenAI Pricing](https://openai.com/pricing)を参照

#### 推奨設定
```javascript
OPENAI: {
    API_KEY: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    MODEL: 'gpt-3.5-turbo',  // コスト効率が良い
    MAX_TOKENS: 150,         // 短い回答に制限
    TEMPERATURE: 0.7         // 適度な創造性
}
```

### 2. Claude API （オプション）

#### 取得手順
1. [Anthropic Console](https://console.anthropic.com/)にアクセス
2. アカウントを作成またはサインイン
3. 「API Keys」セクションに移動
4. 「Create Key」をクリック
5. キーの名前と権限を設定
6. 生成されたAPIキーをコピー

#### 料金プラン
- 無料利用枠があります
- 詳細は[Anthropic Pricing](https://docs.anthropic.com/claude/reference/pricing)を参照

#### 推奨設定
```javascript
CLAUDE: {
    API_KEY: 'sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxx',
    MODEL: 'claude-3-sonnet-20240229',
    MAX_TOKENS: 150
}
```

## 設定ファイルの作成

### 1. 設定ファイルをコピー
```bash
cp config/config.example.js config/config.js
```

### 2. APIキーを設定
`config/config.js`を開いて、以下の部分を編集：

```javascript
const CONFIG = {
    OPENAI: {
        API_KEY: 'your-actual-openai-api-key-here',  // ← 実際のキーに変更
        MODEL: 'gpt-3.5-turbo',
        MAX_TOKENS: 150,
        TEMPERATURE: 0.7
    },
    
    // Claude APIを使用する場合
    CLAUDE: {
        API_KEY: 'your-actual-claude-api-key-here',  // ← 実際のキーに変更
        MODEL: 'claude-3-sonnet-20240229',
        MAX_TOKENS: 150
    }
};
```

## セキュリティ注意事項

### ⚠️ 重要な注意点

1. **APIキーを公開しない**
   - GitHubなどのパブリックリポジトリにコミットしない
   - `config/config.js`は`.gitignore`に含まれています

2. **APIキーの管理**
   - 定期的にキーをローテーション
   - 不要になったキーは削除
   - アクセス権限を最小限に設定

3. **使用量の監視**
   - API使用量を定期的にチェック
   - 予期しない大量使用に注意
   - 必要に応じて使用量制限を設定

## テスト方法

### 1. 設定の確認
ブラウザの開発者ツールで以下を実行：

```javascript
// 設定が正しく読み込まれているか確認
console.log(CONFIG.OPENAI.API_KEY ? 'OpenAI設定OK' : 'OpenAI設定不足');
console.log(CONFIG.CLAUDE.API_KEY ? 'Claude設定OK' : 'Claude設定不足');
```

### 2. API接続テスト
システム起動後、簡単な質問をして動作確認：

- 「こんにちは」
- 「今日の天気は？」
- 「1+1は？」

## トラブルシューティング

### よくある問題と解決方法

#### 1. 「API key not found」エラー
- `config/config.js`ファイルが存在するか確認
- APIキーが正しく設定されているか確認
- ファイルの読み込みエラーがないかブラウザの開発者ツールで確認

#### 2. 「Unauthorized」エラー
- APIキーが正しいか確認
- APIキーの権限設定を確認
- 課金情報が正しく設定されているか確認

#### 3. 「Rate limit exceeded」エラー
- API使用量制限に達している
- 少し時間を置いてから再試行
- 必要に応じてプランをアップグレード

#### 4. 「Network error」
- インターネット接続を確認
- ファイアウォールの設定を確認
- CORS設定の問題（ローカルサーバーから実行しているか確認）

## サポート

### 公式ドキュメント
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Anthropic Claude API Documentation](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)

### よくある質問
- OpenAI: [FAQ](https://help.openai.com/)
- Anthropic: [Support](https://support.anthropic.com/)

---

**注意**: APIキーは機密情報です。適切に管理し、セキュリティを最優先してください。