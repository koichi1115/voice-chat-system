// API設定のサンプルファイル
// このファイルをconfig.jsにコピーして実際のAPIキーを設定してください

const CONFIG = {
    // OpenAI API設定
    OPENAI: {
        API_KEY: 'your-openai-api-key-here',
        MODEL: 'gpt-3.5-turbo',
        MAX_TOKENS: 150,
        TEMPERATURE: 0.7
    },
    
    // Claude API設定（オプション）
    CLAUDE: {
        API_KEY: 'your-claude-api-key-here',
        MODEL: 'claude-3-sonnet-20240229',
        MAX_TOKENS: 150
    },
    
    // 音声設定
    SPEECH: {
        // 音声認識設定
        RECOGNITION: {
            LANGUAGE: 'ja-JP',
            CONTINUOUS: false,
            INTERIM_RESULTS: true
        },
        
        // 音声合成設定
        SYNTHESIS: {
            LANGUAGE: 'ja-JP',
            VOICE_NAME: '',  // ブラウザのデフォルト
            RATE: 1.0,       // 話速（0.1-10）
            PITCH: 1.0,      // 音の高さ（0-2）
            VOLUME: 1.0      // 音量（0-1）
        }
    },
    
    // ユーザー設定
    USER: {
        MAX_HISTORY: 10,     // 保存する質問履歴の最大数
        SESSION_TIMEOUT: 30  // セッションタイムアウト（分）
    },
    
    // デバッグ設定
    DEBUG: {
        ENABLED: true,
        LOG_LEVEL: 'info'  // 'error', 'warn', 'info', 'debug'
    }
};

// 設定をグローバルに公開（開発用）
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}

// Node.js環境での使用（将来の拡張用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}