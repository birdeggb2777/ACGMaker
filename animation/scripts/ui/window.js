
class WindowManager {
    static enable = false;

    static registerMoveWindow(windowObject) {
        getByid("cover_div").style.display = "block";

        const windowTitle = windowObject.windowTitle;
        windowTitle.onmousedown = function (e) {
            this.mouseDown = true;
            // 相對於視窗的座標
            this.clientPoint = new Point(e.clientX, e.clientY);
            this.offsetPoint = new Point(e.offsetX, e.offsetY);
        }
        getByid("outer_div").onmousemove = function (e) {
            if (!windowTitle.mouseDown) return;
            // 相對於視窗的座標
            const x = e.clientX, y = e.clientY;
            windowTitle.window.style.left = windowTitle.clientPoint.x - windowTitle.offsetPoint.x + (x - windowTitle.clientPoint.x) + "px";
            windowTitle.window.style.top = windowTitle.clientPoint.y - windowTitle.offsetPoint.y + (y - windowTitle.clientPoint.y) + "px";
        }
        getByid("outer_div").onmouseup = function (e) { windowTitle.mouseDown = false; }
    }
}

class createWelcomeWindow { }

class createProjectWindow {
    constructor() {
        this.createWindow();
        WindowManager.enable = true;
    }

    createWindow() {
        var root = ToolSelector.project.layerManager;
        var outer_div = getByid("outer_div");
        // 建立視窗樣板
        this.window = createElem("div", null, "childWindow");
        this.windowTitle = createElem("div", null, "windowTitle");
        this.windowClose = createElem("img", null, "windowClose");
        this.windowContent = createElem("div", null, "windowContent");
        // 設定視窗大小
        this.window.style.width = `${outer_div.offsetWidth / 2}px`;
        this.window.style.height = `${outer_div.offsetHeight / 2}px`;
        this.window.style.left = `${outer_div.offsetWidth / 2 - outer_div.offsetWidth / 4}px`;
        this.window.style.top = `${outer_div.offsetHeight / 2 - outer_div.offsetHeight / 4}px`;
        // 視窗標題、圖示
        this.windowTitle.innerText = "新建";
        this.windowTitle.window = this.windowClose.window = this.window;
        this.windowClose.closeWindow = this.closeWindow;
        this.windowClose.src = "./image/close.png";
        // 加入到HTML
        this.window.appendChild(this.windowTitle);
        this.window.appendChild(this.windowContent);
        this.windowTitle.appendChild(this.windowClose);
        // 專案名稱UI
        this.projectNameLabel = createElem("label");
        this.projectNameTextBox = createElem("input", null, "inputText");
        this.projectNameLabel.innerText = "專案名稱：";
        this.projectNameTextBox.type = "text", this.projectNameTextBox.value = "新建插圖";
        appendChilds(this.windowContent, [this.projectNameLabel, this.projectNameTextBox]);
        // 畫布大小UI
        this.projectWidth = createElem("label", null, null, "寬度：");
        this.projectHeight = createElem("label", null, null, "高度：");
        this.projectWidthTextBox = createElem("input", null, "inputText");
        this.projectHeightTextBox = createElem("input", null, "inputText");
        this.projectWidthTextBox.type = "number", this.projectWidthTextBox.value = "1024";
        this.projectHeightTextBox.type = "number", this.projectHeightTextBox.value = "768";
        appendChilds(this.windowContent, [createElem("br"), this.projectWidth, this.projectWidthTextBox, createElem("br"), this.projectHeight, this.projectHeightTextBox, createElem("br"), createElem("br")]);
        // 「建立」按鈕
        const btn = createElem("button", null, null, "建立");
        btn.window = this, btn.projectNameTextBox = this.projectNameTextBox, btn.projectWidthTextBox = this.projectWidthTextBox, btn.projectHeightTextBox = this.projectHeightTextBox;
        btn.onclick = function () {
            if (parseInt(this.projectWidthTextBox.value) <= 10 || parseInt(this.projectHeightTextBox.value) <= 10) return GUI.setStatusAlert("長度與寬度請設在10以上！！！");
            createANewProject("" + this.projectNameTextBox.value, parseInt(this.projectWidthTextBox.value), parseInt(this.projectHeightTextBox.value));
            this.window.closeWindow();
        }
        this.windowContent.appendChild(btn);
        // 註冊移動事件
        getByid("outer_div").appendChild(this.window);
        WindowManager.registerMoveWindow(this);
        // 註冊關閉視窗後的行為
        this.windowClose.onclick = () => this.closeWindow();
    }

