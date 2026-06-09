
class Color {
    constructor(r, g, b, a) { this.b = b; this.g = g; this.r = r; this.a = a; }
    toRGBAList() { return [this.r, this.g, this.b, this.a]; }
}

class Rect {
    constructor(left, top, right, bottom) { this.left = left; this.top = top; this.right = right; this.bottom = bottom; }
    toList() {
        return [this.left, this.top, this.right, this.bottom]
    }
}

class Point {
    constructor(x, y) { this.x = x; this.y = y; }
    copy() { return new Point(this.x, this.y); }
}

class Vector {
    constructor(x, y) { this.x = x; this.y = y; }
}

class Size {
    constructor(x, y) { this.x = x; this.y = y; }
}