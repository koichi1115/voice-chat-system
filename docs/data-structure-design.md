# データ構造設計（LocalStorage）

## データ設計原則

### 設計方針
1. **軽量性**: 必要最小限のデータ保存でパフォーマンス確保
2. **プライバシー保護**: 個人情報の暗号化保存
3. **スキーマ柔軟性**: 将来の機能拡張に対応できる構造
4. **データ整合性**: バリデーションとエラー処理の充実

### LocalStorage使用理由
- **初期版要件**: サーバーレス構成での簡単なデータ永続化
- **ユーザー体験**: ログイン不要で即座に利用開始可能
- **プライバシー**: データがユーザーデバイスのみに保存
- **オフライン対応**: ネットワーク不要でのデータアクセス

## データストレージ設計

### ストレージキー構造
```javascript
// キープレフィックス
const STORAGE_PREFIX = 'voiceChat_';

// メインキー構造
const STORAGE_KEYS = {
  // ユーザー情報
  USER_PROFILE: `${STORAGE_PREFIX}userProfile`,
  USER_PREFERENCES: `${STORAGE_PREFIX}userPreferences`,
  
  // 会話データ
  CONVERSATION_HISTORY: `${STORAGE_PREFIX}conversations`,
  CONVERSATION_METADATA: `${STORAGE_PREFIX}conversationMeta`,
  
  // 設定データ
  APP_SETTINGS: `${STORAGE_PREFIX}appSettings`,
  SPEECH_SETTINGS: `${STORAGE_PREFIX}speechSettings`,
  
  // セッションデータ
  CURRENT_SESSION: `${STORAGE_PREFIX}currentSession`,
  TEMP_DATA: `${STORAGE_PREFIX}tempData`,
  
  // メタデータ
  DATA_VERSION: `${STORAGE_PREFIX}dataVersion`,
  LAST_UPDATED: `${STORAGE_PREFIX}lastUpdated`
};
```

### データバージョニング
```javascript
// データバージョン管理
const DATA_SCHEMA_VERSION = '1.0.0';

const MIGRATION_HANDLERS = {
  '0.9.0': (data) => {
    // v0.9.0からv1.0.0への移行
    return migrateToV1(data);
  }
};
```

## データ構造定義

### 1. ユーザープロファイル

#### UserProfile
```typescript
interface UserProfile {
  // 基本情報
  id: string;                    // ユーザーID (UUID)
  name: string;                  // 名前
  age: number;                   // 年齢 (3-18)
  grade: string;                 // 学年
  
  // 学習情報
  interests: string[];           // 興味分野
  knowledgeLevel: string;        // 知識レベル ('beginner' | 'intermediate' | 'advanced')
  learningGoals: string[];       // 学習目標
  
  // 統計情報
  totalQuestions: number;        // 総質問数
  totalSessions: number;         // 総セッション数
  averageSessionLength: number;  // 平均セッション時間（分）
  favoriteTopics: string[];      // よく質問するトピック
  
  // メタデータ
  createdAt: string;            // ISO 8601形式
  lastLoginAt: string;          // 最終ログイン時刻
  dataVersion: string;          // データバージョン
}

// 実際の保存例
const userProfileExample = {
  id: "usr_123e4567-e89b-12d3-a456-426614174000",
  name: "たろう",
  age: 8,
  grade: "小学2年生",
  interests: ["恐竜", "宇宙", "動物"],
  knowledgeLevel: "beginner",
  learningGoals: ["理科の勉強", "読書習慣"],
  totalQuestions: 45,
  totalSessions: 12,
  averageSessionLength: 15.5,
  favoriteTopics: ["恐竜", "動物"],
  createdAt: "2024-06-11T10:00:00.000Z",
  lastLoginAt: "2024-06-11T14:30:00.000Z",
  dataVersion: "1.0.0"
};
```

