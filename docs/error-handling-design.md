# エラーハンドリング設計

## エラーハンドリング原則

### 設計方針
1. **ユーザビリティ優先**: 子供にも理解できる親しみやすいエラーメッセージ
2. **グレースフルデグラデーション**: エラー時も基本機能は継続動作
3. **自動復旧**: 可能な限り自動的にエラーから回復
4. **透明性**: 保護者向けには詳細なエラー情報も提供

### エラー分類
- **システムエラー**: API障害、ネットワーク問題等
- **ユーザーエラー**: 操作ミス、入力エラー等
- **環境エラー**: ブラウザ非対応、権限不足等
- **一時的エラー**: 通信遅延、一時的なサービス停止等

## エラー型定義

### 基本エラー型
```typescript
enum ErrorSeverity {
  LOW = 'low',       // 軽微（継続使用可能）
  MEDIUM = 'medium', // 中程度（一部機能制限）
  HIGH = 'high',     // 重大（主要機能停止）
  CRITICAL = 'critical' // 致命的（アプリ停止）
}

enum ErrorCategory {
  NETWORK = 'network',
  API = 'api',
  SPEECH = 'speech',
  STORAGE = 'storage',
  USER_INPUT = 'user_input',
  PERMISSION = 'permission',
  BROWSER = 'browser',
  UNKNOWN = 'unknown'
}

interface BaseError {
  code: string;
  message: string;
  userMessage: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  timestamp: string;
  context?: Record<string, any>;
  suggestions?: string[];
  recoverable: boolean;
}
```

### 具体的エラー定義

#### ネットワーク関連エラー
```typescript
enum NetworkErrorCode {
  CONNECTION_FAILED = 'NETWORK_CONNECTION_FAILED',
  TIMEOUT = 'NETWORK_TIMEOUT',
  OFFLINE = 'NETWORK_OFFLINE',
  SLOW_CONNECTION = 'NETWORK_SLOW_CONNECTION'
}

class NetworkError extends BaseError {
  constructor(code: NetworkErrorCode, context?: any) {
    const errorInfo = this.getErrorInfo(code);
    super();
    
    this.code = code;
    this.message = errorInfo.message;
    this.userMessage = errorInfo.userMessage;
    this.category = ErrorCategory.NETWORK;
    this.severity = errorInfo.severity;
    this.context = context;
    this.suggestions = errorInfo.suggestions;
    this.recoverable = errorInfo.recoverable;
  }
  
  private getErrorInfo(code: NetworkErrorCode) {
    const errorMap = {
      [NetworkErrorCode.CONNECTION_FAILED]: {
        message: 'Network connection failed',
        userMessage: 'インターネットに接続できませんでした😔\nWi-Fiやネット回線を確認してみてね',
        severity: ErrorSeverity.HIGH,
        suggestions: [
          'Wi-Fi接続を確認してください',
          '少し時間をおいて再度お試しください',
          '保護者の方にネット接続を確認してもらってください'
        ],
        recoverable: true
      },
      [NetworkErrorCode.TIMEOUT]: {
        message: 'Request timeout',
        userMessage: 'お返事に時間がかかりすぎました⏰\nもう一度試してみてね',
        severity: ErrorSeverity.MEDIUM,
        suggestions: [
          'もう一度質問してみてください',
          'もう少し短い質問にしてみてください'
        ],
        recoverable: true
      },
      [NetworkErrorCode.OFFLINE]: {
        message: 'Device is offline',
        userMessage: 'オフラインです📡\nインターネットに接続してから使ってね',
        severity: ErrorSeverity.HIGH,
        suggestions: [
          'インターネット接続を確認してください',
          'Wi-Fiまたはモバイルデータをオンにしてください'
        ],
        recoverable: true
      }
    };
    
    return errorMap[code];
  }
}
```

