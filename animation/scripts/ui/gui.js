// 要由ViewModel呼叫
class GUI {
    static menu = null;
    static refleshGUI() {
        GUI.refleshProjectBar();    // project優先
        GUI.displayDrawer();        // 抽屜重要性低
        GUI.refleshBrushBar();      // 左側工具
        GUI.relfeshCursor();        // 游標
        GUI.refleshMarkCanvas();    // 上層的暫時標記
        GUI.displayLayerDrawer();   // 圖層抽屜很難處理
        GUI.refleshCanvas();        // 圖片最後，效能關鍵
    }
    // 游標
    static relfeshCursor() {

    }
    // 筆刷工具的底色
    static refleshBrushBar() {
        for (var elem of getClass("left_icon"))
            elem.style.backgroundColor = (elem.id == ToolSelector.brush.id) ? "rgb(68, 68, 153)" : "";
    }
    // 專案表
    static refleshProjectBar() {
        // 不必每次都清除重建、可以再做效能改善
        getByid("project_block").innerHTML = null;
        for (const project of ACGM.projects) {
            var label = createElem("label", null, "white fullheight projectlabel", project.name);
            if (ToolSelector.project == project) label.classList.add("selectedProject");
            getByid("project_block").appendChild(label); // label.project = project;
            label.onclick = () => switchProject(project);
        }
    }

    static refleshMarkCanvas() {
        var pictrue = document.getElementById("MarkPicture"), ctx = pictrue.getContext('2d');
        if (pictrue.width != ToolSelector.project.layerManager.width || pictrue.height != ToolSelector.project.layerManager.height) {
            pictrue.width = ToolSelector.project.layerManager.width; pictrue.height = ToolSelector.project.layerManager.height;
        }
        ctx.clearRect(0, 0, pictrue.width, pictrue.height);
        if (ToolSelector.hasSelection) {
            if (ToolSelector?.selection?.type == "rect") {
                var rect = ToolSelector.selection.content.toList();
                var scale = 1 / Canvas.scale.x, offset = 2 * scale;

                ctx.setLineDash([5 * scale, 5 * scale]);
                ctx.beginPath();
                ctx.moveTo(rect[0] + offset, rect[1] + offset);
                ctx.lineTo(rect[2] + offset, rect[1] + offset);
                ctx.lineTo(rect[2] + offset, rect[3] + offset);
                ctx.lineTo(rect[0] + offset, rect[3] + offset);
                ctx.lineTo(rect[0] + offset, rect[1] + offset);
                ctx.lineWidth = 5 * scale;
                ctx.strokeStyle = '#FFFFFF';
                ctx.stroke();
                ctx.closePath();

                ctx.beginPath();
                ctx.moveTo(rect[0], rect[1]);
                ctx.lineTo(rect[2], rect[1]);
                ctx.lineTo(rect[2], rect[3]);
                ctx.lineTo(rect[0], rect[3]);
                ctx.lineTo(rect[0], rect[1]);
                ctx.lineWidth = 5 * scale;
                ctx.strokeStyle = '#000000';
                ctx.stroke();
                ctx.closePath();

                ctx.setLineDash([]);
                pictrue.classList.remove("caterpillar");
            } else {
                var pixels = ToolSelector.selection.content.d2;
                var ImgData = ctx.createImageData(pictrue.width, pictrue.height), data = ImgData.data;
                const width = pictrue.width, height = pictrue.height;
                for (var h = 0; h < height; h++) {
                    for (var w = 0; w < width * 4; w += 4) {
                        if (pixels[h][w] > 0 /*&& ((h / 5) | 0) % 2 == 0 && ((w / 20) | 0) % 2 == 0*/) {
                            if (h == 0 || w == 0 || h == height - 1 || w == width * 4 - 4) {
                                const indexX = (w / 80) | 0, indexY = (h / 20) | 0;
                                const isWhite = (indexX + indexY) % 2 === 0;
                                if (isWhite) data[h * 4 * width + w] = data[h * 4 * width + w + 1] = data[h * 4 * width + w + 2] = 0;
                                else data[h * 4 * width + w] = data[h * 4 * width + w + 1] = data[h * 4 * width + w + 2] = 255;
                                data[h * 4 * width + w + 3] = 255;
                            }
                            else if (pixels[h - 1][w - 4] == 0 || pixels[h - 1][w] == 0 || pixels[h - 1][w + 4] == 0 ||
                                pixels[h][w - 4] == 0 || pixels[h][w] == 0 || pixels[h][w + 4] == 0 ||
                                pixels[h + 1][w - 4] == 0 || pixels[h + 1][w] == 0 || pixels[h + 1][w + 4] == 0) {
                                const indexX = (w / 80) | 0, indexY = (h / 20) | 0;
                                const isWhite = (indexX + indexY) % 2 === 0;
                                if (isWhite) data[h * 4 * width + w] = data[h * 4 * width + w + 1] = data[h * 4 * width + w + 2] = 0;
                                else data[h * 4 * width + w] = data[h * 4 * width + w + 1] = data[h * 4 * width + w + 2] = 255;
                                data[h * 4 * width + w + 3] = 255;
                            }

                        }
                        else data[h * 4 * width + w + 3] = 0;
                    }
                }
                ctx.putImageData(ImgData, 0, 0);
                pictrue.classList.remove("caterpillar");
                pictrue.classList.add("caterpillar");
            }
        } else {
            pictrue.classList.remove("caterpillar");
        }
    }

