# レスポンシブデザイン設計

## レスポンシブ設計原則

### モバイルファースト戦略
1. **最小画面から設計**: 320px幅から開始
2. **プログレッシブエンハンスメント**: 大画面向けに機能追加
3. **タッチファースト**: タッチ操作を前提とした設計
4. **パフォーマンス重視**: 軽量で高速な読み込み

### デバイス優先順位
1. **スマートフォン** (320px-767px) - 最優先
2. **タブレット** (768px-1023px) - 高優先  
3. **デスクトップ** (1024px以上) - 中優先

## ブレークポイント設計

### 主要ブレークポイント
```css
/* Extra Small devices (phones) */
@media (max-width: 575.98px) { 
  /* 320px - 575px */
}

/* Small devices (landscape phones, small tablets) */
@media (min-width: 576px) and (max-width: 767.98px) { 
  /* 576px - 767px */
}

/* Medium devices (tablets) */
@media (min-width: 768px) and (max-width: 991.98px) { 
  /* 768px - 991px */
}

/* Large devices (desktops) */
@media (min-width: 992px) and (max-width: 1199.98px) { 
  /* 992px - 1199px */
}

/* Extra large devices (large desktops) */
@media (min-width: 1200px) { 
  /* 1200px+ */
}
```

### カスタムブレークポイント
```css
/* 音声チャット専用ブレークポイント */
@media (max-width: 480px) { 
  /* 小型スマートフォン */
}

@media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) { 
  /* タブレット横向き */
}

@media (min-width: 1024px) { 
  /* デスクトップ最適化 */
}
```

## レイアウトパターン

### 1. モバイル (320px - 767px)

#### 基本レイアウト
```css
/* モバイル: 単一カラムレイアウト */
.mobile-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 16px;
}

.mobile-header {
  height: 60px;
  padding: 0 16px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.mobile-main {
  flex: 1;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.mobile-footer {
  height: 80px;
  padding: 16px;
  border-top: 1px solid #E9ECEF;
}
```

#### 音声ボタン調整
```css
@media (max-width: 767px) {
  .btn-voice-main {
    width: 140px;
    height: 140px;
    font-size: 1.25rem;
  }
  
  /* 小型デバイス対応 */
  @media (max-width: 380px) {
    .btn-voice-main {
      width: 120px;
      height: 120px;
      font-size: 1.125rem;
    }
  }
}
```

#### ナビゲーション
```css
.mobile-nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: white;
  border-radius: 24px 24px 0 0;
  box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.1);
}

.mobile-nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  text-decoration: none;
  color: #7F8C8D;
  font-size: 0.75rem;
  transition: color 0.3s ease;
}

.mobile-nav-item.active {
  color: #4A90E2;
}

.mobile-nav-icon {
  font-size: 1.5rem;
  margin-bottom: 4px;
}
```

### 2. タブレット (768px - 1023px)

#### レイアウト構造
```css
.tablet-layout {
  display: grid;
  grid-template-areas:
    "header header"
    "main sidebar"
    "footer footer";
  grid-template-columns: 1fr 280px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  gap: 24px;
  padding: 24px;
}

.tablet-header {
  grid-area: header;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tablet-main {
  grid-area: main;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

.tablet-sidebar {
  grid-area: sidebar;
  background: #F8F9FA;
  border-radius: 16px;
  padding: 24px;
}
```

#### 横向き対応
```css
@media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
  .tablet-layout {
    grid-template-areas: "header header header"
                         "sidebar main assistant"
                         "footer footer footer";
    grid-template-columns: 200px 1fr 200px;
  }
  
  .btn-voice-main {
    width: 160px;
    height: 160px;
  }
}
```

### 3. デスクトップ (1024px以上)

#### 大画面レイアウト
```css
.desktop-layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main assistant"
    "footer footer footer";
  grid-template-columns: 250px 1fr 300px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  max-width: 1400px;
  margin: 0 auto;
  gap: 32px;
  padding: 32px;
}

.desktop-main {
  grid-area: main;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  min-height: 600px;
}

.desktop-sidebar {
  grid-area: sidebar;
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.desktop-assistant {
  grid-area: assistant;
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}
```

## コンポーネント対応

### ボタンレスポンシブ対応
```css
/* ベースサイズ（モバイル） */
.btn-responsive {
  padding: 12px 20px;
  font-size: 1rem;
  border-radius: 8px;
  min-height: 44px; /* タッチターゲット最小サイズ */
}

/* タブレット */
@media (min-width: 768px) {
  .btn-responsive {
    padding: 14px 24px;
    font-size: 1.125rem;
    border-radius: 10px;
  }
}

/* デスクトップ */
@media (min-width: 1024px) {
  .btn-responsive {
    padding: 16px 32px;
    font-size: 1.25rem;
    border-radius: 12px;
  }
}

/* メインボタンのレスポンシブ */
.btn-voice-main {
  /* モバイル */
  width: 120px;
  height: 120px;
  font-size: 1rem;
}

@media (min-width: 480px) {
  .btn-voice-main {
    width: 140px;
    height: 140px;
    font-size: 1.125rem;
  }
}

@media (min-width: 768px) {
  .btn-voice-main {
    width: 180px;
    height: 180px;
    font-size: 1.25rem;
  }
}

@media (min-width: 1024px) {
  .btn-voice-main {
    width: 200px;
    height: 200px;
    font-size: 1.5rem;
  }
}
```

