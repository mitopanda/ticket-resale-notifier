import axios from "axios";
import * as cheerio from "cheerio";
import dotenv from "dotenv";

dotenv.config();

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

// 環境変数のチェックを変更
if (!DISCORD_WEBHOOK_URL) {
  throw new Error("Discord Webhook URLを環境変数に設定してください。");
}

const INTERVAL = 2500;
const URL = process.env.TICKET_PIA_URL;
const PLUS_MEMBER_ID = process.env.PLUS_MEMBER_ID;

// Discordにメッセージを送信する関数を追加
async function sendDiscordMessage(message: string): Promise<void> {
  if (!DISCORD_WEBHOOK_URL) return;
  await axios.post(DISCORD_WEBHOOK_URL, {
    content: message,
  });
}

async function checkTicketAvailability(): Promise<void> {
  if (!URL) {
    console.error("URLが設定されていません。");
    return;
  }
  try {
    const response = await axios.get(URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const $ = cheerio.load(response.data);
    const noTicketElement = $(".sl_ticketArchiveList--empty");

    // アクセス集中ページのチェック
    const isAccessCongested =
      $("strong.notice:contains('ただいまアクセスが集中し')").length > 0 ||
      $("p:contains('アクセスが集中')").length > 0 ||
      $(".notice2").length > 0;

    if (isAccessCongested) {
      const currentTime = new Date().toLocaleString("ja-JP");
      console.log(`[${currentTime}] IPアドレスを変えよう`);
      return;
    }

    if (!noTicketElement.length) {
      // チケットが見つかった場合
      try {
        // Discord通知を送信
        await sendDiscordMessage(
          `🎫 チケットが見つかりました！\n確認URL: ${URL}`
        );

        if (PLUS_MEMBER_ID) {
          await sendDiscordMessage(PLUS_MEMBER_ID);
        }

        console.log("チケットが見つかりました！Discord通知を送信しました。");
        // インターバルをクリアしてループを終了
        if (intervalId) {
          clearInterval(intervalId);
          console.log("チケット監視を終了します。");
        }
      } catch (error) {
        console.error("Discord通知の送信に失敗しました:", error);
      }
    } else {
      const currentTime = new Date().toLocaleString("ja-JP");
      console.log(`[${currentTime}] チケットはまだありません`);
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 429) {
      const currentTime = new Date().toLocaleString("ja-JP");
      console.log(`[${currentTime}] アクセスが集中しています`);
    } else {
      console.error("エラーが発生しました:", error);
    }
  }
}

console.log("チケット監視を開始します...");
const intervalId = setInterval(checkTicketAvailability, INTERVAL);
checkTicketAvailability(); // 初回実行
