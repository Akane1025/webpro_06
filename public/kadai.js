"use strict";

    const locationData = {}; // 場所ごとの集計データを保持

    const ctx = document.getElementById('chart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                label: '場所の頻度',
                data: [],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
            }
        }
    });

    function updateChart(place) {
        if (!locationData[place]) {
            locationData[place] = 0;
            chart.data.labels.push(place);
        }
        locationData[place]++;
        chart.data.datasets[0].data = Object.values(locationData);
        chart.update();
    }

    // メッセージ送信イベント
    document.querySelector('#post').addEventListener('click', () => {
        const name = document.querySelector('#name').value;
        const message = document.querySelector('#message').value;
        const date = document.querySelector('#date').value;
        const place = document.querySelector('#place').value;

        if (!place) return alert('場所を入力してください！');

        updateChart(place);

        const params = {
            method: "POST",
            body: 'name=' + encodeURIComponent(name) + '&message=' + encodeURIComponent(message) + '&date=' + encodeURIComponent(date) + '&place=' + encodeURIComponent(place),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        fetch('/post', params)
        .then(response => response.json())
        .then(() => {
            const cover = document.createElement('div');
            cover.className = 'cover';

            const joinedMessage = [
                name || 'undefined',
                date || 'undefined',
                place || 'undefined',
                message || 'undefined'
            ].join('，');

            const joined_area = document.createElement('span');
            joined_area.className = 'joinedMessage';
            joined_area.textContent = joinedMessage;

            // 削除ボタンの作成
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '削除';
            deleteButton.classList.add('delete-button');

            // 削除ボタンにイベントリスナーを追加
            deleteButton.addEventListener('click', () => {
                const params = {
                    method: 'POST',
                    body: JSON.stringify({
                        message,
                        date,
                        place
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };

                fetch('/delete', params)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        cover.remove(); // メッセージを削除
                        updateChartAfterDeletion(place); // グラフを再更新
                    } else {
                        console.error('メッセージ削除エラー');
                    }
                })
                .catch(error => console.error('削除リクエストエラー:', error));
            });

            cover.appendChild(joined_area);
            cover.appendChild(deleteButton); // 削除ボタンを追加
            document.querySelector('#bbs').appendChild(cover);

            updateChart(place);
        })
        .catch((error) => {
            console.error('データ送信エラー:', error);
        });
    });

    function updateChartAfterDeletion(place) {
        // 場所ごとのデータを再計算し、グラフを更新する
        if (locationData[place]) {
            locationData[place]--;
            if (locationData[place] <= 0) {
                delete locationData[place]; // データを削除
            }
        }

        // グラフのラベルとデータを再構築
        chart.data.labels = Object.keys(locationData);
        chart.data.datasets[0].data = Object.values(locationData);
        chart.update(); // グラフの再描画
    }

    window.addEventListener('load', () => {
        updateMessages();
    });

    function updateMessages(dateFilter = null) {
        const params = {
            method: "POST",
            body: 'start=' + 0 + (dateFilter ? '&date=' + encodeURIComponent(dateFilter) : ''),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        fetch("/read", params)
        .then((response) => response.json())
        .then((response) => {
            response.messages.forEach((mes) => {
                const cover = document.createElement('div');
                cover.className = 'cover';

                const joinedMessage = [
                    mes.name || 'undefined',
                    mes.date || 'undefined',
                    mes.place || 'undefined',
                    mes.message || 'undefined'
                ].join('，');

                const joined_area = document.createElement('span');
                joined_area.className = 'joinedMessage';
                joined_area.textContent = joinedMessage;

                // 削除ボタンの作成
                const deleteButton = document.createElement('button');
                deleteButton.textContent = '削除';
                deleteButton.classList.add('delete-button');

                // 削除ボタンにイベントリスナーを追加
                deleteButton.addEventListener('click', () => {
                    const params = {
                        method: 'POST',
                        body: JSON.stringify({
                            message: mes.message,
                            date: mes.date,
                            place: mes.place
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };

                    fetch('/delete', params)
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            cover.remove(); // メッセージを削除
                            updateChartAfterDeletion(mes.place); // グラフを再更新
                        } else {
                            console.error('メッセージ削除エラー');
                        }
                    })
                    .catch(error => console.error('削除リクエストエラー:', error));
                });

                cover.appendChild(joined_area);
                cover.appendChild(deleteButton); // 削除ボタンを追加
                document.querySelector('#bbs').appendChild(cover);

                if (mes.place) {
                    updateChart(mes.place);
                }
            });
        })
        .catch((error) => {
            console.error('メッセージ取得エラー:', error);
        });
    }