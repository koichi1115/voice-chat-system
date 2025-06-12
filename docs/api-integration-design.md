# API連携仕様設計

## API連携概要

### 連携API一覧
1. **OpenAI API** - メインLLMプロバイダー
2. **Claude API** - セカンダリLLMプロバイダー（オプション）
3. **Web Speech API** - ブラウザネイティブ音声機能

### 設計原則
- **冗長性**: 複数LLMによるフェイルオーバー対応
- **レート制限対応**: API制限を考慮した呼び出し制御
- **セキュリティ**: APIキーの安全な管理
- **パフォーマンス**: 応答時間最適化とキャッシュ活用

## 1. OpenAI API連携

### 基本仕様
```typescript
interface OpenAIConfig {
  apiKey: string;
  baseURL: string;
  model: string;
  organization?: string;
  timeout: number;
}

interface OpenAIRequest {
  model: string;
  messages: ChatMessage[];
  max_tokens: number;
  temperature: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  user?: string;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  name?: string;
}
```

### 実装クラス
```typescript
class OpenAIManager {
  private config: OpenAIConfig;
  private rateLimiter: RateLimiter;
  private cache: ResponseCache;
  
  constructor(config: OpenAIConfig) {
    this.config = config;
    this.rateLimiter = new RateLimiter({
      requestsPerMinute: 60,
      tokensPerMinute: 40000
    });
    this.cache = new ResponseCache();
  }
  
  async sendMessage(
    message: string, 
    context: ConversationContext
  ): Promise<LLMResponse> {
    // レート制限チェック
    await this.rateLimiter.waitForSlot();
    
    // キャッシュ確認
    const cacheKey = this.generateCacheKey(message, context);
    const cachedResponse = await this.cache.get(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    try {
      // プロンプト構築
      const messages = this.buildMessages(message, context);
      
      // API呼び出し
      const response = await this.callOpenAI({
        model: this.config.model,
        messages,
        max_tokens: context.maxTokens || 150,
        temperature: context.temperature || 0.7,
        user: context.userId
      });
      
      // レスポンス処理
      const result = this.processResponse(response);
      
      // キャッシュ保存
      await this.cache.set(cacheKey, result, 3600); // 1時間
      
      return result;
      
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  private async callOpenAI(request: OpenAIRequest): Promise<any> {
    const response = await fetch(`${this.config.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Organization': this.config.organization || ''
      },
      body: JSON.stringify(request),
      signal: AbortSignal.timeout(this.config.timeout)
    });
    
    if (!response.ok) {
      throw new APIError(`OpenAI API error: ${response.status}`, response);
    }
    
    return await response.json();
  }
  
  private buildMessages(message: string, context: ConversationContext): ChatMessage[] {
    const messages: ChatMessage[] = [];
    
    // システムプロンプト
    messages.push({
      role: 'system',
      content: this.buildSystemPrompt(context)
    });
    
    // 会話履歴（最新5件）
    if (context.history && context.history.length > 0) {
      const recentHistory = context.history.slice(-5);
      for (const entry of recentHistory) {
        messages.push(
          { role: 'user', content: entry.question },
          { role: 'assistant', content: entry.answer }
        );
      }
    }
    
    // 現在のメッセージ
    messages.push({
      role: 'user',
      content: message
    });
    
    return messages;
  }
  
  private buildSystemPrompt(context: ConversationContext): string {
    const { userProfile } = context;
    
    return `あなたは子供向けのAIアシスタントです。以下の設定で回答してください：

【ユーザー情報】
- 名前: ${userProfile.name}
- 年齢: ${userProfile.age}歳
- 学年: ${userProfile.grade}
- 興味: ${userProfile.interests.join('、')}

【回答ルール】
1. ${userProfile.age}歳の子供にわかりやすい言葉で説明する
2. 回答は3-4文程度に収める
3. 興味を引く具体例や比較を使う
4. 安全で教育的な内容のみ回答する
5. わからないことは「一緒に調べてみよう」と提案する

【話し方】
- 丁寧だが親しみやすい口調
- 漢字にはひらがなを併記（例：恐竜(きょうりゅう)）
- 子供の好奇心を刺激する表現を使う`;
  }
}
```

### エラーハンドリング
```typescript
class OpenAIErrorHandler {
  handleError(error: any): LLMError {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      switch (status) {
        case 401:
          return new LLMError('API_KEY_INVALID', 'APIキーが無効です');
        case 429:
          return new LLMError('RATE_LIMIT_EXCEEDED', 'リクエスト制限に達しました');
        case 500:
          return new LLMError('SERVER_ERROR', 'OpenAIサーバーエラー');
        case 503:
          return new LLMError('SERVICE_UNAVAILABLE', 'サービス一時停止中');
        default:
          return new LLMError('API_ERROR', `API Error: ${status}`);
      }
    }
    