#### UserPreferences
```typescript
interface UserPreferences {
  // 音声設定
  speech: {
    rate: number;               // 話速 (0.5-2.0)
    pitch: number;              // 音の高さ (0.0-2.0)
    volume: number;             // 音量 (0.0-1.0)
    voiceName: string;          // 音声名
    language: string;           // 言語 ('ja-JP')
  };
  
  // LLM設定
  llm: {
    provider: string;           // 'openai' | 'claude'
    model: string;              // モデル名
    responseLength: string;     // 'short' | 'medium' | 'long'
    personality: string;        // 'friendly' | 'educational' | 'casual'
  };
  
  // UI設定
  ui: {
    theme: string;              // 'light' | 'dark' | 'auto'
    fontSize: string;           // 'small' | 'medium' | 'large'
    animations: boolean;        // アニメーション有無
    soundEffects: boolean;      // 効果音有無
  };
  
  // プライバシー設定
  privacy: {
    saveHistory: boolean;       // 履歴保存
    autoDelete: number;         // 自動削除日数 (0=無効)
    analytics: boolean;         // 使用状況分析
  };
}
```

### 2. 会話データ

#### ConversationHistory
```typescript
interface ConversationEntry {
  id: string;                   // 会話ID
  sessionId: string;            // セッションID
  timestamp: string;            // 会話時刻
  
  // 質問データ
  question: {
    text: string;               // 認識されたテキスト
    audioUrl?: string;          // 音声データURL（一時的）
    confidence: number;         // 認識信頼度 (0.0-1.0)
    processingTime: number;     // 処理時間（ms）
  };
  
  // 回答データ
  answer: {
    text: string;               // 回答テキスト
    provider: string;           // 使用LLM
    model: string;              // 使用モデル
    responseTime: number;       // 応答時間（ms）
    tokens?: {
      input: number;            // 入力トークン数
      output: number;           // 出力トークン数
    };
  };
  
  // 評価データ
  feedback?: {
    rating: number;             // 評価 (1-5)
    helpful: boolean;           // 役に立った
    understood: boolean;        // 理解できた
    appropriate: boolean;       // 年齢に適している
  };
  
  // タグ・分類
  tags: string[];              // トピックタグ
  category: string;            // カテゴリ
  difficulty: string;          // 難易度
}

// ConversationHistory全体
interface ConversationHistory {
  entries: ConversationEntry[];
  metadata: {
    totalEntries: number;
    oldestEntry: string;        // 最古の会話日時
    newestEntry: string;        // 最新の会話日時
    storageSize: number;        // 使用ストレージ容量（bytes）
  };
}
```

#### SessionData
```typescript
interface SessionData {
  id: string;                   // セッションID
  startTime: string;            // 開始時刻
  endTime?: string;             // 終了時刻
  duration?: number;            // セッション時間（分）
  
  // セッション統計
  questionCount: number;        // 質問数
  avgResponseTime: number;      // 平均応答時間
  topicsDiscussed: string[];    // 話したトピック
  
  // セッション状態
  currentQuestion?: string;     // 現在の質問
  currentAnswer?: string;       // 現在の回答
  isActive: boolean;           // アクティブセッション
  
  // 品質メトリクス
  speechRecognitionErrors: number;  // 音声認識エラー数
  llmErrors: number;               // LLMエラー数
  userSatisfaction?: number;       // ユーザー満足度
}
```

### 3. 設定データ

#### AppSettings
```typescript
interface AppSettings {
  // アプリケーション設定
  app: {
    version: string;            // アプリバージョン
    language: string;           // UI言語
    autoSave: boolean;          // 自動保存
    debugMode: boolean;         // デバッグモード
  };
  
  // 機能設定
  features: {
    voiceInput: boolean;        // 音声入力有効
    textInput: boolean;         // テキスト入力有効
    historyFeature: boolean;    // 履歴機能有効
    feedbackSystem: boolean;    // フィードバック機能
  };
  
  // 制限設定
  limits: {
    maxHistoryEntries: number;  // 最大履歴数
    maxSessionTime: number;     // 最大セッション時間（分）
    dailyQuestionLimit: number; // 1日の質問制限
  };
  
  // 通知設定
  notifications: {
    sessionReminders: boolean;  // セッション開始リマインダー
    achievementAlerts: boolean; // 達成通知
    errorAlerts: boolean;       // エラー通知
  };
}
```

