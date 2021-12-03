// https://github.com/LukeGarrigan/p5-multiplayer-game-starter

let socket = io();

socket.on('connect', () => {
    console.log('Connected');
    // console.log('My socket id is: ', socket.id);
    socket.emit('new-user');
});

let leftButtonCount = 0;
let rightButtonCount = 0;
let downButtonCount = 0;
let upButtonCount = 0;
let users = [];
let user;
let existingUsers;


function setup() {
    let myCanvas = createCanvas(windowWidth, windowHeight);
    myCanvas.parent('canvas-container');

    socket.on('new-user', (data) => {
        user = new User(windowWidth / 2, windowHeight / 2, data);
        console.log(user);
        users.push(user);
        console.log("users[]:", users);
    });

    socket.on('userPositionServer', (data) => {
        console.log("userPositionServer:", data);
    });

    // socket.on('allSockets', (data) => {
    //     console.log("allSockets:", data);
    //     existingUsers = data.ids;
    //     existingUsers.forEach(u => new User());
    // });

}

function draw() {
    background(220);

    users.forEach(user => user.display());
    users.forEach(user => user.move());

   // existingUsers.forEach(user => user.display());

    if (keyIsPressed && (keyCode === UP_ARROW || keyCode === DOWN_ARROW || keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW)) {
        /* STEP 4.2 */
        let userPos = {
            x: user.x,
            y: user.y
            // id: user.id
        };
        // console.log("user position:", userPos);
        socket.emit('userPosition', userPos);
    }

    // reset button counts so speed doesn't keep increasing
    leftButtonCount = 0;
    rightButtonCount = 0;
    downButtonCount = 0;
    upButtonCount = 0;
}


function updateUsers(serverUsers) {
    let removedUsers = users.filter(p => serverUsers.findIndex(s => s.id == p.id));
    for (let user of removedUsers) {
        removeUser(user.id);
    }
    for (let i = 0; i < serverUsers.length; i++) {
        let userFromServer = serverUsers[i];
        if (!userExists(userFromServer)) {
            users.push(new User(userFromServer.x, userFromServer.y, userFromServer.id));
        }
    }
}


function userExists(userFromServer) {
    // loop through users array to check if a user currently exists
    for (let i = 0; i < users.length; i++) {
        if (users[i].id === userFromServer) {
            return true;
        }
    }
    return false;
}

function removeUser(userID) {
    // filter for all users whose ids are not equal to the disconnected user
    // update users array to contain only the present users
    users = users.filter(user => user.id !== userID);
}