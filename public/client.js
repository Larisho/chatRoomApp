// initializing socket, connection to server
var socket = io.connect('http://localhost:8000');
var username = getCookieValue('username');
var cookieExists = false;

if (username !== "") {
    cookieExists = true;
}

socket.on('connect', function(data) {
    socket.emit('join', 'Hello server from client');
});

socket.on('getUsername', function(data) {
    console.log(data);
    username = cookieExists ? username : data;

    username = prompt("Your username will be " + username + ". If that's okay, press ok. If not, type in your preferred username", username);

    if (!cookieExists)
        document.cookie = "username=" + username + "; expires=Thu, 18 Dec 2018 12:00:00 UTC";
});

socket.on('userCount', function(data) {
    $('userCount').text(data);
});

// listener for 'thread' event, which updates messages

socket.on('thread', function(data) {
    $('#thread').append('<li><b>' + data.username + '</b>: ' + data.message + '</li>');
});

// sends message to server, resets & prevents default form action
$('form').submit(function() {
    var message = $('#message').val();
    socket.emit('messages', {message: message, username: username});
    this.reset();
    return false;
});

function getCookieValue(a) {
    var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
}