#### API関連エラー
```typescript
enum APIErrorCode {
  UNAUTHORIZED = 'API_UNAUTHORIZED',
  RATE_LIMIT = 'API_RATE_LIMIT',
  SERVER_ERROR = 'API_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'API_SERVICE_UNAVAILABLE',
  CONTENT_FILTER = 'API_CONTENT_FILTER',
  QUOTA_EXCEEDED = 'API_QUOTA_EXCEEDED'
}

class APIError extends BaseError {
  constructor(
    code: APIErrorCode, 
    provider: string,
    httpStatus?: number,
    context?: any
  ) {
    const errorInfo = this.getErrorInfo(code);
    super();
    
    this.code = code;
    this.message = `${provider}: ${errorInfo.message}`;
    this.userMessage = errorInfo.userMessage;
    this.category = ErrorCategory.API;
    this.severity = errorInfo.severity;
    this.context = { ...context, provider, httpStatus };
    this.suggestions = errorInfo.suggestions;
    this.recoverable = errorInfo.recoverable;
  }
  
  private getErrorInfo(code: APIErrorCode) {
    const errorMap = {
      [APIErrorCode.UNAUTHORIZED]: {
        message: 'API authentication failed',
        userMessage: 'AIとの接続に問題があります🔐\n保護者の方に設定を確認してもらってください',
        severity: ErrorSeverity.HIGH,
        suggestions: [
          '保護者の方にAPI設定を確認してもらってください',
          'アプリを再起動してみてください'
        ],
        recoverable: false
      },
      [APIErrorCode.RATE_LIMIT]: {
        message: 'API rate limit exceeded',
        userMessage: 'たくさん質問してくれてありがとう！⏱️\n少し休憩してからまた話しかけてね',
        severity: ErrorSeverity.MEDIUM,
        suggestions: [
          '5分ほど待ってから再度お試しください',
          '文字入力で質問してみてください'
        ],
        recoverable: true
      },
      [APIErrorCode.SERVER_ERROR]: {
        message: 'API server error',
        userMessage: 'AIが一時的に調子悪いみたい🤖💭\nちょっと待ってから試してみてね',
        severity: ErrorSeverity.HIGH,
        suggestions: [
          'しばらく待ってから再度お試しください',
          '別の質問をしてみてください'
        ],
        recoverable: true
      },
      [APIErrorCode.CONTENT_FILTER]: {
        message: 'Content filtered by AI safety system',
        userMessage: 'その質問には答えられません😅\n別のことを聞いてみてね',
        severity: ErrorSeverity.LOW,
        suggestions: [
          '違う話題について質問してみてください',
          '学習や趣味について聞いてみてください'
        ],
        recoverable: true
      }
    };
    
    return errorMap[code];
  }
}
```

#### 音声関連エラー
```typescript
enum SpeechErrorCode {
  NOT_SUPPORTED = 'SPEECH_NOT_SUPPORTED',
  MICROPHONE_DENIED = 'SPEECH_MICROPHONE_DENIED',
  MICROPHONE_NOT_FOUND = 'SPEECH_MICROPHONE_NOT_FOUND',
  RECOGNITION_FAILED = 'SPEECH_RECOGNITION_FAILED',
  SYNTHESIS_FAILED = 'SPEECH_SYNTHESIS_FAILED',
  AUDIO_PLAYBACK_FAILED = 'SPEECH_AUDIO_PLAYBACK_FAILED',
  LANGUAGE_NOT_SUPPORTED = 'SPEECH_LANGUAGE_NOT_SUPPORTED'
}

class SpeechError extends BaseError {
  constructor(code: SpeechErrorCode, context?: any) {
    const errorInfo = this.getErrorInfo(code);
    super();
    
    this.code = code;
    this.message = errorInfo.message;
    this.userMessage = errorInfo.userMessage;
    this.category = ErrorCategory.SPEECH;
    this.severity = errorInfo.severity;
    this.context = context;
    this.suggestions = errorInfo.suggestions;
    this.recoverable = errorInfo.recoverable;
  }
  
  private getErrorInfo(code: SpeechErrorCode) {
    const errorMap = {
      [SpeechErrorCode.MICROPHONE_DENIED]: {
        message: 'Microphone access denied',
        userMessage: 'マイクの使用が許可されていません🎤\n設定で許可してから使ってね',
        severity: ErrorSeverity.HIGH,
        suggestions: [
          'ブラウザでマイクの使用を許可してください',
          '文字で質問することもできます',
          '保護者の方に設定を確認してもらってください'
        ],
        recoverable: true
      },
      [SpeechErrorCode.MICROPHONE_NOT_FOUND]: {
        message: 'Microphone not found',
        userMessage: 'マイクが見つかりません🔍\nマイクが接続されているか確認してね',
        severity: ErrorSeverity.HIGH,
        suggestions: [
          'マイクが正しく接続されているか確認してください',
          'ヘッドセットやイヤホンのマイクを試してください',
          '文字入力で質問することもできます'
        ],
        recoverable: true
      },
      [SpeechErrorCode.RECOGNITION_FAILED]: {
        message: 'Speech recognition failed',
        userMessage: '声が聞き取れませんでした👂\nもう一度ゆっくり話してみてね',
        severity: ErrorSeverity.MEDIUM,
        suggestions: [
          'もう一度ゆっくりはっきりと話してください',
          '静かな場所で話してみてください',
          '文字で質問することもできます'
        ],
        recoverable: true
      },
      [SpeechErrorCode.NOT_SUPPORTED]: {
        message: 'Speech feature not supported',
        userMessage: 'このブラウザでは音声機能が使えません💻\n文字で質問してみてね',
        severity: ErrorSeverity.MEDIUM,
        suggestions: [
          'Chrome、Firefox、Safariなどのブラウザをお試しください',
          '文字入力で質問することができます',
          'ブラウザを最新版に更新してください'
        ],
        recoverable: false
      }
    };
    
    return errorMap[code];
  }
}
```

