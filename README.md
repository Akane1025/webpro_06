# webpro_06
## このプログラムについて
## ファイル一覧

ファイル名| 説明
-|-
app5.js|プログラム本体
public/janken.html | じゃんけんの開始画面
views/janken.ejs | じゃんけんのテンプレートファイル

## 使用方法
1. ```node app5.js```を起動する
1. Webブラウザで```ocalhost:8080/public/janken.html```にアクセスする
1. 自分の手を入力する

```mermaid
flowchart TD;

start["開始"];
end1["終了"]
if{"勝ちの条件を満たすか"}
win["勝ち"]
loose["負け"]
aiko["あいこ"]
if2["あいこの条件を満たすか"]

start --> if
if -->|yes| win
win --> end1
if -->|no| if2
if2 -->|yes| aiko
aiko --> end1
if2 -->|no| loose
loose --> end1
```