    if (error.code === 'ENOTFOUND') {
      return new LLMError('NETWORK_ERROR', 'ネットワーク接続エラー');
    }
    
    if (error.name === 'AbortError') {
      return new LLMError('TIMEOUT', 'リクエストタイムアウト');
    }
    
    return new LLMError('UNKNOWN_ERROR', error.message);
  }
}
```

## 2. Claude API連携

### 基本仕様
```typescript
interface ClaudeConfig {
  apiKey: string;
  baseURL: string;
  model: string;
  version: string;
  timeout: number;
}

interface ClaudeRequest {
  model: string;
  max_tokens: number;
  messages: ClaudeMessage[];
  temperature?: number;
  top_p?: number;
  top_k?: number;
  system?: string;
}

interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}
```

### 実装クラス
```typescript
class ClaudeManager {
  private config: ClaudeConfig;
  private rateLimiter: RateLimiter;
  
  constructor(config: ClaudeConfig) {
    this.config = config;
    this.rateLimiter = new RateLimiter({
      requestsPerMinute: 50,
      tokensPerMinute: 40000
    });
  }
  
  async sendMessage(
    message: string, 
    context: ConversationContext
  ): Promise<LLMResponse> {
    await this.rateLimiter.waitForSlot();
    
    try {
      const request: ClaudeRequest = {
        model: this.config.model,
        max_tokens: context.maxTokens || 150,
        temperature: context.temperature || 0.7,
        system: this.buildSystemPrompt(context),
        messages: this.buildMessages(message, context)
      };
      
      const response = await this.callClaude(request);
      return this.processResponse(response);
      
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  private async callClaude(request: ClaudeRequest): Promise<any> {
    const response = await fetch(`${this.config.baseURL}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'anthropic-version': this.config.version,
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify(request),
      signal: AbortSignal.timeout(this.config.timeout)
    });
    
    if (!response.ok) {
      throw new APIError(`Claude API error: ${response.status}`, response);
    }
    
    return await response.json();
  }
  
  private buildMessages(message: string, context: ConversationContext): ClaudeMessage[] {
    const messages: ClaudeMessage[] = [];
    
    // 会話履歴
    if (context.history && context.history.length > 0) {
      const recentHistory = context.history.slice(-5);
      for (const entry of recentHistory) {
        messages.push(
          { role: 'user', content: entry.question },
          { role: 'assistant', content: entry.answer }
        );
      }
    }
    
    // 現在のメッセージ
    messages.push({
      role: 'user',
      content: message
    });
    
    return messages;
  }
}
```

## 3. Web Speech API連携

### 音声認識（Speech Recognition）
```typescript
interface SpeechRecognitionConfig {
  language: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  
  // 追加設定
  silenceTimeout: number;
  noiseThreshold: number;
  confidenceThreshold: number;
}

class SpeechRecognitionManager {
  private recognition: SpeechRecognition | null = null;
  private config: SpeechRecognitionConfig;
  private isListening = false;
  
  constructor(config: SpeechRecognitionConfig) {
    this.config = config;
    this.initializeRecognition();
  }
  
  private initializeRecognition(): void {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      throw new Error('Speech Recognition not supported');
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    // 基本設定
    this.recognition.lang = this.config.language;
    this.recognition.continuous = this.config.continuous;
    this.recognition.interimResults = this.config.interimResults;
    this.recognition.maxAlternatives = this.config.maxAlternatives;
    
    // イベントリスナー設定
    this.setupEventListeners();
  }
  
  private setupEventListeners(): void {
    if (!this.recognition) return;
    
    this.recognition.onstart = () => {
      this.isListening = true;
      this.emit('recognition:start');
    };
    
    this.recognition.onresult = (event) => {
      const results = this.processResults(event.results);
      this.emit('recognition:result', results);
    };
    
    this.recognition.onerror = (event) => {
      this.handleRecognitionError(event.error);
    };
    
    this.recognition.onend = () => {
      this.isListening = false;
      this.emit('recognition:end');
    };
  }
  
  async startListening(): Promise<void> {
    if (!this.recognition) {
      throw new Error('Speech Recognition not initialized');
    }
    
    if (this.isListening) {
      throw new Error('Already listening');
    }
    
    try {
      // マイクアクセス許可確認
      await this.requestMicrophonePermission();
      
      this.recognition.start();
      
      // タイムアウト設定
      setTimeout(() => {
        if (this.isListening) {
          this.stopListening();
        }
      }, this.config.silenceTimeout);
      
    } catch (error) {
      throw new SpeechError('MICROPHONE_ACCESS_DENIED', error.message);
    }
  }
  
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }
  
  private processResults(results: SpeechRecognitionResultList): RecognitionResult {
    const result = results[results.length - 1];
    const alternative = result[0];
    
    return {
      transcript: alternative.transcript,
      confidence: alternative.confidence,
      isFinal: result.isFinal,
      alternatives: Array.from(result).map(alt => ({
        transcript: alt.transcript,
        confidence: alt.confidence
      }))
    };
  }
  
  private async requestMicrophonePermission(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      throw new Error('Microphone access denied');
    }
  }
}
```

### 音声合成（Speech Synthesis）
```typescript
interface SpeechSynthesisConfig {
  language: string;
  voiceName?: string;
  rate: number;
  pitch: number;
  volume: number;
  
  // 追加設定
  pauseBetweenSentences: number;
  emphasisLevel: number;
}

class SpeechSynthesisManager {
  private synthesis: SpeechSynthesis;
  private config: SpeechSynthesisConfig;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  
  constructor(config: SpeechSynthesisConfig) {
    this.synthesis = window.speechSynthesis;
    this.config = config;
  }
  
  async speak(text: string, options?: Partial<SpeechSynthesisConfig>): Promise<void> {
    return new Promise((resolve, reject) => {
      // 既存の発話を停止
      this.stop();
      
      // 音声合成オブジェクト作成
      const utterance = new SpeechSynthesisUtterance(text);
      
      // 設定適用
      const finalConfig = { ...this.config, ...options };
      this.applyConfig(utterance, finalConfig);
      
      // イベントリスナー設定
      utterance.onend = () => {
        this.currentUtterance = null;
        this.emit('synthesis:end');
        resolve();
      };
      
      utterance.onerror = (event) => {
        this.currentUtterance = null;
        this.emit('synthesis:error', event.error);
        reject(new SpeechError('SYNTHESIS_ERROR', event.error));
      };
      
      utterance.onstart = () => {
        this.emit('synthesis:start');
      };
      
      utterance.onpause = () => {
        this.emit('synthesis:pause');
      };
      
      utterance.onresume = () => {
        this.emit('synthesis:resume');
      };
      
      // 発話開始
      this.currentUtterance = utterance;
      this.synthesis.speak(utterance);
    });
  }
  
  pause(): void {
    if (this.synthesis.speaking) {
      this.synthesis.pause();
    }
  }
  
  resume(): void {
    if (this.synthesis.paused) {
      this.synthesis.resume();
    }
  }
  
  stop(): void {
    this.synthesis.cancel();
    this.currentUtterance = null;
  }
  
  private applyConfig(utterance: SpeechSynthesisUtterance, config: SpeechSynthesisConfig): void {
    utterance.lang = config.language;
    utterance.rate = config.rate;
    utterance.pitch = config.pitch;
    utterance.volume = config.volume;
    
    // 音声選択
    if (config.voiceName) {
      const voices = this.synthesis.getVoices();
      const voice = voices.find(v => v.name === config.voiceName);
      if (voice) {
        utterance.voice = voice;
      }
    }
  }
  
  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synthesis.getVoices().filter(voice => 
      voice.lang.startsWith(this.config.language.substring(0, 2))
    );
  }
}
```

## 4. 統合LLMマネージャー

### プロバイダー切り替え機能
```typescript
class LLMManager {
  private providers: Map<string, LLMProvider>;
  private currentProvider: string;
  private fallbackProvider: string;
  
  constructor() {
    this.providers = new Map();
    this.currentProvider = 'openai';
    this.fallbackProvider = 'claude';
  }
  
  registerProvider(name: string, provider: LLMProvider): void {
    this.providers.set(name, provider);
  }
  
  async sendMessage(message: string, context: ConversationContext): Promise<LLMResponse> {
    const startTime = performance.now();
    
    try {
      // メインプロバイダーで試行
      const provider = this.providers.get(this.currentProvider);
      if (!provider) {
        throw new Error(`Provider ${this.currentProvider} not found`);
      }
      
      const response = await provider.sendMessage(message, context);
      response.processingTime = performance.now() - startTime;
      response.provider = this.currentProvider;
      
      return response;
      
    } catch (error) {
      console.warn(`${this.currentProvider} failed:`, error);
      
      // フォールバックプロバイダーで再試行
      if (this.shouldFallback(error) && this.fallbackProvider !== this.currentProvider) {
        try {
          const fallbackProvider = this.providers.get(this.fallbackProvider);
          if (fallbackProvider) {
            console.log(`Falling back to ${this.fallbackProvider}`);
            const response = await fallbackProvider.sendMessage(message, context);
            response.processingTime = performance.now() - startTime;
            response.provider = this.fallbackProvider;
            response.wasFallback = true;
            
            return response;
          }
        } catch (fallbackError) {
          console.error(`Fallback also failed:`, fallbackError);
        }
      }
      
      throw error;
    }
  }
  
  private shouldFallback(error: LLMError): boolean {
    // 一時的なエラーの場合のみフォールバック
    return error.code === 'RATE_LIMIT_EXCEEDED' ||
           error.code === 'SERVER_ERROR' ||
           error.code === 'SERVICE_UNAVAILABLE' ||
           error.code === 'TIMEOUT';
  }
}
```

## 5. レート制限とキャッシュ

### レート制限管理
```typescript
class RateLimiter {
  private requests: number[];
  private tokens: number[];
  private requestsPerMinute: number;
  private tokensPerMinute: number;
  
  constructor(limits: { requestsPerMinute: number; tokensPerMinute: number }) {
    this.requests = [];
    this.tokens = [];
    this.requestsPerMinute = limits.requestsPerMinute;
    this.tokensPerMinute = limits.tokensPerMinute;
  }
  
  async waitForSlot(estimatedTokens: number = 150): Promise<void> {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    
    // 1分以内のリクエストをフィルター
    this.requests = this.requests.filter(time => time > oneMinuteAgo);
    this.tokens = this.tokens.filter(time => time > oneMinuteAgo);
    
    // リクエスト数制限チェック
    if (this.requests.length >= this.requestsPerMinute) {
      const waitTime = this.requests[0] + 60000 - now;
      await this.sleep(waitTime);
      return this.waitForSlot(estimatedTokens);
    }
    
    // トークン数制限チェック
    const currentTokens = this.tokens.length * 150; // 平均トークン数で概算
    if (currentTokens + estimatedTokens > this.tokensPerMinute) {
      const waitTime = 60000 / this.tokensPerMinute * estimatedTokens;
      await this.sleep(waitTime);
      return this.waitForSlot(estimatedTokens);
    }
    
    // スロット確保
    this.requests.push(now);
    this.tokens.push(now);
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, Math.max(0, ms)));
  }
}
```

### レスポンスキャッシュ
```typescript
class ResponseCache {
  private cache: Map<string, CacheEntry>;
  private maxSize: number;
  
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }
  
  async get(key: string): Promise<LLMResponse | null> {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    // TTL チェック
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    // LRU更新
    this.cache.delete(key);
    this.cache.set(key, entry);
    
    return entry.response;
  }
  
  async set(key: string, response: LLMResponse, ttlSeconds: number): Promise<void> {
    // サイズ制限チェック
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      response,
      expiresAt: Date.now() + (ttlSeconds * 1000)
    });
  }
  
  generateKey(message: string, context: ConversationContext): string {
    const contextHash = this.hashContext({
      userId: context.userId,
      userAge: context.userProfile.age,
      interests: context.userProfile.interests,
      recentHistory: context.history?.slice(-2) // 直近2件のみ
    });
    
    return `${this.hashString(message)}_${contextHash}`;
  }
}
```

## 6. エラー定義とハンドリング

### エラー型定義
```typescript
enum LLMErrorCode {
  API_KEY_INVALID = 'API_KEY_INVALID',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  SERVER_ERROR = 'SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  CONTENT_FILTER = 'CONTENT_FILTER',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

class LLMError extends Error {
  constructor(
    public code: LLMErrorCode,
    message: string,
    public originalError?: any
  ) {
    super(message);
    this.name = 'LLMError';
  }
}

enum SpeechErrorCode {
  NOT_SUPPORTED = 'NOT_SUPPORTED',
  MICROPHONE_ACCESS_DENIED = 'MICROPHONE_ACCESS_DENIED',
  RECOGNITION_ERROR = 'RECOGNITION_ERROR',
  SYNTHESIS_ERROR = 'SYNTHESIS_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR'
}

class SpeechError extends Error {
  constructor(
    public code: SpeechErrorCode,
    message: string,
    public originalError?: any
  ) {
    super(message);
    this.name = 'SpeechError';
  }
}
```

---

**作成日**: 2024年6月11日  
**設計者**: API統合チーム  
**対象API**: OpenAI, Claude, Web Speech API  
**セキュリティレベル**: 高