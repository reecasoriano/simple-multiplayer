class User {

    constructor(x, y, id) {
        this.x = x;
        this.y = y;
        this.d = 50;
        this.id = id;
    }

    display() {
        circle(this.x, this.y, this.d);
    }

    updatePosition(x, y) {
        this.x = x;
        this.y = y
    }

}
