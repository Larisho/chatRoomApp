var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var randomWords = require('random-words');

app.get('/', function(req, res, next) {
    res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static('public'));


io.on('connection', function(client) {
    console.log('Client connected...');
    var words = randomWords({min: 1, max: 4, join: ' '});
    console.log(words);


    client.on('join', function(data) {
        console.log(data);
        client.broadcast.emit('userCount', io.sockets.clients().length);
        client.emit('getUsername', words);
    });

    client.on('messages', function(data){
        client.emit('thread', data);
        client.broadcast.emit('thread', data);
    });
});

server.listen(8000, "0.0.0.0");