
// 切換圖層的是否顯示狀態
function toggleLayerDisplay(layer) {
    layer.display = !layer.display;
    GUI.displayLayerDrawer();
    GUI.refleshSandwichAndFullCanvas();
}
// 切換選擇的圖層
function switchLayer(layer) {
    ToolSelector.layer = layer;
    createFullSandwich();
    GUI.displayLayerDrawer();
}
// 用專案視窗建立專案
function createProjectWithCreateProjectWindow(name, w, h, windowObj) {
    if (parseInt(w) <= 10 || parseInt(h) <= 10) return GUI.setStatusAlert("長度與寬度請設在10以上！！！");
    createANewProject("" + name, parseInt(w), parseInt(h));
    windowObj.closeWindow();
}
// 用剪貼簿視窗建立專案
function createProjectWithPasteWindow(img, windowObj) {
    var project = new Project();
    ACGM.projects.push(project);

    project.layerManager = new LayerManager(img.width, img.height, 1);
    var layer = new Layer(0, 0, 0, img.width, img.height, 1); layer.opacity = 1.0;
    project.name = layer.name = "剪貼簿";
    ///////////////
    var canvas = createCanvas(img.width, img.height), ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    var data = ctx.getImageData(0, 0, img.width, img.height).data;
    ///////////////
    for (var i = 0; i < layer.pixelData.d1.length; i++)layer.pixelData.d1[i] = data[i];
    project.layer = layer;
    project.layerManager.layers.push(layer);

    switchProject(project);
    Canvas.AutoFitTransform();
    windowObj.closeWindow();
}

// 用剪貼簿視窗貼上影像
function pasteImgWithPasteWindow(img, windowObj) {
    var root = ToolSelector.project.layerManager;
    var canvas = createCanvas(img.width, img.height), ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    var data = ctx.getImageData(0, 0, img.width, img.height).data;
    var layer = addNewLayer();
    layer.name = "剪貼簿";
    Brush.cache = new PixelData(img.width, img.height, 4);
    for (var i = 0; i < Brush.cache.d1.length; i++)Brush.cache.d1[i] = data[i];
    pastePixelData(Brush.cache, 0, 0, img.width, img.height, ToolSelector.layer.pixelData, 0, 0, img.width, img.height, 混合模式.完全覆蓋, 1.0);
    root.needRefleshRect = true;
    createFullSandwich();
    GUI.refleshGUI();
    windowObj.closeWindow();
}