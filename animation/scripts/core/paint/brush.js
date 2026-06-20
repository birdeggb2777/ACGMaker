
class Brush {
    constructor() {
        this.id = null;
        this.size = 20;
        this.opacity = 95;
        this.antiAliasing = 5;
        this.seal = null;
    }
    // static Painting = false; //代表已經下筆 
    static cache = null;
    // 材料
    static pencilMaterial = [];
    static waterpenMaterial = [];
};

function loadPencilMaterial() {
    Brush.pencilMaterial = [0, 0, 0, 0];
    const img0 = new Image(), img1 = new Image(), img2 = new Image(), img3 = new Image();
    img0.src = "./image/material/pencil1.png"; img1.src = "./image/material/pencil2.png";
    img2.src = "./image/material/pencil3.png"; img3.src = "./image/material/pencil4.png";

    function loadMaterial(img, index) {
        const canvas = createCanvas(img.width, img.height), ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        Brush.pencilMaterial[index] = new F32PixelData(img.width, img.height, 4);
        for (var i = 0; i < Brush.pencilMaterial[index].d1.length; i++) Brush.pencilMaterial[index].d1[i] = imageData.data[i];
    }
    img0.onload = () => loadMaterial(img0, 0); img1.onload = () => loadMaterial(img1, 1);
    img2.onload = () => loadMaterial(img2, 2); img3.onload = () => loadMaterial(img3, 3);
}
loadPencilMaterial();

function loadWaterpenMaterial() {
    Brush.waterpenMaterial = [0];
    const img0 = new Image();
    img0.src = "./image/material/waterpen1.png";

    img0.onload = () => {
        const canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
        canvas.width = img0.width, canvas.height = img0.height;
        ctx.drawImage(img0, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        Brush.waterpenMaterial[0] = new F32PixelData(img0.width, img0.height, 4);
        for (var i = 0; i < Brush.waterpenMaterial[0].d1.length; i++) Brush.waterpenMaterial[0].d1[i] = imageData.data[i];
    };
}
loadWaterpenMaterial();

// 起筆時要做的動作 (清除暫存區域)
function beginPencilTool() {
    // 複製pixelData到參考和active
    ToolSelector.project.layerManager.cache.active.clear();
}

// 收筆時要做的動作 (效能還可以改善)
function endPencilTool() {
    // 紀錄歷史狀態
    if (ToolSelector.brush != operateTool) Command.cmd("history", "");
    // 將active覆蓋到pixelData
    ActiveData2PixelData(ToolSelector.project.layerManager.cache.active, 0, 0, Canvas.width, Canvas.height, ToolSelector.layer.pixelData, 0, 0, Canvas.width, Canvas.height);
    // 更新整張影像
    GUI.refleshSandwichAndFullCanvas();
}

// 串聯路徑，[0,1,2]變成[[0,1],[1,2]]
function path2LinkPath(path) {
    var newPath = [];
    for (var i = 1; i < path.length; i++) {
        var point = path[i], previewPoint = path[i - 1];
        var dist = ((point.x - previewPoint.x) ** 2 + (point.y - previewPoint.y) ** 2) ** 0.5;
        if (!dist || isNaN(dist)) continue; // 距離算不出來或為0，就不用加入了
        newPath.push([previewPoint, point, dist]);
    }
    return newPath;
}
// 串聯路徑，[0,1,2]變成[[0,1],[1,2]](添加筆壓版本)
function path2LinkPathIncludePressure(path, pressurePath) {
    var newPath = [];
    for (var i = 1; i < path.length; i++) {
        var point = path[i], previewPoint = path[i - 1];
        var dist = ((point.x - previewPoint.x) ** 2 + (point.y - previewPoint.y) ** 2) ** 0.5;
        if (!dist || isNaN(dist)) continue; // 距離算不出來或為0，就不用加入了
        newPath.push([previewPoint, point, dist, pressurePath[i]]);
    }
    return newPath;
}

// 製作實心圓
function createCircle(halfSize, rgbaList, edgeWidth = 0) {
    // 座標是中心點
    var point = new Point(halfSize * 1, halfSize * 1);
    // 建立筆刷的快取
    Brush.cache = new F32PixelData(halfSize * 2 + 1, halfSize * 2 + 1, 4);
    // 偏移是相對於中心點的，負一半到正一半
    var minY = -halfSize, minX = -halfSize, maxY = halfSize, maxX = halfSize;
    // 顏色來自list
    var [r, g, b, a] = rgbaList;
    // 製作實心圓
    for (var y = minY; y <= maxY; y++) {
        for (var x = minX; x <= maxX; x++) {
            var dist = (x * x + y * y) ** 0.5;
            if (dist <= halfSize) {
                let alpha = ((halfSize - dist) / edgeWidth) + 0.5;
                if (alpha <= 0) continue;   // 球外的像素會直接無視。
                if (alpha > 1) alpha = 1.0; // 球內的像素保持不透明。
                Brush.cache.d2[point.y + y][(point.x + x) * 4 + 0] = r;
                Brush.cache.d2[point.y + y][(point.x + x) * 4 + 1] = g;
                Brush.cache.d2[point.y + y][(point.x + x) * 4 + 2] = b;
                Brush.cache.d2[point.y + y][(point.x + x) * 4 + 3] = alpha * a;
            }
        }
    }
}
// 製作空心圓
function createHoleCircle(halfSize, rgbaList, edgeWidth = 0, lineWidth = 1) {
    // 座標是中心點
    var point = new Point(halfSize * 1, halfSize * 1);
    // 建立筆刷的快取
    Brush.cache = new F32PixelData(halfSize * 2 + 1, halfSize * 2 + 1, 4);
    // 偏移是相對於中心點的，負一半到正一半
    var minY = -halfSize, minX = -halfSize, maxY = halfSize, maxX = halfSize;
    // 顏色來自list
    var [r, g, b, a] = rgbaList;
    // 製作空心圓
    for (var y = minY; y <= maxY; y++) {
        for (var x = minX; x <= maxX; x++) {
            var dist = (x * x + y * y) ** 0.5;
            if (dist <= halfSize + lineWidth && dist >= halfSize - lineWidth) {
                let alpha = ((halfSize - dist) / edgeWidth) + 0.5;
                if (alpha <= 0) continue;   // 球外的像素會直接無視。
                if (alpha > 1) alpha = 1.0; // 球內的像素保持不透明。
                Brush.cache.d2[point.y + y][(point.x + x) * 4 + 0] = r;
                Brush.cache.d2[point.y + y][(point.x + x) * 4 + 1] = g;
                Brush.cache.d2[point.y + y][(point.x + x) * 4 + 2] = b;
                Brush.cache.d2[point.y + y][(point.x + x) * 4 + 3] = alpha * a;
            }
        }
    }
}
// 製作矩形
function createTriangle(rgbaList, minX_, minY_, maxX_, maxY_, inputPoint) {
    // 偵測座標是否在矩形內
    function isPointInTriangle(p, p0, p1, p2) {
        const crossProduct = (pA, pB, pC) => (pA.x - pC.x) * (pB.y - pC.y) - (pA.y - pC.y) * (pB.x - pC.x);
        const d1 = crossProduct(p, p0, p1), d2 = crossProduct(p, p1, p2), d3 = crossProduct(p, p2, p0);
        const has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0), has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);
        return !(has_neg && has_pos);
    }
    // 建立筆刷的快取
    Brush.cache = new F32PixelData(maxX_ - minX_ + 1, maxY_ - minY_ + 1, 4);
    // 中心點座標
    var point = new Point(maxX_ - minX_, maxY_ - minY_);
    var minY = 0, minX = 0, maxY = maxY_ - minY_, maxX = maxX_ - minX_;
    var [r, g, b, a] = rgbaList;
    var [p0, p1, p2] = inputPoint;
    for (var y = minY; y <= maxY; y++) {
        for (var x = minX; x <= maxX; x++) {
            let inTriangle = isPointInTriangle(new Point(x + minX_, y + minY_), p0, p1, p2);
            if (inTriangle <= 0) continue;
            Brush.cache.d2[y][x * 4 + 0] = r;
            Brush.cache.d2[y][x * 4 + 1] = g;
            Brush.cache.d2[y][x * 4 + 2] = b;
            Brush.cache.d2[y][x * 4 + 3] = a;
        }
    }
}

// 裝飾工具
function invokeEggTool1() {
    return;
}

