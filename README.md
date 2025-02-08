# チケット再販通知システム

チケットぴあのリセールチケットが見つかったら、LINE で通知する。

## セットアップ

### 1.必要なパッケージをインストール

```bash
npm install
```

### 2.環境変数の設定

- `LINE_CHANNEL_ACCESS_TOKEN`
  - チャネル＞ Messaging API 設定>チャネルアクセストークンから取得
- `LINE_CHANNEL_SECRET`
  - チャネル＞チャネル基本設定>チャネルシークレットから取得
- `LINE_USER_ID`
  - チャネル＞チャネル基本設定>あなたのユーザー ID から取得
- `TICKET_PIA_URL`
  - チケットぴあのリセールページの url

### 3.アプリケーションの実行

```bash
npm run dev
```

## 機能

- 30 秒ごとに指定された URL をチェック
- チケットが見つかった場合、LINE 通知を送信
