
class Selection {
    constructor(type = "rect", content) {
        this.type = type;
        this.content = content ? content : null;
        this.map = null;
    }
    rect2pixel() {
        if (this.type != "rect") return;
        this.content = this.getMap();
        this.type = "pixel";
    }
    reverse() {
        this.rect2pixel();
        const width = this.content.w, height = this.content.h;
        for (var h = 0; h < height; h++) {
            const pixelRow = this.content.d2[h];
            for (var w = 0; w < width * 4; w += 4) {
                pixelRow[w + 0] = 1 - pixelRow[w + 0];
                pixelRow[w + 1] = 1 - pixelRow[w + 1];
                pixelRow[w + 2] = 1 - pixelRow[w + 2];
                pixelRow[w + 3] = 1 - pixelRow[w + 3];
            }
        }
    }
    move(point) {
        this.rect2pixel();
        const width = this.content.w, height = this.content.h;
        var temp = new PixelData(Canvas.width, Canvas.height, 4);

        for (var h = 0; h < height; h++) {
            const pixelRow = this.content.d2[h], tempRow = temp.d2[h];
            for (var w = 0; w < width * 4; w += 4) {
                tempRow[w + 0] = pixelRow[w + 0];
                tempRow[w + 1] = pixelRow[w + 1];
                tempRow[w + 2] = pixelRow[w + 2];
                tempRow[w + 3] = pixelRow[w + 3];
            }
        } 
        for (var h = 0; h < height; h++) {
            const pixelRow = this.content.d2[h], tempRow = temp.d2[h + point.y];
            for (var w = 0, w0 = 0; w < width * 4; w += 4, w0++) {
                if (!tempRow || w0 + point.x < 0 || w0 + point.x >= width) {
                    pixelRow[w + 0] = pixelRow[w + 1] = pixelRow[w + 2] = pixelRow[w + 3] = 0;
                    continue;
                }
                pixelRow[w + 0] = tempRow[w + (point.x * 4) + 0];
                pixelRow[w + 1] = tempRow[w + (point.x * 4) + 1];
                pixelRow[w + 2] = tempRow[w + (point.x * 4) + 2];
                pixelRow[w + 3] = tempRow[w + (point.x * 4) + 3];
            }
        }
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
        this.w = w, this.h = h, this.c = c;
        this.d1 = new Uint8ClampedArray(w * h * 4), this.d2 = new Array(h);
        for (var i = 0; i < h; i++)this.d2[i] = new Uint8ClampedArray(this.d1.buffer, i * w * 4, w * 4);
        this.D1 = new Uint32Array(this.d1.buffer), this.D2 = new Array(h);
        for (var i = 0; i < h; i++)this.D2[i] = new Uint32Array(this.D1.buffer, i * w * 4, w);
    }
    fillColor(inputColor) {
        const color = ((inputColor.a << 24) | (inputColor.b << 16) | (inputColor.g << 8) | inputColor.r) >>> 0;
        new Uint32Array(this.d1.buffer).fill(color);
    }
    clear() { new Uint32Array(this.d1.buffer).fill(0x00000000); return this; }
    set(inputPixelData) { this.d1.set(inputPixelData.d1); }
    clone() {
        var newPixelData = new PixelData(this.w, this.h, this.c);
        for (var i = 0; i < this.d1.length; i++)newPixelData.d1[i] = this.d1[i];
        return newPixelData;
    }
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
    clear() { new Float32Array(this.d1.buffer).fill(0x00000000); return this; }
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
        this.opacity = 1; //可超過一百甚至為負值
        this.display = true;
        /////////////
        this.mixBlendMode = "普通";
        this.tag = "預設標籤";
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

class Canvas {
    static mouseDownLeft = false;
    static mouseDownMiddle = false;
    static mouseDownRight = false;

    static mouseNowPoint = new Point(0, 0);
    static mousePreviousPoint = new Point(0, 0);

    static mouseClickPoint = new Point(0, 0);
    static mouseEndPoint = new Point(0, 0);

    static scale = new Size(1, 1);
    static translate = new Point(0, 0);
    static center = new Point(0, 0);

    static pathCurrentIndex = 1;

    static get width() { return getByid("picture").width; }
    static get height() { return getByid("picture").height; }

    static get cursor() { return getByid("circle-cursor"); }

    static getCurrentPoint(point) {
        function reverseTransform(transformOriginX, transformOriginY, translateX, translateY, scaleX, scaleY, dx, dy) {
            const x = (dx - transformOriginX - scaleX * translateX) / scaleX + transformOriginX;
            const y = (dy - transformOriginY - scaleY * translateY) / scaleY + transformOriginY;
            return new Point(x | 0, y | 0);
        }
        return reverseTransform(Canvas.center.x, Canvas.center.y, Canvas.translate.x, Canvas.translate.y,
            Canvas.scale.x, Canvas.scale.y, point.x, point.y);
    }
    static getRevertCurrentPoint(point) {
        function forwardTransform(transformOriginX, transformOriginY, translateX, translateY, scaleX, scaleY, x, y) {
            const dx = (x - transformOriginX) * scaleX + transformOriginX + scaleX * translateX;
            const dy = (y - transformOriginY) * scaleY + transformOriginY + scaleY * translateY;
            return new Point(dx | 0, dy | 0);
        }
        return forwardTransform(Canvas.center.x, Canvas.center.y, Canvas.translate.x, Canvas.translate.y,
            Canvas.scale.x, Canvas.scale.y, point.x, point.y);
    }

    static AutoFitTransform() {
        var canvasArea = getByid("canvas_area");
        var layerManager = ToolSelector.project.layerManager;

        // 計算縮放比例（等比例縮放，fit）
        const scale = Math.min(canvasArea.clientWidth / layerManager.width, canvasArea.clientHeight / layerManager.height);

        // 計算縮放後的寬高
        const newWidth = layerManager.width * scale;
        const newHeight = layerManager.height * scale;

        // 計算置中所需的平移
        const translateX = (canvasArea.clientWidth - newWidth) / 2;
        const translateY = (canvasArea.clientHeight - newHeight) / 2;

        Canvas.scale.x = scale;
        Canvas.scale.y = scale;
        Canvas.translate.x = translateX;
        Canvas.translate.y = translateY;
        Canvas.setTransform();
    }
    static setTransform() {
        if (handTool.AlignBy == "Upper left corner") Canvas.center.x = Canvas.center.y = 0;
        if (handTool.AlignBy == "Upper left corner") Canvas.translate.x = Canvas.translate.y = 0;
        if (handTool.AlignBy == "center") Canvas.center.x = getByid("canvas_area").clientWidth / 2, Canvas.center.y = getByid("canvas_area").clientHeight / 2;
        if (handTool.AlignBy == "center") Canvas.translate.x = getByid("canvas_area").clientWidth / 2 - Canvas.width / 2, Canvas.translate.y = getByid("canvas_area").clientHeight / 2 - Canvas.height / 2;
        var container = getByid("PictureContainer");
        container.style["transform-origin"] = `${Canvas.center.x}px ${Canvas.center.y}px`;
        container.style["transform"] = `scale(${Canvas.scale.x} , ${Canvas.scale.y}) translate(${Canvas.translate.x}px , ${Canvas.translate.y}px)`;
        GUI.refleshMarkCanvas();
    }
}
