
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
            this.history = new History();
            //暫存，供切換專案時使用
            this.selection = null;
            this.layer = 0;
            this.translate = new Size(0, 0);
            this.scale = new Size(1, 1);
        }
        if (type == "game") {
            this.type = "game";
            this.name = "場景";
            this.sceneManager = null;
            //this.history = new History();
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

function switchProject(project) {
    // 切換前
    ToolSelector.project.layer = ToolSelector.layer;
    ToolSelector.project.selection = ToolSelector.selection;
    ToolSelector.project.scale = Canvas.scale;
    ToolSelector.project.translate = Canvas.translate;
    // 開始切換
    ToolSelector.project = project;
    ToolSelector.layer = project.layer;
    ToolSelector.selection = project.selection;
    Canvas.scale = ToolSelector.project.scale ? ToolSelector.project.scale : new Size(1, 1);
    Canvas.translate = ToolSelector.project.translate ? ToolSelector.project.translate : new Size(0, 0);
    //ToolSelector.layer = ToolSelector.project.layerManager.layers[0]; // 指派選取的圖層
    // 切換後
    GUI.refleshProjectBar();
    GUI.refleshSandwichAndFullCanvas();
    GUI.displayLayerDrawer();
    Canvas.setTransform();

    getByid("redo").innerHTML = `重做(Ctrl+Y) (${ToolSelector.project.history.RedoStorage.length})`;
    getByid("undo").innerHTML = `復原(Ctrl+Z) (${ToolSelector.project.history.UndoStorage.length})`;
}


function initACGM2() {
    
}

function initACGM() {
    setHandTool();
    createANewProject();
    //var project = new Project();
    //ACGM.projects.push(project);
    //ToolSelector.project = project;
    createProjectByPath("./image/example.jpg");
    //var project = ToolSelector.project;

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
