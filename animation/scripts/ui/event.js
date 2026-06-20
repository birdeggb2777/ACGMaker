
getByid("workspace").onpointerdown = function (e) {
    GUI.menu = null; // 將選擇的menu指向null
    GUI.closeAllDrawer();
    if (getByid(e.target.id) && getByid(e.target.id).parentNode.id != "colorpalette" && getByid(e.target.id).id != "colorpalette") GUI.closeColorPalette();
}

getByid("canvas_area").onpointerdown = function (e) {
    if (e?.target?.parentNode?.id == "ColorWindow") return;
    if (e.button > 1 && e.pointerType === 'pen') Canvas.mouseDownLeft = true;
    else {
        if (e.button == 0) Canvas.mouseDownLeft = true;
        if (e.button == 1) Canvas.mouseDownMiddle = true;
        if (e.button == 2) Canvas.mouseDownRight = true;
    }

    // 紀錄歷史狀態
    if (ToolSelector.brush == oilTool || ToolSelector.brush == erasorTool || ToolSelector.brush == operateTool) Command.cmd("history", "");

    ToolSelector.path = [];
    ToolSelector.pressurePath = [];
    Canvas.pathCurrentIndex = 1;
    Canvas.mousePreviousPoint = new Point(e.pageX - this.getBoundingClientRect().left - 0, e.pageY - this.getBoundingClientRect().top - 0);
    Canvas.mouseClickPoint = Canvas.getCurrentPoint(Canvas.mousePreviousPoint);
    // 僅限點一下的筆刷，比如油漆桶
    if (Canvas.mouseDownLeft) Command.cmd("brushClick", null);
    // 滴管專用工具
    if (Canvas.mouseDownRight) Command.cmd("brushRight", null);
    // 可放到其他程式碼區域
    if (ToolSelector.brush == pencilTool || ToolSelector.brush == waterpenTool || ToolSelector.brush == erasorTool || ToolSelector.brush == sprayTool || ToolSelector.brush == shapeTool) beginPencilTool();
    if (ToolSelector.brush == oilTool && oilTool.fillType == "填充線") beginPencilTool();
}

getByid("canvas_area").onpointerup = function (e) {
    if (e?.target?.parentNode?.id == "ColorWindow") return;
    if (e.pointerType === 'pen') Canvas.mouseDownLeft = false;
    if (e.button == 0) Canvas.mouseDownLeft = false;
    if (e.button == 1) Canvas.mouseDownMiddle = false;
    if (e.button == 2) Canvas.mouseDownRight = false;

    /*if (ToolSelector.brush == operateTool) {
        var endPoint = ToolSelector.path[ToolSelector.path.length - 1] ? ToolSelector.path[ToolSelector.path.length - 1] : Canvas.mouseClickPoint;
        var offsetPoint = new Point(((Canvas.mouseClickPoint.x - endPoint.x) | 0), ((Canvas.mouseClickPoint.y - endPoint.y) | 0));
        if (operateTool.selection) operateTool.selection.move(offsetPoint)
        ToolSelector.selection = operateTool.selection;
        GUI.refleshMarkCanvas();
    }*/

    ToolSelector.path = [];
    ToolSelector.pressurePath = [];
    Canvas.mousePreviousPoint = new Point(e.pageX - this.getBoundingClientRect().left - 0, e.pageY - this.getBoundingClientRect().top - 0);
    Canvas.mouseEndPoint = Canvas.getCurrentPoint(Canvas.mousePreviousPoint);
    // 僅限點一下的筆刷，比如油漆桶
    Command.cmd("brushEnd", null);
    // 可放到其他程式碼區域
    if (ToolSelector.brush == pencilTool || ToolSelector.brush == waterpenTool || ToolSelector.brush == sprayTool || ToolSelector.brush == sealTool || ToolSelector.brush == shapeTool || ToolSelector.brush == operateTool) endPencilTool();
    if (ToolSelector.brush == oilTool && oilTool.fillType == "填充線") endPencilTool();
    if (ToolSelector.brush == selectTool1 && ToolSelector?.selection?.type == "rect") {
        ToolSelector.selection.rect2pixel();
        GUI.refleshMarkCanvas();
    }
}

function isPointInRect(point, rect) {
    return point.x >= rect.left && point.y >= rect.top && point.x < rect.right && point.y < rect.bottom;
}
function getRgbaByPointFromPixelData(point, pixelData) {
    return [pixelData.d2[point.y][point.x * 4 + 0], pixelData.d2[point.y][point.x * 4 + 1], pixelData.d2[point.y][point.x * 4 + 2], pixelData.d2[point.y][point.x * 4 + 3]]
}

getByid("canvas_area").oncontextmenu = (e) => e.preventDefault();

