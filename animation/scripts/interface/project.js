
class ACGM {
    static project = null;
    static projects = [];
    static temp = [];
}

class Project {
    constructor(type = "paint") {
        if (type == "paint") {
            this.type = "paint";
            this.name = "影像";
            this.layerManager = null;
        }
    }
}

class ToolSelector {
    static filter = null;
    static brush = null;
    static layer = null;
    static path = null;
    static pressurePath = null;
    static 前背透色 = [];
    static colorIndex = 0;
    static selection = null;
    static project = null;
    static get color() { return ToolSelector.前背透色[ToolSelector.colorIndex]; }
    static get hasSelection() { return ToolSelector?.selection?.content }
}

function createANewProject(projectName = "預設專案", width = 512, height = 512) {
    var project = new Project();
    ACGM.projects.push(project);
    ToolSelector.project = project;
    project.name = projectName;
    project.layerManager = new LayerManager(width, height, 1);
    addNewLayer();
    ToolSelector.layer.pixelData.fillColor(new Color(220, 220, 220, 255));
    project.layerManager.needRefleshRect = true;
    createFullSandwich();
    GUI.refleshGUI();
    Canvas.AutoFitTransform();
}

function initACGM() {
    setHandTool();
    createANewProject();
    //var project = new Project();
    //ACGM.projects.push(project);
    //ToolSelector.project = project;
    createProjectByPath("./image/example.jpg");
    var project = ToolSelector.project;

    ToolSelector.前背透色 = [new Color(128, 164, 221, 255), new Color(255, 255, 255, 255), new Color(0, 0, 0, 0)];
    ToolSelector.colorIndex = 0;
    setHandTool();
    //project.layerManager = new LayerManager(512, 512, 1);
    //addNewLayer();
    //ToolSelector.layer.pixelData.fillColor(new Color(200, 200, 200, 255));

    //project.layerManager.needRefleshRect = true;
    //Canvas.AutoFitTransform();
    //createFullSandwich();
    //GUI.refleshGUI();
    // 紀念縮放操作測試成功，測試座標特別予以保留
    // for (var i = -5; i < 5; i++) {
    //     for (var j = -5; j < 5; j++) {
    //         ACGM.targetProject.targetLayer.content.RowPixel[120 + i][(120 + j) * 4 + 0] = 0;
    //         ACGM.targetProject.targetLayer.content.RowPixel[120 + i][(120 + j) * 4 + 1] = 0;
    //         ACGM.targetProject.targetLayer.content.RowPixel[120 + i][(120 + j) * 4 + 2] = 0;
    //         ACGM.targetProject.targetLayer.content.RowPixel[120 + i][(120 + j) * 4 + 3] = 255;
    //
    //         ACGM.targetProject.targetLayer.content.RowPixel[290 + i][(380 + j) * 4 + 0] = 0;
    //         ACGM.targetProject.targetLayer.content.RowPixel[290 + i][(380 + j) * 4 + 1] = 0;
    //         ACGM.targetProject.targetLayer.content.RowPixel[290 + i][(380 + j) * 4 + 2] = 0;
    //         ACGM.targetProject.targetLayer.content.RowPixel[290 + i][(380 + j) * 4 + 3] = 255;
    //     }
    // }
    ////////////////////////
}
window.addEventListener("load", initACGM);

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