## エラーハンドリングシステム

### エラーハンドラー基盤
```typescript
interface ErrorHandler {
  canHandle(error: Error): boolean;
  handle(error: Error): Promise<ErrorHandleResult>;
  priority: number;
}

interface ErrorHandleResult {
  handled: boolean;
  recovered: boolean;
  userNotified: boolean;
  fallbackAction?: () => Promise<void>;
  retryAction?: () => Promise<void>;
}

class ErrorHandlingSystem {
  private handlers: ErrorHandler[] = [];
  private errorLog: ErrorLogEntry[] = [];
  private maxLogSize = 100;
  
  constructor() {
    this.registerDefaultHandlers();
  }
  
  registerHandler(handler: ErrorHandler): void {
    this.handlers.push(handler);
    this.handlers.sort((a, b) => b.priority - a.priority);
  }
  
  async handleError(error: Error, context?: any): Promise<void> {
    // エラーログ記録
    this.logError(error, context);
    
    // 適切なハンドラーを見つけて処理
    for (const handler of this.handlers) {
      if (handler.canHandle(error)) {
        try {
          const result = await handler.handle(error);
          if (result.handled) {
            return;
          }
        } catch (handlerError) {
          console.error('Error handler failed:', handlerError);
        }
      }
    }
    
    // 全てのハンドラーで処理できない場合のフォールバック
    await this.handleUnknownError(error);
  }
  
  private logError(error: Error, context?: any): void {
    const logEntry: ErrorLogEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      context,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    this.errorLog.unshift(logEntry);
    
    // ログサイズ制限
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize);
    }
    
    // 重大エラーの場合は即座に報告
    if (error instanceof BaseError && error.severity === ErrorSeverity.CRITICAL) {
      this.reportCriticalError(logEntry);
    }
  }
}
```

### 具体的エラーハンドラー

#### ネットワークエラーハンドラー
```typescript
class NetworkErrorHandler implements ErrorHandler {
  priority = 90;
  private retryAttempts = new Map<string, number>();
  private maxRetries = 3;
  
  canHandle(error: Error): boolean {
    return error instanceof NetworkError;
  }
  
  async handle(error: NetworkError): Promise<ErrorHandleResult> {
    const errorId = this.getErrorId(error);
    const attempts = this.retryAttempts.get(errorId) || 0;
    
    switch (error.code) {
      case NetworkErrorCode.CONNECTION_FAILED:
        return this.handleConnectionFailed(error, attempts);
        
      case NetworkErrorCode.TIMEOUT:
        return this.handleTimeout(error, attempts);
        
      case NetworkErrorCode.OFFLINE:
        return this.handleOffline(error);
        
      default:
        return { handled: false, recovered: false, userNotified: false };
    }
  }
  
  private async handleConnectionFailed(
    error: NetworkError, 
    attempts: number
  ): Promise<ErrorHandleResult> {
    if (attempts < this.maxRetries) {
      // 指数バックオフで再試行
      const delay = Math.pow(2, attempts) * 1000;
      await this.sleep(delay);
      
      this.retryAttempts.set(this.getErrorId(error), attempts + 1);
      
      return {
        handled: true,
        recovered: false,
        userNotified: false,
        retryAction: () => this.retryOriginalAction(error)
      };
    }
    
    // 最大試行回数に達した場合
    this.showUserError(error);
    this.enableOfflineMode();
    
    return {
      handled: true,
      recovered: false,
      userNotified: true,
      fallbackAction: () => this.switchToTextMode()
    };
  }
  
  private async handleTimeout(
    error: NetworkError, 
    attempts: number
  ): Promise<ErrorHandleResult> {
    if (attempts < 2) {
      // タイムアウト時間を延長して再試行
      this.increaseTimeout();
      this.retryAttempts.set(this.getErrorId(error), attempts + 1);
      
      return {
        handled: true,
        recovered: false,
        userNotified: false,
        retryAction: () => this.retryWithLongerTimeout(error)
      };
    }
    
    this.showUserError(error);
    return {
      handled: true,
      recovered: false,
      userNotified: true,
      fallbackAction: () => this.switchToTextMode()
    };
  }
  
  private async enableOfflineMode(): Promise<void> {
    // オフラインモードの有効化
    const offlineService = new OfflineService();
    await offlineService.enable();
  }
  
  private async switchToTextMode(): Promise<void> {
    // 音声機能を無効化してテキスト入力のみに切り替え
    const uiController = UIController.getInstance();
    uiController.switchToTextOnlyMode();
  }
}
```

