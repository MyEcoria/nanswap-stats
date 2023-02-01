const request = require('request');
const fs = require('fs');
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const path = require('path');

const url = 'https://data.nanswap.com/get-stats';
const file = 'stats.json';

setInterval(() => {
  request(url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      let stats = [];
      try {
        stats = JSON.parse(fs.readFileSync(file, 'utf-8'));
      } catch (err) {
        console.error(err);
      }
      const newStats = JSON.parse(body);
      stats.push({
        date: new Date().toLocaleString(),
        totalVolume: newStats.total24.volume,
        totalTxCount: newStats.total24.txCount,
        avgExecutionTime: newStats.total24.avgExecutionTime,
        faucetClaims: newStats.faucetClaims24
      });
      fs.writeFileSync(file, JSON.stringify(stats), 'utf-8');
    } else {
      console.error(error);
    }
  });
}, 24 * 60 * 60 * 1000);

app.get('/data', (req, res) => {
    res.set('Content-Type', 'text/x-json');
    let datas = fs.readFileSync('stats.json');
    res.send(datas);
});

app.get('/stats', (req, res) => {
    let datas = fs.readFileSync('stats.json');
    var fonc = '<html> <head> <script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js"></script> </head> <body> <canvas id="myChart"></canvas> <script> const data = ' + datas + '; const ctx = document.getElementById("myChart").getContext("2d"); const chart = new Chart(ctx, { type: "line", data: { labels: data.map(({ date }) => date), datasets: [ { label: "Total Volume", data: data.map(({ totalVolume }) => totalVolume), backgroundColor: "rgba(255, 99, 132, 0.2)", borderColor: "rgba(255, 99, 132, 1)", borderWidth: 1 }, { label: "Total Tx Count", data: data.map(({ totalTxCount }) => totalTxCount), backgroundColor: "rgba(54, 162, 235, 0.2)", borderColor: "rgba(54, 162, 235, 1)", borderWidth: 1 }, { label: "Avg Execution Time", data: data.map(({ avgExecutionTime }) => avgExecutionTime), backgroundColor: "rgba(255, 206, 86, 0.2)", borderColor: "rgba(255, 206, 86, 1)", borderWidth: 1 }, { label: "Faucet Claims", data: data.map(({ faucetClaims }) => faucetClaims), backgroundColor: "rgba(75, 192, 192, 0.2)", borderColor: "rgba(75, 192, 192, 1)", borderWidth: 1 } ] } }); </script> </body> </html>';
    res.send(fonc);
});

app.get('/', (req, res) => {
    let datas = fs.readFileSync('stats.json');
    var fonc = '<html> <head> <script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js"></script> <style type="text/css"> body { background: #f2f2f2; } @import url("https://fonts.googleapis.com/css2?family=Merriweather:wght@300;900&display=swap"); .container  { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); height: 400px; width: 600px; background: #f2f2f2; overflow: hidden; border-radius: 20px; cursor: pointer; box-shadow: 0 0 20px 8px #d0d0d0; } .content { position: absolute; top: 50%; transform: translatey(-50%); text-align: justify; color: black; padding: 40px; font-family: "Merriweather", serif; } h1 { font-weight: 900; text-align: center; } h3 { font-weight: 300; } </style> </head> <body> <div class="container"> <div class="content"> <h1>NanSwap Stats</h1> <canvas id="myChart" width="500px"></canvas> </div> <div class="flap"></div> </div> <script> const data = ' + datas + '; const ctx = document.getElementById("myChart").getContext("2d"); const chart = new Chart(ctx, { type: "line", data: { labels: data.map(({ date }) => date), datasets: [ { label: "Total Volume", data: data.map(({ totalVolume }) => totalVolume), backgroundColor: "rgba(255, 99, 132, 0.2)", borderColor: "rgba(255, 99, 132, 1)", borderWidth: 1 }, { label: "Total Tx Count", data: data.map(({ totalTxCount }) => totalTxCount), backgroundColor: "rgba(54, 162, 235, 0.2)", borderColor: "rgba(54, 162, 235, 1)", borderWidth: 1 }, { label: "Avg Execution Time", data: data.map(({ avgExecutionTime }) => avgExecutionTime), backgroundColor: "rgba(255, 206, 86, 0.2)", borderColor: "rgba(255, 206, 86, 1)", borderWidth: 1 }, { label: "Faucet Claims", data: data.map(({ faucetClaims }) => faucetClaims), backgroundColor: "rgba(75, 192, 192, 0.2)", borderColor: "rgba(75, 192, 192, 1)", borderWidth: 1 } ] } }); </script> </body> </html>';
    res.send(fonc);
});

app.listen(port, '0.0.0.0', () => {
    console.log('Server app listening on port ' + port);
});
