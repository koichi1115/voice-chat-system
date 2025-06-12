# システムアーキテクチャ設計

## アーキテクチャ概要

### 設計原則
1. **シンプルさ優先**: 初期版では複雑さを避け、確実に動作するシンプルな構成
2. **フロントエンド中心**: サーバーレス構成でクライアントサイド完結
3. **モジュラー設計**: 機能別に分離されたモジュール構成
4. **段階的拡張**: 将来のデータベース化・サーバー化に対応可能

### アーキテクチャパターン
- **MVP (Model-View-Presenter)**: プレゼンテーション層とビジネスロジックの分離
- **イベント駆動**: 非同期音声処理に適したイベントベースアーキテクチャ
- **レイヤードアーキテクチャ**: UI、ビジネスロジック、データ層の明確な分離

## システム全体構成

```
┌─────────────────────────────────────────────────────────┐
│                    ブラウザ環境                          │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐    │
│  │              UI レイヤー                        │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌──────────┐  │    │
│  │  │   HTML      │ │    CSS      │ │   Icons  │  │    │
│  │  │  Template   │ │   Styles    │ │  Assets  │  │    │
│  │  └─────────────┘ └─────────────┘ └──────────┘  │    │
│  └─────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────┐    │
│  │            アプリケーション層                    │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌──────────┐  │    │
│  │  │    UI       │ │   Event     │ │  State   │  │    │
│  │  │ Controller  │ │  Manager    │ │ Manager  │  │    │
│  │  └─────────────┘ └─────────────┘ └──────────┘  │    │
│  └─────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────┐    │
│  │            ビジネスロジック層                    │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌──────────┐  │    │
│  │  │   Speech    │ │     LLM     │ │   User   │  │    │
│  │  │  Manager    │ │   Manager   │ │ Manager  │  │    │
│  │  └─────────────┘ └─────────────┘ └──────────┘  │    │
│  └─────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────┐    │
│  │              データ層                           │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌──────────┐  │    │
│  │  │ LocalStorage│ │ SessionData │ │  Config  │  │    │
│  │  │   Manager   │ │   Manager   │ │ Manager  │  │    │
│  │  └─────────────┘ └─────────────┘ └──────────┘  │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    外部API                              │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌──────────────────┐  │
│  │ OpenAI API  │ │ Claude API  │ │ Web Speech API   │  │
│  │  (Primary)  │ │ (Secondary) │ │   (Browser)      │  │
│  └─────────────┘ └─────────────┘ └──────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## モジュール構成

### 1. UIレイヤー (Presentation Layer)

#### HTML Template Engine
```javascript
// templates/
class TemplateEngine {
  static render(templateName, data) {
    // シンプルなテンプレート描画
  }
}

// 主要テンプレート
- mainChat.html      // メインチャット画面
- settings.html      // 設定画面
- history.html       // 履歴画面
- errorModal.html    // エラー表示
```

#### CSS Architecture (BEM方式)
```css
/* css/base/       - リセット、変数、基本スタイル */
/* css/components/ - 再利用可能コンポーネント */
/* css/layouts/    - レイアウト専用 */
/* css/pages/      - ページ固有スタイル */
/* css/utilities/  - ユーティリティクラス */
```

### 2. アプリケーション層 (Application Layer)

#### UI Controller
```javascript
// js/controllers/
class UIController {
  constructor() {
    this.eventManager = new EventManager();
    this.stateManager = new StateManager();
  }
  
  // UI状態管理
  updateVoiceButtonState(state) {}
  showMessage(message, type) {}
  updateConversationDisplay() {}
}
```

#### Event Manager
```javascript
// js/core/
class EventManager {
  constructor() {
    this.listeners = new Map();
  }
  
  // イベント管理
  on(event, callback) {}
  emit(event, data) {}
  off(event, callback) {}
}

// 主要イベント
- 'voice:start'
- 'voice:end'
- 'voice:error'
- 'llm:response'
- 'ui:update'
```

#### State Manager
```javascript
// js/core/
class StateManager {
  constructor() {
    this.state = {
      currentMode: 'ready',     // ready, listening, processing, speaking
      isVoiceSupported: false,
      currentUser: null,
      conversationHistory: [],
      settings: {}
    };
  }
  
  // 状態管理
  setState(newState) {}
  getState(key) {}
  subscribe(callback) {}
}
```

### 3. ビジネスロジック層 (Business Logic Layer)

#### Speech Manager
```javascript
// js/services/
class SpeechManager {
  constructor() {
    this.recognition = null;
    this.synthesis = null;
    this.isRecording = false;
  }
  
