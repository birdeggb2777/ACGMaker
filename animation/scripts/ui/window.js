
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    i = (h * 6) | 0;
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return new Color((r * 255) | 0, (g * 255) | 0, (b * 255) | 0);
}

function rgb2hsv(r, g, b) {
    var max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min, h, s = (max === 0 ? 0 : d / max), v = max;
    if (max === min) h = 0; // 灰色，無色相 e
    else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return { h: h, s: s, v: v };
}

getByid("colorpalette").onclick = function (e) {
    if (getByid("ColorWindow")) getByid("canvas_area").removeChild(getByid("ColorWindow"));
    else ColorWindow.DisplayColorWindow(e);
}


getByid("createNewProject").onclick = function (e) {
    new createProjectWindow();
}

class createProjectWindow {
    static windows = {};
    static MouseDownPoint = null;
    constructor() {
        this.createWindow();
    }

    createWindow() {
        var outer_div = getByid("outer_div");

        var root = ToolSelector.project.layerManager;

        this.window = createElem("div"); this.window.className = "childWindow";
        this.window.style.zIndex = "100";
        this.windowTitle = createElem("div"); this.windowTitle.className = "windowTitle";
        this.windowClose = createElem("img"); this.windowClose.className = "windowClose";
        this.windowContent = createElem("div"); this.windowContent.className = "windowContent";
        this.window.style.position = "absolute";

        this.window.style.width = outer_div.offsetWidth / 2 + "px"
        this.window.style.height = outer_div.offsetHeight / 2 + "px"

        this.window.style.left = (outer_div.offsetWidth / 2 - outer_div.offsetWidth / 4) + 'px';
        this.window.style.top = (outer_div.offsetHeight / 2 - outer_div.offsetHeight / 4) + 'px';

        this.windowTitle.innerText = "新建";
        this.windowTitle.style.userSelect = "none";
        this.windowTitle.window = this.windowClose.window = this.window;
        this.windowClose.closeWindow = this.closeWindow;
        this.windowClose.src = "./image/close.png";

        this.window.appendChild(this.windowTitle);
        this.window.appendChild(this.windowContent);
        this.windowTitle.appendChild(this.windowClose);

        this.projectNameLabel = createElem("label");
        this.projectNameLabel.innerText = "專案名稱：";
        this.windowContent.appendChild(this.projectNameLabel);
        this.projectNameTextBox = createElem("input", null, "inputText");
        this.projectNameTextBox.type = "text", this.projectNameTextBox.value = "新建插圖";
        this.windowContent.appendChild(this.projectNameTextBox);

        this.projectWidth = createElem("label"), this.projectWidth.innerText = "寬度：";
        this.projectHeight = createElem("label"), this.projectHeight.innerText = "高度：";
        this.projectWidthTextBox = createElem("input", null, "inputText");
        this.projectWidthTextBox.type = "number", this.projectWidthTextBox.value = "1024";
        this.projectHeightTextBox = createElem("input", null, "inputText");
        this.projectHeightTextBox.type = "number", this.projectHeightTextBox.value = "768";

        this.windowContent.appendChild(createElem("br"));
        this.windowContent.appendChild(this.projectWidth);
        this.windowContent.appendChild(this.projectWidthTextBox);
        this.windowContent.appendChild(createElem("br"));
        this.windowContent.appendChild(this.projectHeight);
        this.windowContent.appendChild(this.projectHeightTextBox);

        this.windowContent.appendChild(createElem("br"));
        this.windowContent.appendChild(createElem("br"));
        const button = createElem("button"); button.innerText = "建立";
        this.windowContent.appendChild(button);
        button.window = this, button.projectNameTextBox = this.projectNameTextBox, button.projectWidthTextBox = this.projectWidthTextBox, button.projectHeightTextBox = this.projectHeightTextBox;
        button.onclick = function () {
            if (parseInt(this.projectWidthTextBox.value) <= 10 || parseInt(this.projectHeightTextBox.value) <= 10)
                return GUI.setStatusAlert("長度與寬度請設在10以上！！！");
            createANewProject("" + this.projectNameTextBox.value, parseInt(this.projectWidthTextBox.value), parseInt(this.projectHeightTextBox.value));
            this.window.closeWindow();
        }

        outer_div.appendChild(this.window);
        getByid("cover_div").style.display = "block";

        const windowTitle = this.windowTitle;
        this.windowTitle.onmousedown = function (e) {
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
        getByid("outer_div").onmouseup = function (e) {
            windowTitle.mouseDown = false;
        }

        this.windowClose.onclick = function () {
            this.closeWindow();
        }
    }

    closeWindow(e) {
        if (e) e.stopImmediatePropagation();
        if (this.window.window) getByid("outer_div").removeChild(this.window.window);
        if (this.window) getByid("outer_div").removeChild(this.window);
        else removeChild(this.window);
        getByid("cover_div").style.display = "none";
    }
}

class ColorWindow {
    static windows = {};
    static MouseDownPoint = null;

