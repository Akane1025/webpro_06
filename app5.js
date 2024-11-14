const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

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
  else if( num==3 ) luck = '吉';
  else if( num==4 ) luck = '小吉';
  else if( num==5 ) luck = '末吉';
  else if( num==6 ) luck = '凶';
  console.log( 'あなたの運勢は' + luck + 'です' );
  res.render( 'luck', {number:num, luck:luck} );
});


app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number( req.query.win ) || 0;
  let total = Number( req.query.total ) || 0;
  console.log( {hand, win, total});
  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';
  
  let judgement = '';

  if (
    (hand === 'グー' && cpu === 'チョキ') ||
    (hand === 'チョキ' && cpu === 'パー') ||
    (hand === 'パー' && cpu === 'グー')
  ) {
    judgement = '勝ち';
    win += 1;
  } else if (hand === cpu) {
    judgement = '引き分け';
  } else {
    judgement = '負け';
  }

  
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


app.get("/uranai", (req, res) => {
  const birth = req.query.date;
  const date = new Date(birth);
  const month = date.getMonth() + 1;
  const Dates = date.getDate() ;
  const kekka = month + Dates;

  if (kekka<5){
      result = "赤い服を着ると良いことあるかも！";
} else if (kekka<10){
      result = "今日は早めに寝ると吉";
} else if (kekka<15){
      result = "うまくいかないのでゆっくりしよう";
} else if (kekka<20){
      result = "牛乳を飲むと金運アップかも？";
} else if (kekka<25){
      result = "感謝を伝えると運気アップ";
} else if (kekka<30){
      result = "チョコレートを食べると勉強運アップ";
} else if (kekka<35){
      result = "外に出かけると最高の出会いがあるかも！";
} else if (kekka<40){
      result = "ついてないかも、黄色いハンカチで運気を上げよう";
} else{
      result = "超ラッキー！何でもうまくいきそう！";
}



const display = {
  your: birth,
  result: result,
  date: date,
  month: month,
  Dates: Dates,
  kekka:kekka
}

  res.render("uranai", display);


});


app.get("/hoi", (req, res) => {
  const dire = req.query.radio;
  let win = Number( req.query.win ) || 0;
  let total = Number( req.query.total ) || 0;
  console.log( {dire, win, total});
  const num = Math.floor( Math.random() * 4 + 1 );
  let cpu = '';
  if( num==1 ) cpu = '右';
  else if( num==2 ) cpu = '左';
  else if( num==3 ) cpu = '上';
  else cpu = '下';

  let judgement = '';

  if  (dire === cpu){
    judgement = '勝ち';
    win += 1;
  } else {
    judgement = '負け';
  }
  
  total += 1;
  const display = {
    your: dire,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render( 'hoi', display );
});





app.listen(8080, () => console.log("Example app listening on port 8080!"));
