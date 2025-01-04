"use strict";
const express = require("express");
const app = express();

let bbs = [];  // 本来はDBMSを使用するが，今回はこの変数にデータを蓄える

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

app.get("/luck", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';
  console.log( 'あなたの運勢は' + luck + 'です' );
  res.render( 'luck', {number:num, luck:luck} );
});

app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number( req.query.win );
  let total = Number( req.query.total );
  console.log( {hand, win, total});
  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';
  // ここに勝敗の判定を入れる
  // 今はダミーで人間の勝ちにしておく
  let judgement = '勝ち';
  win += 1;
  total += 1;
  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render( 'janken', display );
});

app.get("/get_test", (req, res) => {
  res.json({
    answer: 0
  })
});

app.get("/add", (req, res) => {
  console.log("GET");
  console.log( req.query );
  const num1 = Number( req.query.num1 );
  const num2 = Number( req.query.num2 );
  console.log( num1 );
  console.log( num2 );
  res.json( {answer: num1+num2} );
});

app.post("/add", (req, res) => {
  console.log("POST");
  console.log( req.body );
  const num1 = Number( req.body.num1 );
  const num2 = Number( req.body.num2 );
  console.log( num1 );
  console.log( num2 );
  res.json( {answer: num1+num2} );
});




app.get("/kadai", (req, res) => {
  console.log("GET /kadai");
  res.json({ test: "GET /kadai" });
});

app.post("/kadai", (req, res) => {
  console.log("POST /kadai");
  res.json({ test: "POST /kadai" });
});


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let messages = []; // メモリ上の簡易データベース
const locationData = {}; // 場所ごとの集計データを保持

// データを保存
app.post('/post', (req, res) => {
  const { name, message, date, place } = req.body;
  if (!name || !message || !date || !place) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  messages.push({ name, message, date, place });
  console.log('Message received:', { name, message, date, place });
  
  // 場所データを更新
  if (!locationData[place]) {
    locationData[place] = 0;
  }
  locationData[place]++;

  res.json({ success: true });
});

// メッセージ削除処理
app.post('/delete', (req, res) => {
  const { message, date, place } = req.body;

  // メッセージ配列から一致するメッセージを削除
  messages = messages.filter((msg) => !(msg.message === message && msg.date === date && msg.place === place));

  console.log('Deleted message:', { message, date, place });

  // 削除後、グラフの場所データを再集計
  if (locationData[place]) {
    locationData[place]--;
    if (locationData[place] <= 0) {
      delete locationData[place]; // カウントが0以下の場合、場所データを削除
    }
  }

  res.json({ success: true });
});

// 新しいメッセージを取得（オプションで日付でフィルタ）
app.post('/read', (req, res) => {
  const { start, date } = req.body;
  const startIndex = isNaN(parseInt(start, 10)) ? 0 : parseInt(start, 10);
  console.log('Fetching messages starting from index:', startIndex, 'with date filter:', date); // デバッグ用ログ

  if (startIndex < 0 || startIndex >= messages.length) {
    return res.json({ messages: [] });
  }

  let filteredMessages = messages.slice(startIndex); // 開始位置以降のメッセージを取得

  // 日付フィルタが存在する場合、メッセージを日付でフィルタリング
  if (date) {
    filteredMessages = filteredMessages.filter((message) => {
      return message.date === date; // 日付が一致するメッセージのみ
    });
  }

  console.log('Filtered messages:', filteredMessages);

  res.json({ messages: filteredMessages, totalCount: messages.length });
});

// 新しいメッセージがあるか確認
app.post('/check', (req, res) => {
  res.json({ number: messages.length });
});


app.listen(8080, () => console.log('Example app listening on port 8080!'));