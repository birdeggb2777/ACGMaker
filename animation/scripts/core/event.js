
getByid("addNewLayer").onclick = function () {
    addNewLayer();
}

///////////////////////////////
///////////////////////////////

getByid("workspace").onpointerdown = function (e) {
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
    if (ToolSelector.brush == pencilTool || ToolSelector.brush == waterpenTool || ToolSelector.brush == erasorTool || ToolSelector.brush == sprayTool || ToolSelector.brush == lineTool) beginPencilTool();
    if (ToolSelector.brush == oilTool && oilTool.fillType == "填充線") beginPencilTool();
}

getByid("canvas_area").onpointerup = function (e) {
    if (e?.target?.parentNode?.id == "ColorWindow") return;
    if (e.pointerType === 'pen') Canvas.mouseDownLeft = false;
    if (e.button == 0) Canvas.mouseDownLeft = false;
    if (e.button == 1) Canvas.mouseDownMiddle = false;
    if (e.button == 2) Canvas.mouseDownRight = false;

    ToolSelector.path = [];
    ToolSelector.pressurePath = [];
    Canvas.mousePreviousPoint = new Point(e.pageX - this.getBoundingClientRect().left - 0, e.pageY - this.getBoundingClientRect().top - 0);
    Canvas.mouseEndPoint = Canvas.getCurrentPoint(Canvas.mousePreviousPoint);
    // 僅限點一下的筆刷，比如油漆桶
    Command.cmd("brushEnd", null);
    // 可放到其他程式碼區域
    if (ToolSelector.brush == pencilTool || ToolSelector.brush == waterpenTool || ToolSelector.brush == erasorTool || ToolSelector.brush == sprayTool || ToolSelector.brush == lineTool) endPencilTool();
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

getByid("canvas_area").oncontextmenu = function (e) {
    e.preventDefault();
};

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

    Canvas.cursor.style.display = "";
    Canvas.cursor.style.left = currentPoint.x + 'px';
    Canvas.cursor.style.top = currentPoint.y + 'px';
}

getByid("canvas_area").onmouseleave = function (e) {
    GUI.setStatusText("");
    Canvas.cursor.style.display = 'none';
}

getByid("canvas_area").pointermove = function (e) {
    if (e.buttons > 0) {
        var pressure = e.pressure;
        var x = e.clientX, y = e.clientY;
        Command.InvokeWithPen(x, y, pressure);
    }
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

window.addEventListener('keydown', function (event) {
    const ctrl = event.ctrlKey || event.metaKey;
    if (!ctrl) return;
    const key = event.key.toLowerCase();
    if (key === 'z' || key === "y") event.preventDefault();
    if (WindowManager.enable) return;

    if (key === 'z') Command.cmd("undo", "");
    else if (key === 'y') Command.cmd("redo", "");
});