#### SpeechSettings
```typescript
interface SpeechSettings {
  // 音声認識設定
  recognition: {
    language: string;           // 認識言語
    continuous: boolean;        // 連続認識
    interimResults: boolean;    // 中間結果表示
    maxAlternatives: number;    // 代替候補数
    
    // 詳細設定
    silenceTimeout: number;     // 無音タイムアウト（ms）
    noiseThreshold: number;     // ノイズ閾値
    confidenceThreshold: number; // 信頼度閾値
  };
  
  // 音声合成設定
  synthesis: {
    rate: number;               // 話速
    pitch: number;              // 音の高さ
    volume: number;             // 音量
    voice: {
      name: string;             // 音声名
      lang: string;             // 音声言語
      gender: string;           // 性別
    };
    
    // 詳細設定
    pauseBetweenSentences: number;  // 文間ポーズ（ms）
    emphasisLevel: number;          // 強調レベル
    pronunciation: Record<string, string>; // 発音辞書
  };
}
```

### 4. 一時データ

#### TempData
```typescript
interface TempData {
  // 現在の音声処理
  currentVoiceSession?: {
    isRecording: boolean;
    startTime: string;
    audioBlob?: Blob;
    transcript: string;
    confidence: number;
  };
  
  // 現在のLLM処理
  currentLLMRequest?: {
    requestId: string;
    prompt: string;
    startTime: string;
    provider: string;
    status: 'pending' | 'processing' | 'completed' | 'error';
  };
  
  // UI状態
  uiState: {
    currentView: string;        // 現在の画面
    modalStack: string[];       // モーダルスタック
    focusedElement?: string;    // フォーカス要素
    scrollPosition: Record<string, number>; // スクロール位置
  };
  
  // キャッシュデータ
  cache: {
    llmResponses: Record<string, {
      response: string;
      timestamp: string;
      ttl: number;
    }>;
    userInputs: string[];       // 最近の入力履歴
  };
}
```

## データ操作クラス設計

### StorageManager
```typescript
class StorageManager {
  private prefix: string = 'voiceChat_';
  private encryptionKey: CryptoKey;
  
  // 基本操作
  async set<T>(key: string, value: T): Promise<void> {
    try {
      const encrypted = await this.encrypt(JSON.stringify(value));
      localStorage.setItem(this.prefix + key, encrypted);
      this.updateLastModified(key);
    } catch (error) {
      throw new StorageError(`Failed to save ${key}`, error);
    }
  }
  
  async get<T>(key: string): Promise<T | null> {
    try {
      const encrypted = localStorage.getItem(this.prefix + key);
      if (!encrypted) return null;
      
      const decrypted = await this.decrypt(encrypted);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error(`Failed to load ${key}:`, error);
      return null;
    }
  }
  
  // バッチ操作
  async setBatch(items: Record<string, any>): Promise<void> {
    const operations = Object.entries(items).map(([key, value]) => 
      this.set(key, value)
    );
    await Promise.all(operations);
  }
  
  // データ移行
  async migrate(fromVersion: string, toVersion: string): Promise<void> {
    const migrationHandler = MIGRATION_HANDLERS[fromVersion];
    if (migrationHandler) {
      const allData = await this.getAllData();
      const migratedData = migrationHandler(allData);
      await this.setBatch(migratedData);
      await this.set('dataVersion', toVersion);
    }
  }
  
  // 暗号化・復号化
  private async encrypt(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: new Uint8Array(12) },
      this.encryptionKey,
      dataBuffer
    );
    return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
  }
  
  private async decrypt(encryptedData: string): Promise<string> {
    const encrypted = new Uint8Array(
      atob(encryptedData).split('').map(c => c.charCodeAt(0))
    );
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(12) },
      this.encryptionKey,
      encrypted
    );
    return new TextDecoder().decode(decrypted);
  }
}
```