    closeWindow(e) {
        if (e) e.stopImmediatePropagation();
        if (this.window.window) getByid("outer_div").removeChild(this.window.window);
        if (this.window) getByid("outer_div").removeChild(this.window);
        else removeChild(this.window);
        getByid("cover_div").style.display = "none";
        WindowManager.enable = false;
    }
}


class pasteImgWindow {
    constructor(img) {
        this.createWindow(img);
        WindowManager.enable = true;
    }

    createWindow(img) {
        var root = ToolSelector.project.layerManager;
        var outer_div = getByid("outer_div");
        // 建立視窗樣板
        this.window = createElem("div", null, "childWindow");
        this.windowTitle = createElem("div", null, "windowTitle", "新建");
        this.windowClose = createElem("img", null, "windowClose");
        this.windowContent = createElem("div", null, "windowContent");
        // 設定視窗大小
        this.window.style.width = `${outer_div.offsetWidth / 2}px`;
        this.window.style.height = `${outer_div.offsetHeight / 2}px`;
        this.window.style.left = `${outer_div.offsetWidth / 2 - outer_div.offsetWidth / 4}px`;
        this.window.style.top = `${outer_div.offsetHeight / 2 - outer_div.offsetHeight / 4}px`;
        // 視窗標題、圖示
        this.windowTitle.window = this.windowClose.window = this.window;
        this.windowClose.closeWindow = this.closeWindow;
        this.windowClose.src = "./image/close.png";
        // 加入到HTML
        this.window.appendChild(this.windowTitle);
        this.window.appendChild(this.windowContent);
        this.windowTitle.appendChild(this.windowClose);
        // 添加內容
        this.normalLabel = createElem("label", null, null, "偵測到貼上圖片的動作，請從下方選擇其中一個：");
        const ProjectButton = createElem("button", null, null, "使用剪貼簿影像，建立新的專案");
        const OnlyPasteButton = createElem("button", null, null, "將剪貼簿影像，貼到目前專案的新圖層");
        appendChilds(this.windowContent, [this.normalLabel, createElem("br"), ProjectButton, OnlyPasteButton]);

        ProjectButton.onclick = function () {
            var project = new Project();
            ACGM.projects.push(project);

            project.layerManager = new LayerManager(img.width, img.height, 1);
            var layer = new Layer(0, 0, 0, img.width, img.height, 1); layer.opacity = 1.0;
            project.name = layer.name = "剪貼簿";
            ///////////////
            var canvas = createElem("canvas"), ctx = canvas.getContext('2d');
            canvas.width = img.width; canvas.height = img.height
            ctx.drawImage(img, 0, 0);
            var data = ctx.getImageData(0, 0, img.width, img.height).data;
            ///////////////
            for (var i = 0; i < layer.pixelData.d1.length; i++)layer.pixelData.d1[i] = data[i];
            project.layer = layer;
            project.layerManager.layers.push(layer);

            switchProject(project);
            Canvas.AutoFitTransform()
            this.window.closeWindow();
        }

        OnlyPasteButton.onclick = function () {
            var canvas = createElem("canvas"), ctx = canvas.getContext('2d');
            canvas.width = img.width; canvas.height = img.height
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
        }

        ProjectButton.style.margin = OnlyPasteButton.style.margin = "5px";
        ProjectButton.window = OnlyPasteButton.window = this;
        // 註冊移動事件
        getByid("outer_div").appendChild(this.window);
        WindowManager.registerMoveWindow(this);
        // 註冊關閉視窗後的行為
        this.windowClose.onclick = () => this.closeWindow();
    }

