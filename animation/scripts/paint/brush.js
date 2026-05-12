
class Brush {
    constructor() {
        this.id = null;
        this.size = 20;
        this.opacity = 95;
        this.antiAliasing = 5;
        //////////////////////
        this.previewMark = true;
        //////////////////////
        this.point = new Point(0, 0, 0);
    }
    // 代表已經下筆
    static Painting = false;
    static cache = null;
    // 材料
    static pencilMaterial = [];
    static waterpenMaterial = [];
};

function loadPencilMaterial() {
    Brush.pencilMaterial = [0, 0, 0, 0]
    const img0 = new Image(), img1 = new Image(), img2 = new Image(), img3 = new Image();
    img0.src = "./image/material/pencil1.png"; img1.src = "./image/material/pencil2.png";
    img2.src = "./image/material/pencil3.png"; img3.src = "./image/material/pencil4.png";

    img0.onload = () => {
        const canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
        canvas.width = img0.width, canvas.height = img0.height;
        ctx.drawImage(img0, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        Brush.pencilMaterial[0] = new F32PixelData(img0.width, img0.height, 4);
        for (var i = 0; i < Brush.pencilMaterial[0].d1.length; i++) Brush.pencilMaterial[0].d1[i] = imageData.data[i];
    };
    img1.onload = () => {
        const canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
        canvas.width = img1.width, canvas.height = img1.height;
        ctx.drawImage(img1, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        Brush.pencilMaterial[1] = new F32PixelData(img1.width, img1.height, 4);
        for (var i = 0; i < Brush.pencilMaterial[1].d1.length; i++) Brush.pencilMaterial[1].d1[i] = imageData.data[i];
    };
    img2.onload = () => {
        const canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
        canvas.width = img2.width, canvas.height = img2.height;
        ctx.drawImage(img2, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        Brush.pencilMaterial[2] = new F32PixelData(img2.width, img2.height, 4);
        for (var i = 0; i < Brush.pencilMaterial[2].d1.length; i++) Brush.pencilMaterial[2].d1[i] = imageData.data[i];
    };
    img3.onload = () => {
        const canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
        canvas.width = img3.width, canvas.height = img3.height;
        ctx.drawImage(img3, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        Brush.pencilMaterial[3] = new F32PixelData(img3.width, img3.height, 4);
        for (var i = 0; i < Brush.pencilMaterial[3].d1.length; i++) Brush.pencilMaterial[3].d1[i] = imageData.data[i];
    };
}
loadPencilMaterial();

function loadWaterpenMaterial() {
    Brush.waterpenMaterial = [0]
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

function enableBtnWithId(idList, enable = true) {
    if (enable == true) {
        for (var elem of idList) {
            getByid(elem).parentNode.style.background = "#d6def8";
        }
    } else {
        for (var elem of idList) {
            getByid(elem).parentNode.style.background = "#b6bac4";
        }
    }
}

getByid("handToolAlign").onchange = function () {
    handTool.AlignBy = "" + this.value;
    Canvas.setTransform();
    enableBtnWithId(["handToolAlignValue1", "handToolAlignValue2", "handToolAlignValue3"], false);
    if ("" + this.value == "Upper left corner") enableBtnWithId(["handToolAlignValue1"], true);
    if ("" + this.value == "center") enableBtnWithId(["handToolAlignValue2"], true);
    if ("" + this.value == "Cursor position") enableBtnWithId(["handToolAlignValue3"], true);
}
getByid("handToolAlignValue1").parentNode.onclick = function () {
    getByid("handToolAlign").value = "Upper left corner";
    getByid("handToolAlign").onchange();
}
getByid("handToolAlignValue2").parentNode.onclick = function () {
    getByid("handToolAlign").value = "center";
    getByid("handToolAlign").onchange();
}
getByid("handToolAlignValue3").parentNode.onclick = function () {
    getByid("handToolAlign").value = "Cursor position";
    getByid("handToolAlign").onchange();
}

getByid("eggToolImgEggValue1").parentNode.onclick = function () {
    enableBtnWithId(["eggToolImgEggValue1", "eggToolImgEggValue2", "eggToolImgEggValue3"], false);
    enableBtnWithId(["eggToolImgEggValue1"], true);
}
getByid("eggToolImgEggValue2").parentNode.onclick = function () {
    enableBtnWithId(["eggToolImgEggValue1", "eggToolImgEggValue2", "eggToolImgEggValue3"], false);
    enableBtnWithId(["eggToolImgEggValue2"], true);
}
getByid("eggToolImgEggValue3").parentNode.onclick = function () {
    enableBtnWithId(["eggToolImgEggValue1", "eggToolImgEggValue2", "eggToolImgEggValue3"], false);
    enableBtnWithId(["eggToolImgEggValue3"], true);
}

getByid("dropperSource").onchange = function () {
    dropperTool.source = "" + this.value;
}

getByid("oilColorDiffNum").oninput = getByid("oilColorDiffSize").oninput = function () {
    oilTool.ColorDiff = parseInt(this.value);
    getByid("oilColorDiffNum").value = getByid("oilColorDiffSize").value = this.value;
}

getByid("oilOpacityNum").oninput = getByid("oilOpacity").oninput = function () {
    oilTool.opacity = parseInt(this.value);
    getByid("oilOpacityNum").value = getByid("oilOpacity").value = this.value;
}

getByid("fillType").onchange = function () {
    oilTool.fillType = "" + this.value;
    enableBtnWithId(["oilTypeValue1", "oilTypeValue2"], false);
    if ("" + this.value == "油漆桶") enableBtnWithId(["oilTypeValue1"], true);
    if ("" + this.value == "填充線") enableBtnWithId(["oilTypeValue2"], true);
}
getByid("oilTypeValue1").parentNode.onclick = function () {
    getByid("fillType").value = "油漆桶";
    getByid("fillType").onchange();
}
getByid("oilTypeValue2").parentNode.onclick = function () {
    getByid("fillType").value = "填充線";
    getByid("fillType").onchange();
}

getByid("selectTool2DiffNum").oninput = getByid("selectTool2Diff").oninput = function () {
    selectTool2.ColorDiff = parseInt(this.value);
    getByid("selectTool2DiffNum").value = getByid("selectTool2Diff").value = this.value;
}

getByid("lineToolShape").onchange = function () {
    lineTool.shape = "" + this.value;
    enableBtnWithId(["lineToolShapeValue1", "lineToolShapeValue2", "lineToolShapeValue3"], false);
    if ("" + this.value == "circle") enableBtnWithId(["lineToolShapeValue1"], true);
    if ("" + this.value == "rect") enableBtnWithId(["lineToolShapeValue2"], true);
    if ("" + this.value == "line") enableBtnWithId(["lineToolShapeValue3"], true);
}
getByid("lineToolShapeValue1").parentNode.onclick = function () {
    getByid("lineToolShape").value = "circle";
    getByid("lineToolShape").onchange();
}
getByid("lineToolShapeValue2").parentNode.onclick = function () {
    getByid("lineToolShape").value = "rect";
    getByid("lineToolShape").onchange();
}
getByid("lineToolShapeValue3").parentNode.onclick = function () {
    getByid("lineToolShape").value = "line";
    getByid("lineToolShape").onchange();
}

getByid("lineToolAlign").onchange = function () {
    lineTool.AlignBy = "" + this.value;
    enableBtnWithId(["lineToolAlignValue1", "lineToolAlignValue2"], false);
    if ("" + this.value == "center") enableBtnWithId(["lineToolAlignValue1"], true);
    if ("" + this.value == "twice") enableBtnWithId(["lineToolAlignValue2"], true);
}
getByid("lineToolAlignValue1").parentNode.onclick = function () {
    getByid("lineToolAlign").value = "center";
    getByid("lineToolAlign").onchange();
}
getByid("lineToolAlignValue2").parentNode.onclick = function () {
    getByid("lineToolAlign").value = "twice";
    getByid("lineToolAlign").onchange();
}

getByid("pencilOpacityPressure").onchange = function () {
    pencilTool.opacityWithPressure = "" + this.checked;
}
getByid("pencilType").onchange = function () {
    pencilTool.pencilType = "" + this.value;
    enableBtnWithId(["pencilTypeValue1", "pencilTypeValue2", "pencilTypeValue3"], false);
    if ("" + this.value == "鉛筆") enableBtnWithId(["pencilTypeValue1"], true);
    if ("" + this.value == "原子筆") enableBtnWithId(["pencilTypeValue2"], true);
    if ("" + this.value == "沾水筆") enableBtnWithId(["pencilTypeValue3"], true);
}
getByid("pencilTypeValue1").parentNode.onclick = function () {
    getByid("pencilType").value = "鉛筆";
    getByid("pencilType").onchange();
}
getByid("pencilTypeValue2").parentNode.onclick = function () {
    getByid("pencilType").value = "原子筆";
    getByid("pencilType").onchange();
}
getByid("pencilTypeValue3").parentNode.onclick = function () {
    getByid("pencilType").value = "沾水筆";
    getByid("pencilType").onchange();
}
getByid("pencilSizeNum").oninput = getByid("pencilSize").oninput = function () {
    pencilTool.size = parseInt(this.value);
    getByid("pencilSizeNum").value = getByid("pencilSize").value = this.value;
    Canvas.cursor.style.width = Canvas.cursor.style.height = `${pencilTool.size}px`;
}
getByid("pencilOpacityNum").oninput = getByid("pencilOpacity").oninput = function () {
    pencilTool.opacity = parseInt(this.value);
    getByid("pencilOpacityNum").value = getByid("pencilOpacity").value = this.value;
}
getByid("pencilAntiAliasingNum").oninput = getByid("pencilAntiAliasing").oninput = function () {
    pencilTool.antiAliasing = parseInt(this.value);
    getByid("pencilAntiAliasingNum").value = getByid("pencilAntiAliasing").value = this.value;
}

getByid("waterpenSizeNum").oninput = getByid("waterpenSize").oninput = function () {
    waterpenTool.size = parseInt(this.value);
    getByid("waterpenSizeNum").value = getByid("waterpenSize").value = this.value;
    Canvas.cursor.style.width = Canvas.cursor.style.height = `${waterpenTool.size}px`;
}
getByid("waterpenOpacityNum").oninput = getByid("waterpenOpacity").oninput = function () {
    waterpenTool.opacity = parseInt(this.value);
    getByid("waterpenOpacityNum").value = getByid("waterpenOpacity").value = this.value;
}
getByid("waterpenPigmentNum").oninput = getByid("waterpenPigment").oninput = function () {
    waterpenTool.pigment = parseInt(this.value);
    getByid("waterpenPigmentNum").value = getByid("waterpenPigment").value = this.value;
}

getByid("spraySizeNum").oninput = getByid("spraySize").oninput = function () {
    sprayTool.size = parseInt(this.value);
    getByid("spraySizeNum").value = getByid("spraySize").value = this.value;
    Canvas.cursor.style.width = Canvas.cursor.style.height = `${sprayTool.size * 2}px`;
}
getByid("sprayRangeNum").oninput = getByid("sprayRange").oninput = function () {
    sprayTool.range = parseInt(this.value);
    getByid("sprayRangeNum").value = getByid("sprayRange").value = this.value;
}


getByid("lineSizeNum").oninput = getByid("lineSize").oninput = function () {
    lineTool.size = parseInt(this.value);
    getByid("lineSizeNum").value = getByid("lineSize").value = this.value;
    Canvas.cursor.style.width = Canvas.cursor.style.height = `${lineTool.size}px`;
}
getByid("lineOpacityNum").oninput = getByid("lineOpacity").oninput = function () {
    lineTool.opacity = parseInt(this.value);
    getByid("lineOpacityNum").value = getByid("lineOpacity").value = this.value;
}
getByid("lineAntiAliasingNum").oninput = getByid("lineAntiAliasing").oninput = function () {
    lineTool.antiAliasing = parseInt(this.value);
    getByid("lineAntiAliasingNum").value = getByid("lineAntiAliasing").value = this.value;
}

getByid("erasorSizeNum").oninput = getByid("erasorSize").oninput = function () {
    erasorTool.size = parseInt(this.value);
    getByid("erasorSizeNum").value = getByid("erasorSize").value = this.value;
    Canvas.cursor.style.width = Canvas.cursor.style.height = `${erasorTool.size}px`;
}
getByid("erasorOpacityNum").oninput = getByid("erasorOpacity").oninput = function () {
    erasorTool.opacity = parseInt(this.value);
    getByid("erasorOpacityNum").value = getByid("erasorOpacity").value = this.value;
}
getByid("erasorAntiAliasingNum").oninput = getByid("erasorAntiAliasing").oninput = function () {
    erasorTool.antiAliasing = parseInt(this.value);
    getByid("erasorAntiAliasingNum").value = getByid("erasorAntiAliasing").value = this.value;
}
getByid("erasorOpacityPressure").onchange = function () {
    erasorTool.opacityWithPressure = "" + this.checked;
}
/*
getByid("eggToolImgEgg").onchange = function () {
    erasorTool.img = this;
}*/

// 讓某些按鈕按了可以操作圖層的動作
function setBrushTrigger() {
    var toolSpans = getClass("left_icon");
    for (var ToolElem of toolSpans) {
        const main = "changeTool", parm = ToolElem.id;
        getByid("" + ToolElem.id).onmousedown = function () {
            for (var panel of getClass("panel")) panel.style.display = "none";
            if (getByid(parm + "Panel")) getByid(parm + "Panel").style.display = "";
            Command.cmd(main, parm);
        }
        getByid("" + ToolElem.id).ondragstart = function (e) { e.preventDefault(); }
    }
}
setBrushTrigger();

var handTool = new Brush(); handTool.id = "handTool";
handTool.AlignBy = "Cursor position";
handTool.size = 20;
var selectTool1 = new Brush(); selectTool1.id = "selectTool1";
var pencilTool = new Brush(); pencilTool.id = "pencilTool";
pencilTool.pencilType = "鉛筆";
handTool.size = 20;
handTool.opacity = 95;
handTool.antiAliasing = 5;
pencilTool.opacityWithPressure = true;
var oilTool = new Brush(); oilTool.id = "oilTool";
oilTool.Separation = "color";
oilTool.ColorDiff = 15;
oilTool.fillType = "油漆桶";
var sprayTool = new Brush(); sprayTool.id = "sprayTool";
sprayTool.size = 50;
sprayTool.range = 5;
var waterpenTool = new Brush(); waterpenTool.id = "waterpenTool";
waterpenTool.size = 45;
waterpenTool.opacity = 95;
waterpenTool.pigment = 25;
var erasorTool = new Brush(); erasorTool.id = "erasorTool";
erasorTool.opacityWithPressure = true;
var lineTool = new Brush(); lineTool.id = "lineTool";
lineTool.AlignBy = "center";
lineTool.shape = "circle";
lineTool.size = 8;
lineTool.antiAliasing = 1;
var gradientTool = new Brush(); gradientTool.id = "gradientTool";
var selectTool2 = new Brush(); selectTool2.id = "selectTool2";
selectTool2.ColorDiff = 10;
var eggTool = new Brush(); eggTool.id = "eggTool";
var dropperTool = new Brush(); dropperTool.id = "dropperTool";
dropperTool.source = "layer";

// 裝飾工具
function invokeEggTool1() {
    erasorTool.img = this;
    if (ToolSelector.path.length <= 1) return;
    if (ToolSelector.colorIndex == 2) return;
    // 這個是要直接修改的pixelData
    var pixelData = ToolSelector.project.layerManager.cache.active;
    if (ToolSelector.colorIndex == 2) pixelData = ToolSelector.layer.pixelData;
    // 前一次畫過的不再拿出來
    var path = ToolSelector.path.slice(Canvas.pathCurrentIndex);
    var pressurePath = ToolSelector.pressurePath.slice(Canvas.pathCurrentIndex);
    path = path2LinkPathIncludePressure(path, pressurePath);

    var size = ToolSelector.brush.size, halfSize = (size / 2) | 0, rsq = size * size;
    const pencilType = ToolSelector.brush.pencilType;
    var opacity = (ToolSelector.brush.opacity / 100.0);
    var opacityWithPressure = "" + ToolSelector.brush.opacityWithPressure == 'true';

    if (pencilType == "原子筆") {
        // 透明色會用完全覆蓋的方式
        const 混合方式 = ToolSelector.colorIndex == 2 ? 混合模式.橡皮擦 : 混合模式.筆刷;


        if (ToolSelector.colorIndex == 2) createCircle(halfSize, [rgba[3], rgba[3], rgba[3], 255], ToolSelector.brush.antiAliasing);
        for (var p = 0; p < path.length; p++) {
            // 路徑中的一格格 (注意跳格的情況不列入)
            var [previewPoint, point, distance, pressure] = path[p]; //[currentPath[0], currentPath[1], currentPath[2]];

            //前一座標到當前座標的距離
            for (var i = 0; i <= distance; i++) {
                var ratio = i / distance;
                var currentPoint = new Point((previewPoint.x + (point.x - previewPoint.x) * ratio) | 0, (previewPoint.y + (point.y - previewPoint.y) * ratio) | 0);
                const Y = currentPoint.y + (((size - size * pressure) / 2) | 0), X = currentPoint.x + (((size - size * pressure) / 2) | 0);
                pastePixelData(Brush.cache, 0, 0, size, size, pixelData, X - halfSize, Y - halfSize, size * pressure, size * pressure, 混合方式, opacityWithPressure ? pressure : 1.0);
            }
        }
    }

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

    Canvas.pathCurrentIndex = ToolSelector.path.length - 1;
    GUI.refleshCanvas();
    return;
}

// 選擇工具1
function invokeSelectTool1() {
    if (ToolSelector.path.length <= 1) {
        ToolSelector.selection = null;
        GUI.refleshMarkCanvas();
        return;
    }
    var startPoint = Canvas.mouseClickPoint;
    var endPoint = ToolSelector.path[ToolSelector.path.length - 1];

    var top = startPoint.y < endPoint.y ? startPoint.y : endPoint.y;
    var bottom = startPoint.y > endPoint.y ? startPoint.y : endPoint.y;
    var left = startPoint.x < endPoint.x ? startPoint.x : endPoint.x;
    var right = startPoint.x > endPoint.x ? startPoint.x : endPoint.x;

    if (top == bottom || left == right) ToolSelector.selection = null;
    else ToolSelector.selection = new Selection("rect", new Rect(left, top, right, bottom));
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

    // 前一次畫過的不再拿出來 
    var point = Canvas.mouseClickPoint;
    var ColorDifference = selectTool2.ColorDiff;

    //建立參照表，數值小於它就可以填充
    if (true) {
        var [clickColorR, clickColorG, clickColorB, clickColorA] = getRgbaByPointFromPixelData(point, ToolSelector.layer.pixelData)

        for (var h = top; h < bottom; h++) {
            for (var w = left * 4; w < right * 4; w += 4) {
                var currentColor = pixels[h][w + 0] + pixels[h][w + 1] + pixels[h][w + 2] + pixels[h][w + 3];
                var clickColor = clickColorR + clickColorG + clickColorB + clickColorA;
                var gap = ((clickColorR - pixels[h][w + 0]) ** 2 + (clickColorG - pixels[h][w + 1]) ** 2 + (clickColorB - pixels[h][w + 2]) ** 2 + (clickColorA - pixels[h][w + 3]) ** 2) ** 0.5;

                temp.d2[h][w + 0] = temp.d2[h][w + 1] = temp.d2[h][w + 2] = temp.d2[h][w + 3] = gap;
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
    }
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

    if (Canvas.mouseDownLeft || Canvas.mouseDownMiddle) {
        Canvas.translate.x -= (Canvas.mousePreviousPoint.x - Canvas.mouseNowPoint.x) / Canvas.scale.x;
        Canvas.translate.y -= (Canvas.mousePreviousPoint.y - Canvas.mouseNowPoint.y) / Canvas.scale.y;
    }
    Canvas.setTransform();
}

// 滴管工具
function invokeDropperTool() {
    if (dropperTool.source == "layer") {
        if (!(ToolSelector.path && ToolSelector.path.length >= 1)) var point = Canvas.mouseClickPoint;
        else var point = ToolSelector.path[ToolSelector.path.length - 1];
        var [clickColorR, clickColorG, clickColorB, clickColorA] = getRgbaByPointFromPixelData(point, ToolSelector.layer.pixelData)
        updateColor(clickColorR, clickColorG, clickColorB, clickColorA);
    }
    if (dropperTool.source == "full") {
        if (!(ToolSelector.path && ToolSelector.path.length >= 1)) var point = Canvas.mouseClickPoint;
        else var point = ToolSelector.path[ToolSelector.path.length - 1];
        var result = ToolSelector.project.layerManager.result;
        var [clickColorR, clickColorG, clickColorB, clickColorA] = getRgbaByPointFromPixelData(point, result)
        updateColor(clickColorR, clickColorG, clickColorB, clickColorA);
    }
}

// 漸層工具
function invokeGradientTool() {
    var rgba = ToolSelector.color.toRGBAList();
    var rgba2 = ToolSelector.前背透色[1].toRGBAList();
    var ColorList = new Array(100);
    for (var i = 0; i <= 100; i++) {
        var ratio = i / 100.0, inv = 1 - ratio;
        ColorList[i] = new Color(((rgba[0] * ratio + rgba2[0] * inv)) | 0, ((rgba[1] * ratio + rgba2[1] * inv)) | 0, ((rgba[2] * ratio + rgba2[2] * inv)) | 0, ((rgba[3] * ratio + rgba2[3] * inv)) | 0);
    }
    // 已經放開滑鼠了(放開右鍵也有反應，bug)
    if (Canvas.mouseDownLeft == false) {
        var point1 = Canvas.mouseClickPoint;
        var point2 = Canvas.mouseEndPoint;
        // 這個是要直接修改的pixelData
        var pixelData = ToolSelector.layer.pixelData;

        var root = ToolSelector.project.layerManager, cache = root.cache.cache.d2, layer = ToolSelector.layer;
        const pixels = layer.pixelData.d2;
        var mask = null;
        if (ToolSelector.hasSelection && ToolSelector.selection.getMap()) mask = ToolSelector.selection.getMap().d2;

        var [left, top, right, bottom] = [layer.x, layer.y, layer.x + layer.width, layer.y + layer.height];
        if (mask) {
            for (var h = top; h < bottom; h++) {
                const pixelRow = pixels[h], maskRow = mask[h];
                for (var w = left * 4, w0 = left; w < right * 4; w += 4, w0++) {
                    if (maskRow[w + 0] === 0) continue;
                    var dist1 = (((point1.x - w0) ** 2 + (point1.y - h) ** 2) ** 0.5) | 0;
                    var dist2 = (((point2.x - w0) ** 2 + (point2.y - h) ** 2) ** 0.5) | 0;
                    var dist_twice = dist1 + dist2;
                    var radio1 = ((dist1 / dist_twice) * 100) | 0;
                    var radio2 = ((dist2 / dist_twice) * 100) | 0;
                    pixelRow[w + 0] = ColorList[radio1].r;
                    pixelRow[w + 1] = ColorList[radio1].g;
                    pixelRow[w + 2] = ColorList[radio1].b;
                    pixelRow[w + 3] = ColorList[radio1].a;
                }
            }
        } else {
            for (var h = top; h < bottom; h++) {
                const pixelRow = pixels[h];
                for (var w = left * 4, w0 = left; w < right * 4; w += 4, w0++) {
                    var dist1 = (((point1.x - w0) ** 2 + (point1.y - h) ** 2) ** 0.5) | 0;
                    var dist2 = (((point2.x - w0) ** 2 + (point2.y - h) ** 2) ** 0.5) | 0;
                    var dist_twice = dist1 + dist2;
                    var radio1 = ((dist1 / dist_twice) * 100) | 0;
                    var radio2 = ((dist2 / dist_twice) * 100) | 0;
                    pixelRow[w + 0] = ColorList[radio1].r;
                    pixelRow[w + 1] = ColorList[radio1].g;
                    pixelRow[w + 2] = ColorList[radio1].b;
                    pixelRow[w + 3] = ColorList[radio1].a;
                }
            }
        }

        GUI.refleshSandwichAndFullCanvas();
        // 還在拉線
    } else {
        var pixelData = ToolSelector.project.layerManager.cache.active;
        pixelData.clear();

        var size = 5, halfSize = 2;

        // 透明色會用完全覆蓋的方式
        const 混合方式 = 混合模式.筆刷;
        var startPoint = Canvas.mouseClickPoint;
        var endPoint = ToolSelector.path[ToolSelector.path.length - 1];
        var path = path2LinkPath([startPoint, endPoint]);

        for (var p = 0; p < path.length; p++) {
            // 路徑中的一格格 (注意跳格的情況不列入)
            var [previewPoint, point, distance] = path[p];
            //前一座標到當前座標的距離
            for (var i = 0; i <= distance; i++) {
                var ratio = i / distance;
                var currentPoint = new Point((previewPoint.x + (point.x - previewPoint.x) * ratio) | 0, (previewPoint.y + (point.y - previewPoint.y) * ratio) | 0);
                const Y = currentPoint.y, X = currentPoint.x;

                var rgba = ColorList[(ratio * 100) | 0].toRGBAList();
                createCircle(halfSize, rgba, 1.0);

                pastePixelData(Brush.cache, 0, 0, size, size, pixelData, X - halfSize, Y - halfSize, size, size, 混合方式);
            }
        }

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

        Canvas.pathCurrentIndex = ToolSelector.path.length - 1;
        GUI.refleshCanvas();

        if (ToolSelector.colorIndex == 1) GUI.setStatusAlert("請注意，您正在選取背景色，無法發揮漸層效果！！！");
    }
}
function beginPencilTool() {
    // 複製pixelData到參考和active
    ToolSelector.project.layerManager.cache.active.clear();
}

function endPencilTool() {
    // 將active覆蓋到pixelData
    ActiveData2PixelData(ToolSelector.project.layerManager.cache.active, 0, 0, Canvas.width, Canvas.height, ToolSelector.layer.pixelData, 0, 0, Canvas.width, Canvas.height);
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

function createHoleCircle(halfSize, rgbaList, edgeWidth = 0, lineWidth = 1) {
    var point = new Point(halfSize * 2, halfSize * 2);
    Brush.cache = new F32PixelData(halfSize * 2 + 1, halfSize * 2 + 1, 4);

    var rsq = halfSize * halfSize;
    var minY = point.y - halfSize < 0 ? -point.y : -halfSize;
    var minX = point.x - halfSize < 0 ? -point.x : -halfSize;
    var maxY = point.y + halfSize >= Canvas.height ? (Canvas.height - 1) - point.y : halfSize;
    var maxX = point.x + halfSize >= Canvas.width ? (Canvas.width - 1) - point.x : halfSize;
    var [r, g, b, a] = rgbaList;
    for (var y = minY; y <= maxY; y++) {
        for (var x = minX; x <= maxX; x++) {
            var dist = Math.sqrt(x * x + y * y);
            if (dist <= halfSize + lineWidth && dist >= halfSize - lineWidth) {
                let alpha = ((halfSize - dist) / edgeWidth) + 0.5;
                if (alpha <= 0) continue; // 球外的像素直接無視。
                if (alpha > 1) alpha = 1.0; // 球內的像素保持不透明。
                Brush.cache.d2[point.y + y + minY][(point.x + x + minX) * 4 + 0] = r;
                Brush.cache.d2[point.y + y + minY][(point.x + x + minX) * 4 + 1] = g;
                Brush.cache.d2[point.y + y + minY][(point.x + x + minX) * 4 + 2] = b;
                Brush.cache.d2[point.y + y + minY][(point.x + x + minX) * 4 + 3] = alpha * a;
            }
        }
    }
}

function createTriangle(rgbaList, minX_, minY_, maxX_, maxY_, inputPoint) {
    function isPointInTriangle(p, p0, p1, p2) {
        const crossProduct = (pA, pB, pC) => {
            return (pA.x - pC.x) * (pB.y - pC.y) - (pA.y - pC.y) * (pB.x - pC.x);
        };
        const d1 = crossProduct(p, p0, p1), d2 = crossProduct(p, p1, p2), d3 = crossProduct(p, p2, p0);
        const has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0), has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);
        return !(has_neg && has_pos);
    }
    var point = new Point(maxX_ - minX_, maxY_ - minY_);
    Brush.cache = new F32PixelData(maxX_ - minX_ + 1, maxY_ - minY_ + 1, 4);

    var minY = 0;
    var minX = 0;
    var maxY = maxY_ - minY_;
    var maxX = maxX_ - minX_;
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
function createCircle(halfSize, rgbaList, edgeWidth = 0) {
    var point = new Point(halfSize * 2, halfSize * 2);
    Brush.cache = new F32PixelData(halfSize * 2 + 1, halfSize * 2 + 1, 4);

    var rsq = halfSize * halfSize;
    var minY = point.y - halfSize < 0 ? -point.y : -halfSize;
    var minX = point.x - halfSize < 0 ? -point.x : -halfSize;
    var maxY = point.y + halfSize >= Canvas.height ? (Canvas.height - 1) - point.y : halfSize;
    var maxX = point.x + halfSize >= Canvas.width ? (Canvas.width - 1) - point.x : halfSize;
    var [r, g, b, a] = rgbaList;
    for (var y = minY; y <= maxY; y++) {
        for (var x = minX; x <= maxX; x++) {
            var dist = Math.sqrt(x * x + y * y);
            if (dist <= halfSize) {
                let alpha = ((halfSize - dist) / edgeWidth) + 0.5;
                if (alpha <= 0) continue; // 球外的像素直接無視。
                if (alpha > 1) alpha = 1.0; // 球內的像素保持不透明。
                Brush.cache.d2[point.y + y + minY][(point.x + x + minX) * 4 + 0] = r;
                Brush.cache.d2[point.y + y + minY][(point.x + x + minX) * 4 + 1] = g;
                Brush.cache.d2[point.y + y + minY][(point.x + x + minX) * 4 + 2] = b;
                Brush.cache.d2[point.y + y + minY][(point.x + x + minX) * 4 + 3] = alpha * a;
            }
        }
    }
}
function invokeLineTool() {
    var root = ToolSelector.project.layerManager, cache = root.cache.cache.d2, layer = ToolSelector.layer;

    if (ToolSelector.path.length <= 1) return;
    if (ToolSelector.colorIndex == 2) return;
    // 這個是要直接修改的pixelData
    var pixelData = ToolSelector.project.layerManager.cache.active;
    pixelData.clear();

    var size = ToolSelector.brush.size, halfSize = (size / 2) | 0, rsq = size * size;

    var Align = ToolSelector.brush.AlignBy, Shape = ToolSelector.brush.shape;

    var rgba = ToolSelector.color.toRGBAList();
    rgba[3] = parseInt(255 * (ToolSelector.brush.opacity / 100.0));
    createCircle(halfSize, rgba, ToolSelector.brush.antiAliasing);

    // 透明色會用完全覆蓋的方式
    const 混合方式 = 混合模式.筆刷;
    var startPoint = Canvas.mouseClickPoint;
    var endPoint = ToolSelector.path[ToolSelector.path.length - 1];
    var path = path2LinkPath([startPoint, endPoint]);

    if (Shape == "circle") {
        const left = Math.min(startPoint.x, endPoint.x); const right = Math.max(startPoint.x, endPoint.x);
        const top = Math.min(startPoint.y, endPoint.y); const bottom = Math.max(startPoint.y, endPoint.y);
        var gapX = parseInt(right - left) * 2, gapY = parseInt(bottom - top) * 2, circleSize = ((gapX ** 2 + gapY ** 2) ** 0.5);
        createHoleCircle((circleSize / 2) | 0, rgba, ToolSelector.brush.antiAliasing, size);
        if (Align == "twice") var X = left, Y = top;
        if (Align == "center") var X = startPoint.x - circleSize / 2, Y = startPoint.y - circleSize / 2;
        pastePixelData(Brush.cache, 0, 0, circleSize - 1, circleSize - 1, pixelData, X | 0, Y | 0, circleSize - 1, circleSize - 1, 混合方式);
    }
    if (Shape == "line") {
        if (Align == "twice") {
            for (var p = 0; p < path.length; p++) {
                // 路徑中的一格格 (注意跳格的情況不列入)
                var [previewPoint, point, distance] = path[p];
                //前一座標到當前座標的距離
                for (var i = 0; i <= distance; i++) {
                    var ratio = i / distance;
                    var currentPoint = new Point((previewPoint.x + (point.x - previewPoint.x) * ratio) | 0, (previewPoint.y + (point.y - previewPoint.y) * ratio) | 0);
                    const Y = currentPoint.y, X = currentPoint.x;

                    pastePixelData(Brush.cache, 0, 0, size, size, pixelData, X - halfSize, Y - halfSize, size, size, 混合方式);
                }
            }
        } else if (Align == "center") {
            for (var p = 0; p < path.length; p++) {
                // 路徑中的一格格 (注意跳格的情況不列入)
                var [previewPoint, point, distance] = path[p];
                //前一座標到當前座標的距離
                for (var i = 0; i <= distance; i++) {
                    var ratio = i / distance;
                    var currentPoint = new Point((previewPoint.x + (point.x - previewPoint.x) * ratio) | 0, (previewPoint.y + (point.y - previewPoint.y) * ratio) | 0);
                    pastePixelData(Brush.cache, 0, 0, size, size, pixelData, currentPoint.x - halfSize, currentPoint.y - halfSize, size, size, 混合方式);
                    var currentPoint = new Point((previewPoint.x - (point.x - previewPoint.x) * ratio) | 0, (previewPoint.y - (point.y - previewPoint.y) * ratio) | 0);
                    pastePixelData(Brush.cache, 0, 0, size, size, pixelData, currentPoint.x - halfSize, currentPoint.y - halfSize, size, size, 混合方式);
                }
            }
        }
    }
    if (Shape == "rect") {
        const left = Math.min(startPoint.x, endPoint.x); const right = Math.max(startPoint.x, endPoint.x);
        const top = Math.min(startPoint.y, endPoint.y); const bottom = Math.max(startPoint.y, endPoint.y);
        if (Align == "twice") {
            var topLeft = new Point(left, top), topRight = new Point(right, top);
            var bottomLeft = new Point(left, bottom), bottomRight = new Point(right, bottom);
            var path = [...path2LinkPath([topLeft, topRight]), ...path2LinkPath([topRight, bottomRight]), ...path2LinkPath([bottomLeft, bottomRight]), ...path2LinkPath([bottomLeft, topLeft])];
        }
        else if (Align == "center") {
            var gapX = parseInt(right - left), gapY = parseInt(bottom - top);
            var expandX = 0, expandY = 0;
            if (startPoint.x > endPoint.x) gapX = 0, expandX = parseInt(right - left);
            if (startPoint.y > endPoint.y) gapY = 0, expandY = parseInt(bottom - top);
            var topLeft = new Point(left - gapX, top - gapY), topRight = new Point(right + expandX, top - gapY);
            var bottomLeft = new Point(left - gapX, bottom + expandY), bottomRight = new Point(right + expandX, bottom + expandY);
            var path = [...path2LinkPath([topLeft, topRight]), ...path2LinkPath([topRight, bottomRight]), ...path2LinkPath([bottomLeft, bottomRight]), ...path2LinkPath([bottomLeft, topLeft])];
        }

        for (var p = 0; p < path.length; p++) {
            // 路徑中的一格格 (注意跳格的情況不列入)
            var [previewPoint, point, distance] = path[p];
            //前一座標到當前座標的距離
            for (var i = 0; i <= distance; i++) {
                var ratio = i / distance;
                var currentPoint = new Point((previewPoint.x + (point.x - previewPoint.x) * ratio) | 0, (previewPoint.y + (point.y - previewPoint.y) * ratio) | 0);
                const Y = currentPoint.y, X = currentPoint.x;
                pastePixelData(Brush.cache, 0, 0, size, size, pixelData, X - halfSize, Y - halfSize, size, size, 混合方式);
            }
        }
    }

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
        minY -= gapY / 1.25;
        minX -= gapX / 1.25;
        maxY += gapY / 1.25;
        maxX += gapX / 1.25;
    }

    // 往外多擴張一px
    ToolSelector.project.layerManager.needRefleshRect = true;// new Rect((minX - size / 2 - 1) | 0, (minY - size / 2 - 1) | 0, (maxX + size / 2 + 1) | 0, (maxY + size / 2 + 1) | 0);

    Canvas.pathCurrentIndex = ToolSelector.path.length - 1;
    GUI.refleshCanvas();
    return;
}

function invokeOilTool() {
    var fillType = oilTool.fillType;
    if (fillType == "油漆桶") {

        if (ToolSelector.path.length >= 1) return;
        // 這個是要直接修改的pixelData
        var pixelData = ToolSelector.layer.pixelData;

        var root = ToolSelector.project.layerManager, cache = root.cache.cache.d2, layer = ToolSelector.layer;
        const active = ToolSelector.project.layerManager.cache.active.d2;
        const pixels = layer.pixelData.d2;

        var temp = new PixelData(ToolSelector.layer.width, ToolSelector.layer.height, 4);
        var [left, top, right, bottom] = [layer.x, layer.y, layer.x + layer.width, layer.y + layer.height];

        // 前一次畫過的不再拿出來 
        var point = Canvas.mouseClickPoint;
        var ColorDifference = oilTool.ColorDiff;

        //建立參照表，數值小於它就可以填充
        if (oilTool.Separation == "color") {
            var [clickColorR, clickColorG, clickColorB, clickColorA] = getRgbaByPointFromPixelData(point, ToolSelector.layer.pixelData)

            for (var h = top; h < bottom; h++) {
                for (var w = left * 4; w < right * 4; w += 4) {
                    var currentColor = pixels[h][w + 0] + pixels[h][w + 1] + pixels[h][w + 2] + pixels[h][w + 3];
                    var clickColor = clickColorR + clickColorG + clickColorB + clickColorA;
                    var gap = ((clickColorR - pixels[h][w + 0]) ** 2 + (clickColorG - pixels[h][w + 1]) ** 2 + (clickColorB - pixels[h][w + 2]) ** 2 + (clickColorA - pixels[h][w + 3]) ** 2) ** 0.5;

                    temp.d2[h][w + 0] = temp.d2[h][w + 1] = temp.d2[h][w + 2] = temp.d2[h][w + 3] = gap;
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
        } else if (oilTool.Separation == "gradient") {
            // 往右、往左、往下、往上
            for (var h = top; h < bottom; h++) {
                for (var w = left * 4; w < right * 4; w += 4) {
                    var currentColor = pixels[h][w + 0] + pixels[h][w + 1] + pixels[h][w + 2] + pixels[h][w + 3];

                    if (h == top || w == left * 4 || h == bottom - 1 || w == right * 4 - 4) {
                        // 請留意可能的錯誤
                        //var currentColorRight = currentColorLeft = currentColorBottom = currentColorTop = currentColor;
                        var gapRight = gapLeft = gapBottom = gapTop = 0;
                    } else {
                        var currentColorRight = pixels[h][w + 0 + 4] + pixels[h][w + 1 + 4] + pixels[h][w + 2 + 4] + pixels[h][w + 3 + 4];
                        var currentColorLeft = pixels[h][w + 0 - 4] + pixels[h][w + 1 - 4] + pixels[h][w + 2 - 4] + pixels[h][w + 3 - 4];
                        var currentColorBottom = pixels[h + 1][w + 0] + pixels[h + 1][w + 1] + pixels[h + 1][w + 2] + pixels[h + 1][w + 3];
                        var currentColorTop = pixels[h - 1][w + 0] + pixels[h - 1][w + 1] + pixels[h - 1][w + 2] + pixels[h - 1][w + 3];

                        var gapRight = ((pixels[h][w + 0] - pixels[h][w + 0 + 4]) ** 2 + (pixels[h][w + 1] - pixels[h][w + 1 + 4]) ** 2 + (pixels[h][w + 2] - pixels[h][w + 2 + 4]) ** 2 + (pixels[h][w + 3] - pixels[h][w + 3 + 4]) ** 2) ** 0.5;
                        var gapLeft = ((pixels[h][w + 0] - pixels[h][w + 0 - 4]) ** 2 + (pixels[h][w + 1] - pixels[h][w + 1 - 4]) ** 2 + (pixels[h][w + 2] - pixels[h][w + 2 - 4]) ** 2 + (pixels[h][w + 3] - pixels[h][w + 3 - 4]) ** 2) ** 0.5;
                        var gapBottom = ((pixels[h][w + 0] - pixels[h + 1][w + 0]) ** 2 + (pixels[h][w + 1] - pixels[h + 1][w + 1]) ** 2 + (pixels[h][w + 2] - pixels[h + 1][w + 2]) ** 2 + (pixels[h][w + 3] - pixels[h + 1][w + 3]) ** 2) ** 0.5;
                        var gapTop = ((pixels[h][w + 0] - pixels[h - 1][w + 0]) ** 2 + (pixels[h][w + 1] - pixels[h - 1][w + 1]) ** 2 + (pixels[h][w + 2] - pixels[h - 1][w + 2]) ** 2 + (pixels[h][w + 3] - pixels[h - 1][w + 3]) ** 2) ** 0.5;
                    }

                    temp.d2[h][w + 0] = gapRight;
                    temp.d2[h][w + 1] = gapLeft;
                    temp.d2[h][w + 2] = gapBottom;
                    temp.d2[h][w + 3] = gapTop;
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
        }
        function CrossWater2(arr, mask) {
            var nextArr = [];
            if (mask) {
                for (var i = 0; i < arr.length; i++) {
                    var point = arr[i];

                    //由左至右
                    for (var w = (point.x + 1) * 4, w0 = (point.x + 1); w < right * 4; w += 4, w0++) {
                        if (cache[point.y][w] == 0 && temp.d2[point.y][w + 0] <= ColorDifference && mask[point.y][w] === 1) {
                            cache[point.y][w] = 7;
                            nextArr.push(new Point(w0, point.y));
                        } else break;
                    }

                    //從右到左
                    for (var w = (point.x - 1) * 4, w0 = (point.x - 1); w >= left * 4; w -= 4, w0--) {
                        if (cache[point.y][w] == 0 && temp.d2[point.y][w + 1] <= ColorDifference && mask[point.y][w] === 1) {
                            cache[point.y][w] = 7;
                            nextArr.push(new Point(w0, point.y));
                        } else break;
                    }

                    //從上到下
                    for (var h = point.y + 1; h < bottom; h++) {
                        if (cache[h][point.x * 4] == 0 && temp.d2[h][point.x * 4 + 2] <= ColorDifference && mask[h][point.x * 4] === 1) {
                            cache[h][point.x * 4] = 7;
                            nextArr.push(new Point(point.x, h));
                        } else break;
                    }

                    //從下到上
                    for (var h = point.y - 1; h >= top; h--) {
                        if (cache[h][point.x * 4] == 0 && temp.d2[h][point.x * 4 + 3] <= ColorDifference && mask[h][point.x * 4] === 1) {
                            cache[h][point.x * 4] = 7;
                            nextArr.push(new Point(point.x, h));
                        } else break;
                    }
                }
            } else {
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
            }
            return nextArr;
        }

        var mask = null;
        if (ToolSelector.hasSelection && ToolSelector.selection.getMap()) mask = ToolSelector.selection.getMap().d2;

        var PointArr = [point];
        while (PointArr.length > 0) PointArr = CrossWater2(PointArr, mask);

        var color = ToolSelector.color;
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

        GUI.refleshSandwichAndFullCanvas();
    }
    else if (fillType == "填充線") {
        var root = ToolSelector.project.layerManager, cache = root.cache.cache.d2, layer = ToolSelector.layer;

        if (ToolSelector.path.length <= 1) return;
        if (ToolSelector.colorIndex == 2) return;

        // 這個是要直接修改的pixelData
        var pixelData = ToolSelector.project.layerManager.cache.active;

        var size = 4, halfSize = size / 1;

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
        Canvas.pathCurrentIndex = ToolSelector.path.length - 1;
        GUI.refleshCanvas();
    }
}

function invokeSprayTool() {
    if (ToolSelector.path.length <= 1) return;
    // 這個是要直接修改的pixelData
    var pixelData = ToolSelector.project.layerManager.cache.active;
    if (ToolSelector.colorIndex == 2) pixelData = ToolSelector.layer.pixelData;
    // 前一次畫過的不再拿出來
    var path = ToolSelector.path.slice(Canvas.pathCurrentIndex);
    path = path2LinkPath(path);
    var size = ToolSelector.brush.size * 2, halfSize = (size / 2) | 0, rsq = size * size;

    var rgba = ToolSelector.color.toRGBAList();
    rgba[3] = parseInt(255 * (ToolSelector.brush.opacity / 100.0));
    createCircle(halfSize, rgba, ToolSelector.brush.antiAliasing);
    if (ToolSelector.colorIndex == 2) createCircle(halfSize, [rgba[3], rgba[3], rgba[3], 255], ToolSelector.brush.antiAliasing);

    var step = (1 + (1 - (ToolSelector.brush.range / 100.0)) * ToolSelector.brush.size) | 0;
    //添加雜訊
    // var noise = new NoiseList(0n).genList(((halfSize * 2) ** 2));

    // 透明色會用完全覆蓋的方式
    const 混合方式 = ToolSelector.colorIndex == 2 ? 混合模式.橡皮擦 : 混合模式.筆刷;
    for (var p = 0; p < path.length; p++) {
        // 路徑中的一格格 (注意跳格的情況不列入)
        var [previewPoint, point, distance] = path[p]; //[currentPath[0], currentPath[1], currentPath[2]];

        /*for (var h = 0; h < halfSize * 2; h++) {
            for (var w = 0; w < halfSize * 2; w++) {
                if (Brush.cache.d2[h][w * 4 + 3] == 1) Brush.cache.d2[h][w * 4 + 3] = 255;
                if (Math.random() > 0.03)
                    Brush.cache.d2[h][w * 4 + 3] = 1;
            }
        }*/
        //前一座標到當前座標的距離
        for (var i = 0; i <= distance; i += step) {

            for (var h = 0; h < halfSize * 2; h++) {
                for (var w = 0; w < halfSize * 2; w++) {
                    if (Math.random() < 0.03) {
                        if (rgba[0] + rgba[1] + rgba[2] == Brush.cache.d2[h][w * 4 + 0] + Brush.cache.d2[h][w * 4 + 1] + Brush.cache.d2[h][w * 4 + 2])
                            Brush.cache.d2[h][w * 4 + 3] = 255;
                        else Brush.cache.d2[h][w * 4 + 3] = 0;
                    } else Brush.cache.d2[h][w * 4 + 3] = 0;
                }
            }
            var ratio = i / distance;
            var currentPoint = new Point((previewPoint.x + (point.x - previewPoint.x) * ratio) | 0, (previewPoint.y + (point.y - previewPoint.y) * ratio) | 0);
            const Y = currentPoint.y, X = currentPoint.x;
            pastePixelData(Brush.cache, 0, 0, size, size, pixelData, X - halfSize, Y - halfSize, size, size, 混合方式);
        }
    }

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

    Canvas.pathCurrentIndex = ToolSelector.path.length - 1;
    GUI.refleshCanvas();
    return;
}
function invokeErasorTool() {
    if (ToolSelector.path.length <= 1) return;
    // 這個是要直接修改的pixelData
    var pixelData = ToolSelector.layer.pixelData;
    // 前一次畫過的不再拿出來
    var path = ToolSelector.path.slice(Canvas.pathCurrentIndex);
    var pressurePath = ToolSelector.pressurePath.slice(Canvas.pathCurrentIndex);
    path = path2LinkPathIncludePressure(path, pressurePath);

    var size = ToolSelector.brush.size, halfSize = (size / 2) | 0, rsq = size * size;
    var opacity = parseInt(255 * (ToolSelector.brush.opacity / 100.0));
    var opacityWithPressure = "" + ToolSelector.brush.opacityWithPressure == 'true';
    createCircle(halfSize, [opacity, opacity, opacity, 255], ToolSelector.brush.antiAliasing);

    for (var p = 0; p < path.length; p++) {
        // 路徑中的一格格 (注意跳格的情況不列入)
        var [previewPoint, point, distance, pressure] = path[p];
        //前一座標到當前座標的距離
        for (var i = 0; i <= distance; i++) {
            var ratio = i / distance;
            var currentPoint = new Point((previewPoint.x + (point.x - previewPoint.x) * ratio) | 0, (previewPoint.y + (point.y - previewPoint.y) * ratio) | 0);
            const Y = currentPoint.y + (((size - size * pressure) / 2) | 0), X = currentPoint.x + (((size - size * pressure) / 2) | 0);
            pastePixelData(Brush.cache, 0, 0, size, size, pixelData, X - halfSize, Y - halfSize, size * pressure, size * pressure, 混合模式.橡皮擦, opacityWithPressure ? pressure : 1.0);
        }
    }

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

    Canvas.pathCurrentIndex = ToolSelector.path.length - 1;
    GUI.refleshCanvas();
    return;
}

// 筆刷工具
function invokePencilTool() {
    if (ToolSelector.path.length <= 1) return;
    // 這個是要直接修改的pixelData
    var pixelData = ToolSelector.project.layerManager.cache.active;
    if (ToolSelector.colorIndex == 2) pixelData = ToolSelector.layer.pixelData;
    // 前一次畫過的不再拿出來
    var path = ToolSelector.path.slice(Canvas.pathCurrentIndex);
    var pressurePath = ToolSelector.pressurePath.slice(Canvas.pathCurrentIndex);
    path = path2LinkPathIncludePressure(path, pressurePath);

    var size = ToolSelector.brush.size, halfSize = (size / 2) | 0, rsq = size * size;
    const pencilType = ToolSelector.brush.pencilType;
    var opacity = (ToolSelector.brush.opacity / 100.0);
    var opacityWithPressure = "" + ToolSelector.brush.opacityWithPressure == 'true';

    if (pencilType == "原子筆") {
        // 透明色會用完全覆蓋的方式
        const 混合方式 = ToolSelector.colorIndex == 2 ? 混合模式.橡皮擦 : 混合模式.筆刷;

        var rgba = ToolSelector.color.toRGBAList();
        rgba[3] = parseInt(255 * opacity);
        createCircle(halfSize, rgba, ToolSelector.brush.antiAliasing);
        if (ToolSelector.colorIndex == 2) createCircle(halfSize, [rgba[3], rgba[3], rgba[3], 255], ToolSelector.brush.antiAliasing);
        for (var p = 0; p < path.length; p++) {
            // 路徑中的一格格 (注意跳格的情況不列入)
            var [previewPoint, point, distance, pressure] = path[p]; //[currentPath[0], currentPath[1], currentPath[2]];

            //前一座標到當前座標的距離
            for (var i = 0; i <= distance; i++) {
                var ratio = i / distance;
                var currentPoint = new Point((previewPoint.x + (point.x - previewPoint.x) * ratio) | 0, (previewPoint.y + (point.y - previewPoint.y) * ratio) | 0);
                const Y = currentPoint.y + (((size - size * pressure) / 2) | 0), X = currentPoint.x + (((size - size * pressure) / 2) | 0);
                pastePixelData(Brush.cache, 0, 0, size, size, pixelData, X - halfSize, Y - halfSize, size * pressure, size * pressure, 混合方式, opacityWithPressure ? pressure : 1.0);
            }
        }
    } else if (pencilType == "鉛筆" || pencilType == "沾水筆") {
        // 透明色會用完全覆蓋的方式
        const 混合方式 = ToolSelector.colorIndex == 2 ? 混合模式.橡皮擦 : 混合模式.筆刷;

        var mat_index = parseInt(Math.random() * 4);
        var material = Brush.pencilMaterial[mat_index];

        Brush.cache = new F32PixelData(64, 64, 4);

        var rgba = ToolSelector.color.toRGBAList();
        var rgba2 = ToolSelector.前背透色[ToolSelector.colorIndex].toRGBAList();

        for (var p = 0; p < path.length; p++) {
            // 路徑中的一格格 (注意跳格的情況不列入)
            var [previewPoint, point, distance, pressure] = path[p];
            if (pencilType == "沾水筆") {
                //前一座標到當前座標的距離
                for (var i = 0; i <= distance; i += (1 + ((size * pressure) / 2)) | 0) {
                    var rand = Math.random(), Inv = 1 - rand;
                    var mat_index = parseInt(Math.random() * 4);
                    var material = Brush.pencilMaterial[mat_index];

                    for (var j = 0; j < material.d1.length; j += 4) {
                        if (material.d1[j + 3] > 20) {
                            Brush.cache.d1[j + 0] = (rgba[0] * rand + (rgba2[0]) * Inv);
                            Brush.cache.d1[j + 1] = (rgba[1] * rand + (rgba2[1]) * Inv);
                            Brush.cache.d1[j + 2] = (rgba[2] * rand + (rgba2[2]) * Inv);
                            Brush.cache.d1[j + 3] = 255 * opacity * rand;
                        } else Brush.cache.d1[j + 3] = 0;
                    }

                    var ratio = i / distance;
                    var currentPoint = new Point((previewPoint.x + (point.x - previewPoint.x) * ratio) | 0, (previewPoint.y + (point.y - previewPoint.y) * ratio) | 0);
                    const Y = currentPoint.y + (((size - size * pressure) / 2) | 0), X = currentPoint.x + (((size - size * pressure) / 2) | 0);
                    pastePixelData(Brush.cache, 0, 0, 64, 64, pixelData, X - halfSize, Y - halfSize, size * pressure, size * pressure, 混合方式, opacityWithPressure ? pressure : 1.0);
                }
            } else {
                //前一座標到當前座標的距離
                for (var i = 0; i <= distance; i += (1 + (size / 8)) | 0) {
                    var mat_index = parseInt(Math.random() * 4);
                    var material = Brush.pencilMaterial[mat_index];

                    for (var j = 0; j < material.d1.length; j += 4) {
                        if (material.d1[j + 3] > 20) {
                            var rand = Math.random(), Inv = 1 - rand;
                            Brush.cache.d1[j + 0] = (rgba[0] * rand + (rgba2[0]) * Inv);
                            Brush.cache.d1[j + 1] = (rgba[1] * rand + (rgba2[1]) * Inv);
                            Brush.cache.d1[j + 2] = (rgba[2] * rand + (rgba2[2]) * Inv);
                            Brush.cache.d1[j + 3] = 255 * opacity * rand;
                        } else Brush.cache.d1[j + 3] = 0;
                    }

                    var ratio = i / distance;
                    var currentPoint = new Point((previewPoint.x + (point.x - previewPoint.x) * ratio) | 0, (previewPoint.y + (point.y - previewPoint.y) * ratio) | 0);
                    const Y = currentPoint.y + (((size - size * pressure) / 2) | 0), X = currentPoint.x + (((size - size * pressure) / 2) | 0);
                    pastePixelData(Brush.cache, 0, 0, 64, 64, pixelData, X - halfSize, Y - halfSize, size * pressure, size * pressure, 混合方式, opacityWithPressure ? pressure : 1.0);
                }
            }
        }
    }

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

    Canvas.pathCurrentIndex = ToolSelector.path.length - 1;
    GUI.refleshCanvas();
    return;
}

// 水彩筆工具
function invokeWaterpenTool() {
    if (ToolSelector.path.length <= 1) return;
    // 這個是要直接修改的pixelData
    var pixelData = ToolSelector.project.layerManager.cache.active;
    if (ToolSelector.colorIndex == 2) pixelData = ToolSelector.layer.pixelData;
    // 前一次畫過的不再拿出來
    var path = ToolSelector.path.slice(Canvas.pathCurrentIndex);
    var pressurePath = ToolSelector.pressurePath.slice(Canvas.pathCurrentIndex);
    path = path2LinkPathIncludePressure(path, pressurePath);

    var size = ToolSelector.brush.size, halfSize = (size / 2) | 0, rsq = size * size;
    const pencilType = "水彩筆"; //ToolSelector.brush.pencilType;
    const 濃度 = (ToolSelector.brush.pigment / 100.0), 紙濃度 = 1 - 濃度;
    var opacity = ((ToolSelector.brush.opacity / 100.0) * 255) | 0;
    //var opacityWithPressure = "" + ToolSelector.brush.opacityWithPressure == 'true';

    if (pencilType == "水彩筆") {
        // 透明色會用完全覆蓋的方式
        const 混合方式 = ToolSelector.colorIndex == 2 ? 混合模式.橡皮擦 : 混合模式.筆刷;
        var material = Brush.waterpenMaterial[0];
        Brush.cache = new F32PixelData(size, size, 4);

        var rgba = ToolSelector.color.toRGBAList();
        var rgba2 = ToolSelector.前背透色[ToolSelector.colorIndex].toRGBAList();

        for (var p = 0; p < path.length; p++) {
            // 路徑中的一格格 (注意跳格的情況不列入)
            var [previewPoint, point, distance, pressure] = path[p];
            //前一座標到當前座標的距離
            for (var i = 0; i <= distance; i += (1 + (size / 8)) | 0) {
                var ratio = i / distance;
                var currentPoint = new Point((previewPoint.x + (point.x - previewPoint.x) * ratio) | 0, (previewPoint.y + (point.y - previewPoint.y) * ratio) | 0);
                const Y = currentPoint.y, X = currentPoint.x;
                for (var h = 0; h < size; h++) {
                    const offsetY = Y % 350 + h >= 350 ? Y % 350 + h - 350 : Y % 350 + h;
                    const brushRow = Brush.cache.d2[h], materialRow = material.d2[offsetY];
                    for (var w = 0, w0 = 0; w < size * 4; w += 4, w0++) {
                        var dist = Math.sqrt((w0 - halfSize) ** 2 + (h - halfSize) ** 2);
                        /*if (dist + 1 >= halfSize && dist - 1 <= halfSize) {
                            const offsetX = X % 350 + w0 >= 350 ? X % 350 + w0 - 350 : X % 350 + w0;
                            brushRow[w + 0] = materialRow[(offsetX) * 4 + 0];
                            brushRow[w + 1] = materialRow[(offsetX) * 4 + 1];
                            brushRow[w + 2] = materialRow[(offsetX) * 4 + 2];
                            brushRow[w + 3] = materialRow[(offsetX) * 4 + 3];
                        }*/
                        if (dist <= halfSize) {
                            const offsetX = X % 350 + w0 >= 350 ? X % 350 + w0 - 350 : X % 350 + w0;
                            brushRow[w + 0] = (rgba[0] * 濃度 + materialRow[(offsetX) * 4 + 0] * 紙濃度) | 0;
                            brushRow[w + 1] = (rgba[1] * 濃度 + materialRow[(offsetX) * 4 + 1] * 紙濃度) | 0;
                            brushRow[w + 2] = (rgba[2] * 濃度 + materialRow[(offsetX) * 4 + 2] * 紙濃度) | 0;
                            brushRow[w + 3] = opacity | 0;
                        }
                    }
                }
                pastePixelData(Brush.cache, 0, 0, size, size, pixelData, X - ((halfSize * pressure) | 0), Y - ((halfSize * pressure) | 0), size * pressure, size * pressure, 混合方式, 1.0);
            }
        }
    }

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

    Canvas.pathCurrentIndex = ToolSelector.path.length - 1;
    GUI.refleshCanvas();
    return;
}


function setHandTool() {
    ToolSelector.brush = handTool;
}

function setSelectTool1() {
    ToolSelector.brush = selectTool1;
}

function setPencilTool() {
    ToolSelector.brush = pencilTool;
    Canvas.cursor.style.width = Canvas.cursor.style.height = `${pencilTool.size}px`;
}

function setOilTool() {
    ToolSelector.brush = oilTool;
    Canvas.cursor.style.width = Canvas.cursor.style.height = `${5}px`;
}

function setDropperTool() {
    ToolSelector.brush = dropperTool;
    Canvas.cursor.style.width = Canvas.cursor.style.height = `${5}px`;
}

function setSprayTool() {
    ToolSelector.brush = sprayTool;
    Canvas.cursor.style.width = Canvas.cursor.style.height = `${sprayTool.size * 2}px`;
}

function setWaterpenTool() {
    ToolSelector.brush = waterpenTool;
    Canvas.cursor.style.width = Canvas.cursor.style.height = `${waterpenTool.size}px`;
}

function setErasorTool() {
    ToolSelector.brush = erasorTool;
    Canvas.cursor.style.width = Canvas.cursor.style.height = `${erasorTool.size}px`;
}

function setLineTool() {
    ToolSelector.brush = lineTool;
    Canvas.cursor.style.width = Canvas.cursor.style.height = `${lineTool.size}px`;
}

function setGradientTool() {
    ToolSelector.brush = gradientTool;
}

function setSelectTool2() {
    ToolSelector.brush = selectTool2;
}

function setEggTool() {
    ToolSelector.brush = eggTool;
}

getByid("handTool").onmousemove = function () { GUI.setStatusText("移動工具 (可以移動圖片位置，預設可用滑鼠中鍵移動)"); }
getByid("selectTool1").onmousemove = function () { GUI.setStatusText("範圍選擇 (框選住的地方才能編輯)"); }
getByid("pencilTool").onmousemove = function () { GUI.setStatusText("鉛筆 (一種筆)"); }
getByid("oilTool").onmousemove = function () { GUI.setStatusText("油漆桶 (類似小畫家的油漆桶，改良版)"); }
getByid("sprayTool").onmousemove = function () { GUI.setStatusText("酒精噴霧 (一種筆)"); }
getByid("waterpenTool").onmousemove = function () { GUI.setStatusText("水彩筆 (一種筆)"); }
getByid("erasorTool").onmousemove = function () { GUI.setStatusText("橡皮擦 (將劃過的地方變成透明)"); }
getByid("lineTool").onmousemove = function () { GUI.setStatusText("形狀 (繪製常見形狀)"); }
getByid("gradientTool").onmousemove = function () { GUI.setStatusText("漸層工具 (從選取色到背景色)"); }
getByid("selectTool2").onmousemove = function () { GUI.setStatusText("仙女棒 (魔術棒的升級版)"); }
getByid("eggTool").onmousemove = function () { GUI.setStatusText("瑞典復活節彩蛋"); }
getByid("dropperTool").onmousemove = function () { GUI.setStatusText("滴管工具 (選擇色彩用，預設可用滑鼠右鍵選擇)"); }

getByid("selectEmpty").onclick = function () {
    ToolSelector.selection = null;
    GUI.refleshMarkCanvas();
}

getByid("reverseEmpty").onclick = function () {
    if (ToolSelector.selection) ToolSelector.selection.reverse();
    GUI.refleshMarkCanvas();
}

getByid("foregroundColorDiv").onmousemove = function () { GUI.setStatusText("前景色"); }
getByid("backgroundColorDiv").onmousemove = function () { GUI.setStatusText("背景色"); }
getByid("alphaColorDiv").onmousemove = function () { GUI.setStatusText("透明色"); }
getByid("foregroundColorDiv").onclick = function () {
    getByid("foregroundColorDiv").style.borderStyle = "double";
    getByid("backgroundColorDiv").style.borderStyle = "solid";
    getByid("foregroundColorDiv").style.borderStyle = "solid";
    getByid("foregroundColorDiv").style.scale = "0.8";
    getByid("backgroundColorDiv").style.scale = "0.6";
    getByid("alphaColorDiv").style.scale = "0.6";
    ToolSelector.colorIndex = 0;
}
getByid("backgroundColorDiv").onclick = function () {
    getByid("foregroundColorDiv").style.borderStyle = "solid";
    getByid("foregroundColorDiv").style.borderStyle = "double";
    getByid("alphaColorDiv").style.borderStyle = "solid";
    getByid("foregroundColorDiv").style.scale = "0.6";
    getByid("backgroundColorDiv").style.scale = "0.8";
    getByid("alphaColorDiv").style.scale = "0.6";
    ToolSelector.colorIndex = 1;
}
getByid("alphaColorDiv").onclick = function (e) {
    getByid("foregroundColorDiv").style.borderStyle = "solid";
    getByid("backgroundColorDiv").style.borderStyle = "solid";
    getByid("alphaColorDiv").style.borderStyle = "double";
    getByid("foregroundColorDiv").style.scale = "0.6";
    getByid("backgroundColorDiv").style.scale = "0.6";
    getByid("alphaColorDiv").style.scale = "0.8";
    ToolSelector.colorIndex = 2;
}
function updateColor(r, g, b, a) {
    if (ToolSelector.colorIndex == 2) ToolSelector.colorIndex = 0;
    if (ToolSelector.colorIndex == 0) {
        ToolSelector.前背透色[0].r = r;
        ToolSelector.前背透色[0].g = g;
        ToolSelector.前背透色[0].b = b;
        getByid("foregroundColorDiv").style.backgroundColor = `rgb(${r},${g},${b})`;
    }
    if (ToolSelector.colorIndex == 1) {
        ToolSelector.前背透色[1].r = r;
        ToolSelector.前背透色[1].g = g;
        ToolSelector.前背透色[1].b = b;
        getByid("backgroundColorDiv").style.backgroundColor = `rgb(${r},${g},${b})`;
    }
}