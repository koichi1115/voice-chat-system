# 視覚デザイン設計 - 子供向けUI

## デザインコンセプト

### テーマ: 「やさしい友達」
- **親しみやすさ**: 子供が安心して使える温かみのあるデザイン
- **わくわく感**: 学習への好奇心を刺激するカラフルで楽しいUI
- **安心感**: 保護者も安心できる清潔で健全なビジュアル

### ペルソナ設定
- **プライマリ**: 6-12歳の子供（小学生）
- **セカンダリ**: 保護者（30-40代）
- **利用シーン**: 自宅での学習・遊び時間

## カラーパレット

### メインカラー
```css
/* プライマリカラー - 親しみやすい青 */
--primary-blue: #4A90E2;      /* メインボタン、ヘッダー */
--primary-blue-light: #7BB3F0; /* ホバー状態 */
--primary-blue-dark: #357ABD;  /* アクティブ状態 */

/* セカンダリカラー - 温かみのある色 */
--secondary-green: #7ED321;    /* 成功、正常状態 */
--secondary-orange: #F5A623;   /* 注意、進行中 */
--secondary-purple: #BD10E0;   /* 特別な機能 */
--secondary-pink: #FF69B4;     /* キャラクター要素 */
```

### 背景・テキストカラー
```css
/* 背景色 */
--bg-primary: #FFFFFF;         /* メイン背景 */
--bg-secondary: #F8F9FA;       /* サブ背景 */
--bg-light: #E8F4FD;          /* 薄い青背景 */
--bg-warm: #FFF8E1;           /* 温かみのある背景 */

/* テキスト色 */
--text-primary: #2C3E50;       /* メインテキスト */
--text-secondary: #7F8C8D;     /* サブテキスト */
--text-light: #FFFFFF;         /* 明るい背景用テキスト */
--text-error: #E74C3C;         /* エラーテキスト */
```

### 状態カラー
```css
/* システム状態 */
--success: #27AE60;            /* 成功 */
--warning: #F39C12;            /* 警告 */
--error: #E74C3C;              /* エラー */
--info: #3498DB;               /* 情報 */

/* 音声状態 */
--recording: #FF4757;          /* 録音中 */
--processing: #FFA502;         /* 処理中 */
--speaking: #2ED573;           /* 話し中 */
--ready: #5352ED;              /* 準備完了 */
```

## タイポグラフィ

### フォントファミリー
```css
/* プライマリフォント - 読みやすい日本語フォント */
font-family: 
  'Hiragino Sans', 
  'ヒラギノ角ゴシック', 
  'Hiragino Kaku Gothic ProN', 
  'Noto Sans JP', 
  'メイリオ', 
  'Meiryo', 
  sans-serif;

/* セカンダリフォント - 英数字用 */
font-family: 
  'Inter', 
  'Segoe UI', 
  'Roboto', 
  'Helvetica Neue', 
  Arial, 
  sans-serif;
```

### フォントサイズスケール
```css
/* ヘッダー・タイトル */
--font-size-h1: 2.5rem;        /* 40px - メインタイトル */
--font-size-h2: 2rem;          /* 32px - セクションタイトル */
--font-size-h3: 1.5rem;        /* 24px - サブタイトル */

/* ボディテキスト */
--font-size-large: 1.25rem;    /* 20px - 重要なテキスト */
--font-size-base: 1rem;        /* 16px - 標準テキスト */
--font-size-small: 0.875rem;   /* 14px - 補助テキスト */
--font-size-xs: 0.75rem;       /* 12px - キャプション */

/* ボタンテキスト */
--font-size-button-large: 1.5rem;  /* 24px - メインボタン */
--font-size-button-base: 1.125rem; /* 18px - 標準ボタン */
--font-size-button-small: 1rem;    /* 16px - 小ボタン */
```

### フォントウェイト
```css
--font-weight-light: 300;      /* 軽い */
--font-weight-normal: 400;     /* 標準 */
--font-weight-medium: 500;     /* 中程度 */
--font-weight-semibold: 600;   /* セミボールド */
--font-weight-bold: 700;       /* ボールド */
```

## アイコンシステム

### アイコンライブラリ
- **メイン**: Material Design Icons
- **補助**: Font Awesome (子供向けアイコン)
- **カスタム**: 独自キャラクターアイコン

### アイコンサイズ
```css
--icon-xs: 16px;               /* 小さなアイコン */
--icon-sm: 20px;               /* 小アイコン */
--icon-base: 24px;             /* 標準アイコン */
--icon-lg: 32px;               /* 大アイコン */
--icon-xl: 48px;               /* 特大アイコン */
--icon-hero: 96px;             /* ヒーローアイコン */
```

### 主要アイコン定義
```css
/* 基本機能 */
.icon-microphone::before { content: "🎤"; }
.icon-speaker::before { content: "🔊"; }
.icon-stop::before { content: "⏹️"; }
.icon-play::before { content: "▶️"; }
.icon-pause::before { content: "⏸️"; }

/* 状態表示 */
.icon-recording::before { content: "🔴"; }
.icon-thinking::before { content: "🤔"; }
.icon-speaking::before { content: "💬"; }
.icon-ready::before { content: "✅"; }

/* キャラクター */
.icon-robot::before { content: "🤖"; }
.icon-child::before { content: "👧"; }
.icon-teacher::before { content: "👩‍🏫"; }

/* ナビゲーション */
.icon-settings::before { content: "⚙️"; }
.icon-history::before { content: "📚"; }
.icon-help::before { content: "❓"; }
.icon-profile::before { content: "👤"; }
```

## コンポーネントデザイン

### ボタンスタイル