#### API エラーハンドラー
```typescript
class APIErrorHandler implements ErrorHandler {
  priority = 85;
  private failoverManager: FailoverManager;
  
  constructor() {
    this.failoverManager = new FailoverManager();
  }
  
  canHandle(error: Error): boolean {
    return error instanceof APIError;
  }
  
  async handle(error: APIError): Promise<ErrorHandleResult> {
    switch (error.code) {
      case APIErrorCode.RATE_LIMIT:
        return this.handleRateLimit(error);
        
      case APIErrorCode.SERVER_ERROR:
      case APIErrorCode.SERVICE_UNAVAILABLE:
        return this.handleServerError(error);
        
      case APIErrorCode.UNAUTHORIZED:
        return this.handleUnauthorized(error);
        
      case APIErrorCode.CONTENT_FILTER:
        return this.handleContentFilter(error);
        
      default:
        return { handled: false, recovered: false, userNotified: false };
    }
  }
  
  private async handleRateLimit(error: APIError): Promise<ErrorHandleResult> {
    // 別のプロバイダーに切り替え
    const switchResult = await this.failoverManager.switchProvider();
    
    if (switchResult.success) {
      return {
        handled: true,
        recovered: true,
        userNotified: false,
        retryAction: () => this.retryWithNewProvider(error)
      };
    }
    
    // 全プロバイダーがレート制限の場合
    this.showRateLimitMessage();
    this.scheduleRetry(300000); // 5分後に再試行
    
    return {
      handled: true,
      recovered: false,
      userNotified: true,
      fallbackAction: () => this.enableLimitedMode()
    };
  }
  
  private async handleServerError(error: APIError): Promise<ErrorHandleResult> {
    // サーバーエラーの場合は即座にフェイルオーバー
    const switchResult = await this.failoverManager.switchProvider();
    
    if (switchResult.success) {
      return {
        handled: true,
        recovered: true,
        userNotified: false,
        retryAction: () => this.retryWithNewProvider(error)
      };
    }
    
    // 全プロバイダーが利用不可の場合
    this.showServerErrorMessage();
    
    return {
      handled: true,
      recovered: false,
      userNotified: true,
      fallbackAction: () => this.enableOfflineHelp()
    };
  }
  
  private async enableLimitedMode(): Promise<void> {
    // 制限モード：キャッシュされた回答のみ使用
    const cacheService = CacheService.getInstance();
    cacheService.enableOfflineMode();
  }
  
  private async enableOfflineHelp(): Promise<void> {
    // オフラインヘルプ：事前定義された回答を使用
    const offlineHelp = new OfflineHelpService();
    offlineHelp.activate();
  }
}
```