    static refleshSandwichAndFullCanvas() {
        createFullSandwich();
        GUI.refleshFullCanvas();
    }

    static refleshFullCanvas() {
        if (!ToolSelector?.project?.layerManager) return;
        ToolSelector.project.layerManager.needRefleshRect = true;
        GUI.refleshCanvas();
    }

    static refleshCanvas() {
        if (ToolSelector.project.type == "paint") {
            if (ToolSelector.project.layerManager) {
                // 取得所有圖層的像素資料
                refleshLayerManager(ToolSelector.project.layerManager); // ToolSelector.project.layerManager.refleshResult();
                var resultData = ToolSelector.project.layerManager.result.d1;
                // 長寬不符就更新
                var pictrue = getByid("picture"), pictureContainer = getByid("PictureContainer");
                if (pictrue.width != ToolSelector.project.layerManager.width || pictrue.height != ToolSelector.project.layerManager.height) {
                    pictrue.width = ToolSelector.project.layerManager.width; pictrue.height = ToolSelector.project.layerManager.height;
                }
                if (pictureContainer.width != ToolSelector.project.layerManager.width || pictureContainer.height != ToolSelector.project.layerManager.height) {
                    pictureContainer.width = ToolSelector.project.layerManager.width; pictureContainer.height = ToolSelector.project.layerManager.height;
                }
                var ctx = picture.getContext('2d'), imgData = ctx.createImageData(picture.width, picture.height);
                // 填寫到Canvas
                for (var i = 0; i < resultData.length; i++)imgData.data[i] = resultData[i];
                ctx.putImageData(imgData, 0, 0);
            }
        }
    }
    // 關閉所有抽屜 
    static closeAllDrawer() {
        for (var drawer of getClass("drawer")) drawer.style.display = "none";
    }
    // 關閉調色盤 
    static closeColorPalette() {
        if (getByid("ColorWindow")) getByid("canvas_area").removeChild(getByid("ColorWindow"));
    }
    // 顯示/隱藏抽屜 
    static displayDrawer() {
        // menu指向哪，哪個就是開的，其他的都是關的，邏輯就這麼簡單
        for (var drawer of getClass("drawer")) drawer.style.display = (drawer == GUI.menu) ? "" : "none";
    }

    // 顯示圖層 
    static displayLayerDrawer() {
        getByid("layers_container").innerHTML = "";
        // 新增圖層
        for (const layer of ToolSelector.project.layerManager.layers) {
            // 產生圖層抽屜、眼睛、筆、圖層名稱
            var label_block = createElem("div");
            var label_eye = createElem("img", null, "layerImg");
            var label_pen = createElem("img", null, "layerImg");
            var nameInput = createElem("input", null, "white layerdark layerNameInput");
            nameInput.type = "text", nameInput.value = layer.name;
            [label_eye.width, label_eye.height, label_eye.src] = ["35", "35", (layer.display) ? "./image/eye.png" : "./image/rect.png"];
            [label_pen.width, label_pen.height, label_pen.src] = ["35", "35", (layer == ToolSelector.layer) ? "./image/pen.png" : "./image/rect.png"];
            getByid("layers_container").appendChild(label_block);
            // 註冊觸發的動作
            label_eye.onclick = () => toggleLayerDisplay(layer);
            label_pen.onclick = () => switchLayer(layer);
            appendChilds(label_block, [label_eye, label_pen, nameInput]);
            // ondrag暫時先移除
            // 圖層不透明度及混合模式
            if (layer == ToolSelector.layer) {
                getByid("LayerOpacity").value = (layer.opacity * 100) | 0;
                getByid("layer_MixBlendMode").value = "" + "普通"; // layer.mixBlendMode;
            }
        }

        const children = Array.from(getByid("layers_container").children);
        children.reverse().forEach(child => { getByid("layers_container").appendChild(child); });
    }
    // 顯示狀態列 
    static setStatusText(str) {
        getByid("status_text").innerText = str;
    }
    // 警示狀態列 
    static setStatusAlert(str) {
        getByid("status_text").innerHTML = `<span style="color: orange;">${str}</span>`;
    }
}

///////////////////////////////
///////////////////////////////

// 讓某些按鈕點了可以開啟選單
function setMenuTrigger() {
    var menuSpans = getClass("menuspan");
    for (var menu of menuSpans) {
        const child = [...menu.children].find(el => el.classList.contains('childmenu'));
        menu.onclick = function () {
            GUI.menu = (GUI.menu == child) ? null : child;
            GUI.displayDrawer();
        }
        menu.onmouseenter = function () {
            if (GUI.menu && GUI.menu != child) {
                GUI.menu = child;
                GUI.displayDrawer();
            }
        }
    }
}
setMenuTrigger();

///////////////////////////////
///////////////////////////////

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

function updateCursorSize(size) {
    Canvas.cursor.style.width = Canvas.cursor.style.height = `${size}px`;
}
function updateCursorPoint(x, y) {
    Canvas.cursor.style.left = x + 'px';
    Canvas.cursor.style.top = y + 'px';
}
function enableCursor(b) {
    Canvas.cursor.style.display = b == true ? "" : "none";
}