#### メインボタン（音声入力）
```css
.btn-voice-main {
  /* サイズ */
  width: 200px;
  height: 200px;
  border-radius: 50%;
  
  /* カラー */
  background: linear-gradient(135deg, #4A90E2, #7BB3F0);
  color: white;
  border: 4px solid #FFFFFF;
  box-shadow: 0 8px 24px rgba(74, 144, 226, 0.3);
  
  /* テキスト */
  font-size: 1.5rem;
  font-weight: 600;
  
  /* アニメーション */
  transition: all 0.3s ease;
  transform: scale(1);
}

.btn-voice-main:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 32px rgba(74, 144, 226, 0.4);
}

.btn-voice-main:active {
  transform: scale(0.95);
}

.btn-voice-main.recording {
  background: linear-gradient(135deg, #FF4757, #FF6B7A);
  animation: pulse-recording 1.5s infinite;
}

@keyframes pulse-recording {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}
```

#### セカンダリボタン
```css
.btn-secondary {
  /* サイズ */
  padding: 12px 24px;
  border-radius: 24px;
  
  /* カラー */
  background: #F8F9FA;
  color: #2C3E50;
  border: 2px solid #E9ECEF;
  
  /* テキスト */
  font-size: 1rem;
  font-weight: 500;
  
  /* エフェクト */
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #E9ECEF;
  transform: translateY(-2px);
}
```

### カードコンポーネント
```css
.card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid #F1F3F4;
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2C3E50;
}

.card-body {
  font-size: 1rem;
  line-height: 1.6;
  color: #7F8C8D;
}
```

### 状態インジケーター
```css
.status-indicator {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  gap: 8px;
}

.status-ready {
  background: #E8F5E8;
  color: #27AE60;
}

.status-recording {
  background: #FFEBEE;
  color: #FF4757;
  animation: blink 1s infinite;
}

.status-processing {
  background: #FFF3E0;
  color: #F39C12;
}

.status-speaking {
  background: #E3F2FD;
  color: #2196F3;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.5; }
}
```

## レイアウトシステム

### グリッドシステム
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.grid {
  display: grid;
  gap: 24px;
}

.grid-main {
  grid-template-areas:
    "header header header"
    "sidebar content aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

/* タブレット対応 */
@media (max-width: 1023px) {
  .grid-main {
    grid-template-areas:
      "header"
      "content"
      "footer";
    grid-template-columns: 1fr;
  }
}
```

### スペーシングシステム
```css
/* 8px ベースのスペーシング */
--space-xs: 4px;     /* 0.25rem */
--space-sm: 8px;     /* 0.5rem */
--space-base: 16px;  /* 1rem */
--space-lg: 24px;    /* 1.5rem */
--space-xl: 32px;    /* 2rem */
--space-2xl: 48px;   /* 3rem */
--space-3xl: 64px;   /* 4rem */
```

## アニメーションシステム

### 基本アニメーション
```css
/* フェードイン */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* スケールイン */
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

/* スライドイン */
@keyframes slideInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 音声波形アニメーション */
@keyframes waveform {
  0%, 100% { height: 20px; }
  50% { height: 40px; }
}

.waveform-bar {
  width: 4px;
  background: #4A90E2;
  margin: 0 2px;
  border-radius: 2px;
  animation: waveform 1.5s infinite ease-in-out;
}

.waveform-bar:nth-child(2) { animation-delay: 0.1s; }
.waveform-bar:nth-child(3) { animation-delay: 0.2s; }
.waveform-bar:nth-child(4) { animation-delay: 0.3s; }
```

### タイミング関数
```css
--ease-out-quad: cubic-bezier(0.25, 0.46, 0.45, 0.94);
--ease-out-cubic: cubic-bezier(0.215, 0.61, 0.355, 1);
--ease-in-out-quart: cubic-bezier(0.77, 0, 0.175, 1);
```

## キャラクターデザイン

### AIアシスタントキャラクター
```css
.character-ai {
  /* ベースデザイン */
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  /* 顔の表現 */
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* 影とエフェクト */
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.character-ai::before {
  content: "🤖";
  font-size: 2rem;
}

.character-ai.thinking {
  animation: thinking-pulse 2s infinite;
}

.character-ai.speaking {
  animation: speaking-bounce 1s infinite;
}

@keyframes thinking-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); opacity: 0.8; }
}

@keyframes speaking-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
```

## レスポンシブデザイン

### ブレークポイント
```css
/* デスクトップファースト */
@media (max-width: 1199px) { /* Large Desktop */ }
@media (max-width: 991px) { /* Desktop */ }
@media (max-width: 767px) { /* Tablet */ }
@media (max-width: 575px) { /* Mobile */ }
```

### モバイル最適化
```css
/* タッチターゲットサイズ */
.touch-target {
  min-width: 44px;
  min-height: 44px;
  padding: 12px;
}

/* モバイル用ボタン */
@media (max-width: 767px) {
  .btn-voice-main {
    width: 160px;
    height: 160px;
  }
  
  .container {
    padding: 0 16px;
  }
  
  .card {
    padding: 16px;
  }
}
```

## テーマバリエーション

### ダークモード（将来実装）
```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1a1a1a;
    --bg-secondary: #2d2d2d;
    --text-primary: #ffffff;
    --text-secondary: #cccccc;
  }
}
```

### ハイコントラストモード
```css
@media (prefers-contrast: high) {
  :root {
    --primary-blue: #0066cc;
    --text-primary: #000000;
    --bg-primary: #ffffff;
  }
}
```

---

**作成日**: 2024年6月11日  
**デザイナー**: UI/UXチーム  
**承認**: プロジェクトマネージャー  
**更新**: デザインシステム確定後