// 選擇工具1
function invokeSelectTool1() {
    if (ToolSelector.path.length <= 1) {
        ToolSelector.selection = null;
        GUI.refleshMarkCanvas();
        return;
    }
    // 框選的開始/目前
    var startPoint = Canvas.mouseClickPoint;
    var endPoint = ToolSelector.path[ToolSelector.path.length - 1];
    // 找出四個角落
    var top = startPoint.y < endPoint.y ? startPoint.y : endPoint.y;
    var bottom = startPoint.y > endPoint.y ? startPoint.y : endPoint.y;
    var left = startPoint.x < endPoint.x ? startPoint.x : endPoint.x;
    var right = startPoint.x > endPoint.x ? startPoint.x : endPoint.x;
    // 防止超出範圍
    left = left < 0 ? 0 : (left > Canvas.width ? Canvas.width : left);
    right = right < 0 ? 0 : (right > Canvas.width ? Canvas.width : right);
    top = top < 0 ? 0 : (top > Canvas.height ? Canvas.height : top);
    bottom = bottom < 0 ? 0 : (bottom > Canvas.height ? Canvas.height : bottom);
    // 套用選擇的範圍
    if (top == bottom || left == right) ToolSelector.selection = null;
    else ToolSelector.selection = new Selection("rect", new Rect(left, top, right, bottom));
    // 更新標記到畫面上
    GUI.refleshMarkCanvas();
}

// 選擇工具2
function invokeSelectTool2() {

    // 這個是要直接修改的pixelData
    var pixelData = ToolSelector.layer.pixelData;

    var root = ToolSelector.project.layerManager, cache = root.cache.cache.d2, layer = ToolSelector.layer;
    const active = ToolSelector.project.layerManager.cache.active.d2;
    const pixels = layer.pixelData.d2;

    var temp = new PixelData(ToolSelector.layer.width, ToolSelector.layer.height, 4);
    var [left, top, right, bottom] = [layer.x, layer.y, layer.x + layer.width, layer.y + layer.height];

    if (selectTool2.magicType == "魔術棒") {
        var point = Canvas.mouseClickPoint;
        var ColorDifference = selectTool2.ColorDiff;

        //建立參照表，數值小於它就可以填充
        var [clickColorR, clickColorG, clickColorB, clickColorA] = getRgbaByPointFromPixelData(point, ToolSelector.layer.pixelData)

        for (var h = top; h < bottom; h++) {
            for (var w = left * 4; w < right * 4; w += 4) {
                var currentColor = pixels[h][w + 0] + pixels[h][w + 1] + pixels[h][w + 2] + pixels[h][w + 3];
                var clickColor = clickColorR + clickColorG + clickColorB + clickColorA;
                var gap = ((clickColorR - pixels[h][w + 0]) ** 2 + (clickColorG - pixels[h][w + 1]) ** 2 + (clickColorB - pixels[h][w + 2]) ** 2 + (clickColorA - pixels[h][w + 3]) ** 2) ** 0.5;

                temp.d2[h][w + 0] = temp.d2[h][w + 1] = temp.d2[h][w + 2] = temp.d2[h][w + 3] = gap;
            }
        }
    } else if (selectTool2.magicType == "仙女棒") {
        var size = selectTool2.size;
        var point = Canvas.mouseClickPoint;
        var ColorDifference = selectTool2.ColorDiff;

        //建立參照表，數值小於它就可以填充
        var K_value = 5;
        const pixelsD2 = layer.pixelData.d2;
        var rList = [];
        for (var r = 0; r <= 255; r += 50) {
            var gList = [];
            for (var g = 0; g <= 255; g += 50) {
                var bList = [];
                for (var b = 0; b <= 255; b += 50) bList.push([]);
                gList.push(bList);
            }
            rList.push(gList);
        }

        function distance(p1, p2) {
            let r = p1.r - p2.r, g = p1.g - p2.g, b = p1.b - p2.b;
            return Math.sqrt(r * r + g * g + b * b);
        }

        var [left_, top_, right_, bottom_] = [point.x - size, point.y - size, point.x + size, point.y + size];
        left_ = left_ < 0 ? 0 : (left_ > root.width ? root.width : left_);
        right_ = right_ < 0 ? 0 : (right_ > root.width ? root.width : right_);
        top_ = top_ < 0 ? 0 : (top_ > root.height ? root.height : top_);
        bottom_ = bottom_ < 0 ? 0 : (bottom_ > root.height ? root.height : bottom_);

        for (var h = top_; h < bottom_; h++) {
            const pixelRow = pixels[h];
            for (var w = left_ * 4; w < right_ * 4; w += 4) {
                let r = pixelsD2[h][w], g = pixelsD2[h][w + 1], b = pixelsD2[h][w + 2];
                rList[parseInt(r / 50)][parseInt(g / 50)][parseInt(b / 50)].push([r, g, b]);
            }
        }

        var firstList = [];
        for (var r in rList) {
            for (var g in gList) {
                for (var b in bList) {
                    if (rList[r][g][b].length > 0) {
                        firstList.push(parseInt(rList[r][g][b].length));
                    }
                }
            }
        }
        var firstListColor = [];
        var firstList2 = firstList.sort((a, b) => a - b).reverse();
        for (var f in firstList2) {
            for (var r in rList) {
                for (var g in gList) {
                    for (var b in bList) {
                        if (rList[r][g][b].length == firstList2[f]) {
                            if (f < K_value) firstListColor.push([r, g, b]);
                        }
                    }
                }
            }
        }
        var centers = [];
        for (var colorList1 of firstListColor) {
            var colorList = rList[colorList1[0]][colorList1[1]][colorList1[2]];
            var r_count = 0, g_count = 0, b_count = 0;
            for (var color of colorList) {
                r_count += color[0];
                g_count += color[1];
                b_count += color[2];
            }
            var r_avg = parseInt(r_count / colorList.length);
            var g_avg = parseInt(g_count / colorList.length)
            var b_avg = parseInt(b_count / colorList.length);
            centers.push({ r: r_avg, g: g_avg, b: b_avg });
        }
        K_value = centers.length;

        for (var h = top; h < bottom; h++) {
            for (var w = left * 4; w < right * 4; w += 4) {
                var currentColor = pixels[h][w + 0] + pixels[h][w + 1] + pixels[h][w + 2] + pixels[h][w + 3];
                //var clickColor = clickColorR + clickColorG + clickColorB + clickColorA;
                var gap = 99999999;
                for (var k = 0; k < K_value; k++) {
                    var gap_temp = ((pixels[h][w + 0] - centers[k].r) ** 2 + (pixels[h][w + 1] - centers[k].g) ** 2 + (pixels[h][w + 2] - centers[k].b) ** 2) ** 0.5;
                    if (gap > gap_temp) gap = gap_temp;
                }

                temp.d2[h][w + 0] = temp.d2[h][w + 1] = temp.d2[h][w + 2] = temp.d2[h][w + 3] = gap;
            }
        }
    }

    for (var h = top; h < bottom; h++) {
        const pixelRow = pixels[h], cacheRow = cache[h];
        for (var w = left * 4; w < right * 4; w += 4) {
            cacheRow[w + 0] = 0;
            cacheRow[w + 1] = 0;
            cacheRow[w + 2] = 0;
            cacheRow[w + 3] = 0;
        }
    }
    //////////////////////
    function CrossWater2(arr) {
        var nextArr = [];
        for (var i = 0; i < arr.length; i++) {
            var point = arr[i];

            //由左至右
            for (var w = (point.x + 1) * 4, w0 = (point.x + 1); w < right * 4; w += 4, w0++) {
                if (cache[point.y][w] == 0 && temp.d2[point.y][w + 0] <= ColorDifference) {
                    cache[point.y][w] = 7;
                    nextArr.push(new Point(w0, point.y));
                } else break;
            }

            //從右到左
            for (var w = (point.x - 1) * 4, w0 = (point.x - 1); w >= left * 4; w -= 4, w0--) {
                if (cache[point.y][w] == 0 && temp.d2[point.y][w + 1] <= ColorDifference) {
                    cache[point.y][w] = 7;
                    nextArr.push(new Point(w0, point.y));
                } else break;
            }

            //從上到下
            for (var h = point.y + 1; h < bottom; h++) {
                if (cache[h][point.x * 4] == 0 && temp.d2[h][point.x * 4 + 2] <= ColorDifference) {
                    cache[h][point.x * 4] = 7;
                    nextArr.push(new Point(point.x, h));
                } else break;
            }

            //從下到上
            for (var h = point.y - 1; h >= top; h--) {
                if (cache[h][point.x * 4] == 0 && temp.d2[h][point.x * 4 + 3] <= ColorDifference) {
                    cache[h][point.x * 4] = 7;
                    nextArr.push(new Point(point.x, h));
                } else break;
            }
        }
        return nextArr;
    }

    var PointArr = [point];
    while (PointArr.length > 0) PointArr = CrossWater2(PointArr);


    ToolSelector.selection = new Selection("pixel", new PixelData(layer.width, layer.height, 4));
    var map = ToolSelector.selection.content;
    var includeContent = 0;

    for (var h = top; h < bottom; h++) {
        const mapRow = map.d2[h];
        for (var w = left * 4; w < right * 4; w += 4) {
            if (cache[h][w] != 7) mapRow[w + 0] = mapRow[w + 1] = mapRow[w + 2] = mapRow[w + 3] = 0;
            else includeContent = mapRow[w + 0] = mapRow[w + 1] = mapRow[w + 2] = mapRow[w + 3] = 1;
        }
    }
    if (includeContent == 0) ToolSelector.selection = null;
    GUI.refleshMarkCanvas();
}