    closeWindow(e) {
        if (e) e.stopImmediatePropagation();
        if (this.window.window) getByid("outer_div").removeChild(this.window.window);
        if (this.window) getByid("outer_div").removeChild(this.window);
        else removeChild(this.window);
        getByid("cover_div").style.display = "none";
        WindowManager.enable = false;
    }
}

class ColorWindow {
    static DisplayColorWindow() {
        var div = createElem("div", "ColorWindow");
        // 製作隱藏滑桿
        const slider = createElem("input", null, "ColorSlider");
        slider.type = "range", slider.min = 0, slider.max = 360, slider.value = 0;
        div.appendChild(slider);
        // 製作色彩區域
        var canvas = createElem("canvas");
        canvas.width = 256, canvas.height = 256, canvas.div = div;
        canvas.style.top = "25px", canvas.style.position = "absolute";
        var ctx = canvas.getContext('2d'), imgData = ctx.createImageData(canvas.width, canvas.height);
        
        var RowPixel = new Array(canvas.height);
        for (var h = 0; h < canvas.height; h++)
            RowPixel[h] = new Uint8ClampedArray(imgData.data.buffer, h * canvas.width * 4, canvas.width * 4);
        for (var h = 0; h < canvas.height; h++) {
            for (var w = 0; w < canvas.width; w++) {
                var color = HSVtoRGB(0, w / canvas.width, (canvas.height - h) / 255);
                RowPixel[h][w * 4 + 0] = color.r;
                RowPixel[h][w * 4 + 1] = color.g;
                RowPixel[h][w * 4 + 2] = color.b;
                RowPixel[h][w * 4 + 3] = 255;
            }
        }
        ctx.putImageData(imgData, 0, 0);
        div.appendChild(canvas);
        div.HsvWindow = canvas;
        canvas.paint = function () {
            var canvas = this.div.HsvWindow;
            canvas.width = 256, canvas.height = 256, canvas.div = div;
            var ctx = canvas.getContext('2d'), imgData = ctx.createImageData(canvas.width, canvas.height);
            var RowPixel = new Array(canvas.height);
            for (var h = 0; h < canvas.height; h++)
                RowPixel[h] = new Uint8ClampedArray(imgData.data.buffer, h * canvas.width * 4, canvas.width * 4);
            for (var h = 0; h < canvas.height; h++) {
                for (var w = 0; w < canvas.width; w++) {
                    var color = HSVtoRGB(this.div.h / 360, w / canvas.width, (canvas.height - h) / 255);
                    RowPixel[h][w * 4 + 0] = color.r;
                    RowPixel[h][w * 4 + 1] = color.g;
                    RowPixel[h][w * 4 + 2] = color.b;
                    RowPixel[h][w * 4 + 3] = 255;
                }
            }
            ctx.putImageData(imgData, 0, 0);
            // 畫圈圈
            ctx.beginPath();
            ctx.arc(this.div.s, 255 - this.div.v, 5, 0, 2 * Math.PI);
            ctx.lineWidth = 2; ctx.strokeStyle = "white"; ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(this.div.s, 255 - this.div.v, 7, 0, 2 * Math.PI);
            ctx.lineWidth = 2; ctx.strokeStyle = "black"; ctx.stroke();
            ctx.closePath();
        }

        canvas.onmousemove = function (e) {
            if (!this.mouseDown) return;
            var rect = this.getBoundingClientRect(), x = (e.clientX - rect.left) | 0, y = (e.clientY - rect.top) | 0;
            var ctx = this.getContext('2d'), imgData = ctx.getImageData(x, y, 1, 1);
            this.div.s = x;
            this.div.v = 255 - y;
            this.paint();
            updateColor(imgData.data[0], imgData.data[1], imgData.data[2], 255);
        }

        canvas.onmousedown = function (e) { this.mouseDown = true; this.onmousemove(e); }
        canvas.onmouseleave = canvas.onmouseup = function (e) { this.mouseDown = false; }

        ///////////////////////////////
        var canvas = createElem("canvas");
        canvas.id = "HBar";
        canvas.style.position = "absolute";
        canvas.width = 255, canvas.height = 25, canvas.div = div;
        var ctx = canvas.getContext('2d'), imgData = ctx.createImageData(canvas.width, canvas.height);
        var RowPixel = new Array(canvas.height);
        for (var h = 0; h < canvas.height; h++)
            RowPixel[h] = new Uint8ClampedArray(imgData.data.buffer, h * canvas.width * 4, canvas.width * 4);
        for (var h = 0; h < canvas.height; h++) {
            for (var w = 0; w < canvas.width; w++) {
                var color = HSVtoRGB(w / canvas.width, 1, 1);
                RowPixel[h][w * 4 + 0] = color.r;
                RowPixel[h][w * 4 + 1] = color.g;
                RowPixel[h][w * 4 + 2] = color.b;
                RowPixel[h][w * 4 + 3] = 255;
            }
        }
        ctx.putImageData(imgData, 0, 0);

        slider.div = div;
        slider.oninput = function (e) {
            this.div.h = this.value;
            this.div.HsvWindow.paint();

            var canvas = getByid("HBar");
            var ctx = canvas.getContext('2d'), imgData = ctx.createImageData(canvas.width, canvas.height)
            var RowPixel = new Array(canvas.height);
            for (var h = 0; h < canvas.height; h++)
                RowPixel[h] = new Uint8ClampedArray(imgData.data.buffer, h * canvas.width * 4, canvas.width * 4);

            for (var h = 0; h < canvas.height; h++) {
                for (var w = 0; w < canvas.width; w++) {
                    var color = HSVtoRGB(w / canvas.width, 1, 1);
                    RowPixel[h][w * 4 + 0] = color.r;
                    RowPixel[h][w * 4 + 1] = color.g;
                    RowPixel[h][w * 4 + 2] = color.b;
                    RowPixel[h][w * 4 + 3] = 255;
                    if (w == parseInt((256 / 360) * this.div.h)) RowPixel[h][w * 4 + 0] = RowPixel[h][w * 4 + 1] = RowPixel[h][w * 4 + 2] = 0;
                }
            }
            ctx.putImageData(imgData, 0, 0);

            // 選取色彩
            var imgData = this.div.HsvWindow.getContext('2d').getImageData(this.div.s, 255 - this.div.v, 1, 1);
            updateColor(imgData.data[0], imgData.data[1], imgData.data[2], 255);
        }
        div.HWindow = canvas;
        div.appendChild(canvas);
        ///////////////////////////////

        div.style.position = "relative";
        getByid("canvas_area").appendChild(div);
        div.onmousedown = function (e) { e.stopPropagation(); }
        div.onmousemove = function (e) { e.stopPropagation(); }
        div.onmouseup = function (e) { e.stopPropagation(); }
        ////顯示當前顏色////
        var color = ToolSelector.color.toRGBAList();
        var hsv = rgb2hsv(color[0], color[1], color[2]);
        slider.div.h = slider.value = hsv.h * 360;
        slider.div.s = (hsv.s * 255) | 0;
        slider.div.v = hsv.v | 0;
        slider.oninput();
    }
}

