# アクセシビリティ設計

## アクセシビリティ設計原則

### WCAG 2.1 準拠レベル
- **目標レベル**: AA準拠
- **最小要件**: A準拠
- **将来目標**: AAA準拠（部分的）

### 4つの基本原則（POUR）
1. **Perceivable（知覚可能）**: 情報とUIコンポーネントが知覚可能
2. **Operable（操作可能）**: UIコンポーネントとナビゲーションが操作可能
3. **Understandable（理解可能）**: 情報とUIの操作が理解可能
4. **Robust（堅牢）**: 支援技術を含む様々なユーザーエージェントで解釈可能

## 対象ユーザー

### 主要対象
- **視覚障害者**: 全盲、弱視、色覚特性
- **聴覚障害者**: 難聴、聴覚処理障害
- **運動障害者**: 手の動きが制限される方
- **認知障害者**: 学習障害、注意欠陥、記憶障害
- **高齢者**: 複合的な障害を持つ方

### 子供特有の配慮
- **読字困難**: ひらがな・カタカナ中心の表示
- **注意力**: 短い集中時間への配慮
- **操作スキル**: 簡単で直感的な操作
- **理解力**: 年齢に応じた言葉遣い

## 知覚可能（Perceivable）

### 1.1 代替テキスト

#### 画像・アイコンの代替テキスト
```html
<!-- 機能的な画像 -->
<button aria-label="音声で質問する">
  <img src="microphone.svg" alt="" role="presentation">
  🎤 話しかける
</button>

<!-- 装飾的な画像 -->
<img src="decoration.svg" alt="" role="presentation">

<!-- 情報を含む画像 -->
<img src="waveform.svg" alt="音声レベル: 中程度">

<!-- 複雑な情報 -->
<img src="chart.svg" alt="質問回数グラフ" 
     aria-describedby="chart-description">
<div id="chart-description">
  過去7日間の質問回数: 月曜3回、火曜5回、水曜2回...
</div>
```

#### 音声コンテンツの代替
```html
<!-- 音声出力の視覚化 -->
<div class="speech-output" aria-live="polite">
  <div class="speech-text">恐竜は昔地球にいた大きな動物です...</div>
  <div class="speech-controls">
    <button aria-label="音声を一時停止">⏸️</button>
    <button aria-label="音声をスキップ">⏭️</button>
  </div>
</div>

<!-- 音声入力の視覚フィードバック -->
<div class="speech-input" aria-live="assertive">
  <div class="status">🎤 聞いています...</div>
  <div class="transcript">恐竜について教えて</div>
</div>
```

### 1.2 時間ベースメディア

#### 音声コンテンツのキャプション
```html
<!-- 音声出力のテキスト表示 -->
<div class="audio-transcript" role="region" aria-label="AI回答テキスト">
  <p class="current-speech">恐竜は約2億年前から6600万年前まで地球にいた大きな爬虫類です。</p>
</div>

<!-- 音声コントロール -->
<div class="audio-controls" role="group" aria-label="音声再生コントロール">
  <button aria-label="再生/一時停止" aria-pressed="false">
    <span aria-hidden="true">⏸️</span>
  </button>
  <button aria-label="音量調整">🔊</button>
  <input type="range" aria-label="音量" min="0" max="100" value="80">
</div>
```

### 1.3 適応可能

#### 構造化マークアップ
```html
<!-- セマンティックな構造 */
<main role="main" aria-label="音声チャット">
  <header role="banner">
    <h1>音声チャット</h1>
    <nav role="navigation" aria-label="メインナビゲーション">
      <ul>
        <li><a href="#settings" aria-current="page">設定</a></li>
        <li><a href="#history">履歴</a></li>
        <li><a href="#help">ヘルプ</a></li>
      </ul>
    </nav>
  </header>
  
  <section aria-label="音声入力エリア">
    <h2>質問してみよう</h2>
    <button class="voice-button" aria-describedby="voice-instructions">
      🎤 話しかける
    </button>
    <div id="voice-instructions" class="sr-only">
      ボタンを押して音声で質問してください。マイクの使用許可が必要です。
    </div>
  </section>
  
  <section aria-label="会話履歴" aria-live="polite">
    <h2>今までの会話</h2>
    <div class="conversation-log">
      <!-- 会話内容 -->
    </div>
  </section>
</main>
```

