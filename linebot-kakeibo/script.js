const SPREAD_SHEET_ID = ''
const SHEET_NAME = ''

// POSTリクエストに対する処理
// e の仕様はこちら
//   https://developers.google.com/apps-script/guides/web?hl=ja#request_parameters
function doPost(e) {
  // // リクエストを受け取る
  const requestJSON = e.postData.contents;
  // // JSONをパース
  const requestObj = JSON.parse(requestJSON);

  const events = requestObj.events
  // events の仕様は公式ドキュメントを参照
  //   https://developers.line.biz/ja/reference/messaging-api/
  // events は配列で渡ってくるので、繰り返し処理する
  events.forEach((event) => {
    // メッセージイベントのみ受け付ける
    if (event.type !== 'message') return;
    // メッセージ
    const message = event.message
    // 入力はテキストのみ受け付ける
    if (message.type !== 'text') return;
    // 現在日時
    const datetime = new Date()
    // ユーザーID
    const userId = event.source.userId
    // 入力内容
    const text = message.text
    // 入力を`/`で区切って、「品目/金額」とする
    const [title, price] = text.split('/')

    const records = [datetime, userId, title, price]

    // スプレッドシートに記載
    addRecord(records)
  })
}

// スプレッドシートに記載する
function addRecord(records = []) {
    const ss = SpreadsheetApp.openById(SPREAD_SHEET_ID); 
    const sheet = ss.getSheetByName(SHEET_NAME);
    // 最終行の一行下に追記
    const lastRow = sheet.getLastRow() + 1;
    const range = sheet.getRange(lastRow, 1, 1, records.length)
    range.setValues([records])
}
