let express = require('express');
let app = express();
app.use('/', express.static('public'));

let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log("Server is listening at port: " + port);
});


let io = require('socket.io');
io = new io.Server(server);

let socketIDs;

io.sockets.on('connection', (socket) => {
    console.log("We have a new client:", socket.id);

    // broadcast new user's socket id to other clients
    socket.on('new-user', (data) => {
        socket.broadcast.emit('new-user', socket.id);
    });

    // grab all of the sockets
    let allSockets = io.sockets.sockets;
    //create an empty array to store all of the socket ids
    socketIDs = [];

    // use the forEach method to loop through the sockets 'map'
    allSockets.forEach((value, key) => {
        socketIDs.push(value.id);
    });
    // console.log("socketIDs:", socketIDs);

    // send an .emit() just to the new user who joined
    // share all of the existing socketIDs
    // note this will include the id for this user as well 
    let socketsData = { ids: socketIDs };
    socket.emit('allSockets', socketsData);
    console.log("socketsData:", socketsData);

    // on receiving 'userPosition', emit position to other clients
    socket.on('userPosition', (data) => {
        data.id = socket.id;
        // console.log("userPosition:", data);
        // console.log(userPositions);
        io.sockets.emit('userPositionServer', data);
    })

    socket.on('disconnect', () => {
        console.log("Client left:", socket.id);

        // find index of socket that just disconnected
        let index = socketIDs.indexOf(socket.id);
        socketsData = { ids: socketIDs, index: index };

        io.sockets.emit('user-left', socketsData);
        // prints current client ids and index of client that just left
        console.log("*updated* socketsData:", socketsData);

        // remove socket from array in server
        if (index > -1) {
            socketIDs.splice(index, 1);
        }
        // console.log("*updated* socketIDs:", socketIDs);
    
    });

});