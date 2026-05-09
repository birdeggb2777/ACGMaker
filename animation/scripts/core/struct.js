

class Selection {
    constructor(type = "rect", content) {
        this.type = type;
        this.content = content ? content : null;
        this.map = null;
    }
    getMap() {
        if (this.map) return this.map;
        if (this.type == "pixel" && this.content) {
            return this.content;
        }
        if (this.type == "rect" && this.content) {
            var rect = this.content;
            if (!this.map) {
                const top = rect.top, bottom = rect.bottom, left = rect.left * 4, right = rect.right * 4;
                var map = this.map = new PixelData(Canvas.width, Canvas.height, 4);
                for (var h = top; h < bottom; h++) {
                    const pixelRow = map.d2[h];
                    for (var w = left; w < right; w += 4) {
                        pixelRow[w + 0] = pixelRow[w + 1] = pixelRow[w + 2] = pixelRow[w + 3] = 1;
                    }
                }
            }
            return map;
        }
        return null;
    }
}

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

class Path {
    constructor(point) {
        this.list = [];
        if (point) this.push(point);
    }
    push(point) {
        this.list.push(point);
    }
    distance(max) {
        let total = 0, points = this.list;
        if (!max) max = points.length;
        for (let i = 1; i < max; i++) {
            const dx = points[i].x - points[i - 1].x;
            const dy = points[i].y - points[i - 1].y;
            total += (dx * dx + dy * dy) ** 0.5;
        }
        return total;
    }
}


class PixelData {
    constructor(w, h, c) {
        this.d1 = new Uint8ClampedArray(w * h * 4), this.d2 = new Array(h);
        this.w = w, this.h = h, this.c = c;
        for (var i = 0; i < h; i++)this.d2[i] = new Uint8ClampedArray(this.d1.buffer, i * w * 4, w * 4);
    }
    fillColor(inputColor) {
        const color = ((inputColor.a << 24) | (inputColor.b << 16) | (inputColor.g << 8) | inputColor.r) >>> 0;
        new Uint32Array(this.d1.buffer).fill(color);
    }
    clear() { new Uint32Array(this.d1.buffer).fill(0x00000000); }
    set(inputPixelData) { this.d1.set(inputPixelData.d1); }
}

class F32PixelData {
    constructor(w, h, c) {
        this.d1 = new Float32Array(w * h * 4), this.d2 = new Array(h);
        this.w = w, this.h = h, this.c = c;
        // ！！！請注意！！！
        // 這個是以byte為單位初始化，切勿和Uint8同樣的初始化方式
        for (var i = 0; i < h; i++)this.d2[i] = new Float32Array(this.d1.buffer, i * w * 4 * 4, w * 4);
    }
    fillColor(inputColor) {
        var [r, g, b, a] = inputColor.toRGBAList();
        for (var i = 0; i < this.d1.length; i += 4) {
            this.d1[i + 0] = r, this.d1[i + 1] = g, this.d1[i + 2] = b, this.d1[i + 3] = a;
        }
    }
    clear() { new Float32Array(this.d1.buffer).fill(0x00000000); }
    set(inputPixelData) { this.d1.set(inputPixelData.d1); }
}

class Layer {
    constructor(x, y, z, w, h, d) {
        this.type = 圖層類型.影像;
        this.name = "圖層";
        /////////////
        //座標(跑到邊界外面的依然存在，只是不顯示)
        this.x = x; this.y = y; this.z = z;
        // 長寬深
        this.width = w; this.height = h; this.deep = d;
        /////////////
        this.pixelData = new PixelData(w, h, 4);
        this.style = 混合模式.普通;
        this.opacity = 1; //可超過一百甚至為負值
        this.display = true;
        /////////////
        this.color = new Color(128, 128, 128, 255);
    }
}

class LayerManager {
    constructor(w, h, d) {
        // 長寬深
        this.width = w; this.height = h; this.deep = d;
        // 裝圖層用的list
        this.layers = [];
        // 快取，採三明治快取法，其中多了reference，用於特定筆刷或濾鏡操考用
        this.cache = {
            front: new F32PixelData(w, h, 4),
            active: new F32PixelData(w, h, 4),
            back: new F32PixelData(w, h, 4),
            /////////////////////////////////
            cache: new F32PixelData(w, h, 4),  // 萬用快取，誰都可以任意調用
            needReflesh: true, // 代表需要刷新，可在切換圖層後設定為true
            preview: false,
        }
        // 需要更新的區域 (true為整個畫布)
        this.needRefleshRect = true;
        // 最後彩現結果
        this.result = new PixelData(w, h, 4);
    }
}