getByid("canvas_area").onpointermove = function (e) {
    if (e?.target?.parentNode?.id == "ColorWindow") return;
    var point = new Point(e.pageX - this.getBoundingClientRect().left - 0, e.pageY - this.getBoundingClientRect().top - 0);
    var currentPoint = Canvas.getCurrentPoint(point);
    Canvas.mouseNowPoint = point.copy();

    if (isPointInRect(currentPoint, new Rect(0, 0, Canvas.width, Canvas.height)) && ToolSelector.layer) {
        var [r, g, b, a] = getRgbaByPointFromPixelData(currentPoint, ToolSelector.layer.pixelData);
        GUI.setStatusText("目前座標：(" + currentPoint.x + ", " + currentPoint.y + ")" + "、顏色：(" + r + ", " + g + ", " + b + ", " + a + ")");
    }
    else GUI.setStatusText("目前座標：(" + currentPoint.x + ", " + currentPoint.y + ")")

    if (Canvas.mouseDownLeft) {
        ToolSelector.path.push(currentPoint);
        if (e.pointerType === 'pen' && !isNaN(e.pressure)) ToolSelector.pressurePath.push(e.pressure);
        else ToolSelector.pressurePath.push(1.0);
        if (WindowManager.enable) Command.cmd("move", null);
        else Command.cmd("brush", null);
    }
    // 滴管專用工具
    if (Canvas.mouseDownRight && !Canvas.mouseDownLeft && !WindowManager.enable) {
        ToolSelector.path.push(currentPoint);
        Command.cmd("brushRight", null);
    }
    // 移動專用工具
    if (Canvas.mouseDownMiddle && !Canvas.mouseDownLeft && !WindowManager.enable) {
        ToolSelector.path.push(currentPoint);
        Command.cmd("brushMiddle", null);
    }

    Canvas.mousePreviousPoint = point.copy();

    enableCursor(true);
    updateCursorPoint(currentPoint.x, currentPoint.y);
}

getByid("canvas_area").onmouseleave = function (e) {
    GUI.setStatusText("");
    enableCursor(false);
}

getByid("canvas_area").pointermove = function (e) {
    if (e.buttons > 0) {
        var pressure = e.pressure;
        var x = e.clientX, y = e.clientY;
        Command.InvokeWithPen(x, y, pressure);
    }
}

getByid("layer_MixBlendMode").onchange = function (e) {
    if (!ToolSelector.layer) return;
    ToolSelector.layer.mixBlendMode = this.value;
    GUI.displayLayerDrawer();
    GUI.refleshSandwichAndFullCanvas();
}
getByid("LayerOpacity").onchange = function (e) {
    if (!ToolSelector.layer) return;
    var opacity = parseFloat(this.value) / 100;
    ToolSelector.layer.opacity = opacity < 0 ? 0 : opacity > 1 ? 1 : opacity;
    GUI.displayLayerDrawer();
    GUI.refleshSandwichAndFullCanvas();
}

getByid("canvas_area").onwheel = function (e) {
    var point = new Point(e.pageX - this.getBoundingClientRect().left - 0, e.pageY - this.getBoundingClientRect().top - 0);// new Point(e.pageX - 0, e.pageY - 0);
    var currentPoint = Canvas.getCurrentPoint(point);
    GUI.setStatusText("目前座標：(" + currentPoint.x + ", " + currentPoint.y + ")");

    if (currentPoint.x < 0) point.x -= currentPoint.x * Canvas.scale.x;
    if (currentPoint.y < 0) point.y -= currentPoint.y * Canvas.scale.y;
    if (currentPoint.x >= Canvas.width) point.x -= (currentPoint.x - Canvas.width) * Canvas.scale.x;
    if (currentPoint.y >= Canvas.height) point.y -= (currentPoint.y - Canvas.height) * Canvas.scale.y;

    var currentPoint = Canvas.getCurrentPoint(point);
    const weight = 0.5;

    Canvas.scale.x += e.deltaY * -0.001 * weight;
    Canvas.scale.y += e.deltaY * -0.001 * weight
    Canvas.scale.x = clamp(Canvas.scale.x, 0.05, 5);
    Canvas.scale.y = clamp(Canvas.scale.y, 0.05, 5);

    Canvas.center = point.copy();
    if (currentPoint.x < 0) Canvas.center.x += currentPoint.x * Canvas.scale.x;
    if (currentPoint.y < 0) Canvas.center.y += currentPoint.y * Canvas.scale.y;
    if (currentPoint.x > Canvas.width) Canvas.center.x -= (Canvas.width - currentPoint.x) * Canvas.scale.x;
    if (currentPoint.y > Canvas.height) Canvas.center.y -= (Canvas.height - currentPoint.y) * Canvas.scale.y;


    Canvas.translate.x = -(currentPoint.x - Canvas.center.x);
    Canvas.translate.y = -(currentPoint.y - Canvas.center.y);

    Canvas.setTransform();
    // 紀念縮放操作測試成功，測試座標特別予以保留
    // Canvas.center.x = 43; Canvas.center.y = 66;
    // Canvas.translate.x = -(120 - 43); Canvas.translate.y = -(120 - 66);
    // Canvas.scale.x = 1.0; Canvas.scale.y = 1.0; Canvas.setTransform();
}
// 可以即時取得目前按住的按鍵
const pressedKeys = new Set();
window.addEventListener("keydown", e => { pressedKeys.add(e.key); });
window.addEventListener("keyup", e => { pressedKeys.delete(e.key); });
function isKeyPressed(key) { return pressedKeys.has(key); }

window.addEventListener('keydown', function (e) {
    const ctrl = e.ctrlKey || e.metaKey, key = e.key.toLowerCase();
    if (!ctrl || WindowManager.enable) return;
    if (key === 'z' || key === "y") e.preventDefault();

    if (key === 'z') Command.cmd("undo", "");
    else if (key === 'y') Command.cmd("redo", "");
});
