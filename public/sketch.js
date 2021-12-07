let socket = io();

socket.on('connect', () => {
    console.log(socket.id, 'connected');

    // ping server with new-user event on connection
    socket.emit('new-user');

    socket.on('allSockets', (socketsData) => {
        // console.log(socketsData);
        for (let i = 0; i < socketsData.ids.length - 1; i++) {
            let pastUser = new User(int(random(50, width - 50)), int(random(50, height - 50)), socketsData.ids[i]);
            allOtherUsers.push(pastUser);
        }
    });

});

let allOtherUsers = [];
let user;
let xPos, yPos;

function setup() {
    let myCanvas = createCanvas(windowWidth, windowHeight);
    myCanvas.parent('canvas-container');

    xPos = int(random(50, width - 50));
    yPos = int(random(50, height - 50));

    user = new User(xPos, yPos, 'me'); // temp id

    socket.on('new-user', (data) => {
        let otherUser = new User(int(random(50, width - 50)), int(random(50, height - 50)), data);
        // console.log(otherUser);
        allOtherUsers.push(otherUser);
        // console.log("allOtherUsers[]:", allOtherUsers);
    });

    socket.on('userPositionServer', (data) => {
        // console.log("userPositionServer:", data);
        moveOthers(data);
    });

    
    socket.on('user-left', (socketsData) => {

        console.log(socketsData.ids[socketsData.index]);
       
        let userIndex;

        // search for socket id to remove
        for (let i = 0; i < allOtherUsers.length; i++) {
            if (allOtherUsers[i].id == socketsData.ids[socketsData.index]) {
                userIndex = i;
            }
        }

        console.log("index:", userIndex);

        if (userIndex > -1) {
            allOtherUsers.splice(userIndex, 1);
        }

    });

}

function draw() {
    background(220);

    // display & move other users
    allOtherUsers.forEach(user => user.display());
    allOtherUsers.forEach(user => user.updatePosition(user.x, user.y));

    // display & move current user
    user.display();
    user.updatePosition(xPos, yPos);

    arrowKeys();

}

function arrowKeys() {
    if (keyIsDown(LEFT_ARROW)) {
        if (xPos > 50) {
            xPos -= 3;
        }
    }
    if (keyIsDown(RIGHT_ARROW)) {
        if (xPos < width - 50) {
            xPos += 3;
        }
    }
    if (keyIsDown(DOWN_ARROW)) {
        if (yPos < height - 50) {
            yPos += 3;
        }
    }
    if (keyIsDown(UP_ARROW)) {
        if (yPos > 50) {
            yPos -= 3;
        }
    }

    if (keyIsPressed && (keyCode === UP_ARROW || keyCode === DOWN_ARROW || keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW)) {
        let userPos = {
            x: user.x,
            y: user.y
        };
        // console.log("user position:", userPos);
        socket.emit('userPosition', userPos);
    }

}

function moveOthers(data) {
    for (let i = 0; i < allOtherUsers.length; i++) {
        if (allOtherUsers[i].id == data.id) {
            allOtherUsers[i].x = data.x;
            allOtherUsers[i].y = data.y;
        }
    }
}
