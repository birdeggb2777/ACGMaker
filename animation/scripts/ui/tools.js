
function enableBtnWithId(idList, enable = true) {
    for (var elem of idList)
        getByid(elem).parentNode.style.background = (enable == true) ? "#d6def8" : "#b6bac4";
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
    updateCursorSize(selectTool2.size);
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

getByid("shapeToolShape").onchange = function () {
    shapeTool.shape = "" + this.value;
    enableBtnWithId(["shapeToolShapeValue1", "shapeToolShapeValue2", "shapeToolShapeValue3"], false);
    if ("" + this.value == "circle") enableBtnWithId(["shapeToolShapeValue1"], true);
    if ("" + this.value == "rect") enableBtnWithId(["shapeToolShapeValue2"], true);
    if ("" + this.value == "line") enableBtnWithId(["shapeToolShapeValue3"], true);
}
getByid("shapeToolShapeValue1").parentNode.onclick = function () {
    getByid("shapeToolShape").value = "circle";
    getByid("shapeToolShape").onchange();
}
getByid("shapeToolShapeValue2").parentNode.onclick = function () {
    getByid("shapeToolShape").value = "rect";
    getByid("shapeToolShape").onchange();
}
getByid("shapeToolShapeValue3").parentNode.onclick = function () {
    getByid("shapeToolShape").value = "line";
    getByid("shapeToolShape").onchange();
}

getByid("shapeToolAlign").onchange = function () {
    shapeTool.AlignBy = "" + this.value;
    enableBtnWithId(["shapeToolAlignValue1", "shapeToolAlignValue2"], false);
    if ("" + this.value == "center") enableBtnWithId(["shapeToolAlignValue1"], true);
    if ("" + this.value == "twice") enableBtnWithId(["shapeToolAlignValue2"], true);
}
getByid("shapeToolAlignValue1").parentNode.onclick = function () {
    getByid("shapeToolAlign").value = "center";
    getByid("shapeToolAlign").onchange();
}
getByid("shapeToolAlignValue2").parentNode.onclick = function () {
    getByid("shapeToolAlign").value = "twice";
    getByid("shapeToolAlign").onchange();
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
    updateCursorSize(pencilTool.size);
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
    updateCursorSize(waterpenTool.size);
}
getByid("waterpenOpacityNum").oninput = getByid("waterpenOpacity").oninput = function () {
    waterpenTool.opacity = parseInt(this.value);
    getByid("waterpenOpacityNum").value = getByid("waterpenOpacity").value = this.value;
}
getByid("waterpenPigmentNum").oninput = getByid("waterpenPigment").oninput = function () {
    waterpenTool.pigment = parseInt(this.value);
    getByid("waterpenPigmentNum").value = getByid("waterpenPigment").value = this.value;
}

getByid("sealSizeNum").oninput = getByid("sealSize").oninput = function () {
    sealTool.size = parseInt(this.value);
    getByid("sealSizeNum").value = getByid("sealSize").value = this.value;
    updateCursorSize(sealTool.size);
}

getByid("spraySizeNum").oninput = getByid("spraySize").oninput = function () {
    sprayTool.size = parseInt(this.value);
    getByid("spraySizeNum").value = getByid("spraySize").value = this.value;
    updateCursorSize(sprayTool.size * 2);
}
getByid("sprayRangeNum").oninput = getByid("sprayRange").oninput = function () {
    sprayTool.range = parseInt(this.value);
    getByid("sprayRangeNum").value = getByid("sprayRange").value = this.value;
}


getByid("lineSizeNum").oninput = getByid("lineSize").oninput = function () {
    shapeTool.size = parseInt(this.value);
    getByid("lineSizeNum").value = getByid("lineSize").value = this.value;
    updateCursorSize(shapeTool.size);
}
getByid("lineOpacityNum").oninput = getByid("lineOpacity").oninput = function () {
    shapeTool.opacity = parseInt(this.value);
    getByid("lineOpacityNum").value = getByid("lineOpacity").value = this.value;
}
getByid("lineAntiAliasingNum").oninput = getByid("lineAntiAliasing").oninput = function () {
    shapeTool.antiAliasing = parseInt(this.value);
    getByid("lineAntiAliasingNum").value = getByid("lineAntiAliasing").value = this.value;
}

getByid("erasorSizeNum").oninput = getByid("erasorSize").oninput = function () {
    erasorTool.size = parseInt(this.value);
    getByid("erasorSizeNum").value = getByid("erasorSize").value = this.value;
    updateCursorSize(erasorTool.size);
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
var shapeTool = new Brush(); shapeTool.id = "shapeTool";
shapeTool.AlignBy = "center";
shapeTool.shape = "circle";
shapeTool.size = 8;
shapeTool.antiAliasing = 1;
var gradientTool = new Brush(); gradientTool.id = "gradientTool";
var textTool = new Brush(); textTool.id = "textTool";
var selectTool2 = new Brush(); selectTool2.id = "selectTool2";
selectTool2.ColorDiff = 20;
selectTool2.size = 50;
selectTool2.magicType = "魔術棒";
var eggTool = new Brush(); eggTool.id = "eggTool";
var sealTool = new Brush(); sealTool.id = "sealTool";
sealTool.size = 50;
var dropperTool = new Brush(); dropperTool.id = "dropperTool";
dropperTool.source = "layer";
var operateTool = new Brush(); operateTool.id = "operateTool";

function setHandTool() {
    ToolSelector.brush = handTool;
}

function setSelectTool1() {
    ToolSelector.brush = selectTool1;
}

function setPencilTool() {
    ToolSelector.brush = pencilTool;
    updateCursorSize(ToolSelector.brush.size);
}

function setOilTool() {
    ToolSelector.brush = oilTool;
    updateCursorSize(5);
}

function setDropperTool() {
    ToolSelector.brush = dropperTool;
    updateCursorSize(5);
}

function setSprayTool() {
    ToolSelector.brush = sprayTool;
    updateCursorSize(ToolSelector.brush.size * 2);
}

function setWaterpenTool() {
    ToolSelector.brush = waterpenTool;
    updateCursorSize(ToolSelector.brush.size);
}

function setErasorTool() {
    ToolSelector.brush = erasorTool;
    updateCursorSize(ToolSelector.brush.size);
}

function setShapeTool() {
    ToolSelector.brush = shapeTool;
    updateCursorSize(ToolSelector.brush.size);
}

function setOperateTool() {
    ToolSelector.brush = operateTool;
}

function setTextTool() {
    ToolSelector.brush = textTool;
}

function setSealTool() {
    ToolSelector.brush = sealTool;
    updateCursorSize(ToolSelector.brush.size);
}

function setGradientTool() {
    ToolSelector.brush = gradientTool;
}

function setSelectTool2() {
    ToolSelector.brush = selectTool2;
    updateCursorSize(ToolSelector.brush.size);
}

function setEggTool() {
    ToolSelector.brush = eggTool;
}

getByid("handTool").onmousemove = () => GUI.setStatusText("移動工具 (可以移動圖片位置，預設可用滑鼠中鍵移動)");
getByid("selectTool1").onmousemove = () => GUI.setStatusText("範圍選擇 (框選住的地方才能編輯)");
getByid("operateTool").onmousemove = () => GUI.setStatusText("操作工具 (可以移動、縮放選取的區域)");
getByid("pencilTool").onmousemove = () => GUI.setStatusText("鉛筆 (一種筆)");
getByid("oilTool").onmousemove = () => GUI.setStatusText("油漆桶 (類似小畫家的油漆桶，改良版)");
getByid("sprayTool").onmousemove = () => GUI.setStatusText("酒精噴霧 (一種筆)");
getByid("waterpenTool").onmousemove = () => GUI.setStatusText("水彩筆 (一種筆)");
getByid("erasorTool").onmousemove = () => GUI.setStatusText("橡皮擦 (將劃過的地方變成透明)");
getByid("shapeTool").onmousemove = () => GUI.setStatusText("形狀 (繪製常見形狀)");
getByid("textTool").onmousemove = () => GUI.setStatusText("文字工具 (準備中)");
getByid("sealTool").onmousemove = () => GUI.setStatusText("複製工具 (按住alt並點擊影像可以複製為印章，沒有印章就怎麼按都不會有反應)");
getByid("gradientTool").onmousemove = () => GUI.setStatusText("漸層工具 (從選取色到背景色)");
getByid("selectTool2").onmousemove = () => GUI.setStatusText("仙女棒 (魔術棒的升級版)");
getByid("eggTool").onmousemove = () => GUI.setStatusText("瑞典復活節彩蛋");
getByid("dropperTool").onmousemove = () => GUI.setStatusText("滴管工具 (選擇色彩用，預設可用滑鼠右鍵選擇)");

getByid("selectEmpty").onclick = function () {
    ToolSelector.selection = null;
    GUI.refleshMarkCanvas();
}

getByid("selectAll").onclick = function () {
    ToolSelector.selection = new Selection("rect", new Rect(0, 0, Canvas.width, Canvas.height));
    ToolSelector.selection.rect2pixel();
    GUI.refleshMarkCanvas();
}

getByid("reverseEmpty").onclick = function () {
    if (ToolSelector.selection) ToolSelector.selection.reverse();
    GUI.refleshMarkCanvas();
}

getByid("colorpalette").onmousemove = function () { GUI.setStatusText("調色盤"); }
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