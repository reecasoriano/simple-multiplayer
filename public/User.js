class User {

    constructor(_x = width / 2, _y = height / 2, _id) {
        this.x = _x;
        this.y = _y;
        this.d = 50;
        this.id = _id;
    }

    display() {
        circle(this.x, this.y, this.d);
    }

    move() {
        // move left if left arrow is pressed
        if (keyIsDown(LEFT_ARROW)) {
            if (this.x > 50) {
                leftButtonCount++;
                this.x -= leftButtonCount * 4;
            }
        }

        // move right if right arrow is pressed
        if (keyIsDown(RIGHT_ARROW)) {
            if (this.x < width - 50) { // constrain to canvas
                rightButtonCount++;
                this.x += rightButtonCount * 4;
            }
        }

        // move down if down arrow is pressed
        if (keyIsDown(DOWN_ARROW)) {
            if (this.y < height - 50) { // constrain to canvas
                downButtonCount++;
                this.y += downButtonCount * 4;
            }
        }

        // move up if up arrow is pressed
        if (keyIsDown(UP_ARROW)) {
            if (this.y > 50) { // constrain to canvas
                upButtonCount++;
                this.y -= upButtonCount * 4;
            }
        }
    }

}
