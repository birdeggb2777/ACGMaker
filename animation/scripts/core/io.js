
class IO {
    // 輸入影像自剪貼簿
    static getImageBlobByClip(callBack) {
        navigator.clipboard.read().then(async (items) => {
            for (let item of items) {
                for (let type of item.types) {
                    if (type.startsWith("image/")) {
                        const blob = await item.getType(type);
                        callBack(blob);
                    }
                }
            }
        }).catch(err => { alert("無法讀取剪貼簿影像"); console.log(err); });
    }

    // 複製影像到剪貼簿
    static CopyToClipboard() {
        try {
            getByid("picture").toBlob(function (blob) {
                const item = new ClipboardItem({ "image/png": blob });
                navigator.clipboard.write([item]);
            });
        } catch (error) {
            alert("無法複製影像");
            console.error(error);
        }
    }
}

// 複製完整影像到剪貼簿
getByid("copyFullImg2clip").onclick = function () {
    // Source - https://stackoverflow.com/a/59462270
    getByid("picture").toBlob(blob => navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]));
    GUI.setStatusText("已將完整圖片影像複製到剪貼簿");
}

// 複製選擇的圖層到剪貼簿
getByid("copyLayerImg2clip").onclick = function () {
    // Source - https://stackoverflow.com/a/59462270
    var layer = ToolSelector.layer, pixels = layer.pixelData.d1;

    var canvas = createCanvas(layer.width, layer.height), ctx = canvas.getContext('2d');
    var ImgData = ctx.createImageData(layer.width, layer.height), data = ImgData.data;
    for (var i = 0; i < data.length; i++)data[i] = pixels[i];
    ctx.putImageData(ImgData, 0, 0);
    canvas.toBlob(blob => navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]));
}

// 儲存影像
getByid("saveToFile").onclick = function () {
    var canvas = getByid("picture"), ctx = canvas.getContext('2d');
    const imageURI = canvas.toDataURL("image/png");
    // const imageURI = canvas.toDataURL("image/jpeg", 0.8);
    var a = document.createElement('a');
    a.href = imageURI;
    a.download = "" + ToolSelector.project.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// 開啟舊檔
getByid("openFromFile").onclick = function () {
    var fileInput = document.createElement('input');
    fileInput.type = 'file', fileInput.accept = 'image/*';
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        const fileName = "" + file.name;
        if (file) {
            var url = URL.createObjectURL(file);
            const img = createElem("img");
            img.onload = function () {
                var project = new Project();
                ACGM.projects.push(project);

                project.layerManager = new LayerManager(img.width, img.height, 1);
                var layer = new Layer(0, 0, 0, img.width, img.height, 1); layer.opacity = 1.0;
                project.name = layer.name = fileName;
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
                // 記憶體釋放
                URL.revokeObjectURL(url);
            }
            img.src = url;
        }
    };
    fileInput.click();
}

// 將剪貼簿影像貼到新圖層
getByid("pasteLayerFromClip").onclick = function () {
    function CreateProject(blob) {
        const img = createElem("img");
        img.onload = function () {
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
            this.window.closeWindow();
            URL.revokeObjectURL(blob); // 記憶體釋放
        }
        img.src = URL.createObjectURL(blob);
    }
    getByid("fileMenu").style.display = "none";
    IO.getImageBlobByClip(CreateProject);
}

// 使用剪貼簿影像建立專案
getByid("createProjectFromClip").onclick = function () {
    function CreateProject(blob) {
        const img = createElem("img");
        img.onload = function () {
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
            URL.revokeObjectURL(blob); // 記憶體釋放
        }
        img.src = URL.createObjectURL(blob);
    }
    getByid("fileMenu").style.display = "none";
    IO.getImageBlobByClip(CreateProject);
}

// 輸入影像自路徑
function createProjectByPath(url) {
    const img = createElem("img");
    img.onload = function () {
        var project = new Project();
        ACGM.projects.push(project);

        project.layerManager = new LayerManager(img.width, img.height, 1);
        var layer = new Layer(0, 0, 0, img.width, img.height, 1); layer.opacity = 1.0;
        project.name = layer.name = "影像";
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
        // 記憶體釋放
        URL.revokeObjectURL(url);
    }
    img.src = url;
}

// 偵測複製行為
window.addEventListener('copy', function (e) {
    // Source - https://stackoverflow.com/a/59462270
    getByid("picture").toBlob(blob => navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]));
    GUI.setStatusText("已將完整圖片影像複製到剪貼簿");
});

// 偵測到貼上行為
window.addEventListener('paste', function (e) {
    if (WindowManager.enable) return;
    // 取得剪貼簿中的內容
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;

    for (let i = 0; i < items.length; i++) {
        // 確認拿到的是圖片
        if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile(); // 取得 Blob 檔案
            const reader = new FileReader();

            // 將Blob轉換為DataURL
            reader.onload = function (event) {
                const img = new Image();
                img.onload = function () {
                    new pasteImgWindow(img);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(blob);
        }
    }
});