#### 音声エラーハンドラー
```typescript
class SpeechErrorHandler implements ErrorHandler {
  priority = 80;
  
  canHandle(error: Error): boolean {
    return error instanceof SpeechError;
  }
  
  async handle(error: SpeechError): Promise<ErrorHandleResult> {
    switch (error.code) {
      case SpeechErrorCode.MICROPHONE_DENIED:
        return this.handleMicrophoneDenied(error);
        
      case SpeechErrorCode.MICROPHONE_NOT_FOUND:
        return this.handleMicrophoneNotFound(error);
        
      case SpeechErrorCode.RECOGNITION_FAILED:
        return this.handleRecognitionFailed(error);
        
      case SpeechErrorCode.NOT_SUPPORTED:
        return this.handleNotSupported(error);
        
      default:
        return { handled: false, recovered: false, userNotified: false };
    }
  }
  
  private async handleMicrophoneDenied(error: SpeechError): Promise<ErrorHandleResult> {
    // マイクアクセス許可のガイダンスを表示
    this.showMicrophonePermissionGuide();
    
    // テキスト入力モードに自動切り替え
    await this.switchToTextInput();
    
    return {
      handled: true,
      recovered: false,
      userNotified: true,
      fallbackAction: () => this.enableTextInputMode()
    };
  }
  
  private async handleRecognitionFailed(error: SpeechError): Promise<ErrorHandleResult> {
    // 認識失敗の場合は数回再試行
    const retryCount = error.context?.retryCount || 0;
    
    if (retryCount < 2) {
      this.showRetryMessage();
      
      return {
        handled: true,
        recovered: false,
        userNotified: true,
        retryAction: () => this.retryVoiceRecognition(error, retryCount + 1)
      };
    }
    
    // 再試行上限に達した場合はテキスト入力を提案
    this.showTextInputSuggestion();
    
    return {
      handled: true,
      recovered: false,
      userNotified: true,
      fallbackAction: () => this.enableTextInputMode()
    };
  }
  
  private showMicrophonePermissionGuide(): void {
    const modal = new PermissionGuideModal({
      title: 'マイクの使用許可が必要です',
      content: `
        <div class="permission-guide">
          <div class="step">
            <span class="step-number">1</span>
            <p>ブラウザの設定でマイクの使用を許可してください</p>
          </div>
          <div class="step">
            <span class="step-number">2</span>
            <p>ページを再読み込みしてから再度お試しください</p>
          </div>
          <div class="alternative">
            <p>音声が使えない場合は、文字で質問することもできます</p>
          </div>
        </div>
      `,
      actions: [
        {
          text: '文字で質問する',
          action: () => this.switchToTextInput()
        },
        {
          text: '再度試す',
          action: () => this.retryMicrophoneAccess()
        }
      ]
    });
    
    modal.show();
  }
}
```

## ユーザー向けエラー表示

### エラーメッセージコンポーネント
```typescript
interface ErrorMessageConfig {
  type: 'toast' | 'modal' | 'inline';
  duration?: number;
  dismissible?: boolean;
  showIcon?: boolean;
  showSuggestions?: boolean;
}

class ErrorMessageDisplay {
  static show(error: BaseError, config: ErrorMessageConfig = {}) {
    const defaultConfig = {
      type: 'toast' as const,
      duration: 5000,
      dismissible: true,
      showIcon: true,
      showSuggestions: true
    };
    
    const finalConfig = { ...defaultConfig, ...config };
    
    switch (finalConfig.type) {
      case 'toast':
        this.showToast(error, finalConfig);
        break;
      case 'modal':
        this.showModal(error, finalConfig);
        break;
      case 'inline':
        this.showInline(error, finalConfig);
        break;
    }
  }
  
  private static showToast(error: BaseError, config: ErrorMessageConfig) {
    const toast = document.createElement('div');
    toast.className = `error-toast severity-${error.severity}`;
    
    toast.innerHTML = `
      <div class="toast-content">
        ${config.showIcon ? this.getErrorIcon(error.category) : ''}
        <div class="toast-message">
          <div class="message-text">${error.userMessage}</div>
          ${config.showSuggestions && error.suggestions ? 
            `<div class="suggestions">
              ${error.suggestions.map(s => `<div class="suggestion">💡 ${s}</div>`).join('')}
             </div>` : ''
          }
        </div>
        ${config.dismissible ? '<button class="toast-close" aria-label="閉じる">×</button>' : ''}
      </div>
    `;
    
    document.body.appendChild(toast);
    
    // アニメーション
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });
    
    // 自動削除
    if (config.duration && config.duration > 0) {
      setTimeout(() => {
        this.removeToast(toast);
      }, config.duration);
    }
    
    // 手動削除
    if (config.dismissible) {
      toast.querySelector('.toast-close')?.addEventListener('click', () => {
        this.removeToast(toast);
      });
    }
  }
  
  private static getErrorIcon(category: ErrorCategory): string {
    const iconMap = {
      [ErrorCategory.NETWORK]: '📡',
      [ErrorCategory.API]: '🤖',
      [ErrorCategory.SPEECH]: '🎤',
      [ErrorCategory.STORAGE]: '💾',
      [ErrorCategory.PERMISSION]: '🔐',
      [ErrorCategory.BROWSER]: '🌐',
      [ErrorCategory.USER_INPUT]: '✍️',
      [ErrorCategory.UNKNOWN]: '❓'
    };
    
    return iconMap[category] || '⚠️';
  }
}
```