  // 音声認識
  async startListening() {}
  stopListening() {}
  
  // 音声合成
  async speak(text, options) {}
  stopSpeaking() {}
  
  // 音声制御
  pauseSpeech() {}
  resumeSpeech() {}
}
```

#### LLM Manager
```javascript
// js/services/
class LLMManager {
  constructor() {
    this.currentProvider = 'openai';
    this.fallbackProvider = 'claude';
  }
  
  // LLM通信
  async sendMessage(message, context) {}
  async switchProvider(provider) {}
  
  // プロンプト生成
  buildPrompt(message, userProfile, history) {}
  
  // レスポンス処理
  processResponse(response) {}
}
```

#### User Manager
```javascript
// js/services/
class UserManager {
  constructor() {
    this.currentUser = null;
    this.storageManager = new StorageManager();
  }
  
  // ユーザー管理
  loadUserProfile() {}
  saveUserProfile(profile) {}
  updatePreferences(preferences) {}
  
  // 履歴管理
  addConversation(question, answer) {}
  getConversationHistory(limit) {}
  clearHistory() {}
}
```

### 4. データ層 (Data Layer)

#### Storage Manager
```javascript
// js/data/
class StorageManager {
  constructor() {
    this.prefix = 'voiceChat_';
    this.encryptionKey = this.generateKey();
  }
  
  // データ操作
  set(key, value) {}
  get(key) {}
  remove(key) {}
  clear() {}
  
  // 暗号化
  encrypt(data) {}
  decrypt(data) {}
}
```

#### Session Data Manager
```javascript
// js/data/
class SessionDataManager {
  constructor() {
    this.sessionData = {};
  }
  
  // セッション管理
  setSessionData(key, value) {}
  getSessionData(key) {}
  clearSession() {}
  
  // 一時データ
  setTempData(key, value, ttl) {}
  getTempData(key) {}
}
```

## データフロー

### 1. 音声入力フロー
```
[ユーザー] 
    ↓ ボタン押下
[UIController] 
    ↓ 'voice:start'
[SpeechManager] 
    ↓ Web Speech API
[音声認識] 
    ↓ テキスト変換
[LLMManager] 
    ↓ API呼び出し
[外部LLM] 
    ↓ レスポンス
[SpeechManager] 
    ↓ 音声合成
[ユーザー]
```

### 2. データ永続化フロー
```
[User Input] 
    ↓
[UserManager] 
    ↓ 履歴追加
[StorageManager] 
    ↓ 暗号化
[LocalStorage] 
    ↓ 保存完了
[StateManager] 
    ↓ 状態更新
[UIController]
```

### 3. エラーハンドリングフロー
```
[API Error] 
    ↓
[LLMManager] 
    ↓ 'error:llm'
[EventManager] 
    ↓ エラー通知
[UIController] 
    ↓ エラー表示
[ErrorHandler] 
    ↓ 復旧処理
[ユーザー]
```

## ファイル構成

### プロジェクト構造
```
voice-chat-system/
├── index.html                    # エントリーポイント
├── css/
│   ├── base/
│   │   ├── reset.css            # CSSリセット
│   │   ├── variables.css        # CSS変数
│   │   └── typography.css       # タイポグラフィ
│   ├── components/
│   │   ├── buttons.css          # ボタンスタイル
│   │   ├── cards.css            # カードコンポーネント
│   │   ├── modals.css           # モーダル
│   │   └── forms.css            # フォーム
│   ├── layouts/
│   │   ├── grid.css             # グリッドシステム
│   │   ├── header.css           # ヘッダー
│   │   └── navigation.css       # ナビゲーション
│   ├── pages/
│   │   ├── chat.css             # チャット画面
│   │   ├── settings.css         # 設定画面
│   │   └── history.css          # 履歴画面
│   └── utilities/
│       ├── spacing.css          # スペーシング
│       ├── responsive.css       # レスポンシブ
│       └── accessibility.css    # アクセシビリティ
│
├── js/
│   ├── app.js                   # アプリケーション初期化
│   ├── config.js                # 設定読み込み
│   │
│   ├── core/                    # コア機能
│   │   ├── EventManager.js      # イベント管理
│   │   ├── StateManager.js      # 状態管理
│   │   └── Logger.js            # ログ機能
│   │
│   ├── controllers/             # コントローラー
│   │   ├── UIController.js      # UI制御
│   │   ├── ChatController.js    # チャット制御
│   │   └── SettingsController.js # 設定制御
│   │
│   ├── services/                # サービス層
│   │   ├── SpeechManager.js     # 音声管理
│   │   ├── LLMManager.js        # LLM連携
│   │   ├── UserManager.js       # ユーザー管理
│   │   └── ConfigManager.js     # 設定管理
│   │
│   ├── data/                    # データ層
│   │   ├── StorageManager.js    # ストレージ管理
│   │   ├── SessionManager.js    # セッション管理
│   │   └── CacheManager.js      # キャッシュ管理
│   │
│   ├── utils/                   # ユーティリティ
│   │   ├── helpers.js           # ヘルパー関数
│   │   ├── validators.js        # バリデーション
│   │   ├── formatters.js        # フォーマット
│   │   └── crypto.js            # 暗号化
│   │
│   └── templates/               # テンプレート
│       ├── chatTemplate.js      # チャットUI
│       ├── settingsTemplate.js  # 設定UI
│       └── errorTemplate.js     # エラー表示
│
├── assets/
│   ├── icons/                   # アイコンファイル
│   ├── images/                  # 画像ファイル
│   └── sounds/                  # 効果音
│
└── tests/                       # テストファイル
    ├── unit/                    # 単体テスト
    ├── integration/             # 結合テスト
    └── e2e/                     # E2Eテスト
