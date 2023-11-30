const OPENAI_TOKEN  = 'OPENAI_TOKEN';  // TODO: OpenaAIのAPIキーを入力
const CHANNEL_TOKEN = 'CHANNEL_TOKEN'; // TODO: LINEMessengerの チャネルアクセストークン を入力
const LINE_ENDPOINT = "https://api.line.me/v2/bot/message/reply";
const GPT_ENDPOINT  = 'https://api.openai.com/v1/chat/completions';
const MODEL_NAME    = 'gpt-3.5-turbo'; // 使用するGPTモデル
const MODEL_TEMP    = 0.5;             // 応答の多様性(0-1)※数値が大きいほどランダムな応答になる
const MAX_TOKENS    = 256;             // レスポンストークンの最大値(最大4,096)

// POSTリクエストに対する処理
function doPost(e) {
  // // リクエストを受け取ってオブジェクトに変換
  const json = JSON.parse(e.postData.contents);
  const events = json.events;
  // events は配列で渡ってくるので、繰り返し処理する
  events.forEach((event) => {
    // メッセージイベントのみ受け付ける
    if (event.type !== 'message') return;
    // テキスト入力のみ受け付ける
    const message = event.message
    if (message.type !== 'text') return;
    // LINE側へ応答するためのトークンを取得
    const replyToken = event.replyToken;
    if (typeof replyToken === 'undefined') return;
  
    // LINEから送られてきたメッセージを取得
    // 改行はGPTの入力には不要なので、空白に変換
    const userMessage = message.text.replace(/\r?\n/g, ' ');
    // LINEのメッセージをGPTに投げるリクエストにセットする
    const messages = [{ "role": "user", "content": userMessage }]
  
    const headers = {
      'Authorization': 'Bearer ' + OPENAI_TOKEN,
      'Content-type': 'application/json',
    };
    // リクエストオプション
    const options = {
      'method': 'POST',
      'headers': headers,
      'payload': JSON.stringify({
        'model': MODEL_NAME,        
        'max_tokens': MAX_TOKENS,   
        'temperature': MODEL_TEMP,  
        'messages': messages
      })
    };
    // GPTにリクエストを送信
    const res = JSON.parse(UrlFetchApp.fetch(GPT_ENDPOINT, options).getContentText());
  
    // GPTから返却されたメッセージをLINEbotで応答
    lineReply(replyToken, res.choices[0].message.content.trimStart());
  })
}

// LINE bot で応答する
function lineReply(replyToken, replyText) {
  // 応答メッセージを作成
  const message = {
    "replyToken": replyToken,
    "messages": [{
      "type": "text",
      "text": replyText
    }]
  };

  options = {
    "method": "post",
    "headers": {
      "Content-Type": "application/json; charset=UTF-8",
      "Authorization": "Bearer " + CHANNEL_TOKEN
    },
    "payload": JSON.stringify(message)
  };
  // LINEへ応答メッセージを返す
  UrlFetchApp.fetch(LINE_ENDPOINT, options);
}