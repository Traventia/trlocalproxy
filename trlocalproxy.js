var net = require('net');

module.exports = function localtunnel(local_port, remote_addr, remote_port) {

	var server = net.createServer(function (socket) {
	    socket.on('data', function (msg) {
	        var serviceSocket = new net.Socket();
	        serviceSocket.connect(parseInt(remote_port), remote_addr, function () {
	            serviceSocket.write(msg);
	        });
	        serviceSocket.on("data", function (data) {
	            socket.write(data);
	        });
	    });
	});

	server.listen(local_port);
	console.log("TCP server accepting connection on port: " + local_port);
};