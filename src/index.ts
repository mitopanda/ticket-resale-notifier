import axios from "axios";
import * as cheerio from "cheerio";
import dotenv from "dotenv";
import { Client } from "@line/bot-sdk";

dotenv.config();

const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;
const LINE_USER_ID = process.env.LINE_USER_ID!;

if (!LINE_CHANNEL_ACCESS_TOKEN || !LINE_CHANNEL_SECRET || !LINE_USER_ID) {
  throw new Error("環境変数を確認してください。");
}

const client = new Client({
  channelAccessToken: LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: LINE_CHANNEL_SECRET,
});
const URL = process.env.TICKET_PIA_URL!;
const INTERVAL = 30000;

async function checkTicketAvailability(): Promise<void> {
  try {
    const response = await axios.get(URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const $ = cheerio.load(response.data);
    const noTicketElement = $(".sl_ticketArchiveList--empty");

    if (!noTicketElement.length) {
      // チケットが見つかった場合
      await client.pushMessage(LINE_USER_ID, {
        type: "text",
        text: `🎫 チケットが見つかりました！\nPlus Member ID: ${process.env
          .PLUS_MEMBER_ID!}\n確認URL: ${URL}`,
      });
      console.log("チケットが見つかりました！通知を送信しました。");
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
setInterval(checkTicketAvailability, INTERVAL);
checkTicketAvailability(); // 初回実行
