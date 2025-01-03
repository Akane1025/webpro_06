"use strict";

let lastMessageCount = 0; // 最後に表示したメッセージの数

// メッセージの投稿処理
document.querySelector('#post').addEventListener('click', () => {
    const name = document.querySelector('#name').value;
    const message = document.querySelector('#message').value;
    const date = document.querySelector('#date').value;
    const place = document.querySelector('#place').value;

    // メッセージ送信時に必要なデータを送信
    const params = {
        method: "POST",
        body: 'name=' + encodeURIComponent(name) + '&message=' + encodeURIComponent(message) + '&date=' + encodeURIComponent(date) + '&place=' + encodeURIComponent(place),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    const url = "/post";
    fetch(url, params)
    .then((response) => {
        if (!response.ok) {
            throw new Error('Error');
        }
        return response.json();
    })
    .then((response) => {
        console.log(response);
        document.querySelector('#message').value = ""; // 入力欄をクリア
        updateMessages(); // メッセージを再読み込みして新しいものだけを表示
    });
});

// サーバーから新しいメッセージを取得して表示
function updateMessages() {
    const params = {
        method: "POST",
        body: 'start=' + lastMessageCount, // 最後に表示したメッセージ以降のメッセージを取得
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    const url = "/read";
    fetch(url, params)
    .then((response) => {
        if (!response.ok) {
            throw new Error('Error');
        }
        return response.json();
    })
    .then((response) => {
        if (response.messages.length === 0) return; // 新しいメッセージがない場合は何もしない

        // 新しいメッセージがあれば、追加表示
        response.messages.forEach((mes) => {
            const cover = document.createElement('div');
            cover.className = 'cover';

            // メッセージの表示
            const joinedMessage = [
                mes.name || 'undefined',
                mes.date || 'undefined',
                mes.place || 'undefined',
                mes.message || 'undefined'
            ].join('，'); // カンマで区切って表示

            const joined_area = document.createElement('span');
            joined_area.className = 'joinedMessage';
            joined_area.textContent = joinedMessage;

            cover.appendChild(joined_area);
            bbs.appendChild(cover);
        });

        // 最後に表示したメッセージの数を更新
        lastMessageCount = response.totalCount || lastMessageCount;
    })
    .catch((error) => {
        console.error('メッセージ取得エラー:', error);
    });
}

// ページ読み込み時にすでに保存されているメッセージを表示
window.addEventListener('load', () => {
    updateMessages(); // 初期表示でメッセージを読み込む
});