class FilterWindow {
    constructor(content) {
        this.createWindow(content);
        WindowManager.enable = true;
    }

    createWindow(content) {
        var outer_div = getByid("outer_div");
        var root = ToolSelector.project.layerManager;

        root.cache.preview = true;
        root.cache.needReflesh = true;
        createSandwich();
        root.cache.preview = false;
        // 建立視窗樣板
        this.window = createElem("div", null, "childWindow");
        this.windowTitle = createElem("div", null, "windowTitle");
        this.windowClose = createElem("img", null, "windowClose");
        this.windowContent = createElem("div", null, "windowContent");
        // 設定視窗大小
        this.window.style.width = `${outer_div.offsetWidth / 2}px`;
        this.window.style.height = `${outer_div.offsetHeight / 2}px`;
        this.window.style.left = `${outer_div.offsetWidth / 2 - outer_div.offsetWidth / 4}px`;
        this.window.style.top = `${outer_div.offsetHeight / 2 - outer_div.offsetHeight / 4}px`;
        // 視窗標題、圖示
        this.windowTitle.innerText = content.name;
        this.windowTitle.window = this.windowClose.window = this.window;
        this.windowClose.closeWindow = this.closeWindow;
        this.windowClose.src = "./image/close.png";
        this.addElem(content);
        // 加入到HTML
        this.window.appendChild(this.windowTitle);
        this.window.appendChild(this.windowContent);
        this.windowTitle.appendChild(this.windowClose);
        // 註冊移動事件
        getByid("outer_div").appendChild(this.window);
        WindowManager.registerMoveWindow(this);
        // 註冊關閉視窗後的行為
        this.windowClose.onclick = function () {
            GUI.refleshSandwichAndFullCanvas();
            this.closeWindow();
            if (ACGM.temp.length > 0) ACGM.temp = [];
        }
        createCacheForFilter();
    }

