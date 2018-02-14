
var net = require('net');



var LOCAL_PORT  = null;
var REMOTE_PORT = null;
var REMOTE_ADDR = null;

var currentOp = null;

for(var i in process.argv){
  switch(currentOp){
    case 'port':
      LOCAL_PORT = process.argv[i];
      currentOp = null;
      break;
    case 'remote':
      var remote = process.argv[i];
      remote = remote.split(':');
      if (remote.length == 1){
        remote.push(80);
      }
      REMOTE_ADDR = remote[0];
      REMOTE_PORT = remote[1];
      currentOp = null;
      break;
    default:
        switch(process.argv[i]){
          case '--port':
            currentOp = 'port';
            break;
          case '--remote':
            currentOp = 'remote';
            break;
        }
    break;
  }
}

if (LOCAL_PORT == null || REMOTE_PORT == null){
  console.log('You have not set local port or remote host. See Readme.md')
  process.exit(-1);
}

/*
var LOCAL_PORT  = 8080;
var REMOTE_PORT = 80;
var REMOTE_ADDR = "127.0.0.1";
*/
var server = net.createServer(function (socket) {
    socket.on('data', function (msg) {
        var serviceSocket = new net.Socket();
        serviceSocket.connect(parseInt(REMOTE_PORT), REMOTE_ADDR, function () {
            serviceSocket.write(msg);
        });
        serviceSocket.on("data", function (data) {
            socket.write(data);
        });
    });
});

server.listen(LOCAL_PORT);
console.log("TCP server accepting connection on port: " + LOCAL_PORT);