// 手掌工具
function invokeHandTool() {
    if (ToolSelector.path.length <= 1) return;
    if (!Canvas.mouseDownLeft && !Canvas.mouseDownMiddle) return;
    // 移動畫布位置
    if (Canvas.mouseDownLeft || Canvas.mouseDownMiddle) {
        Canvas.translate.x -= (Canvas.mousePreviousPoint.x - Canvas.mouseNowPoint.x) / Canvas.scale.x;
        Canvas.translate.y -= (Canvas.mousePreviousPoint.y - Canvas.mouseNowPoint.y) / Canvas.scale.y;
    }
    // 套用到畫布
    Canvas.setTransform();
}

// 滴管工具
function invokeDropperTool() {
    // 取得現在的座標
    if (!(ToolSelector.path && ToolSelector.path.length >= 1)) var point = Canvas.mouseClickPoint;
    else var point = ToolSelector.path[ToolSelector.path.length - 1];
    // 對圖層提取顏色
    if (dropperTool.source == "layer")
        var [clickColorR, clickColorG, clickColorB, clickColorA] = getRgbaByPointFromPixelData(point, ToolSelector.layer.pixelData);
    // 對整張影像提取顏色
    if (dropperTool.source == "full")
        var [clickColorR, clickColorG, clickColorB, clickColorA] = getRgbaByPointFromPixelData(point, ToolSelector.project.layerManager.result);
    // 更新選擇的顏色
    updateColor(clickColorR, clickColorG, clickColorB, clickColorA);
}