#### 読み上げ順序の制御
```html
<!-- タブ順序の指定 -->
<div class="chat-interface">
  <button tabindex="1" class="voice-input">音声入力</button>
  <button tabindex="2" class="text-input">文字入力</button>
  <div tabindex="3" class="response-area" role="log" aria-live="polite">
    <!-- AI回答表示エリア -->
  </div>
  <button tabindex="4" class="settings">設定</button>
</div>
```

### 1.4 判別可能

#### 色のコントラスト
```css
/* WCAG AA準拠: 4.5:1以上のコントラスト比 */
:root {
  /* 高コントラスト色パレット */
  --text-primary: #212529;      /* 背景#FFFFFに対し15.3:1 */
  --text-secondary: #495057;    /* 背景#FFFFFに対し9.7:1 */
  --bg-primary: #FFFFFF;
  --link-color: #0056b3;        /* 背景#FFFFFに対し8.2:1 */
  --button-bg: #007bff;         /* 白文字に対し5.9:1 */
  --error-color: #dc3545;       /* 背景#FFFFFに対し5.9:1 */
  --success-color: #28a745;     /* 背景#FFFFFに対し4.5:1 */
}

/* ハイコントラストモード対応 */
@media (prefers-contrast: high) {
  :root {
    --text-primary: #000000;
    --bg-primary: #FFFFFF;
    --button-bg: #000000;
    --link-color: #0000EE;
  }
  
  .btn-primary {
    background: var(--button-bg);
    color: #FFFFFF;
    border: 2px solid #000000;
  }
}
```

#### 色だけに依存しない情報伝達
```html
<!-- 状態をアイコンとテキストで表現 -->
<div class="status-indicator">
  <span class="status-icon" aria-hidden="true">✅</span>
  <span class="status-text">接続完了</span>
</div>

<div class="status-indicator error">
  <span class="status-icon" aria-hidden="true">❌</span>
  <span class="status-text">エラーが発生しました</span>
</div>

<!-- フォームバリデーション -->
<div class="form-field">
  <label for="username">名前</label>
  <input type="text" id="username" 
         aria-describedby="username-error" 
         aria-invalid="true">
  <div id="username-error" class="error-message">
    <span aria-hidden="true">⚠️</span>
    名前を入力してください
  </div>
</div>
```

#### テキストサイズ調整
```css
/* ユーザー設定によるズーム対応 */
body {
  font-size: 1rem; /* 16px */
  line-height: 1.5;
}

/* 200%拡大まで横スクロールなしで対応 */
@media (min-width: 1280px) {
  .container {
    max-width: none;
    width: 100%;
  }
}

/* 文字サイズ設定対応 */
@media (prefers-reduced-motion: no-preference) {
  html {
    font-size: calc(1rem + 0.5vw);
  }
}
```

## 操作可能（Operable）

### 2.1 キーボード操作

#### 全機能のキーボードアクセス
```javascript
// キーボードショートカット
document.addEventListener('keydown', (e) => {
  switch(e.code) {
    case 'Space':
    case 'Enter':
      if (e.target.classList.contains('voice-button')) {
        e.preventDefault();
        startVoiceInput();
      }
      break;
      
    case 'Escape':
      stopVoiceInput();
      break;
      
    case 'KeyS':
      if (e.ctrlKey) {
        e.preventDefault();
        openSettings();
      }
      break;
      
    case 'KeyH':
      if (e.ctrlKey) {
        e.preventDefault();
        showHelp();
      }
      break;
  }
});
```

#### フォーカス管理
```css
/* 明確なフォーカスインジケーター */
*:focus {
  outline: 3px solid #4A90E2;
  outline-offset: 2px;
}

/* フォーカス時のハイコントラスト */
@media (prefers-contrast: high) {
  *:focus {
    outline: 3px solid #000000;
    background: #FFFF00;
  }
}

/* キーボードフォーカスのみ表示 */
.js-focus-visible *:focus:not(.focus-visible) {
  outline: none;
}
```

