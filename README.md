# チケット再販通知システム

チケットぴあのリセールチケットが見つかったら、Discord で通知する。

## セットアップ

### 1.必要なパッケージをインストール

```bash
npm install
```

### 2.環境変数の設定

- ~`LINE_CHANNEL_ACCESS_TOKEN`~
  - ~チャネル＞ Messaging API 設定>チャネルアクセストークンから取得~
- ~`LINE_CHANNEL_SECRET`~
  - ~チャネル＞チャネル基本設定>チャネルシークレットから取得~
- ~`LINE_USER_ID`~
  - ~チャネル＞チャネル基本設定>あなたのユーザー ID から取得~
- `DISCORD_WEBHOOK_URL`
  - Discord チャンネル設定 > 連携サービス > ウェブフック > 新しいウェブフック から取得
- `TICKET_PIA_URL`
  - チケットぴあのリセールページの url
- `PLUS_MEMBER_ID`
  - プラスメンバー ID（必要な場合）

### 3.アプリケーションの実行

```bash
npm run dev
```

## 機能

- 設定された間隔ごとに指定された URL をチェック
- チケットが見つかった場合、Discord 通知を送信
- アクセス集中時のエラーページを検出して回避

## Discord Webhook の設定方法

1. Discord サーバーの設定を開く
2. 「連携サービス」をクリック
3. 「ウェブフック」をクリック
4. 「新しいウェブフック」をクリック
5. ウェブフックに名前を付け、投稿先のチャンネルを選択
6. 「ウェブフック URL をコピー」をクリック
7. この URL を`.env`ファイルの`DISCORD_WEBHOOK_URL`に設定