### ConversationManager
```typescript
class ConversationManager {
  private storageManager: StorageManager;
  private maxEntries: number = 1000;
  
  // 会話追加
  async addConversation(entry: Omit<ConversationEntry, 'id' | 'timestamp'>): Promise<string> {
    const conversationEntry: ConversationEntry = {
      ...entry,
      id: this.generateId(),
      timestamp: new Date().toISOString()
    };
    
    const history = await this.getHistory();
    history.entries.unshift(conversationEntry);
    
    // 最大件数チェック
    if (history.entries.length > this.maxEntries) {
      history.entries = history.entries.slice(0, this.maxEntries);
    }
    
    await this.saveHistory(history);
    return conversationEntry.id;
  }
  
  // 履歴検索
  async searchConversations(query: {
    text?: string;
    tags?: string[];
    dateRange?: { start: string; end: string };
    category?: string;
  }): Promise<ConversationEntry[]> {
    const history = await this.getHistory();
    
    return history.entries.filter(entry => {
      if (query.text && !entry.question.text.includes(query.text) && 
          !entry.answer.text.includes(query.text)) {
        return false;
      }
      
      if (query.tags && !query.tags.some(tag => entry.tags.includes(tag))) {
        return false;
      }
      
      if (query.dateRange) {
        const entryDate = new Date(entry.timestamp);
        const start = new Date(query.dateRange.start);
        const end = new Date(query.dateRange.end);
        if (entryDate < start || entryDate > end) {
          return false;
        }
      }
      
      if (query.category && entry.category !== query.category) {
        return false;
      }
      
      return true;
    });
  }
  
  // 統計取得
  async getStatistics(): Promise<ConversationStatistics> {
    const history = await this.getHistory();
    
    return {
      totalConversations: history.entries.length,
      avgResponseTime: this.calculateAvgResponseTime(history.entries),
      topTopics: this.getTopTopics(history.entries),
      dailyActivity: this.getDailyActivity(history.entries),
      satisfactionScore: this.calculateSatisfactionScore(history.entries)
    };
  }
}
```

## データ制限・最適化

### ストレージ制限
```typescript
interface StorageLimits {
  maxTotalSize: number;         // 5MB
  maxHistoryEntries: number;    // 1000件
  maxSessionTime: number;       // 2時間
  maxDailyQuestions: number;    // 100問
}

// サイズ監視
class StorageSizeMonitor {
  async getCurrentUsage(): Promise<number> {
    let totalSize = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('voiceChat_')) {
        const value = localStorage.getItem(key);
        totalSize += key.length + (value?.length || 0);
      }
    }
    return totalSize;
  }
  
  async cleanupOldData(): Promise<void> {
    const usage = await this.getCurrentUsage();
    if (usage > this.limits.maxTotalSize * 0.8) {
      // 古いデータの削除
      await this.removeOldestEntries(100);
    }
  }
}
```

### データ圧縮
```typescript
// 大きなデータの圧縮
class DataCompressor {
  compress(data: string): string {
    // LZ77ベースの簡易圧縮
    return this.lz77Compress(data);
  }
  
  decompress(compressedData: string): string {
    return this.lz77Decompress(compressedData);
  }
}
```

## バックアップ・復元

### データエクスポート
```typescript
class DataExportManager {
  async exportAllData(): Promise<string> {
    const allData = {
      userProfile: await storageManager.get('userProfile'),
      conversations: await storageManager.get('conversations'),
      settings: await storageManager.get('appSettings'),
      exportDate: new Date().toISOString(),
      version: DATA_SCHEMA_VERSION
    };
    
    return JSON.stringify(allData, null, 2);
  }
  
  async importData(jsonData: string): Promise<void> {
    const data = JSON.parse(jsonData);
    
    // バージョンチェック
    if (data.version !== DATA_SCHEMA_VERSION) {
      throw new Error('Incompatible data version');
    }
    
    // データ復元
    await storageManager.setBatch(data);
  }
}
```

---

**作成日**: 2024年6月11日  
**設計者**: データアーキテクチャチーム  
**データバージョン**: 1.0.0  
**次回レビュー**: 実装完了後