#### タブ順序の管理
```html
<!-- ロジカルなタブ順序 -->
<div class="main-interface">
  <h1 tabindex="-1" id="main-heading">音声チャット</h1>
  
  <!-- スキップリンク -->
  <a href="#main-content" class="skip-link">メインコンテンツへスキップ</a>
  
  <nav role="navigation">
    <ul>
      <li><a href="#" tabindex="1">ホーム</a></li>
      <li><a href="#" tabindex="2">設定</a></li>
      <li><a href="#" tabindex="3">ヘルプ</a></li>
    </ul>
  </nav>
  
  <main id="main-content" tabindex="-1">
    <button tabindex="4" class="voice-button">音声入力</button>
    <div tabindex="5" class="conversation" role="log">
      <!-- 会話内容 -->
    </div>
  </main>
</div>
```

### 2.2 発作・身体反応

#### アニメーション制御
```css
/* 動きを減らす設定への対応 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .pulse-animation {
    animation: none;
  }
  
  .slide-transition {
    transform: none !important;
  }
}

/* デフォルトアニメーション */
@media (prefers-reduced-motion: no-preference) {
  .recording-indicator {
    animation: pulse 1.5s ease-in-out infinite;
  }
  
  .slide-in {
    animation: slideIn 0.3s ease-out;
  }
}
```

#### 点滅制御
```css
/* 3回/秒以下の点滅 */
.blink-safe {
  animation: blink-slow 2s infinite;
}

@keyframes blink-slow {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.7; }
}

/* 高頻度点滅の回避 */
.status-error {
  background: #ffebee;
  color: #c62828;
  /* 点滅ではなく色の変化で注意を引く */
}
```

### 2.3 ナビゲーション

#### ページタイトル
```html
<title>音声チャット - 恐竜について | 子供向けAIチャット</title>
```

#### ランドマーク
```html
<body>
  <header role="banner">
    <!-- ページヘッダー -->
  </header>
  
  <nav role="navigation" aria-label="メインナビゲーション">
    <!-- メインナビ -->
  </nav>
  
  <main role="main">
    <!-- メインコンテンツ -->
  </main>
  
  <aside role="complementary" aria-label="補助情報">
    <!-- サイドバー -->
  </aside>
  
  <footer role="contentinfo">
    <!-- フッター -->
  </footer>
</body>
```

#### パンくずリスト
```html
<nav aria-label="パンくずリスト" role="navigation">
  <ol class="breadcrumb">
    <li><a href="/">ホーム</a></li>
    <li><a href="/chat">チャット</a></li>
    <li aria-current="page">恐竜について</li>
  </ol>
</nav>
```

## 理解可能（Understandable）

### 3.1 読みやすさ

#### 言語設定
```html
<html lang="ja">
<head>
  <meta charset="UTF-8">
</head>
<body>
  <!-- 部分的な言語変更 -->
  <p>今日は<span lang="en">AI</span>と話してみよう！</p>
</body>
</html>
```

#### 読み上げの調整
```html
<!-- 読み上げ速度の調整 -->
<div aria-label="ゆっくり読み上げ">
  <p>恐竜<span aria-hidden="true">、</span>は<span aria-hidden="true">、</span>昔<span aria-hidden="true">、</span>地球にいた大きな動物です。</p>
</div>

<!-- 略語の説明 */
<p><abbr title="人工知能">AI</abbr>が質問に答えます。</p>
```

### 3.2 予測可能

#### 一貫したナビゲーション
```html
<!-- 全ページ共通のナビゲーション構造 -->
<nav class="main-nav" role="navigation">
  <ul>
    <li><a href="/" aria-current="page">ホーム</a></li>
    <li><a href="/settings">設定</a></li>
    <li><a href="/history">履歴</a></li>
    <li><a href="/help">ヘルプ</a></li>
  </ul>
</nav>
```

