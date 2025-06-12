# Claude Code プロジェクトメモリ

## プロジェクト概要
**音声対話Webシステム** - 子供向けAI音声チャットシステム

### 基本情報
- **プロジェクト名**: voice-chat-system
- **開始日**: 2024年6月11日
- **GitHubリポジトリ**: https://github.com/koichi1115/voice-chat-system
- **開発期間**: 4週間（20営業日）
- **総工数**: 120人時

## 技術スタック
- **フロントエンド**: HTML5, CSS3, Vanilla JavaScript
- **音声処理**: Web Speech API (Speech Recognition & Speech Synthesis)
- **AI連携**: OpenAI API, Claude API（オプション）
- **データ保存**: LocalStorage（初期版）
- **開発ツール**: Git, npm, ESLint
- **サーバー**: serve（開発用）

## 主要機能要件
1. **音声入力機能**: ブラウザボタンで音声入力開始
2. **音声認識・LLM連携**: Speech-to-text → LLM API連携
3. **音声出力機能**: Text-to-speech で回答再生
4. **ユーザー情報管理**: 子供の基本情報・質問履歴保持

## 開発環境
- **Node.js**: v18.19.1
- **npm**: 9.2.0
- **Git**: 2.43.0
- **OS**: Linux 5.15.167.4-microsoft-standard-WSL2

## API設定
- **OpenAI API**: config/config.js で設定（要取得）
- **Claude API**: オプション機能
- **設定ファイル**: config/config.example.js をコピーして使用

## プロジェクト構造
```
voice-chat-system/
├── .gitignore
├── README.md
├── package.json
├── CLAUDE.md           # このファイル
├── config/
│   └── config.example.js
├── docs/
│   └── api-setup-guide.md
├── css/                # スタイルシート
├── js/                 # JavaScript モジュール
└── src/                # ソースファイル
```

## 完了した作業

### 1.1.1 開発環境セットアップ ✅
- **1.1.1.1** 開発用PC環境構築 ✅
  - Node.js, npm, Git 確認
  - 基本開発ツール準備完了
  
- **1.1.1.2** バージョン管理システム（Git）セットアップ ✅
  - Gitリポジトリ初期化
  - プロジェクト構造作成
  - .gitignore, README.md 作成
  
- **1.1.1.3** LLM API キー取得・設定 ✅
  - config.example.js 作成
  - API設定ガイド（docs/api-setup-guide.md）作成
  - Personal Access Token設定

### GitHub統合 ✅
- リポジトリ作成: koichi1115/voice-chat-system
- 初期ファイル群プッシュ完了
- リモート追跡設定完了

## 開発コマンド
```bash
npm start       # サーバー起動
npm run dev     # 開発サーバー（ライブリロード）
npm run lint    # コード品質チェック
npm test        # テスト実行（実装予定）
```

## 次の予定作業

### 1.1.2 プロジェクト計画策定
- 詳細スケジュール作成
- リスク分析・対策立案
- 品質基準・テスト計画策定

### 1.2 設計フェーズ
- **1.2.1** UI/UX設計
  - ワイヤーフレーム作成
  - 子供向けビジュアルデザイン
  - レスポンシブデザイン対応
  
- **1.2.2** システム設計
  - アーキテクチャ設計
  - データ構造設計
  - API連携仕様設計

## 重要な設定・注意事項

### セキュリティ
- APIキーは config/config.js に保存（Gitコミット禁止）
- Personal Access Token管理に注意
- 個人情報はLocalStorageで暗号化

### API制限・コスト管理
- OpenAI API: 従量課金制（使用量監視要）
- レスポンス制限: MAX_TOKENS=150
- タイムアウト・リトライ機能実装予定

### ブラウザサポート
- Chrome 70+, Firefox 65+, Safari 12+, Edge 79+
- Web Speech API対応確認必須

## クリティカルパス
1.1 → 1.2 → **1.3.1 → 1.3.2 → 1.3.3 → 1.3.4** → 1.4 → 1.5 → 1.6
（音声機能開発 1.3.2〜1.3.4 が最大リスク箇所）

## リスク事項
- Web Speech APIブラウザ互換性
- LLM APIレスポンス遅延・エラー
- 音声認識精度
- 子供向けUI/UX適合性

## 品質基準
- レスポンス時間: 音声認識後3秒以内にLLM回答開始
- 音声品質: クリアな音声出力、ノイズ除去
- 使いやすさ: 子供でも直感的操作可能

## 参考ドキュメント
- **要件定義書**: requirements.html
- **WBS**: wbs.html
- **API設定ガイド**: docs/api-setup-guide.md
- **README**: README.md