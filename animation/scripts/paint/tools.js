
class Brush {
    constructor() {
        this.id = null;
        this.size = 20;
        this.opacity = 95;
        this.antiAliasing = 5;
    }
    // static Painting = false; //代表已經下筆 
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
getByid("scaledWithPixelated").onchange = function () {
    if (this.checked) getByid("picture").style["image-rendering"] = "pixelated";
    else getByid("picture").style["image-rendering"] = "";
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

    //if ("" + this.value == "油漆桶") getByid("oilColorDiffLabel").style.display = getByid("oilColorDiffNum").style.display = getByid("oilColorDiffSize").style.display = "";
    //if ("" + this.value == "填充線") getByid("oilColorDiffLabel").style.display = getByid("oilColorDiffNum").style.display = getByid("oilColorDiffSize").style.display = "none";
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
getByid("selectTool2SizeNum").oninput = getByid("selectTool2Size").oninput = function () {
    selectTool2.size = parseInt(this.value);
    getByid("selectTool2SizeNum").value = getByid("selectTool2Size").value = this.value;
    Canvas.cursor.style.width = Canvas.cursor.style.height = `${selectTool2.size}px`;
}
getByid("magicType").onchange = function () {
    selectTool2.magicType = "" + this.value;
    enableBtnWithId(["magicTypeValue1", "magicTypeValue2"], false);
    if ("" + this.value == "魔術棒") enableBtnWithId(["magicTypeValue1"], true);
    if ("" + this.value == "仙女棒") enableBtnWithId(["magicTypeValue2"], true);
    if ("" + this.value == "魔術棒") getByid("selectTool2SizeLabel").style.display = getByid("selectTool2SizeNum").style.display = getByid("selectTool2Size").style.display = "none";
    if ("" + this.value == "仙女棒") getByid("selectTool2SizeLabel").style.display = getByid("selectTool2SizeNum").style.display = getByid("selectTool2Size").style.display = "";
}
getByid("magicTypeValue1").parentNode.onclick = function () {
    getByid("magicType").value = "魔術棒";
    getByid("magicType").onchange();
}
getByid("magicTypeValue2").parentNode.onclick = function () {
    getByid("magicType").value = "仙女棒";
    getByid("magicType").onchange();
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
selectTool2.ColorDiff = 20;
selectTool2.size = 50;
selectTool2.magicType = "魔術棒";
var eggTool = new Brush(); eggTool.id = "eggTool";
var dropperTool = new Brush(); dropperTool.id = "dropperTool";
dropperTool.source = "layer";


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
    Canvas.cursor.style.width = Canvas.cursor.style.height = `${selectTool2.size}px`;
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