### CSS スタイル
```css
/* エラートースト */
.error-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  max-width: 400px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  padding: 16px;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  z-index: 1000;
  border-left: 4px solid;
}

.error-toast.show {
  transform: translateX(0);
}

.error-toast.severity-low {
  border-left-color: #f39c12;
}

.error-toast.severity-medium {
  border-left-color: #e67e22;
}

.error-toast.severity-high {
  border-left-color: #e74c3c;
}

.error-toast.severity-critical {
  border-left-color: #c0392b;
  background: #fdf2f2;
}

.toast-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.toast-message {
  flex: 1;
}

.message-text {
  font-size: 1rem;
  color: #2c3e50;
  margin-bottom: 8px;
  line-height: 1.4;
}

.suggestions {
  margin-top: 8px;
}

.suggestion {
  font-size: 0.875rem;
  color: #7f8c8d;
  margin: 4px 0;
  padding: 4px 8px;
  background: #f8f9fa;
  border-radius: 6px;
}

.toast-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #95a5a6;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-close:hover {
  color: #2c3e50;
}

/* モバイル対応 */
@media (max-width: 767px) {
  .error-toast {
    top: auto;
    bottom: 20px;
    left: 20px;
    right: 20px;
    max-width: none;
    transform: translateY(100%);
  }
  
  .error-toast.show {
    transform: translateY(0);
  }
}
```

## 復旧・フォールバック機能

### 自動復旧マネージャー
```typescript
class RecoveryManager {
  private recoveryStrategies: Map<string, RecoveryStrategy[]>;
  
  constructor() {
    this.recoveryStrategies = new Map();
    this.setupDefaultStrategies();
  }
  
  async attemptRecovery(error: BaseError): Promise<boolean> {
    const strategies = this.recoveryStrategies.get(error.code) || [];
    
    for (const strategy of strategies) {
      try {
        const result = await strategy.execute(error);
        if (result.success) {
          console.log(`Recovery successful with strategy: ${strategy.name}`);
          return true;
        }
      } catch (recoveryError) {
        console.warn(`Recovery strategy ${strategy.name} failed:`, recoveryError);
      }
    }
    
    return false;
  }
  
  private setupDefaultStrategies(): void {
    // ネットワークエラー復旧
    this.recoveryStrategies.set(NetworkErrorCode.CONNECTION_FAILED, [
      new RetryWithBackoffStrategy(),
      new SwitchToOfflineModeStrategy(),
      new EnableTextOnlyModeStrategy()
    ]);
    
    // API エラー復旧
    this.recoveryStrategies.set(APIErrorCode.RATE_LIMIT, [
      new SwitchProviderStrategy(),
      new EnableCacheOnlyModeStrategy(),
      new DelayedRetryStrategy()
    ]);
    
    // 音声エラー復旧
    this.recoveryStrategies.set(SpeechErrorCode.MICROPHONE_DENIED, [
      new SwitchToTextInputStrategy(),
      new ShowPermissionGuideStrategy()
    ]);
  }
}

interface RecoveryStrategy {
  name: string;
  execute(error: BaseError): Promise<{ success: boolean; message?: string }>;
}

class SwitchProviderStrategy implements RecoveryStrategy {
  name = 'Switch LLM Provider';
  
  async execute(error: BaseError): Promise<{ success: boolean; message?: string }> {
    const llmManager = LLMManager.getInstance();
    const currentProvider = llmManager.getCurrentProvider();
    const availableProviders = llmManager.getAvailableProviders();
    
    // 現在以外のプロバイダーを試行
    for (const provider of availableProviders) {
      if (provider !== currentProvider) {
        try {
          await llmManager.switchProvider(provider);
          return { success: true, message: `Switched to ${provider}` };
        } catch (switchError) {
          console.warn(`Failed to switch to ${provider}:`, switchError);
        }
      }
    }
    
    return { success: false, message: 'No alternative providers available' };
  }
}
```

---

**作成日**: 2024年6月11日  
**設計者**: エラーハンドリングチーム  
**対象ユーザー**: 6-12歳の子供 + 保護者  
**レビュー**: セキュリティ・UX承認済み