```

## 初期化シーケンス

### アプリケーション起動
```javascript
// app.js
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // 1. 設定読み込み
    const configManager = new ConfigManager();
    await configManager.loadConfig();
    
    // 2. コアサービス初期化
    const eventManager = new EventManager();
    const stateManager = new StateManager();
    const storageManager = new StorageManager();
    
    // 3. ビジネスロジック初期化
    const speechManager = new SpeechManager();
    const llmManager = new LLMManager();
    const userManager = new UserManager();
    
    // 4. UIコントローラー初期化
    const uiController = new UIController();
    const chatController = new ChatController();
    
    // 5. イベントバインディング
    setupEventListeners();
    
    // 6. 初期状態設定
    await initializeApp();
    
    console.log('Voice Chat System initialized successfully');
    
  } catch (error) {
    console.error('Failed to initialize application:', error);
    showInitializationError(error);
  }
});
```

## パフォーマンス考慮

### 1. 遅延読み込み
```javascript
// 動的インポート
const loadLLMManager = () => import('./services/LLMManager.js');
const loadSpeechManager = () => import('./services/SpeechManager.js');

// 必要時にロード
async function initializeVoiceFeature() {
  const { SpeechManager } = await loadSpeechManager();
  return new SpeechManager();
}
```

### 2. メモリ管理
```javascript
// メモリリーク防止
class ComponentManager {
  constructor() {
    this.components = new WeakMap();
    this.cleanupTasks = [];
  }
  
  destroy() {
    this.cleanupTasks.forEach(task => task());
    this.cleanupTasks.length = 0;
  }
}
```

### 3. キャッシュ戦略
```javascript
// レスポンスキャッシュ
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.maxSize = 100;
    this.ttl = 1000 * 60 * 10; // 10分
  }
  
  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }
}
```

## セキュリティ考慮

### 1. XSS対策
```javascript
// HTML文字列のサニタイズ
function sanitizeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
```

### 2. APIキー保護
```javascript
// 環境変数からの読み込み
class ConfigManager {
  constructor() {
    this.apiKeys = {};
  }
  
  async loadConfig() {
    // 設定ファイルから暗号化されたキーを読み込み
    const encryptedConfig = await fetch('./config/config.js');
    this.apiKeys = await this.decryptConfig(encryptedConfig);
  }
}
```

## 拡張性設計

### 将来の拡張ポイント
1. **サーバーサイド移行**: API Proxyサーバーの追加
2. **データベース化**: LocalStorage → Database移行
3. **マルチユーザー**: 認証・セッション管理
4. **高度なAI機能**: カスタムモデル、学習機能
5. **音声品質向上**: ノイズ除去、音声強化

### プラグインアーキテクチャ
```javascript
// プラグインシステム
class PluginManager {
  constructor() {
    this.plugins = new Map();
  }
  
  register(name, plugin) {
    this.plugins.set(name, plugin);
    plugin.initialize?.();
  }
  
  execute(hook, data) {
    for (const plugin of this.plugins.values()) {
      if (plugin[hook]) {
        data = plugin[hook](data) || data;
      }
    }
    return data;
  }
}
```

---

**作成日**: 2024年6月11日  
**設計者**: アーキテクチャチーム  
**レビュー**: 技術責任者承認済み  
**更新**: 実装進行に応じて随時更新