### カードコンポーネント
```css
.card-responsive {
  /* モバイル */
  margin: 8px;
  padding: 16px;
  border-radius: 12px;
}

@media (min-width: 768px) {
  .card-responsive {
    margin: 12px;
    padding: 20px;
    border-radius: 16px;
  }
}

@media (min-width: 1024px) {
  .card-responsive {
    margin: 16px;
    padding: 24px;
    border-radius: 20px;
  }
}
```

### テキストレスポンシブ
```css
.text-responsive {
  /* モバイル */
  font-size: 0.875rem;
  line-height: 1.4;
}

@media (min-width: 768px) {
  .text-responsive {
    font-size: 1rem;
    line-height: 1.5;
  }
}

@media (min-width: 1024px) {
  .text-responsive {
    font-size: 1.125rem;
    line-height: 1.6;
  }
}

/* ヘッダーレスポンシブ */
.heading-responsive {
  /* モバイル */
  font-size: 1.5rem;
  margin-bottom: 16px;
}

@media (min-width: 768px) {
  .heading-responsive {
    font-size: 2rem;
    margin-bottom: 20px;
  }
}

@media (min-width: 1024px) {
  .heading-responsive {
    font-size: 2.5rem;
    margin-bottom: 24px;
  }
}
```

## インタラクション調整

### タッチ操作最適化
```css
/* タッチターゲットサイズ */
.touch-friendly {
  min-width: 44px;
  min-height: 44px;
  padding: 12px;
  margin: 8px;
}

/* ホバーエフェクト（タッチデバイス除外） */
@media (hover: hover) {
  .interactive-element:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

/* タッチデバイス用フィードバック */
@media (hover: none) {
  .interactive-element:active {
    transform: scale(0.98);
    opacity: 0.8;
  }
}
```

### スクロール最適化
```css
/* スムーススクロール */
html {
  scroll-behavior: smooth;
}

/* モバイル用スクロール最適化 */
@media (max-width: 767px) {
  .scrollable-content {
    -webkit-overflow-scrolling: touch;
    overflow-y: auto;
    max-height: calc(100vh - 140px);
  }
}
```

## パフォーマンス最適化

### 画像レスポンシブ
```css
.responsive-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}

/* 高解像度ディスプレイ対応 */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .retina-image {
    /* 高解像度画像の指定 */
  }
}
```

### CSS Grid フォールバック
```css
/* CSS Grid サポートチェック */
@supports (display: grid) {
  .grid-container {
    display: grid;
  }
}

/* フォールバック（Flexbox） */
@supports not (display: grid) {
  .grid-container {
    display: flex;
    flex-wrap: wrap;
  }
}
```

## テスト用ブレークポイント

### 開発者ツール用設定
```css
/* iPhone SE */
@media (width: 375px) and (height: 667px) { }

/* iPhone 12 */
@media (width: 390px) and (height: 844px) { }

/* iPad */
@media (width: 768px) and (height: 1024px) { }

/* iPad Pro */
@media (width: 1024px) and (height: 1366px) { }

/* デスクトップ標準 */
@media (width: 1920px) and (height: 1080px) { }
```

## アクセシビリティ配慮

### 文字サイズ対応
```css
/* ユーザー設定の文字サイズを尊重 */
@media (prefers-reduced-motion: no-preference) {
  .animated-element {
    transition: all 0.3s ease;
  }
}

@media (prefers-reduced-motion: reduce) {
  .animated-element {
    transition: none;
  }
}

/* 大文字サイズ設定対応 */
@media (min-resolution: 120dpi) and (max-resolution: 192dpi) {
  body {
    font-size: 110%;
  }
}
```

### コントラスト対応
```css
@media (prefers-contrast: high) {
  .btn-voice-main {
    border: 3px solid #000000;
    box-shadow: 0 0 0 1px #FFFFFF;
  }
}
```

## 実装優先順位

### Phase 1: モバイル基本対応
- [ ] 320px-767px の基本レイアウト
- [ ] タッチフレンドリーなボタンサイズ
- [ ] 縦向きレイアウト最適化

### Phase 2: タブレット対応
- [ ] 768px-1023px のレイアウト調整
- [ ] 横向き対応
- [ ] サイドバー表示

### Phase 3: デスクトップ最適化
- [ ] 1024px以上の大画面レイアウト
- [ ] マルチカラム表示
- [ ] ホバー効果・アニメーション

### Phase 4: 高度な最適化
- [ ] 高解像度ディスプレイ対応
- [ ] アクセシビリティ強化
- [ ] パフォーマンス最適化

---

**作成日**: 2024年6月11日  
**設計者**: UI/UXチーム  
**対象デバイス**: スマートフォン、タブレット、デスクトップ  
**テスト必須**: iOS Safari, Android Chrome, デスクトップ主要ブラウザ