#### コンテキスト変更の予告
```html
<!-- 新しいウィンドウで開くリンク -->
<a href="/help" target="_blank" aria-describedby="external-link-warning">
  ヘルプ
  <span aria-hidden="true">🔗</span>
</a>
<span id="external-link-warning" class="sr-only">
  新しいウィンドウで開きます
</span>

<!-- フォーカス移動の予告 -->
<button onclick="moveFocusToResults()" aria-describedby="focus-change">
  検索実行
</button>
<span id="focus-change" class="sr-only">
  検索結果にフォーカスが移動します
</span>
```

### 3.3 入力サポート

#### エラー識別
```html
<form novalidate>
  <div class="form-group">
    <label for="age">年齢</label>
    <input type="number" id="age" 
           aria-describedby="age-error age-help"
           aria-invalid="true" 
           min="3" max="18">
    <div id="age-help" class="help-text">
      3歳から18歳まで入力できます
    </div>
    <div id="age-error" class="error-message" role="alert">
      年齢は3歳以上で入力してください
    </div>
  </div>
  
  <button type="submit">保存</button>
</form>
```

#### 入力支援
```html
<!-- 音声入力の代替手段 -->
<div class="input-methods">
  <button class="voice-input" aria-describedby="voice-help">
    🎤 音声で質問
  </button>
  <div id="voice-help" class="help-text">
    ボタンを押してから話してください
  </div>
  
  <label for="text-input">または文字で入力：</label>
  <input type="text" id="text-input" 
         placeholder="質問を入力してください"
         aria-describedby="text-help">
  <div id="text-help" class="help-text">
    例：恐竜について教えて
  </div>
</div>
```

## 堅牢（Robust）

### 4.1 互換性

#### 有効なHTML
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>音声チャット</title>
</head>
<body>
  <!-- 正しくネストされた要素 -->
  <main>
    <section>
      <h1>音声チャット</h1>
      <p>質問してください。</p>
    </section>
  </main>
</body>
</html>
```

#### ARIAの適切な使用
```html
<!-- カスタムコンポーネントのARIA -->
<div role="button" 
     tabindex="0"
     aria-pressed="false"
     aria-describedby="voice-status"
     class="voice-toggle"
     onkeydown="handleKeydown(event)"
     onclick="toggleVoice()">
  音声入力
</div>
<div id="voice-status" aria-live="polite">
  準備完了
</div>

<!-- 複雑なウィジェットのARIA -->
<div role="tablist" aria-label="設定カテゴリ">
  <button role="tab" 
          aria-selected="true" 
          aria-controls="general-panel"
          id="general-tab"
          tabindex="0">
    一般設定
  </button>
  <button role="tab" 
          aria-selected="false" 
          aria-controls="audio-panel"
          id="audio-tab"
          tabindex="-1">
    音声設定
  </button>
</div>

<div role="tabpanel" 
     aria-labelledby="general-tab"
     id="general-panel">
  <!-- 一般設定内容 -->
</div>
```

## テスト計画

### 自動テスト
```javascript
// アクセシビリティ自動テスト
describe('Accessibility Tests', () => {
  test('All images have alt text', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      expect(img.hasAttribute('alt')).toBe(true);
    });
  });
  
  test('Form elements have labels', () => {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      const hasLabel = input.labels.length > 0 || 
                      input.hasAttribute('aria-label') ||
                      input.hasAttribute('aria-labelledby');
      expect(hasLabel).toBe(true);
    });
  });
  
  test('Focus order is logical', () => {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    // タブ順序のテスト
  });
});
```

### 手動テスト項目

#### キーボードナビゲーション
- [ ] Tabキーですべての操作可能要素にアクセス可能
- [ ] Shift+Tabで逆順移動可能
- [ ] フォーカスが視覚的に明確
- [ ] Escapeキーで操作中断可能

#### スクリーンリーダー
- [ ] VoiceOver（Mac）での操作確認
- [ ] NVDA（Windows）での操作確認
- [ ] 読み上げ内容が理解可能
- [ ] ライブリージョンが適切に更新

#### 色・コントラスト
- [ ] グレースケールでも情報判別可能
- [ ] ハイコントラストモードで使用可能
- [ ] 色覚特性シミュレーションでテスト

---

**作成日**: 2024年6月11日  
**設計者**: アクセシビリティチーム  
**準拠基準**: WCAG 2.1 AA  
**テスト予定**: 開発完了後・リリース前