    addElem(content) {
        const filterName = content.name;
        for (const el of content.UIs) {
            if (el.type == "slider") {
                const label = createElem("label"); label.innerText = el.name + "：";
                ////////
                const number = createElem("input"); number.type = "number";
                number.min = el.min, number.max = el.max, number.value = el.default;
                ////////
                const slider = createElem("input"); slider.type = "range";
                slider.style.width = "85%";
                slider.min = el.min, slider.max = el.max, slider.value = el.default;
                ////////
                number.oninput = slider.oninput = function () {
                    ToolSelector.filter[el.name] = number.value = slider.value = this.value;
                    ToolSelector.filter.preview = true;
                    requestAnimationFrame(() => { Command.cmd("filter", filterName); });
                }

                appendChilds(this.windowContent, [label, number, slider]);
                number.oninput();
            }
            if (el.type == "button") {
                const button = createElem("button"); button.innerText = el.name;
                this.windowContent.appendChild(button);
                button.window = this;
                if (el.target == "cancel") button.onclick = function () {
                    GUI.refleshSandwichAndFullCanvas();
                    button.window.closeWindow();
                    if (ACGM.temp.length > 0) ACGM.temp = [];
                }

                if (el.target == "filter") button.onclick = function () {
                    ToolSelector.filter.preview = false;
                    Command.cmd("filter", filterName);
                    button.window.closeWindow();
                    if (ACGM.temp.length > 0) ACGM.temp = [];
                }
            }
            if (el.type == "bool") {
                const label = createElem("label"); label.innerText = el.name + "：";
                const checkbox = createElem("input"); checkbox.type = "checkbox";
                const checkboxInner = createElem("label"); checkboxInner.className = "checklabel";
                checkbox.id = "filterWidow_" + el.name;
                checkboxInner.setAttribute("for", checkbox.id);

                checkbox.onchange = function () {
                    ToolSelector.filter[el.name] = this.checked == true;
                    ToolSelector.filter.preview = true;
                    requestAnimationFrame(() => {
                        Command.cmd("filter", filterName);
                    });
                }
                ////////
                this.windowContent.appendChild(label);
                this.windowContent.appendChild(checkbox);
                this.windowContent.appendChild(checkboxInner);
            }
            if (el.type == "br") {
                this.windowContent.appendChild(createElem("br"));
            }
        }
    }

    closeWindow(e) {
        if (e) e.stopImmediatePropagation();
        if (this.window.window) getByid("outer_div").removeChild(this.window.window);
        if (this.window) getByid("outer_div").removeChild(this.window);
        else removeChild(this.window);
        getByid("cover_div").style.display = "none";
        WindowManager.enable = false;
        Filter.cache = null;
    }

    destroyWindow(e) {
        if (e) e.stopImmediatePropagation();
        if (this.window.window) getByid("outer_div").removeChild(this.window.window);
        if (this.window) getByid("outer_div").removeChild(this.window);
        else removeChild(this.window);
        getByid("cover_div").style.display = "none";
        WindowManager.enable = false;
        Filter.cache = null;
    }
}

getByid("colorpalette").onclick = function (e) {
    if (getByid("ColorWindow")) getByid("canvas_area").removeChild(getByid("ColorWindow"));
    else ColorWindow.DisplayColorWindow(e);
}

getByid("createNewProject").onclick = function (e) {
    new createProjectWindow();
}