// 漸層工具
function invokeGradientTool() {
    // 選擇色
    var rgba = ToolSelector.color.toRGBAList();
    // 背景色
    var rgba2 = ToolSelector.前背透色[1].toRGBAList();
    // 建立色彩表，選擇色到背景色(0~100)
    var ColorList = new Array(100);
    for (var i = 0; i <= 100; i++) {
        var ratio = i / 100.0, inv = 1 - ratio;
        ColorList[i] = new Color(((rgba[0] * ratio + rgba2[0] * inv)) | 0, ((rgba[1] * ratio + rgba2[1] * inv)) | 0, ((rgba[2] * ratio + rgba2[2] * inv)) | 0, ((rgba[3] * ratio + rgba2[3] * inv)) | 0);
    }
    // 已經放開滑鼠了(放開右鍵也有反應，bug)
    if (Canvas.mouseDownLeft == false) {
        // 按下的座標/目前的座標
        var point1 = Canvas.mouseClickPoint;
        var point2 = Canvas.mouseEndPoint;
        // 定義範圍
        var layer = ToolSelector.layer, [left, top, right, bottom] = [layer.x, layer.y, layer.x + layer.width, layer.y + layer.height];
        // 這個是要直接修改的pixelData
        const pixels = layer.pixelData.d2;
        // 建立遮罩，若無就用假遮罩代替
        const hasSelection = ToolSelector.hasSelection && ToolSelector.selection.getMap() ? true : false;
        const mask = hasSelection ? ToolSelector.selection.getMap().d2 : new Uint8ClampedArray(bottom * 4).fill(255);
        // 製作漸層
        for (var h = top; h < bottom; h++) {
            const pixelRow = pixels[h], maskRow = hasSelection ? mask[h] : mask;
            for (var w = left * 4, w0 = left; w < right * 4; w += 4, w0++) {
                if (maskRow[w + 0] === 0) continue;
                // 計算目前的像素，距離兩點的座標
                const dist1 = (((point1.x - w0) ** 2 + (point1.y - h) ** 2) ** 0.5) | 0;
                const dist2 = (((point2.x - w0) ** 2 + (point2.y - h) ** 2) ** 0.5) | 0;
                // 兩點距離總和
                const dist_twice = dist1 + dist2;
                // 依據距離，套用權重
                const ratio = ((dist1 / dist_twice) * 100) | 0;
                pixelRow[w + 0] = ColorList[ratio].r;
                pixelRow[w + 1] = ColorList[ratio].g;
                pixelRow[w + 2] = ColorList[ratio].b;
                pixelRow[w + 3] = ColorList[ratio].a;
            }
        }
        GUI.refleshSandwichAndFullCanvas();
    }
    // 如果還在拉線
    else {
        // 先清除要直接修改的pixelData
        var pixelData = ToolSelector.project.layerManager.cache.active.clear();
        // 預覽的線條，是固定的大小
        var size = 5, halfSize = 2;
        // 透明色會用完全覆蓋的方式
        const 混合方式 = 混合模式.筆刷;
        // 按下的座標/目前的座標 
        var startPoint = Canvas.mouseClickPoint;
        var endPoint = ToolSelector.path[ToolSelector.path.length - 1];
        // 計算出兩點距離
        var distance = ((endPoint.x - startPoint.x) ** 2 + (endPoint.y - startPoint.y) ** 2) ** 0.5;
        //前一座標到當前座標的距離
        for (var i = 0; i <= distance; i++) {
            // 依據距離計算出比率
            var ratio = i / distance;
            // 依據比率對應的色彩，建立圓形貼圖
            var rgba = ColorList[(ratio * 100) | 0].toRGBAList();
            createCircle(halfSize, rgba, 1.0);
            // 計算出目前座標
            var currentPoint = new Point((startPoint.x + (endPoint.x - startPoint.x) * ratio) | 0, (startPoint.y + (endPoint.y - startPoint.y) * ratio) | 0);
            const Y = currentPoint.y, X = currentPoint.x;
            // 將貼圖貼到像素
            pastePixelData(Brush.cache, 0, 0, size, size, pixelData, X - halfSize, Y - halfSize, size, size, 混合方式);
        }
        /////////////////////////////////////////////////////////////////////////////////////////////
        // 找出最大點及最小點，僅更新該區域，省運算量
        var minX = Canvas.width, maxX = 0, minY = Canvas.height, maxY = 0;
        var path = [startPoint, endPoint];
        for (var p = 0; p < path.length; p++) {
            if (minX >= path[p].x) minX = path[p].x;
            if (minY >= path[p].y) minY = path[p].y;
            if (maxX <= path[p].x) maxX = path[p].x;
            if (maxY <= path[p].y) maxY = path[p].y;
        }
        // 往外多擴張一px
        ToolSelector.project.layerManager.needRefleshRect = true;// new Rect((minX - size / 2 - 1) | 0, (minY - size / 2 - 1) | 0, (maxX + size / 2 + 1) | 0, (maxY + size / 2 + 1) | 0);
        // 更新目前路徑的Index，在下一瞬間的游標位置更新，就不用重複計算
        Canvas.pathCurrentIndex = ToolSelector.path.length - 1;
        // 更新畫布的顯示內容
        GUI.refleshCanvas();
        // 如果選取的是背景色，那選擇色和背景色都會是同一個顏色
        if (ToolSelector.colorIndex == 1) GUI.setStatusAlert("請注意，您正在選取背景色，無法發揮漸層效果！！！");
    }
}
// 印章工具
function invokeSealTool() {
    var layer = ToolSelector.layer;

    // 如果在複製模式
    if (isKeyPressed("Alt")) {
        ToolSelector.brush.seal = new F32PixelData(layer.width, layer.height, 4);
        // 這個是要直接複製的來源
        var sourcePixel = ToolSelector.layer.pixelData;
        pastePixelData(sourcePixel, 0, 0, layer.width, layer.height, ToolSelector.brush.seal, 0, 0, layer.width, layer.height, 混合模式.完全覆蓋);
        // 取得現在的座標
        if (!(ToolSelector.path && ToolSelector.path.length >= 1)) ToolSelector.brush.point = Canvas.mouseClickPoint;
        else ToolSelector.brush.point = ToolSelector.path[ToolSelector.path.length - 1];
        return;
    }

    /////////////////////////////////////////////////////////////////////////////////////////////
    // 如果在繪製模式
    if (!ToolSelector.brush.seal)
        return GUI.setStatusAlert("沒有印章，請先按住alt並點擊影像複製一份印章，沒有印章就怎麼按都不會有反應！！！");

    // 座標不滿兩個，就不做任何事
    if (ToolSelector.path.length <= 2) return;
    // 這個是要直接修改的pixelData
    var pixelData = ToolSelector.project.layerManager.cache.active;
    // 前一次畫過的不再拿出來
    var path = ToolSelector.path.slice(Canvas.pathCurrentIndex);
    var pressurePath = ToolSelector.pressurePath.slice(Canvas.pathCurrentIndex);
    path = path2LinkPathIncludePressure(path, pressurePath)[0];
    // 印章大小
    var size = ToolSelector.brush.size, halfSize = (size / 2) | 0;
    // 筆刷座標
    var brushPoint = ToolSelector.brush.point ? ToolSelector.brush.point : new Point((layer.width / 2) | 0, (layer.height / 2) | 0);

    var [startPoint, endPoint, distance, pressure] = path;
    //前一座標到當前座標的距離
    for (var i = 0; i <= distance; i++) {
        // 依據距離計算出比率
        var ratio = i / distance;
        // 計算目前座標
        var currentPoint = new Point((startPoint.x + (endPoint.x - startPoint.x) * ratio) | 0, (startPoint.y + (endPoint.y - startPoint.y) * ratio) | 0);
        const Y = currentPoint.y + (((size - size * pressure) / 2) | 0), X = currentPoint.x + (((size - size * pressure) / 2) | 0);

        var offsetPoint = new Point(Canvas.mouseClickPoint.x - X, Canvas.mouseClickPoint.y - Y)
        // 將貼圖貼到像素
        pastePixelData(ToolSelector.brush.seal, brushPoint.x - halfSize - offsetPoint.x, brushPoint.y - halfSize - offsetPoint.y, size, size, pixelData, X - halfSize, Y - halfSize, size, size, 混合模式.筆刷);
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    // 找出最大點及最小點，僅更新該區域，省運算量
    var minX = Canvas.width, maxX = 0, minY = Canvas.height, maxY = 0;
    for (var p = Canvas.pathCurrentIndex; p < ToolSelector.path.length; p++) {
        if (minX >= ToolSelector.path[p].x) minX = ToolSelector.path[p].x;
        if (minY >= ToolSelector.path[p].y) minY = ToolSelector.path[p].y;
        if (maxX <= ToolSelector.path[p].x) maxX = ToolSelector.path[p].x;
        if (maxY <= ToolSelector.path[p].y) maxY = ToolSelector.path[p].y;
    }
    // 往外多擴張一px
    ToolSelector.project.layerManager.needRefleshRect = new Rect((minX - size / 2 - 1) | 0, (minY - size / 2 - 1) | 0, (maxX + size / 2 + 1) | 0, (maxY + size / 2 + 1) | 0);
    // 更新目前路徑的Index，在下一瞬間的游標位置更新，就不用重複計算
    Canvas.pathCurrentIndex = ToolSelector.path.length - 1;
    // 更新畫布的顯示內容
    GUI.refleshCanvas();
}
// 文字工具
function invokeTextTool() {

}
// 操作工具 (尚未完成)
function invokeOperateTool() {
    var layer = ToolSelector.layer, [left, top, right, bottom] = [layer.x, layer.y, layer.x + layer.width, layer.y + layer.height], mask = null;
    // 讀取mask，沒有就選擇全部
    const hasSelection = ToolSelector.hasSelection && ToolSelector.selection.getMap() ? true : false;
    mask = hasSelection ? ToolSelector.selection.getMap().d2 : mask = new Uint8ClampedArray(bottom * 4).fill(255);
    const pixels = layer.pixelData.d2;
    // 如果是剛按下
    if (ToolSelector.path.length == 0) {
        //operateTool.selection = null;
        Brush.cache = new F32PixelData(right - left, bottom - top, 4);
        // 複製圖層內容到快取
        for (var h = top; h < bottom; h++) {
            const pixelRow = pixels[h], brushRow = Brush.cache.d2[h], maskRow = hasSelection ? mask[h] : mask;
            for (var w = left * 4; w < right * 4; w += 4) {
                if (maskRow[w + 0] === 0) continue;
                brushRow[w + 0] = pixelRow[w + 0];
                brushRow[w + 1] = pixelRow[w + 1];
                brushRow[w + 2] = pixelRow[w + 2];
                brushRow[w + 3] = pixelRow[w + 3];
                pixelRow[w + 0] = pixelRow[w + 1] = pixelRow[w + 2] = pixelRow[w + 3] = 0;
            }
        }
        GUI.refleshSandwichAndFullCanvas();
        // operateTool.selection = ToolSelector.selection;
        // 解除範圍選取
        ToolSelector.selection = null;
        GUI.refleshMarkCanvas();
    }

    // 先清除要直接修改的pixelData
    var activeData = ToolSelector.project.layerManager.cache.active.clear();

    if (ToolSelector.path.length < 2) {
        pastePixelData(Brush.cache, 0, 0, layer.width, layer.height, activeData, 0, 0, layer.width, layer.height, 混合模式.筆刷);
        // 往外多擴張一px
        ToolSelector.project.layerManager.needRefleshRect = true;
        // 更新畫布的顯示內容
        GUI.refleshCanvas();
        return;
    }

    // 按下的座標/目前的座標 
    var startPoint = Canvas.mouseClickPoint;
    var point = ToolSelector.path[ToolSelector.path.length - 1];
    var previewPoint = ToolSelector.path[ToolSelector.path.length - 2];

    /////////////////////////////////////////////////////////////////////////////////////////////
    pastePixelData(Brush.cache, 0, 0, layer.width, layer.height, activeData, point.x - startPoint.x, point.y - startPoint.y, layer.width, layer.height, 混合模式.筆刷);

    // 往外多擴張一px
    ToolSelector.project.layerManager.needRefleshRect = true;
    Canvas.pathCurrentIndex = ToolSelector.path.length - 1;
    // 更新畫布的顯示內容
    GUI.refleshCanvas();
}
// 形狀工具
function invokeShapeTool() {
    var root = ToolSelector.project.layerManager, cache = root.cache.cache.d2, layer = ToolSelector.layer;
    // 座標不滿兩個，或選擇到透明色，就不做任何事
    if (ToolSelector.path.length <= 1) return;
    if (ToolSelector.colorIndex == 2) return;
    // 先清除要直接修改的pixelData
    var pixelData = ToolSelector.project.layerManager.cache.active.clear();
    // 線條粗細
    var size = ToolSelector.brush.size, halfSize = (size / 2) | 0;
    // 對齊方式、形狀
    var Align = ToolSelector.brush.AlignBy, Shape = ToolSelector.brush.shape;
    // 指定顏色，並依據顏色製作實心圓
    var rgba = ToolSelector.color.toRGBAList();
    rgba[3] = parseInt(255 * (ToolSelector.brush.opacity / 100.0));
    createCircle(halfSize, rgba, ToolSelector.brush.antiAliasing);
    /////////////////////////////////////////////////////////////////////////////////////////////
    // 透明色會用完全覆蓋的方式
    const 混合方式 = 混合模式.筆刷;
    // 按下的座標/目前的座標 
    var startPoint = Canvas.mouseClickPoint;
    var endPoint = ToolSelector.path[ToolSelector.path.length - 1];
    // 計算出兩點距離
    var distance = ((endPoint.x - startPoint.x) ** 2 + (endPoint.y - startPoint.y) ** 2) ** 0.5;
    // 如果形狀是圓型
    if (Shape == "circle") {
        // 找出四個角落
        const left = Math.min(startPoint.x, endPoint.x); const right = Math.max(startPoint.x, endPoint.x);
        const top = Math.min(startPoint.y, endPoint.y); const bottom = Math.max(startPoint.y, endPoint.y);
        // 計算出圓的大小、製作成貼圖
        var gapX = parseInt(right - left) * 2, gapY = parseInt(bottom - top) * 2, circleSize = ((gapX ** 2 + gapY ** 2) ** 0.5);
        createHoleCircle((circleSize / 2) | 0, rgba, ToolSelector.brush.antiAliasing, size);
        // 依據對齊方式，計算出貼上的座標，貼到正確的位置上
        if (Align == "twice") var X = left, Y = top;
        if (Align == "center") var X = startPoint.x - circleSize / 2, Y = startPoint.y - circleSize / 2;
        pastePixelData(Brush.cache, 0, 0, circleSize - 1, circleSize - 1, pixelData, X | 0, Y | 0, circleSize - 1, circleSize - 1, 混合方式);
    }
    // 如果形狀是線
    if (Shape == "line") {
        // 如果對齊方式是兩點
        if (Align == "twice") {
            //前一座標到當前座標的距離
            for (var i = 0; i <= distance; i++) {
                var ratio = i / distance;
                var currentPoint = new Point((startPoint.x + (endPoint.x - startPoint.x) * ratio) | 0, (startPoint.y + (endPoint.y - startPoint.y) * ratio) | 0);
                const Y = currentPoint.y, X = currentPoint.x;
                pastePixelData(Brush.cache, 0, 0, size, size, pixelData, X - halfSize, Y - halfSize, size, size, 混合方式);
            }
        }
        // 如果對齊方式是中心點
        else if (Align == "center") {
            //前一座標到當前座標的距離
            for (var i = 0; i <= distance; i++) {
                var ratio = i / distance;
                var currentPoint = new Point((startPoint.x + (endPoint.x - startPoint.x) * ratio) | 0, (startPoint.y + (endPoint.y - startPoint.y) * ratio) | 0);
                pastePixelData(Brush.cache, 0, 0, size, size, pixelData, currentPoint.x - halfSize, currentPoint.y - halfSize, size, size, 混合方式);
                var currentPoint = new Point((startPoint.x - (endPoint.x - startPoint.x) * ratio) | 0, (startPoint.y - (endPoint.y - startPoint.y) * ratio) | 0);
                pastePixelData(Brush.cache, 0, 0, size, size, pixelData, currentPoint.x - halfSize, currentPoint.y - halfSize, size, size, 混合方式);
            }
        }
    }
    // 如果形狀是矩形
    if (Shape == "rect") {
        // 找出四個角落
        const left = Math.min(startPoint.x, endPoint.x); const right = Math.max(startPoint.x, endPoint.x);
        const top = Math.min(startPoint.y, endPoint.y); const bottom = Math.max(startPoint.y, endPoint.y);
        // 如果對齊方式是兩點
        if (Align == "twice") {
            var topLeft = new Point(left, top), topRight = new Point(right, top);
            var bottomLeft = new Point(left, bottom), bottomRight = new Point(right, bottom);
            var path = [[topLeft, topRight], [topRight, bottomRight], [bottomLeft, bottomRight], [bottomLeft, topLeft]];
        }
        // 如果對齊方式是中心點
        else if (Align == "center") {
            var gapX = parseInt(right - left), gapY = parseInt(bottom - top);
            var expandX = 0, expandY = 0;
            if (startPoint.x > endPoint.x) gapX = 0, expandX = parseInt(right - left);
            if (startPoint.y > endPoint.y) gapY = 0, expandY = parseInt(bottom - top);
            var topLeft = new Point(left - gapX, top - gapY), topRight = new Point(right + expandX, top - gapY);
            var bottomLeft = new Point(left - gapX, bottom + expandY), bottomRight = new Point(right + expandX, bottom + expandY);
            var path = [[topLeft, topRight], [topRight, bottomRight], [bottomLeft, bottomRight], [bottomLeft, topLeft]];
        }

        for (var p = 0; p < path.length; p++) {
            var [startPoint, endPoint] = path[p];
            var distance = ((endPoint.x - startPoint.x) ** 2 + (endPoint.y - startPoint.y) ** 2) ** 0.5;
            //前一座標到當前座標的距離
            for (var i = 0; i <= distance; i++) {
                // 依據距離計算出比率
                var ratio = i / distance;
                // 計算出目前座標
                var currentPoint = new Point((startPoint.x + (endPoint.x - startPoint.x) * ratio) | 0, (startPoint.y + (endPoint.y - startPoint.y) * ratio) | 0);
                const Y = currentPoint.y, X = currentPoint.x;
                // 將貼圖貼到像素
                pastePixelData(Brush.cache, 0, 0, size, size, pixelData, X - halfSize, Y - halfSize, size, size, 混合方式);
            }
        }
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    // 找出最大點及最小點，僅更新該區域，省運算量
    var minX = Canvas.width, maxX = 0, minY = Canvas.height, maxY = 0;
    var path = [startPoint, endPoint];
    for (var p = 0; p < path.length; p++) {
        if (minX >= path[p].x) minX = path[p].x;
        if (minY >= path[p].y) minY = path[p].y;
        if (maxX <= path[p].x) maxX = path[p].x;
        if (maxY <= path[p].y) maxY = path[p].y;
    }
    if (Align == "center") {
        var gapX = (maxX - minX), gapY = (maxY - minY);
        minY -= gapY / 1.25, maxY += gapY / 1.25;
        minX -= gapX / 1.25, maxX += gapX / 1.25;
    }
    // 往外多擴張一px
    ToolSelector.project.layerManager.needRefleshRect = true;// new Rect((minX - size / 2 - 1) | 0, (minY - size / 2 - 1) | 0, (maxX + size / 2 + 1) | 0, (maxY + size / 2 + 1) | 0);
    // 更新目前路徑的Index，在下一瞬間的游標位置更新，就不用重複計算
    Canvas.pathCurrentIndex = ToolSelector.path.length - 1;
    // 更新畫布的顯示內容
    GUI.refleshCanvas();
}

function invokeOilTool() {
    var fillType = oilTool.fillType;
    // 如果填充方式是油漆桶
    if (fillType == "油漆桶") {
        if (ToolSelector.path.length >= 1) return;
        // 這個是要直接修改的pixelData
        var pixelData = ToolSelector.layer.pixelData;
        //　無需說明
        var root = ToolSelector.project.layerManager, cache = root.cache.cache.clear().d2, layer = ToolSelector.layer;
        var [left, top, right, bottom] = [layer.x, layer.y, layer.x + layer.width, layer.y + layer.height];
        const active = ToolSelector.project.layerManager.cache.active.d2;
        const pixels = layer.pixelData.d2;
        // 前一次畫過的不再拿出來 
        var point = Canvas.mouseClickPoint;
        // 顏色差異
        var ColorDifference = oilTool.ColorDiff;
        // 選擇的顏色
        var color = ToolSelector.color;
        // 顏色差異圖
        var gapMap = new PixelData(ToolSelector.layer.width, ToolSelector.layer.height, 4);

        //建立顏色差異圖，數值小於它就可以填充
        if (oilTool.Separation == "color") {
            // 取得點擊的座標的顏色
            var [clickColorR, clickColorG, clickColorB, clickColorA] = getRgbaByPointFromPixelData(point, ToolSelector.layer.pixelData);
            // 製作顏色差異圖
            for (var h = top; h < bottom; h++) {
                const getMapRow = gapMap.d2[h];
                for (var w = left * 4; w < right * 4; w += 4) {
                    // 定義出該座標的顏色，比較和點擊位置的色彩差異
                    var currentColor = pixels[h][w + 0] + pixels[h][w + 1] + pixels[h][w + 2] + pixels[h][w + 3];
                    var clickColor = clickColorR + clickColorG + clickColorB + clickColorA;
                    var gap = ((clickColorR - pixels[h][w + 0]) ** 2 + (clickColorG - pixels[h][w + 1]) ** 2 + (clickColorB - pixels[h][w + 2]) ** 2 + (clickColorA - pixels[h][w + 3]) ** 2) ** 0.5;
                    // 將差異指派到gapMap上
                    getMapRow[w + 0] = getMapRow[w + 1] = getMapRow[w + 2] = getMapRow[w + 3] = gap;
                }
            }
        } else if (oilTool.Separation == "gradient") {
            // 往右、往左、往下、往上
            for (var h = top; h < bottom; h++) {
                for (var w = left * 4; w < right * 4; w += 4) {
                    // 定義出該座標的顏色，比較和點擊位置的色彩差異
                    var currentColor = pixels[h][w + 0] + pixels[h][w + 1] + pixels[h][w + 2] + pixels[h][w + 3];
                    // 請留意可能的錯誤
                    //var currentColorRight = currentColorLeft = currentColorBottom = currentColorTop = currentColor;
                    if (h == top || w == left * 4 || h == bottom - 1 || w == right * 4 - 4) var gapRight = gapLeft = gapBottom = gapTop = 0;
                    else {
                        // 定義出相鄰於該座標的顏色
                        var currentColorRight = pixels[h][w + 0 + 4] + pixels[h][w + 1 + 4] + pixels[h][w + 2 + 4] + pixels[h][w + 3 + 4];
                        var currentColorLeft = pixels[h][w + 0 - 4] + pixels[h][w + 1 - 4] + pixels[h][w + 2 - 4] + pixels[h][w + 3 - 4];
                        var currentColorBottom = pixels[h + 1][w + 0] + pixels[h + 1][w + 1] + pixels[h + 1][w + 2] + pixels[h + 1][w + 3];
                        var currentColorTop = pixels[h - 1][w + 0] + pixels[h - 1][w + 1] + pixels[h - 1][w + 2] + pixels[h - 1][w + 3];
                        // 定義出色彩差異 
                        var gapRight = ((pixels[h][w + 0] - pixels[h][w + 0 + 4]) ** 2 + (pixels[h][w + 1] - pixels[h][w + 1 + 4]) ** 2 + (pixels[h][w + 2] - pixels[h][w + 2 + 4]) ** 2 + (pixels[h][w + 3] - pixels[h][w + 3 + 4]) ** 2) ** 0.5;
                        var gapLeft = ((pixels[h][w + 0] - pixels[h][w + 0 - 4]) ** 2 + (pixels[h][w + 1] - pixels[h][w + 1 - 4]) ** 2 + (pixels[h][w + 2] - pixels[h][w + 2 - 4]) ** 2 + (pixels[h][w + 3] - pixels[h][w + 3 - 4]) ** 2) ** 0.5;
                        var gapBottom = ((pixels[h][w + 0] - pixels[h + 1][w + 0]) ** 2 + (pixels[h][w + 1] - pixels[h + 1][w + 1]) ** 2 + (pixels[h][w + 2] - pixels[h + 1][w + 2]) ** 2 + (pixels[h][w + 3] - pixels[h + 1][w + 3]) ** 2) ** 0.5;
                        var gapTop = ((pixels[h][w + 0] - pixels[h - 1][w + 0]) ** 2 + (pixels[h][w + 1] - pixels[h - 1][w + 1]) ** 2 + (pixels[h][w + 2] - pixels[h - 1][w + 2]) ** 2 + (pixels[h][w + 3] - pixels[h - 1][w + 3]) ** 2) ** 0.5;
                    }
                    // 將差異指派到gapMap上
                    gapMap.d2[h][w + 0] = gapRight, gapMap.d2[h][w + 1] = gapLeft;
                    gapMap.d2[h][w + 2] = gapBottom, gapMap.d2[h][w + 3] = gapTop;
                }
            }
        }

        // 洪水填充法修改版
        function CrossWater2(arr, mask) {
            var nextArr = [];
            for (var i = 0; i < arr.length; i++) {
                var point = arr[i];
                //由左至右
                for (var w = (point.x + 1) * 4, w0 = (point.x + 1); w < right * 4; w += 4, w0++) {
                    if (cache[point.y][w] == 0 && gapMap.d2[point.y][w + 0] <= ColorDifference && (!mask || mask[point.y][w] === 1)) {
                        cache[point.y][w] = 7;
                        nextArr.push(new Point(w0, point.y));
                    } else break;
                }
                //從右到左
                for (var w = (point.x - 1) * 4, w0 = (point.x - 1); w >= left * 4; w -= 4, w0--) {
                    if (cache[point.y][w] == 0 && gapMap.d2[point.y][w + 1] <= ColorDifference && (!mask || mask[point.y][w] === 1)) {
                        cache[point.y][w] = 7;
                        nextArr.push(new Point(w0, point.y));
                    } else break;
                }
                //從上到下
                for (var h = point.y + 1; h < bottom; h++) {
                    if (cache[h][point.x * 4] == 0 && gapMap.d2[h][point.x * 4 + 2] <= ColorDifference && (!mask || mask[h][point.x * 4] === 1)) {
                        cache[h][point.x * 4] = 7;
                        nextArr.push(new Point(point.x, h));
                    } else break;
                }
                //從下到上
                for (var h = point.y - 1; h >= top; h--) {
                    if (cache[h][point.x * 4] == 0 && gapMap.d2[h][point.x * 4 + 3] <= ColorDifference && (!mask || mask[h][point.x * 4] === 1)) {
                        cache[h][point.x * 4] = 7;
                        nextArr.push(new Point(point.x, h));
                    } else break;
                }
            }
            return nextArr;
        }
        // 要考慮是否有選擇範圍
        var mask = null;
        if (ToolSelector.hasSelection && ToolSelector.selection.getMap()) mask = ToolSelector.selection.getMap().d2;
        // 標記可填充區域為7
        var PointArr = [point];
        while (PointArr.length > 0) PointArr = CrossWater2(PointArr, mask);
        // 有被標記的地方，就填充選擇色
        for (var h = top; h < bottom; h++) {
            const pixelRow = pixels[h], cacheRow = cache[h];
            for (var w = left * 4; w < right * 4; w += 4) {
                if (cache[h][w] != 7) continue;
                pixelRow[w + 0] = color.r;
                pixelRow[w + 1] = color.g;
                pixelRow[w + 2] = color.b;
                pixelRow[w + 3] = color.a;
            }
        }
        // 指派到圖層，並顯示
        GUI.refleshSandwichAndFullCanvas();
    }
    // 如果填充方式是填充線
    else if (fillType == "填充線") {
        var root = ToolSelector.project.layerManager, cache = root.cache.cache.d2, layer = ToolSelector.layer;
        // 座標不滿兩個，或選擇到透明色，就不做任何事
        if (ToolSelector.path.length <= 1) return;
        if (ToolSelector.colorIndex == 2) return;
        // 這個是要直接修改的pixelData
        var pixelData = ToolSelector.project.layerManager.cache.active;
        // 大小和半徑
        var size = 4, halfSize = size / 1;
        // 指定顏色，並考慮透明度
        var rgba = ToolSelector.color.toRGBAList();
        rgba[3] = parseInt(255 * (ToolSelector.brush.opacity / 100.0));
        // 透明色會用完全覆蓋的方式
        var 混合方式 = 混合模式.反向塗抹;
        var startPoint = Canvas.mouseClickPoint;
        var minX = Canvas.width, maxX = 0, minY = Canvas.height, maxY = 0;
        if (Canvas.pathCurrentIndex > 2) {
            var path = [startPoint, ToolSelector.path[Canvas.pathCurrentIndex], ToolSelector.path[Canvas.pathCurrentIndex + 1]];
            for (var p = 0; p < path.length; p++) {
                if (minX >= path[p].x) minX = path[p].x;
                if (minY >= path[p].y) minY = path[p].y;
                if (maxX <= path[p].x) maxX = path[p].x;
                if (maxY <= path[p].y) maxY = path[p].y;
            }
            createTriangle(rgba, minX, minY, maxX, maxY, [startPoint, ToolSelector.path[Canvas.pathCurrentIndex + 1], ToolSelector.path[Canvas.pathCurrentIndex]]);
            pastePixelData(Brush.cache, 0, 0, maxX - minX, maxY - minY, pixelData, minX, minY, maxX - minX, maxY - minY, 混合方式);
            ToolSelector.project.layerManager.needRefleshRect = new Rect(minX, minY, maxX, maxY);;
        }
        // 更新目前路徑的Index，在下一瞬間的游標位置更新，就不用重複計算
        Canvas.pathCurrentIndex = ToolSelector.path.length - 1;
        // 更新畫布的顯示內容
        GUI.refleshCanvas();
    }
}
// 噴槍
function invokeSprayTool() {
    // 座標不滿兩個，就不做任何事
    if (ToolSelector.path.length <= 2) return;
    // 這個是要直接修改的pixelData
    var pixelData = ToolSelector.project.layerManager.cache.active;
    // 如果選擇色是透明色，直接將色彩指派到原始圖層
    if (ToolSelector.colorIndex == 2) pixelData = ToolSelector.layer.pixelData;
    // 前一次畫過的不再拿出來
    var path = ToolSelector.path.slice(Canvas.pathCurrentIndex);
    var pressurePath = ToolSelector.pressurePath.slice(Canvas.pathCurrentIndex);
    path = path2LinkPathIncludePressure(path, pressurePath)[0];
    // 筆刷大小
    var size = ToolSelector.brush.size * 2, halfSize = (size / 2) | 0;
    // 指定顏色，考慮透明度
    var rgba = ToolSelector.color.toRGBAList();
    rgba[3] = parseInt(255 * (ToolSelector.brush.opacity / 100.0));
    // 依據顏色製作實心圓
    createCircle(halfSize, rgba, ToolSelector.brush.antiAliasing);
    if (ToolSelector.colorIndex == 2) createCircle(halfSize, [rgba[3], rgba[3], rgba[3], 255], ToolSelector.brush.antiAliasing);
    /////////////////////////////////////////////////////////////////////////////////////////////
    // 不必每一個像素都撒
    var step = (1 + (1 - (ToolSelector.brush.range / 100.0)) * ToolSelector.brush.size) | 0;
    // 添加雜訊 var noise = new NoiseList(0n).genList(((halfSize * 2) ** 2));
    // 透明色會用完全覆蓋的方式
    const 混合方式 = ToolSelector.colorIndex == 2 ? 混合模式.橡皮擦 : 混合模式.筆刷;
    var [startPoint, endPoint, distance, pressure] = path;
    //前一座標到當前座標的距離
    for (var i = 0; i <= distance; i += step) {
        // 亂數撒點
        for (var h = 0; h < halfSize * 2; h++) {
            const BrushRow = Brush.cache.d2[h];
            for (var w = 0; w < halfSize * 2; w++) {
                if (!(Math.random() < 0.03)) BrushRow[w * 4 + 3] = 0;
                else BrushRow[w * 4 + 3] = (rgba[0] + rgba[1] + rgba[2] == BrushRow[w * 4 + 0] + BrushRow[w * 4 + 1] + BrushRow[w * 4 + 2]) ? 255 : 0;
            }
        }
        // 依據距離計算出比率
        var ratio = i / distance;
        // 計算出目前座標
        var currentPoint = new Point((startPoint.x + (endPoint.x - startPoint.x) * ratio) | 0, (startPoint.y + (endPoint.y - startPoint.y) * ratio) | 0);
        const Y = currentPoint.y, X = currentPoint.x;
        // 將貼圖貼到像素
        pastePixelData(Brush.cache, 0, 0, size, size, pixelData, X - halfSize, Y - halfSize, size, size, 混合方式);
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    // 找出最大點及最小點，僅更新該區域，減少運算量
    var minX = Canvas.width, maxX = 0, minY = Canvas.height, maxY = 0;
    for (var p = Canvas.pathCurrentIndex; p < ToolSelector.path.length; p++) {
        if (minX >= ToolSelector.path[p].x) minX = ToolSelector.path[p].x;
        if (minY >= ToolSelector.path[p].y) minY = ToolSelector.path[p].y;
        if (maxX <= ToolSelector.path[p].x) maxX = ToolSelector.path[p].x;
        if (maxY <= ToolSelector.path[p].y) maxY = ToolSelector.path[p].y;
    }
    if (ToolSelector.colorIndex == 2) {
        // 往外多擴張一px
        ToolSelector.project.layerManager.cache.needReflesh = new Rect((minX - size / 2 - 1) | 0, (minY - size / 2 - 1) | 0, (maxX + size / 2 + 1) | 0, (maxY + size / 2 + 1) | 0);
        // 製作三明治快取
        createSandwich();
    }
    // 往外多擴張一px
    ToolSelector.project.layerManager.needRefleshRect = new Rect((minX - size / 2 - 1) | 0, (minY - size / 2 - 1) | 0, (maxX + size / 2 + 1) | 0, (maxY + size / 2 + 1) | 0);
    // 更新目前路徑的Index，在下一瞬間的游標位置更新，就不用重複計算
    Canvas.pathCurrentIndex = ToolSelector.path.length - 1;
    // 更新畫布的顯示內容
    GUI.refleshCanvas();
}
//橡皮擦工具
function invokeErasorTool() {
    // 座標不滿兩個，就不做任何事
    if (ToolSelector.path.length <= 2) return;
    // 這個是要直接修改的pixelData
    var pixelData = ToolSelector.layer.pixelData;
    // 前一次畫過的不再拿出來
    var path = ToolSelector.path.slice(Canvas.pathCurrentIndex);
    var pressurePath = ToolSelector.pressurePath.slice(Canvas.pathCurrentIndex);
    path = path2LinkPathIncludePressure(path, pressurePath)[0];
    // 大小、透明度、筆壓
    var size = ToolSelector.brush.size, halfSize = (size / 2) | 0, rsq = size * size;
    var opacity = parseInt(255 * (ToolSelector.brush.opacity / 100.0));
    var opacityWithPressure = "" + ToolSelector.brush.opacityWithPressure == 'true';
    // 製作實心圓
    createCircle(halfSize, [opacity, opacity, opacity, 255], ToolSelector.brush.antiAliasing);
    /////////////////////////////////////////////////////////////////////////////////////////////
    var [previewPoint, point, distance, pressure] = path;
    //前一座標到當前座標的距離
    for (var i = 0; i <= distance; i++) {
        // 依據距離計算出比率
        var ratio = i / distance;
        // 計算出目前座標
        var currentPoint = new Point((previewPoint.x + (point.x - previewPoint.x) * ratio) | 0, (previewPoint.y + (point.y - previewPoint.y) * ratio) | 0);
        const Y = currentPoint.y + (((size - size * pressure) / 2) | 0), X = currentPoint.x + (((size - size * pressure) / 2) | 0);
        // 將貼圖貼到像素
        pastePixelData(Brush.cache, 0, 0, size, size, pixelData, X - halfSize, Y - halfSize, size * pressure, size * pressure, 混合模式.橡皮擦, opacityWithPressure ? pressure : 1.0);
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    // 找出最大點及最小點，僅更新該區域，省運算量
    var minX = Canvas.width, maxX = 0, minY = Canvas.height, maxY = 0;
    for (var p = Canvas.pathCurrentIndex; p < ToolSelector.path.length; p++) {
        if (minX >= ToolSelector.path[p].x) minX = ToolSelector.path[p].x;
        if (minY >= ToolSelector.path[p].y) minY = ToolSelector.path[p].y;
        if (maxX <= ToolSelector.path[p].x) maxX = ToolSelector.path[p].x;
        if (maxY <= ToolSelector.path[p].y) maxY = ToolSelector.path[p].y;
    }
    // 往外多擴張一px
    ToolSelector.project.layerManager.cache.needReflesh = new Rect((minX - size / 2 - 1) | 0, (minY - size / 2 - 1) | 0, (maxX + size / 2 + 1) | 0, (maxY + size / 2 + 1) | 0);
    createSandwich();
    // 往外多擴張一px
    ToolSelector.project.layerManager.needRefleshRect = new Rect((minX - size / 2 - 1) | 0, (minY - size / 2 - 1) | 0, (maxX + size / 2 + 1) | 0, (maxY + size / 2 + 1) | 0);
    // 更新目前路徑的Index，在下一瞬間的游標位置更新，就不用重複計算
    Canvas.pathCurrentIndex = ToolSelector.path.length - 1;
    // 更新畫布的顯示內容
    GUI.refleshCanvas();
}

// 筆刷工具
function invokePencilTool() {
    // 座標不滿兩個，就不做任何事
    if (ToolSelector.path.length <= 2) return;
    // 這個是要直接修改的pixelData
    var pixelData = ToolSelector.project.layerManager.cache.active;
    if (ToolSelector.colorIndex == 2) pixelData = ToolSelector.layer.pixelData;
    // 前一次畫過的不再拿出來
    var path = ToolSelector.path.slice(Canvas.pathCurrentIndex);
    var pressurePath = ToolSelector.pressurePath.slice(Canvas.pathCurrentIndex);
    path = path2LinkPathIncludePressure(path, pressurePath)[0];
    // 大小、筆刷類型、透明度'筆壓
    var size = ToolSelector.brush.size, halfSize = (size / 2) | 0, rsq = size * size;
    const pencilType = ToolSelector.brush.pencilType;
    var opacity = (ToolSelector.brush.opacity / 100.0);
    var opacityWithPressure = "" + ToolSelector.brush.opacityWithPressure == 'true';
    /////////////////////////////////////////////////////////////////////////////////////////////
    // 原子筆是純圓形
    if (pencilType == "原子筆") {
        // 透明色會用完全覆蓋的方式
        const 混合方式 = ToolSelector.colorIndex == 2 ? 混合模式.橡皮擦 : 混合模式.筆刷;
        // 指定顏色，考慮透明度
        var rgba = ToolSelector.color.toRGBAList();
        rgba[3] = parseInt(255 * opacity);
        // 依據顏色製作實心圓
        createCircle(halfSize, rgba, ToolSelector.brush.antiAliasing);
        if (ToolSelector.colorIndex == 2) createCircle(halfSize, [rgba[3], rgba[3], rgba[3], 255], ToolSelector.brush.antiAliasing);
        // 路徑中的一格格 (注意跳格的情況不列入)
        var [previewPoint, point, distance, pressure] = path;
        //前一座標到當前座標的距離
        for (var i = 0; i <= distance; i++) {
            // 依據距離計算出比率
            var ratio = i / distance;
            // 計算目前座標
            var currentPoint = new Point((previewPoint.x + (point.x - previewPoint.x) * ratio) | 0, (previewPoint.y + (point.y - previewPoint.y) * ratio) | 0);
            const Y = currentPoint.y + (((size - size * pressure) / 2) | 0), X = currentPoint.x + (((size - size * pressure) / 2) | 0);
            // 將貼圖貼到像素
            pastePixelData(Brush.cache, 0, 0, size, size, pixelData, X - halfSize, Y - halfSize, size * pressure, size * pressure, 混合方式, opacityWithPressure ? pressure : 1.0);
        }
    } else if (pencilType == "鉛筆" || pencilType == "沾水筆") {
        // 透明色會用完全覆蓋的方式
        const 混合方式 = ToolSelector.colorIndex == 2 ? 混合模式.橡皮擦 : 混合模式.筆刷;
        // 隨機取其中一個素材製作成貼圖
        var mat_index = parseInt(Math.random() * 4);
        var material = Brush.pencilMaterial[mat_index];
        Brush.cache = new F32PixelData(64, 64, 4);
        // 選取的顏色
        var rgba = ToolSelector.color.toRGBAList();
        // 路徑中的一格格 (注意跳格的情況不列入)
        var [previewPoint, point, distance, pressure] = path;
        if (pencilType == "沾水筆") {
            //前一座標到當前座標的距離
            for (var i = 0; i <= distance; i += (1 + ((size * pressure) / 2)) | 0) {
                // 隨機取其中一個素材貼圖
                var mat_index = parseInt(Math.random() * 4);
                var material = Brush.pencilMaterial[mat_index];
                // 隨機調整貼圖透明度
                var rand = Math.random(), Inv = 1 - rand;
                for (var j = 0; j < material.d1.length; j += 4) {
                    if (material.d1[j + 3] > 20) {
                        Brush.cache.d1[j + 0] = rgba[0];
                        Brush.cache.d1[j + 1] = rgba[1];
                        Brush.cache.d1[j + 2] = rgba[2];
                        Brush.cache.d1[j + 3] = 255 * opacity * rand;
                    } else Brush.cache.d1[j + 3] = 0;
                }
                // 依據距離計算出比率
                var ratio = i / distance;
                // 計算目前座標
                var currentPoint = new Point((previewPoint.x + (point.x - previewPoint.x) * ratio) | 0, (previewPoint.y + (point.y - previewPoint.y) * ratio) | 0);
                const Y = currentPoint.y + (((size - size * pressure) / 2) | 0), X = currentPoint.x + (((size - size * pressure) / 2) | 0);
                // 將貼圖貼到像素
                pastePixelData(Brush.cache, 0, 0, 64, 64, pixelData, X - halfSize, Y - halfSize, size * pressure, size * pressure, 混合方式, opacityWithPressure ? pressure : 1.0);
            }
        } else {
            //前一座標到當前座標的距離
            for (var i = 0; i <= distance; i += (1 + (size / 8)) | 0) {
                // 隨機取其中一個素材貼圖
                var mat_index = parseInt(Math.random() * 4);
                var material = Brush.pencilMaterial[mat_index];
                // 隨機調整貼圖透明度
                for (var j = 0; j < material.d1.length; j += 4) {
                    if (material.d1[j + 3] > 20) {
                        var rand = Math.random(), Inv = 1 - rand;
                        Brush.cache.d1[j + 0] = rgba[0];
                        Brush.cache.d1[j + 1] = rgba[1];
                        Brush.cache.d1[j + 2] = rgba[2];
                        Brush.cache.d1[j + 3] = 255 * opacity * rand;
                    } else Brush.cache.d1[j + 3] = 0;
                }
                // 依據距離計算出比率
                var ratio = i / distance;
                // 計算目前座標
                var currentPoint = new Point((previewPoint.x + (point.x - previewPoint.x) * ratio) | 0, (previewPoint.y + (point.y - previewPoint.y) * ratio) | 0);
                const Y = currentPoint.y + (((size - size * pressure) / 2) | 0), X = currentPoint.x + (((size - size * pressure) / 2) | 0);
                // 將貼圖貼到像素
                pastePixelData(Brush.cache, 0, 0, 64, 64, pixelData, X - halfSize, Y - halfSize, size * pressure, size * pressure, 混合方式, opacityWithPressure ? pressure : 1.0);
            }
        }
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    // 找出最大點及最小點，僅更新該區域，省運算量
    var minX = Canvas.width, maxX = 0, minY = Canvas.height, maxY = 0;
    for (var p = Canvas.pathCurrentIndex; p < ToolSelector.path.length; p++) {
        if (minX >= ToolSelector.path[p].x) minX = ToolSelector.path[p].x;
        if (minY >= ToolSelector.path[p].y) minY = ToolSelector.path[p].y;
        if (maxX <= ToolSelector.path[p].x) maxX = ToolSelector.path[p].x;
        if (maxY <= ToolSelector.path[p].y) maxY = ToolSelector.path[p].y;
    }
    if (ToolSelector.colorIndex == 2) {
        // 往外多擴張一px
        ToolSelector.project.layerManager.cache.needReflesh = new Rect((minX - size / 2 - 1) | 0, (minY - size / 2 - 1) | 0, (maxX + size / 2 + 1) | 0, (maxY + size / 2 + 1) | 0);
        createSandwich();
    }
    // 往外多擴張一px
    ToolSelector.project.layerManager.needRefleshRect = new Rect((minX - size / 2 - 1) | 0, (minY - size / 2 - 1) | 0, (maxX + size / 2 + 1) | 0, (maxY + size / 2 + 1) | 0);
    // 更新目前路徑的Index，在下一瞬間的游標位置更新，就不用重複計算
    Canvas.pathCurrentIndex = ToolSelector.path.length - 1;
    // 更新畫布的顯示內容
    GUI.refleshCanvas();
}

// 水彩筆工具
function invokeWaterpenTool() {
    if (ToolSelector.path.length <= 2) return;
    // 這個是要直接修改的pixelData
    var pixelData = ToolSelector.project.layerManager.cache.active;
    if (ToolSelector.colorIndex == 2) pixelData = ToolSelector.layer.pixelData;
    // 前一次畫過的不再拿出來
    var path = ToolSelector.path.slice(Canvas.pathCurrentIndex);
    var pressurePath = ToolSelector.pressurePath.slice(Canvas.pathCurrentIndex);
    path = path2LinkPathIncludePressure(path, pressurePath)[0];
    // 大小、濃度、透明度
    var size = ToolSelector.brush.size, halfSize = (size / 2) | 0, rsq = size * size;
    const 濃度 = (ToolSelector.brush.pigment / 100.0), 紙濃度 = 1 - 濃度;
    var opacity = ((ToolSelector.brush.opacity / 100.0) * 255) | 0;
    // 選取的顏色
    var rgba = ToolSelector.color.toRGBAList();
    // 透明色會用完全覆蓋的方式
    const 混合方式 = ToolSelector.colorIndex == 2 ? 混合模式.橡皮擦 : 混合模式.筆刷;
    // 背景貼圖
    var material = Brush.waterpenMaterial[0];
    Brush.cache = new F32PixelData(size, size, 4);
    // 路徑中的一格格 (注意跳格的情況不列入)
    var [previewPoint, point, distance, pressure] = path;
    /////////////////////////////////////////////////////////////////////////////////////////////
    //前一座標到當前座標的距離
    for (var i = 0; i <= distance; i += (1 + (size / 8)) | 0) {
        // 依據距離計算出比率
        var ratio = i / distance;
        // 計算目前座標
        var currentPoint = new Point((previewPoint.x + (point.x - previewPoint.x) * ratio) | 0, (previewPoint.y + (point.y - previewPoint.y) * ratio) | 0);
        const Y = currentPoint.y, X = currentPoint.x;
        for (var h = 0; h < size; h++) {
            const offsetY = Y % 350 + h >= 350 ? Y % 350 + h - 350 : Y % 350 + h;
            const brushRow = Brush.cache.d2[h], materialRow = material.d2[offsetY];
            for (var w = 0, w0 = 0; w < size * 4; w += 4, w0++) {
                var dist = Math.sqrt((w0 - halfSize) ** 2 + (h - halfSize) ** 2);
                if (dist <= halfSize) {
                    const offsetX = X % 350 + w0 >= 350 ? X % 350 + w0 - 350 : X % 350 + w0;
                    brushRow[w + 0] = (rgba[0] * 濃度 + materialRow[(offsetX) * 4 + 0] * 紙濃度) | 0;
                    brushRow[w + 1] = (rgba[1] * 濃度 + materialRow[(offsetX) * 4 + 1] * 紙濃度) | 0;
                    brushRow[w + 2] = (rgba[2] * 濃度 + materialRow[(offsetX) * 4 + 2] * 紙濃度) | 0;
                    brushRow[w + 3] = opacity | 0;
                }
            }
        }
        // 將貼圖貼到像素
        pastePixelData(Brush.cache, 0, 0, size, size, pixelData, X - ((halfSize * pressure) | 0), Y - ((halfSize * pressure) | 0), size * pressure, size * pressure, 混合方式, 1.0);
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    // 找出最大點及最小點，僅更新該區域，省運算量
    var minX = Canvas.width, maxX = 0, minY = Canvas.height, maxY = 0;
    for (var p = Canvas.pathCurrentIndex; p < ToolSelector.path.length; p++) {
        if (minX >= ToolSelector.path[p].x) minX = ToolSelector.path[p].x;
        if (minY >= ToolSelector.path[p].y) minY = ToolSelector.path[p].y;
        if (maxX <= ToolSelector.path[p].x) maxX = ToolSelector.path[p].x;
        if (maxY <= ToolSelector.path[p].y) maxY = ToolSelector.path[p].y;
    }
    // 往外多擴張一px
    ToolSelector.project.layerManager.needRefleshRect = new Rect((minX - size / 2 - 1) | 0, (minY - size / 2 - 1) | 0, (maxX + size / 2 + 1) | 0, (maxY + size / 2 + 1) | 0);
    // 更新目前路徑的Index，在下一瞬間的游標位置更新，就不用重複計算
    Canvas.pathCurrentIndex = ToolSelector.path.length - 1;
    // 更新畫布的顯示內容
    GUI.refleshCanvas();
}