    static DisplayColorWindow() {
        /*if (getByid("ColorWindow")) {
            getByid("canvas_area").removeChild(getByid("ColorWindow"));
            event.elem.style.backgroundColor = "";
            return;
        }
        event.elem.style.backgroundColor = "rgb(66,66,153)";*/
        var div = createElem("div");
        div.id = "ColorWindow";

        const slider = createElem("input"); slider.type = "range";
        slider.style.width = "255px"; slider.style.height = "25px";
        slider.min = 0, slider.max = 360, slider.value = 0;
        slider.style.position = "absolute";
        slider.style.zIndex = "1";
        slider.style.opacity = "0.0";
        div.appendChild(slider);

        var canvas = createElem("canvas");
        canvas.style.top = "25px";
        canvas.width = 256, canvas.height = 256, canvas.div = div;
        canvas.style.position = "absolute";
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
        div.HsvWindow = canvas;
        div.appendChild(canvas);
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
    static enable = false;;

    constructor(content) {
        this.createWindow(content);
    }

    createWindow(content) {
        var outer_div = getByid("outer_div");

        var root = ToolSelector.project.layerManager;
        root.cache.preview = true;
        root.cache.needReflesh = true;
        createSandwich();
        root.cache.preview = false;

        this.window = createElem("div"); this.window.className = "childWindow";
        this.window.style.zIndex = "100";
        this.windowTitle = createElem("div"); this.windowTitle.className = "windowTitle";
        this.windowClose = createElem("img"); this.windowClose.className = "windowClose";
        this.windowContent = createElem("div"); this.windowContent.className = "windowContent";
        this.window.style.position = "absolute";

        this.window.style.width = outer_div.offsetWidth / 2 + "px"
        this.window.style.height = outer_div.offsetHeight / 2 + "px"

        this.window.style.left = (outer_div.offsetWidth / 2 - outer_div.offsetWidth / 4) + 'px';
        this.window.style.top = (outer_div.offsetHeight / 2 - outer_div.offsetHeight / 4) + 'px';

        this.windowTitle.innerText = content.name;
        this.windowTitle.style.userSelect = "none";
        this.windowTitle.window = this.windowClose.window = this.window;
        this.windowClose.closeWindow = this.closeWindow;
        this.windowClose.src = "./image/close.png";
        this.addElem(content);

        this.window.appendChild(this.windowTitle);
        this.window.appendChild(this.windowContent);
        this.windowTitle.appendChild(this.windowClose);

        outer_div.appendChild(this.window);
        getByid("cover_div").style.display = "block";
        this.windowTitle.mouseDown = false;
        this.windowTitle.previewPoint = null;
        const windowTitle = this.windowTitle;
        this.windowTitle.onmousedown = function (e) {
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
        getByid("outer_div").onmouseup = function (e) {
            windowTitle.mouseDown = false;
        }

        this.windowClose.onclick = function () {
            GUI.refleshSandwichAndFullCanvas();
            this.closeWindow();
            if (ACGM.temp.length > 0) ACGM.temp = [];
        }
        createCacheForFilter();
        FilterWindow.enable = true;
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
                    requestAnimationFrame(() => {
                        //if (ToolSelector.filter.lock == true) return;
                        //ToolSelector.filter.lock = true;
                        Command.cmd("filter", filterName);
                        //ToolSelector.filter.lock = false;
                    });
                }
                ////////
                this.windowContent.appendChild(label);
                this.windowContent.appendChild(number);
                this.windowContent.appendChild(slider);
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
        //Layers.RejectPreviewContent();
        if (this.window.window) getByid("outer_div").removeChild(this.window.window);
        if (this.window) getByid("outer_div").removeChild(this.window);
        else removeChild(this.window);
        getByid("cover_div").style.display = "none";
        FilterWindow.enable = false;
        Filter.cache = null;
    }

    destroyWindow(e) {
        if (e) e.stopImmediatePropagation();
        //Event.removeMouseDown(this.window, "moveWindow");
        if (this.window.window) getByid("outer_div").removeChild(this.window.window);
        if (this.window) getByid("outer_div").removeChild(this.window);
        else removeChild(this.window);
        getByid("cover_div").style.display = "none";
        FilterWindow.enable = false;
        Filter.cache = null;
    }
}

function createFiltersUI() {
    function create(behavior, config) {
        var childWindow = new ChildWindow("濾鏡");
        var container = childWindow.windowContent;//getByid("tools_block");
        //container.innerHTML = "";
        for (var [key, value] of Object.entries(config)) {
            var label = createElem("label");
            label.innerText = translateUI(key) + ":　"; label.style.color = "white"; label.style.lineHeight = "30px";

            if (typeof value == "number") {
                var input = createElem("input"); input.className = "darkInput";
                input.setAttribute("type", "number");
                input.setAttribute("value", "" + value);
                container.appendChild(label);
                container.appendChild(input);
                container.appendChild(createElem("HR"));
            }
            else if (typeof value == "boolean") {
                if (key == "AcceptButton") {
                    var btn = createElem("button");
                    btn.innerText = "確定", btn.childWindow = childWindow;
                    btn.onclick = function (e) {
                        Layers.AcceptPreviewContent();
                        childWindow.destroyWindow(e);
                    }
                    container.appendChild(btn);
                    var btn = createElem("button");
                    btn.innerText = "取消", btn.childWindow = childWindow;
                    btn.onclick = function (e) {
                        Layers.RejectPreviewContent();
                        childWindow.destroyWindow(e);
                    }
                    container.appendChild(btn);
                }
            } else if (value.constructor.name == "RangeUI") {
                var rangeUI = createElem("input");
                rangeUI.className = "darkInput fullSlider";
                rangeUI.setAttribute("type", "range");
                rangeUI.setAttribute("min", "" + value.min);
                rangeUI.setAttribute("max", "" + value.max);
                rangeUI.setAttribute("value", "" + value.val);
                rangeUI.behavior = behavior;

                var numUI = createElem("input");
                numUI.className = "darkInput";
                numUI.setAttribute("type", "number");
                numUI.setAttribute("min", "" + value.min);
                numUI.setAttribute("max", "" + value.max);
                numUI.setAttribute("value", "" + value.val);
                numUI.behavior = behavior;

                numUI.rangeUI = rangeUI;
                rangeUI.numUI = numUI;

                rangeUI.target = numUI.target = config[key];
                container.appendChild(label);
                container.appendChild(numUI);
                container.appendChild(createElem("BR"));
                container.appendChild(rangeUI);
                container.appendChild(createElem("BR"));
                container.appendChild(createElem("HR"));
                rangeUI.oninput = function () {
                    this.target.val = this.value;
                    this.numUI.value = this.value;
                    Filter.trigger(this.behavior, this);
                }
                numUI.oninput = function () {
                    this.target.val = parseInt(this.value);
                    this.rangeUI.value = parseInt(this.value);
                    Filter.trigger(this.behavior, this);
                }
            }
            else if (value.constructor.name == "color") {

            } else if (value.constructor.name == "EnumUI") {
                var select = document.createElement("select");
                select.className = "darkInput";
                //select.style = "z-index: 490;font-weight:bold;font-size:16px";

                for (var str of value.list) {
                    var option = document.createElement("option");
                    option.innerText = translateUI(str);
                    option.setAttribute("value", str);
                    if (str == value.val) option.setAttribute("selected", "selected");
                    select.appendChild(option);
                }
                select.target = config[key];
                select.behavior = behavior;
                select.onchange = function () {
                    this.target.val = this.options[this.options.selectedIndex].value;
                    Filter.trigger(this.behavior, this);
                }
                container.appendChild(label);
                container.appendChild(select);
                container.appendChild(createElem("BR"));
                container.appendChild(createElem("HR"));
            }

            Filter.trigger(behavior, null);
            //console.log(`${key}: ${value}`);
        }
    }
    if (ACGM.targetProject.targetTool == "Binarization") create("binarization", Tools.binarization);
    if (ACGM.targetProject.targetTool == "mosaic") create("mosaic", Tools.mosaic);
    if (ACGM.targetProject.targetTool == "ColorAdjustment") create("coloradjustment", Tools.coloradjustment);
    if (ACGM.targetProject.targetTool == "noise") create("noise", Tools.noise);
    if (ACGM.targetProject.targetTool == "emboss") create("emboss", Tools.emboss);
    if (ACGM.targetProject.targetTool == "BrightnessContrast") create("brightnesscontrast", Tools.brightnesscontrast);
    if (ACGM.targetProject.targetTool == "airbrush") create("airbrush", Tools.airbrush);
    if (ACGM.targetProject.targetTool == "GlassBlur") create("glassblur", Tools.glassblur);
    if (ACGM.targetProject.targetTool == "posterization") create("posterization", Tools.posterization);
}
