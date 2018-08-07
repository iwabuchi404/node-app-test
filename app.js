// const http = require('http');
// const server = http.createServer((req, res) => {
//  res.statusCode = 200;
//  res.setHeader('Content-Type', 'text/plain');
//  res.end('Hello World\n');
// }).listen(process.env.PORT || 3000, () => {
//  console.log(`Server running.`);
// });

var fs = require('fs');
var http = require('http');
var server = http.createServer();
var url = require("url");

server.on('request', function(req, res) {
  var pathname =  __dirname + url.parse(req.url).pathname;
  console.log(pathname)
  file_res = fs.readFile(pathname, (err, data) => {
    if(err){
      data = pathname + " This file does not exist"
    }
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
  // var stream = fs.createReadStream(pathname);
  // stream.pipe(res);
});

var io = require('socket.io').listen(server);

server.listen(process.env.PORT || 8000, () => {
  console.log(`Server running.`);
});

io.sockets.on('connection', function(socket) {
  socket.broadcast.emit('sys_message_send', {message: "ユーザーが入室しました。"})
  socket.on('send_message', function(deta){
    if(deta.message){
      socket.broadcast.emit('send_message', deta)
    }else{
      console.log("no message")
    }
  })
  socket.on("disconnect", function () {
    socket.broadcast.emit('sys_message_send', {message: "ユーザーが退出しました。"})
  });
  return socket
})
