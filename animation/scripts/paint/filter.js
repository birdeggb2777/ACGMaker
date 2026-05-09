
function createCacheForFilter() {
    var layer = ToolSelector.layer, mask = null;
    var [left, top, right, bottom] = [layer.x, layer.y, layer.x + layer.width, layer.y + layer.height];
    var root = ToolSelector.project.layerManager;
    const active = ToolSelector.project.layerManager.cache.active.d2;
    const pixels = layer.pixelData.d2;
    Filter.cache = new F32PixelData(layer.width, layer.height, 4);
    const fcache = Filter.cache.d2;
    for (var h = top; h < bottom; h++) {
        const pixelRow = pixels[h], cacheRow = fcache[h];
        for (var w = left * 4; w < right * 4; w += 4) {
            cacheRow[w + 0] = pixelRow[w + 0];
            cacheRow[w + 1] = pixelRow[w + 1];
            cacheRow[w + 2] = pixelRow[w + 2];
            cacheRow[w + 3] = pixelRow[w + 3];
        }
    }
}

function invokeFilter(filterName) {
    var layer = ToolSelector.layer, mask = null;
    var [left, top, right, bottom] = [layer.x, layer.y, layer.x + layer.width, layer.y + layer.height];
    if (ToolSelector.hasSelection && ToolSelector.selection.getMap()) mask = ToolSelector.selection.getMap().d2;

    if (filterName == "invertColor") {
        if (layer.type == 圖層類型.影像) {
            const pixels = layer.pixelData.d2;
            if (mask) {
                for (var h = top; h < bottom; h++) {
                    const pixelRow = pixels[h], maskRow = mask[h];
                    for (var w = left * 4; w < right * 4; w += 4) {
                        if (maskRow[w + 0] === 0) continue;
                        pixelRow[w + 0] = 255 - pixelRow[w + 0];
                        pixelRow[w + 1] = 255 - pixelRow[w + 1];
                        pixelRow[w + 2] = 255 - pixelRow[w + 2];
                    }
                }
            } else {
                for (var h = top; h < bottom; h++) {
                    const pixelRow = pixels[h];
                    for (var w = left * 4; w < right * 4; w += 4) {
                        pixelRow[w + 0] = 255 - pixelRow[w + 0];
                        pixelRow[w + 1] = 255 - pixelRow[w + 1];
                        pixelRow[w + 2] = 255 - pixelRow[w + 2];
                    }
                }
            }
            GUI.refleshSandwichAndFullCanvas();
        }
    }
    if (filterName == "autoColorBalance"/*"自動色彩平衡"*/) {
        const pixels = layer.pixelData.d2;
        var maxR = 0, maxG = 0, maxB = 0;
        for (var h = top; h < bottom; h++) {
            const pixelRow = pixels[h];
            for (var w = left * 4; w < right * 4; w += 4) {
                //if (maskRow[w + 0] === 0) continue;
                if (maxB < pixelRow[w + 0]) maxB = pixelRow[w + 0];
                if (maxG < pixelRow[w + 1]) maxG = pixelRow[w + 1];
                if (maxR < pixelRow[w + 2]) maxR = pixelRow[w + 2];
            }
            var B = (255.0 / (maxB == 0 ? 1 : maxB));
            var G = (255.0 / (maxG == 0 ? 1 : maxG));
            var R = (255.0 / (maxR == 0 ? 1 : maxR));
            for (var h = top; h < bottom; h++) {
                const pixelRow = pixels[h];
                for (var w = left * 4; w < right * 4; w += 4) {
                    pixelRow[w + 0] = B * pixelRow[w + 0] > 255 ? 255 : B * pixelRow[w + 0];
                    pixelRow[w + 1] = G * pixelRow[w + 1] > 255 ? 255 : G * pixelRow[w + 1];
                    pixelRow[w + 2] = R * pixelRow[w + 2] > 255 ? 255 : R * pixelRow[w + 2];
                }
            }
        }
        GUI.refleshSandwichAndFullCanvas();
    }

    if (filterName == "overexposed") {
        if (layer.type == 圖層類型.影像) {
            const pixels = layer.pixelData.d2;
            if (mask) {
                for (var h = top; h < bottom; h++) {
                    const pixelRow = pixels[h], maskRow = mask[h];
                    for (var w = left * 4; w < right * 4; w += 4) {
                        if (maskRow[w + 0] === 0) continue;
                        pixelRow[w + 0] = Math.abs(128 - Math.abs(128 - pixelRow[w + 0]));
                        pixelRow[w + 1] = Math.abs(128 - Math.abs(128 - pixelRow[w + 1]));
                        pixelRow[w + 2] = Math.abs(128 - Math.abs(128 - pixelRow[w + 2]));
                    }
                }
            }
            else {
                for (var h = top; h < bottom; h++) {
                    const pixelRow = pixels[h];
                    for (var w = left * 4; w < right * 4; w += 4) {
                        pixelRow[w + 0] = Math.abs(128 - Math.abs(128 - pixelRow[w + 0]));
                        pixelRow[w + 1] = Math.abs(128 - Math.abs(128 - pixelRow[w + 1]));
                        pixelRow[w + 2] = Math.abs(128 - Math.abs(128 - pixelRow[w + 2]));
                    }
                }
            }

            GUI.refleshSandwichAndFullCanvas();
        }
    }
    if (filterName == "sharpening") {
        if (layer.type == 圖層類型.影像) {
            var root = ToolSelector.project.layerManager, cache = root.cache.cache.d2;
            const active = ToolSelector.project.layerManager.cache.active.d2;
            const pixels = layer.pixelData.d2;
            for (var h = top; h < bottom; h++) {
                const pixelRow = pixels[h], cacheRow = cache[h];
                for (var w = left * 4; w < right * 4; w += 4) {
                    cacheRow[w + 0] = pixelRow[w + 0];
                    cacheRow[w + 1] = pixelRow[w + 1];
                    cacheRow[w + 2] = pixelRow[w + 2];
                    cacheRow[w + 3] = pixelRow[w + 3];
                }
            }

            var B, G, R;
            if (mask) {
                for (var h = top + 1; h < bottom - 1; h++) {
                    const pixelRow = pixels[h], maskRow = mask[h];
                    for (var w = left * 4 + 4; w < right * 4 - 4; w += 4) {
                        if (maskRow[w + 0] === 0) continue;
                        B = G = R = 0;
                        R -= cache[h - 1][(w) + 0];
                        G -= cache[h - 1][(w) + 1];
                        B -= cache[h - 1][(w) + 2];

                        R -= cache[h + 1][(w) + 0];
                        G -= cache[h + 1][(w) + 1];
                        B -= cache[h + 1][(w) + 2];

                        R -= cache[h][(w + 4) + 0];
                        G -= cache[h][(w + 4) + 1];
                        B -= cache[h][(w + 4) + 2];

                        R -= cache[h][(w - 4) + 0];
                        G -= cache[h][(w - 4) + 1];
                        B -= cache[h][(w - 4) + 2];

                        R += cache[h][(w) + 0] * 4;
                        G += cache[h][(w) + 1] * 4;
                        B += cache[h][(w) + 2] * 4;

                        pixelRow[w + 0] += R;
                        pixelRow[w + 1] += G;
                        pixelRow[w + 2] += B;
                    }
                }
            }
            else {
                for (var h = top + 1; h < bottom - 1; h++) {
                    const pixelRow = pixels[h];
                    for (var w = left * 4 + 4; w < right * 4 - 4; w += 4) {
                        B = G = R = 0;
                        R -= cache[h - 1][(w) + 0];
                        G -= cache[h - 1][(w) + 1];
                        B -= cache[h - 1][(w) + 2];

                        R -= cache[h + 1][(w) + 0];
                        G -= cache[h + 1][(w) + 1];
                        B -= cache[h + 1][(w) + 2];

                        R -= cache[h][(w + 4) + 0];
                        G -= cache[h][(w + 4) + 1];
                        B -= cache[h][(w + 4) + 2];

                        R -= cache[h][(w - 4) + 0];
                        G -= cache[h][(w - 4) + 1];
                        B -= cache[h][(w - 4) + 2];

                        R += cache[h][(w) + 0] * 4;
                        G += cache[h][(w) + 1] * 4;
                        B += cache[h][(w) + 2] * 4;

                        pixelRow[w + 0] += R;
                        pixelRow[w + 1] += G;
                        pixelRow[w + 2] += B;
                    }
                }
            }
            GUI.refleshSandwichAndFullCanvas();
        }
    }
    if (filterName == "二質化") {
        if (layer.type == 圖層類型.影像) {
            var preview = ToolSelector.filter.preview, 門檻值 = parseInt(ToolSelector.filter.門檻值);
            var color1 = new Color(255, 255, 255, 255), color2 = new Color(0, 0, 0, 255);
            if (ToolSelector.filter.使用調色盤色彩 == true) { color1 = ToolSelector.前背透色[0], color2 = ToolSelector.前背透色[1]; }

            var root = ToolSelector.project.layerManager, cache = root.cache.cache.d2;
            const active = ToolSelector.project.layerManager.cache.active.d2;
            const pixels = layer.pixelData.d2;
            if (preview) {
                const fcache = Filter.cache.d2;
                if (mask) {
                    for (var h = top; h < bottom; h++) {
                        const activeRow = active[h], cacheRow = fcache[h], maskRow = mask[h];
                        for (var w = left * 4; w < right * 4; w += 4) {
                            if (maskRow[w + 0] === 0) continue;
                            const grayColor = (0.114 * cacheRow[w + 0] + 0.587 * cacheRow[w + 1] + 0.299 * cacheRow[w + 2]) | 0;
                            if (grayColor > 門檻值) {
                                activeRow[w + 0] = color1.r / 255.0;
                                activeRow[w + 1] = color1.g / 255.0;
                                activeRow[w + 2] = color1.b / 255.0;
                            }
                            else {
                                activeRow[w + 0] = color2.r / 255.0;
                                activeRow[w + 1] = color2.g / 255.0;
                                activeRow[w + 2] = color2.b / 255.0;
                            }
                            activeRow[w + 3] = cacheRow[w + 3] / 255.0;
                        }
                    }
                } else {
                    for (var h = top; h < bottom; h++) {
                        const activeRow = active[h], cacheRow = fcache[h];
                        for (var w = left * 4; w < right * 4; w += 4) {
                            const grayColor = (0.114 * cacheRow[w + 0] + 0.587 * cacheRow[w + 1] + 0.299 * cacheRow[w + 2]) | 0;
                            if (grayColor > 門檻值) {
                                activeRow[w + 0] = color1.r / 255.0;
                                activeRow[w + 1] = color1.g / 255.0;
                                activeRow[w + 2] = color1.b / 255.0;
                            }
                            else {
                                activeRow[w + 0] = color2.r / 255.0;
                                activeRow[w + 1] = color2.g / 255.0;
                                activeRow[w + 2] = color2.b / 255.0;
                            }
                            activeRow[w + 3] = cacheRow[w + 3] / 255.0;
                        }
                    }
                }

                ToolSelector.project.layerManager.needRefleshRect = true;
                GUI.refleshCanvas();
            } else {
                if (mask) {
                    const pixels = layer.pixelData.d2;
                    for (var h = top; h < bottom; h++) {
                        const pixelRow = pixels[h], maskRow = mask[h];;
                        for (var w = left * 4; w < right * 4; w += 4) {
                            if (maskRow[w + 0] === 0) continue;
                            const grayColor = (0.114 * pixelRow[w + 0] + 0.587 * pixelRow[w + 1] + 0.299 * pixelRow[w + 2]) | 0;
                            if (grayColor > 門檻值) {
                                pixelRow[w + 0] = color1.r;
                                pixelRow[w + 1] = color1.g;
                                pixelRow[w + 2] = color1.b;
                            }
                            else {
                                pixelRow[w + 0] = color2.r;
                                pixelRow[w + 1] = color2.g;
                                pixelRow[w + 2] = color2.b;
                            }
                        }
                    }
                } else {
                    const pixels = layer.pixelData.d2;
                    for (var h = top; h < bottom; h++) {
                        const pixelRow = pixels[h];
                        for (var w = left * 4; w < right * 4; w += 4) {
                            const grayColor = (0.114 * pixelRow[w + 0] + 0.587 * pixelRow[w + 1] + 0.299 * pixelRow[w + 2]) | 0;
                            if (grayColor > 門檻值) {
                                pixelRow[w + 0] = color1.r;
                                pixelRow[w + 1] = color1.g;
                                pixelRow[w + 2] = color1.b;
                            }
                            else {
                                pixelRow[w + 0] = color2.r;
                                pixelRow[w + 1] = color2.g;
                                pixelRow[w + 2] = color2.b;
                            }
                        }
                    }
                }

                GUI.refleshSandwichAndFullCanvas();
            }
        }
    }
    if (filterName == "噴槍") {
        if (layer.type == 圖層類型.影像) {
            var preview = ToolSelector.filter.preview, 距離 = parseInt(ToolSelector.filter.距離);
            var root = ToolSelector.project.layerManager, cache = root.cache.cache.d2;
            const active = ToolSelector.project.layerManager.cache.active.d2;
            const pixels = layer.pixelData.d2;
            const width = layer.width, height = layer.height;

            var x = 0, y = 0;
            if (preview) {
                const fcache = Filter.cache.d2;
                if (mask) {
                    for (var h = top; h < bottom; h++) {
                        const activeRow = active[h], cacheRow = fcache[h], maskRow = mask[h];
                        for (var w = left * 4, w0 = left; w < right * 4; w += 4, w0++) {
                            if (maskRow[w + 0] === 0) continue;
                            x = (Math.random() * 距離 * 2 - 距離) | 0, y = (Math.random() * 距離 * 2 - 距離) | 0;
                            y = h + y < 0 ? -h : (h + y >= height ? height - h - 1 : y);
                            x = w0 + x < 0 ? -w0 : (w0 + x >= width ? width - w0 - 1 : x);
                            activeRow[w + 0] = fcache[h + y][w + x * 4] / 255.0;
                            activeRow[w + 1] = fcache[h + y][w + x * 4 + 1] / 255.0;
                            activeRow[w + 2] = fcache[h + y][w + x * 4 + 2] / 255.0;
                            activeRow[w + 3] = cacheRow[w + 3] / 255.0;
                        }
                    }
                } else {
                    for (var h = top; h < bottom; h++) {
                        const activeRow = active[h], cacheRow = fcache[h];
                        for (var w = left * 4, w0 = left; w < right * 4; w += 4, w0++) {
                            x = (Math.random() * 距離 * 2 - 距離) | 0, y = (Math.random() * 距離 * 2 - 距離) | 0;
                            y = h + y < 0 ? -h : (h + y >= height ? height - h - 1 : y);
                            x = w0 + x < 0 ? -w0 : (w0 + x >= width ? width - w0 - 1 : x);
                            activeRow[w + 0] = fcache[h + y][w + x * 4] / 255.0;
                            activeRow[w + 1] = fcache[h + y][w + x * 4 + 1] / 255.0;
                            activeRow[w + 2] = fcache[h + y][w + x * 4 + 2] / 255.0;
                            activeRow[w + 3] = cacheRow[w + 3] / 255.0;
                        }
                    }
                }

                ToolSelector.project.layerManager.needRefleshRect = true;
                GUI.refleshCanvas();
            } else {
                const fcache = Filter.cache.d2;
                if (mask) {
                    const pixels = layer.pixelData.d2;
                    for (var h = top; h < bottom; h++) {
                        const pixelRow = pixels[h], maskRow = mask[h];
                        for (var w = left * 4, w0 = left; w < right * 4; w += 4, w0++) {
                            if (maskRow[w + 0] === 0) continue;
                            x = (Math.random() * 距離 * 2 - 距離) | 0, y = (Math.random() * 距離 * 2 - 距離) | 0;
                            y = h + y < 0 ? -h : (h + y >= height ? height - h - 1 : y);
                            x = w0 + x < 0 ? -w0 : (w0 + x >= width ? width - w0 - 1 : x);
                            pixelRow[w + 0] = fcache[h + y][w + x * 4];
                            pixelRow[w + 1] = fcache[h + y][w + x * 4 + 1];
                            pixelRow[w + 2] = fcache[h + y][w + x * 4 + 2];
                        }
                    }
                } else {
                    const pixels = layer.pixelData.d2;
                    for (var h = top; h < bottom; h++) {
                        const pixelRow = pixels[h];
                        for (var w = left * 4, w0 = left; w < right * 4; w += 4, w0++) {
                            x = (Math.random() * 距離 * 2 - 距離) | 0, y = (Math.random() * 距離 * 2 - 距離) | 0;
                            y = h + y < 0 ? -h : (h + y >= height ? height - h - 1 : y);
                            x = w0 + x < 0 ? -w0 : (w0 + x >= width ? width - w0 - 1 : x);
                            pixelRow[w + 0] = fcache[h + y][w + x * 4];
                            pixelRow[w + 1] = fcache[h + y][w + x * 4 + 1];
                            pixelRow[w + 2] = fcache[h + y][w + x * 4 + 2];
                        }
                    }
                }


                GUI.refleshSandwichAndFullCanvas();
            }
        }
    }
    if (filterName == "磁磚") {
        if (layer.type == 圖層類型.影像) {
            var preview = ToolSelector.filter.preview;
            var 大小 = parseInt(ToolSelector.filter.大小), 陰影深度 = parseInt(ToolSelector.filter.陰影深度);
            var root = ToolSelector.project.layerManager, cache = root.cache.cache.d2;
            const active = ToolSelector.project.layerManager.cache.active.d2;
            const pixels = layer.pixelData.d2;
            const width = layer.width, height = layer.height;

            var value = 大小, value2 = 陰影深度;

            const recSize = value * value;
            const channel = 4;
            var Stride = width * channel, x = 0, y = 0;

            var x2 = 0; var y2 = 0;
            var B = 0, G = 0, R = 0;
            // 照搬C++語言寫的PhotEgg，請留意RGB順序

            if (preview) {
                const fcache = Filter.cache.d1, activeD1 = ToolSelector.project.layerManager.cache.active.d1;
                for (var i = 0; i < fcache.length; i++)activeD1[i] = layer.pixelData.d1[i];

                for (var y = top; y < bottom; y += value) {
                    for (var x = left * 4; x < right * 4; x += value * 4) {
                        for (y2 = 0; y2 <= value; y2++) {
                            for (x2 = 0; x2 <= value2 * channel; x2 += channel) {
                                if (y + y2 < 0 || y + y2 >= height || x + x2 < 0 || x + x2 >= Stride) continue;
                                B = active[y + y2][x + x2] * (x2 / channel) / value2 + 255 * (value2 - x2 / 4) / value2;
                                G = active[y + y2][x + x2 + 1] * (x2 / channel) / value2 + 255 * (value2 - x2 / 4) / value2;
                                R = active[y + y2][x + x2 + 2] * (x2 / channel) / value2 + 255 * (value2 - x2 / 4) / value2;
                                active[y + y2][x + x2] = B > 255 ? 255 : (B < 0 ? 0 : B);
                                active[y + y2][x + x2 + 1] = G > 255 ? 255 : (G < 0 ? 0 : G);
                                active[y + y2][x + x2 + 2] = R > 255 ? 255 : (R < 0 ? 0 : R);
                                active[y + y2][x + x2 + 3] = active[y + y2][x + x2 + 3];
                            }
                        }
                        for (y2 = 0; y2 <= value2; y2++) {
                            for (x2 = 0; x2 <= value * channel; x2 += channel) {
                                if (y + y2 < 0 || y + y2 >= height || x + x2 < 0 || x + x2 >= Stride) continue;
                                B = active[y + y2][x + x2] * (y2) / value2 + 255 * (value2 - y2) / value2;
                                G = active[y + y2][x + x2 + 1] * (y2) / value2 + 255 * (value2 - y2) / value2;
                                R = active[y + y2][x + x2 + 2] * (y2) / value2 + 255 * (value2 - y2) / value2;
                                active[y + y2][x + x2] = B > 255 ? 255 : (B < 0 ? 0 : B);
                                active[y + y2][x + x2 + 1] = G > 255 ? 255 : (G < 0 ? 0 : G);
                                active[y + y2][x + x2 + 2] = R > 255 ? 255 : (R < 0 ? 0 : R);
                                active[y + y2][x + x2 + 3] = active[y + y2][x + x2 + 3];
                            }
                        }
                        for (y2 = 0; y2 <= value; y2++) {
                            for (x2 = (value - value2) * channel; x2 <= value * channel; x2 += channel) {
                                if (y + y2 < 0 || y + y2 >= height || x + x2 < 0 || x + x2 >= Stride) continue;
                                var temptra = x2 - ((value - value2) * channel);
                                B = active[y + y2][x + x2] * (value2 - temptra / channel) / value2 + (temptra / channel) / value2;
                                G = active[y + y2][x + x2 + 1] * (value2 - temptra / channel) / value2 + (temptra / channel) / value2;
                                R = active[y + y2][x + x2 + 2] * (value2 - temptra / channel) / value2 + (temptra / channel) / value2;
                                active[y + y2][x + x2] = B > 255 ? 255 : (B < 0 ? 0 : B);
                                active[y + y2][x + x2 + 1] = G > 255 ? 255 : (G < 0 ? 0 : G);
                                active[y + y2][x + x2 + 2] = R > 255 ? 255 : (R < 0 ? 0 : R);
                                active[y + y2][x + x2 + 3] = active[y + y2][x + x2 + 3];
                            }
                        }
                        for (y2 = (value - value2); y2 <= value; y2++) {
                            for (x2 = 0; x2 <= value * channel; x2 += channel) {
                                if (y + y2 < 0 || y + y2 >= height || x + x2 < 0 || x + x2 >= Stride) continue;
                                var temptra = (y2 - (value - value2)) * channel;
                                B = active[y + y2][x + x2] * (value2 - temptra / channel) / value2 + (temptra / channel) / value2;
                                G = active[y + y2][x + x2 + 1] * (value2 - temptra / channel) / value2 + (temptra / channel) / value2;
                                R = active[y + y2][x + x2 + 2] * (value2 - temptra / channel) / value2 + (temptra / channel) / value2;
                                active[y + y2][x + x2] = B > 255 ? 255 : (B < 0 ? 0 : B);
                                active[y + y2][x + x2 + 1] = G > 255 ? 255 : (G < 0 ? 0 : G);
                                active[y + y2][x + x2 + 2] = R > 255 ? 255 : (R < 0 ? 0 : R);
                                active[y + y2][x + x2 + 3] = active[y + y2][x + x2 + 3];
                            }
                        }
                    }
                }

                for (var i = 0; i < activeD1.length; i++)activeD1[i] = activeD1[i] / 255.0;
                ToolSelector.project.layerManager.needRefleshRect = true;
                GUI.refleshCanvas();
            }
            else {
                for (var y = top; y < bottom; y += value) {
                    for (var x = left * 4; x < right * 4; x += value * 4) {
                        for (y2 = 0; y2 <= value; y2++) {
                            for (x2 = 0; x2 <= value2 * channel; x2 += channel) {
                                if (y + y2 < 0 || y + y2 >= height || x + x2 < 0 || x + x2 >= Stride) continue;
                                B = pixels[y + y2][x + x2] * (x2 / channel) / value2 + 255 * (value2 - x2 / 4) / value2;
                                G = pixels[y + y2][x + x2 + 1] * (x2 / channel) / value2 + 255 * (value2 - x2 / 4) / value2;
                                R = pixels[y + y2][x + x2 + 2] * (x2 / channel) / value2 + 255 * (value2 - x2 / 4) / value2;
                                pixels[y + y2][x + x2] = B > 255 ? 255 : (B < 0 ? 0 : B);
                                pixels[y + y2][x + x2 + 1] = G > 255 ? 255 : (G < 0 ? 0 : G);
                                pixels[y + y2][x + x2 + 2] = R > 255 ? 255 : (R < 0 ? 0 : R);
                            }
                        }
                        for (y2 = 0; y2 <= value2; y2++) {
                            for (x2 = 0; x2 <= value * channel; x2 += channel) {
                                if (y + y2 < 0 || y + y2 >= height || x + x2 < 0 || x + x2 >= Stride) continue;
                                B = pixels[y + y2][x + x2] * (y2) / value2 + 255 * (value2 - y2) / value2;
                                G = pixels[y + y2][x + x2 + 1] * (y2) / value2 + 255 * (value2 - y2) / value2;
                                R = pixels[y + y2][x + x2 + 2] * (y2) / value2 + 255 * (value2 - y2) / value2;
                                pixels[y + y2][x + x2] = B > 255 ? 255 : (B < 0 ? 0 : B);
                                pixels[y + y2][x + x2 + 1] = G > 255 ? 255 : (G < 0 ? 0 : G);
                                pixels[y + y2][x + x2 + 2] = R > 255 ? 255 : (R < 0 ? 0 : R);

                            }
                        }
                        for (y2 = 0; y2 <= value; y2++) {
                            for (x2 = (value - value2) * channel; x2 <= value * channel; x2 += channel) {
                                if (y + y2 < 0 || y + y2 >= height || x + x2 < 0 || x + x2 >= Stride) continue;
                                var temptra = x2 - ((value - value2) * channel);
                                B = pixels[y + y2][x + x2] * (value2 - temptra / channel) / value2 + (temptra / channel) / value2;
                                G = pixels[y + y2][x + x2 + 1] * (value2 - temptra / channel) / value2 + (temptra / channel) / value2;
                                R = pixels[y + y2][x + x2 + 2] * (value2 - temptra / channel) / value2 + (temptra / channel) / value2;
                                pixels[y + y2][x + x2] = B > 255 ? 255 : (B < 0 ? 0 : B);
                                pixels[y + y2][x + x2 + 1] = G > 255 ? 255 : (G < 0 ? 0 : G);
                                pixels[y + y2][x + x2 + 2] = R > 255 ? 255 : (R < 0 ? 0 : R);
                            }
                        }
                        for (y2 = (value - value2); y2 <= value; y2++) {
                            for (x2 = 0; x2 <= value * channel; x2 += channel) {
                                if (y + y2 < 0 || y + y2 >= height || x + x2 < 0 || x + x2 >= Stride) continue;
                                var temptra = (y2 - (value - value2)) * channel;
                                B = pixels[y + y2][x + x2] * (value2 - temptra / channel) / value2 + (temptra / channel) / value2;
                                G = pixels[y + y2][x + x2 + 1] * (value2 - temptra / channel) / value2 + (temptra / channel) / value2;
                                R = pixels[y + y2][x + x2 + 2] * (value2 - temptra / channel) / value2 + (temptra / channel) / value2;
                                pixels[y + y2][x + x2] = B > 255 ? 255 : (B < 0 ? 0 : B);
                                pixels[y + y2][x + x2 + 1] = G > 255 ? 255 : (G < 0 ? 0 : G);
                                pixels[y + y2][x + x2 + 2] = R > 255 ? 255 : (R < 0 ? 0 : R);
                            }
                        }

                    }
                }
                GUI.refleshSandwichAndFullCanvas();
            }
        }
    }
    if (filterName == "浮雕") {
        if (layer.type == 圖層類型.影像) {
            var preview = ToolSelector.filter.preview;
            var 距離 = parseInt(ToolSelector.filter.距離), 角度 = parseInt(ToolSelector.filter.角度), 灰階 = ToolSelector.filter.灰階 == true;
            var root = ToolSelector.project.layerManager, cache = root.cache.cache.d2;
            const active = ToolSelector.project.layerManager.cache.active.d2;
            const pixels = layer.pixelData.d2;
            const width = layer.width, height = layer.height;

            var y = (距離 * Math.cos(角度 * Math.PI / 180)) | 0, x = (距離 * Math.sin(角度 * Math.PI / 180)) | 0, x4 = x * 4;
            if (preview) {
                const fcache = Filter.cache.d2;
                if (mask) {
                    if (灰階 == 0) {
                        for (var h = top; h < bottom; h++) {
                            const activeRow = active[h], cacheRow = fcache[h], maskRow = mask[h];
                            for (var w = left * 4, w0 = left; w < right * 4; w += 4, w0++) {
                                if (maskRow[w + 0] === 0) continue;
                                if (h + y < 0 || w0 + x < 0 || h + y >= height || w0 + x >= width)
                                    var gray = 0.114 * cacheRow[w] + 0.587 * cacheRow[w + 1] + 0.299 * cacheRow[w + 2];
                                else
                                    var gray = 0.114 * fcache[h + y][w + x4] + 0.587 * fcache[h + y][w + x4 + 1] + 0.299 * fcache[h + y][w + x4 + 2];
                                var tempB = 255 - gray, tempG = 255 - gray, tempR = 255 - gray;
                                var rr = ((tempB) + cacheRow[w]) / 2, gg = ((tempG) + cacheRow[w + 1]) / 2, bb = ((tempR) + cacheRow[w + 2]) / 2;
                                gray = (bb + gg + rr) / 3;
                                bb = bb * 2 - gray, gg = gg * 2 - gray, rr = rr * 2 - gray;
                                rr = rr > 255 ? 255 : (rr < 0 ? 0 : rr);
                                gg = gg > 255 ? 255 : (gg < 0 ? 0 : gg);
                                bb = bb > 255 ? 255 : (bb < 0 ? 0 : bb);
                                activeRow[w + 0] = rr / 255.0;
                                activeRow[w + 1] = gg / 255.0;
                                activeRow[w + 2] = bb / 255.0;
                                activeRow[w + 3] = cacheRow[w + 3] / 255.0;
                            }
                        }
                    } else {
                        for (var h = top; h < bottom; h++) {
                            const pixelRow = pixels[h], activeRow = active[h], cacheRow = fcache[h], maskRow = mask[h];
                            for (var w = left * 4, w0 = left; w < right * 4; w += 4, w0++) {
                                if (maskRow[w + 0] === 0) continue;
                                if (h + y < 0 || w0 + x < 0 || h + y >= height || w0 + x >= width) {
                                    activeRow[w + 0] = (((255 - fcache[h][w]) + fcache[h][w]) / 2) / 255.0;
                                    activeRow[w + 1] = (((255 - fcache[h][w + 1]) + fcache[h][w + 1]) / 2) / 255.0;
                                    activeRow[w + 2] = (((255 - fcache[h][w + 2]) + fcache[h][w + 2]) / 2) / 255.0;
                                    activeRow[w + 3] = cacheRow[w + 3] / 255.0;
                                } else {
                                    activeRow[w + 0] = (((255 - fcache[h][w]) + fcache[h][w]) / 2) / 255.0;
                                    activeRow[w + 1] = (((255 - fcache[h][w + 1]) + fcache[h][w + 1]) / 2) / 255.0;
                                    activeRow[w + 2] = (((255 - fcache[h][w + 2]) + fcache[h][w + 2]) / 2) / 255.0;
                                    activeRow[w + 3] = cacheRow[w + 3] / 255.0;
                                }
                            }
                        }
                    }
                } else {
                    if (灰階 == 0) {
                        for (var h = top; h < bottom; h++) {
                            const activeRow = active[h], cacheRow = fcache[h];
                            for (var w = left * 4, w0 = left; w < right * 4; w += 4, w0++) {
                                if (h + y < 0 || w0 + x < 0 || h + y >= height || w0 + x >= width)
                                    var gray = 0.114 * cacheRow[w] + 0.587 * cacheRow[w + 1] + 0.299 * cacheRow[w + 2];
                                else
                                    var gray = 0.114 * fcache[h + y][w + x4] + 0.587 * fcache[h + y][w + x4 + 1] + 0.299 * fcache[h + y][w + x4 + 2];
                                var tempB = 255 - gray, tempG = 255 - gray, tempR = 255 - gray;
                                var rr = ((tempB) + cacheRow[w]) / 2, gg = ((tempG) + cacheRow[w + 1]) / 2, bb = ((tempR) + cacheRow[w + 2]) / 2;
                                gray = (bb + gg + rr) / 3;
                                bb = bb * 2 - gray, gg = gg * 2 - gray, rr = rr * 2 - gray;
                                rr = rr > 255 ? 255 : (rr < 0 ? 0 : rr);
                                gg = gg > 255 ? 255 : (gg < 0 ? 0 : gg);
                                bb = bb > 255 ? 255 : (bb < 0 ? 0 : bb);
                                activeRow[w + 0] = rr / 255.0;
                                activeRow[w + 1] = gg / 255.0;
                                activeRow[w + 2] = bb / 255.0;
                                activeRow[w + 3] = cacheRow[w + 3] / 255.0;
                            }
                        }
                    } else {
                        for (var h = top; h < bottom; h++) {
                            const pixelRow = pixels[h], activeRow = active[h], cacheRow = fcache[h];
                            for (var w = left * 4, w0 = left; w < right * 4; w += 4, w0++) {
                                if (h + y < 0 || w0 + x < 0 || h + y >= height || w0 + x >= width) {
                                    activeRow[w + 0] = (((255 - fcache[h][w]) + fcache[h][w]) / 2) / 255.0;
                                    activeRow[w + 1] = (((255 - fcache[h][w + 1]) + fcache[h][w + 1]) / 2) / 255.0;
                                    activeRow[w + 2] = (((255 - fcache[h][w + 2]) + fcache[h][w + 2]) / 2) / 255.0;
                                    activeRow[w + 3] = cacheRow[w + 3] / 255.0;
                                } else {
                                    activeRow[w + 0] = (((255 - fcache[h][w]) + fcache[h + y][w + x4]) / 2) / 255.0;
                                    activeRow[w + 1] = (((255 - fcache[h][w + 1]) + fcache[h + y][w + x4 + 1]) / 2) / 255.0;
                                    activeRow[w + 2] = (((255 - fcache[h][w + 2]) + fcache[h + y][w + x4 + 2]) / 2) / 255.0;
                                    activeRow[w + 3] = cacheRow[w + 3] / 255.0;
                                }
                            }
                        }
                    }
                }

                ToolSelector.project.layerManager.needRefleshRect = true;
                GUI.refleshCanvas();
            } else {
                const fcache = Filter.cache.d2;
                if (mask) {
                    if (灰階 == 0) {
                        for (var h = top; h < bottom; h++) {
                            const pixelRow = pixels[h], activeRow = active[h], cacheRow = fcache[h], maskRow = mask[h];
                            for (var w = left * 4, w0 = left; w < right * 4; w += 4, w0++) {
                                if (maskRow[w + 0] === 0) continue;
                                if (h + y < 0 || w0 + x < 0 || h + y >= height || w0 + x >= width)
                                    var gray = 0.114 * cacheRow[w] + 0.587 * cacheRow[w + 1] + 0.299 * cacheRow[w + 2];
                                else
                                    var gray = 0.114 * fcache[h + y][w + x4] + 0.587 * fcache[h + y][w + x4 + 1] + 0.299 * fcache[h + y][w + x4 + 2];
                                var tempB = 255 - gray, tempG = 255 - gray, tempR = 255 - gray;
                                var rr = ((tempB) + cacheRow[w]) / 2, gg = ((tempG) + cacheRow[w + 1]) / 2, bb = ((tempR) + cacheRow[w + 2]) / 2;
                                gray = (bb + gg + rr) / 3;
                                bb = bb * 2 - gray, gg = gg * 2 - gray, rr = rr * 2 - gray;
                                pixelRow[w + 0] = (rr > 255 ? 255 : (rr < 0 ? 0 : rr)) | 0;
                                pixelRow[w + 1] = (gg > 255 ? 255 : (gg < 0 ? 0 : gg)) | 0;
                                pixelRow[w + 2] = (bb > 255 ? 255 : (bb < 0 ? 0 : bb)) | 0;
                            }
                        }
                    } else {
                        for (var h = top; h < bottom; h++) {
                            const pixelRow = pixels[h], activeRow = active[h], cacheRow = fcache[h], maskRow = mask[h];
                            for (var w = left * 4, w0 = left; w < right * 4; w += 4, w0++) {
                                if (maskRow[w + 0] === 0) continue;
                                if (h + y < 0 || w0 + x < 0 || h + y >= height || w0 + x >= width) {
                                    pixelRow[w + 0] = (((255 - fcache[h][w]) + fcache[h][w]) / 2) | 0;
                                    pixelRow[w + 1] = (((255 - fcache[h][w + 1]) + fcache[h][w + 1]) / 2) | 0;
                                    pixelRow[w + 2] = (((255 - fcache[h][w + 2]) + fcache[h][w + 2]) / 2) | 0;
                                } else {
                                    pixelRow[w + 0] = (((255 - fcache[h][w]) + fcache[h + y][w + x4]) / 2) | 0;
                                    pixelRow[w + 1] = (((255 - fcache[h][w + 1]) + fcache[h + y][w + x4 + 1]) / 2) | 0;
                                    pixelRow[w + 2] = (((255 - fcache[h][w + 2]) + fcache[h + y][w + x4 + 2]) / 2) | 0;
                                }
                            }
                        }
                    }
                } else {
                    if (灰階 == 0) {
                        for (var h = top; h < bottom; h++) {
                            const pixelRow = pixels[h], activeRow = active[h], cacheRow = fcache[h];
                            for (var w = left * 4, w0 = left; w < right * 4; w += 4, w0++) {
                                if (h + y < 0 || w0 + x < 0 || h + y >= height || w0 + x >= width)
                                    var gray = 0.114 * cacheRow[w] + 0.587 * cacheRow[w + 1] + 0.299 * cacheRow[w + 2];
                                else
                                    var gray = 0.114 * fcache[h + y][w + x4] + 0.587 * fcache[h + y][w + x4 + 1] + 0.299 * fcache[h + y][w + x4 + 2];
                                var tempB = 255 - gray, tempG = 255 - gray, tempR = 255 - gray;
                                var rr = ((tempB) + cacheRow[w]) / 2, gg = ((tempG) + cacheRow[w + 1]) / 2, bb = ((tempR) + cacheRow[w + 2]) / 2;
                                gray = (bb + gg + rr) / 3;
                                bb = bb * 2 - gray, gg = gg * 2 - gray, rr = rr * 2 - gray;
                                pixelRow[w + 0] = (rr > 255 ? 255 : (rr < 0 ? 0 : rr)) | 0;
                                pixelRow[w + 1] = (gg > 255 ? 255 : (gg < 0 ? 0 : gg)) | 0;
                                pixelRow[w + 2] = (bb > 255 ? 255 : (bb < 0 ? 0 : bb)) | 0;
                            }
                        }
                    } else {
                        for (var h = top; h < bottom; h++) {
                            const pixelRow = pixels[h], activeRow = active[h], cacheRow = fcache[h];
                            for (var w = left * 4, w0 = left; w < right * 4; w += 4, w0++) {
                                if (h + y < 0 || w0 + x < 0 || h + y >= height || w0 + x >= width) {
                                    pixelRow[w + 0] = (((255 - fcache[h][w]) + fcache[h][w]) / 2) | 0;
                                    pixelRow[w + 1] = (((255 - fcache[h][w + 1]) + fcache[h][w + 1]) / 2) | 0;
                                    pixelRow[w + 2] = (((255 - fcache[h][w + 2]) + fcache[h][w + 2]) / 2) | 0;
                                } else {
                                    pixelRow[w + 0] = (((255 - fcache[h][w]) + fcache[h + y][w + x4]) / 2) | 0;
                                    pixelRow[w + 1] = (((255 - fcache[h][w + 1]) + fcache[h + y][w + x4 + 1]) / 2) | 0;
                                    pixelRow[w + 2] = (((255 - fcache[h][w + 2]) + fcache[h + y][w + x4 + 2]) / 2) | 0;
                                }
                            }
                        }
                    }
                }
                GUI.refleshSandwichAndFullCanvas();
            }
        }
    }
    if (filterName == "馬賽克") {
        if (layer.type == 圖層類型.影像) {
            var preview = ToolSelector.filter.preview, kernel = parseInt(ToolSelector.filter.大小);
            var root = ToolSelector.project.layerManager, cache = root.cache.cache.d2;
            const active = ToolSelector.project.layerManager.cache.active.d2;
            const pixels = layer.pixelData.d2;
            const width = layer.width, height = layer.height
            if (preview) {
                if (mask) {
                    var B, G, R, count;
                    for (var h = top; h < bottom; h += kernel) {
                        const pixelRow = pixels[h], maskRow = mask[h];
                        for (var w = left * 4; w < right * 4; w += 4 * kernel) {
                            if (maskRow[w + 0] === 0) continue;
                            B = G = R = count = 0;
                            for (var kh = 0; kh < kernel; kh++) {
                                for (var kw = 0; kw < kernel * 4; kw += 4) {
                                    if (h + kh >= height || w + kw >= width * 4) continue;
                                    B += pixels[h + kh][(w + kw) + 0];
                                    G += pixels[h + kh][(w + kw) + 1];
                                    R += pixels[h + kh][(w + kw) + 2];
                                    count++;
                                }
                            }
                            B /= count, G /= count, R /= count;
                            for (var kh = 0; kh < kernel; kh++) {
                                for (var kw = 0; kw < kernel * 4; kw += 4) {
                                    if (h + kh >= height || w + kw >= width * 4) continue;
                                    active[(h + kh)][(w + kw) + 0] = B / 255.0;
                                    active[(h + kh)][(w + kw) + 1] = G / 255.0;
                                    active[(h + kh)][(w + kw) + 2] = R / 255.0;
                                    active[(h + kh)][(w + kw) + 3] = pixels[h + kh][(w + kw) + 3] / 255.0;
                                }
                            }
                        }
                    }
                } else {
                    var B, G, R, count;
                    for (var h = top; h < bottom; h += kernel) {
                        const pixelRow = pixels[h];
                        for (var w = left * 4; w < right * 4; w += 4 * kernel) {
                            B = G = R = count = 0;
                            for (var kh = 0; kh < kernel; kh++) {
                                for (var kw = 0; kw < kernel * 4; kw += 4) {
                                    if (h + kh >= height || w + kw >= width * 4) continue;
                                    B += pixels[h + kh][(w + kw) + 0];
                                    G += pixels[h + kh][(w + kw) + 1];
                                    R += pixels[h + kh][(w + kw) + 2];
                                    count++;
                                }
                            }
                            B /= count, G /= count, R /= count;
                            for (var kh = 0; kh < kernel; kh++) {
                                for (var kw = 0; kw < kernel * 4; kw += 4) {
                                    if (h + kh >= height || w + kw >= width * 4) continue;
                                    active[(h + kh)][(w + kw) + 0] = B / 255.0;
                                    active[(h + kh)][(w + kw) + 1] = G / 255.0;
                                    active[(h + kh)][(w + kw) + 2] = R / 255.0;
                                    active[(h + kh)][(w + kw) + 3] = pixels[h + kh][(w + kw) + 3] / 255.0;
                                }
                            }
                        }
                    }
                }

                ToolSelector.project.layerManager.needRefleshRect = true;
                GUI.refleshCanvas();
            } else {
                if (mask) {
                    var B, G, R, count;
                    for (var h = top; h < bottom; h += kernel) {
                        const pixelRow = pixels[h], maskRow = mask[h];
                        for (var w = left * 4; w < right * 4; w += 4 * kernel) {
                            if (maskRow[w + 0] === 0) continue;
                            B = G = R = count = 0;
                            for (var kh = 0; kh < kernel; kh++) {
                                for (var kw = 0; kw < kernel * 4; kw += 4) {
                                    if (h + kh >= height || w + kw >= width * 4) continue;
                                    B += pixels[h + kh][(w + kw) + 0];
                                    G += pixels[h + kh][(w + kw) + 1];
                                    R += pixels[h + kh][(w + kw) + 2];
                                    count++;
                                }
                            }
                            B /= count, G /= count, R /= count;
                            for (var kh = 0; kh < kernel; kh++) {
                                for (var kw = 0; kw < kernel * 4; kw += 4) {
                                    if (h + kh >= height || w + kw >= width * 4) continue;
                                    pixels[(h + kh)][(w + kw) + 0] = B | 0;
                                    pixels[(h + kh)][(w + kw) + 1] = G | 0;
                                    pixels[(h + kh)][(w + kw) + 2] = R | 0;
                                    pixels[(h + kh)][(w + kw) + 3] = pixels[h + kh][(w + kw) + 3] | 0;
                                }
                            }
                        }
                    }
                } else {
                    var B, G, R, count;
                    for (var h = top; h < bottom; h += kernel) {
                        const pixelRow = pixels[h];
                        for (var w = left * 4; w < right * 4; w += 4 * kernel) {
                            B = G = R = count = 0;
                            for (var kh = 0; kh < kernel; kh++) {
                                for (var kw = 0; kw < kernel * 4; kw += 4) {
                                    if (h + kh >= height || w + kw >= width * 4) continue;
                                    B += pixels[h + kh][(w + kw) + 0];
                                    G += pixels[h + kh][(w + kw) + 1];
                                    R += pixels[h + kh][(w + kw) + 2];
                                    count++;
                                }
                            }
                            B /= count, G /= count, R /= count;
                            for (var kh = 0; kh < kernel; kh++) {
                                for (var kw = 0; kw < kernel * 4; kw += 4) {
                                    if (h + kh >= height || w + kw >= width * 4) continue;
                                    pixels[(h + kh)][(w + kw) + 0] = B | 0;
                                    pixels[(h + kh)][(w + kw) + 1] = G | 0;
                                    pixels[(h + kh)][(w + kw) + 2] = R | 0;
                                    pixels[(h + kh)][(w + kw) + 3] = pixels[h + kh][(w + kw) + 3] | 0;
                                }
                            }
                        }
                    }
                }
                GUI.refleshSandwichAndFullCanvas();
            }
        }
    }
    if (filterName == "玻璃模糊") {
        if (layer.type == 圖層類型.影像) {
            var preview = ToolSelector.filter.preview, 強度 = parseFloat(ToolSelector.filter.強度);
            var root = ToolSelector.project.layerManager, cache = root.cache.cache.d2;
            const active = ToolSelector.project.layerManager.cache.active.d2;
            const pixels = layer.pixelData.d2;
            const width = layer.width, height = layer.height;

            for (var h = top; h < bottom; h++) {
                const activeRow = active[h], pixelRow = pixels[h], cacheRow = cache[h];
                for (var w = left * 4; w < right * 4; w += 4) {
                    cacheRow[w + 0] = pixelRow[w + 0];
                    cacheRow[w + 1] = pixelRow[w + 1];
                    cacheRow[w + 2] = pixelRow[w + 2];
                    cacheRow[w + 3] = pixelRow[w + 3];
                }
            }

            function mosaic(kernel) {
                const strides = width * 4, kernel4 = kernel * 4;
                const kernel_pow = kernel * kernel, inv = 1 / kernel_pow;
                let h, w, x, y, B, G, R, count;
                for (h = 0; h < height; h += kernel) {
                    const limit_h = h + kernel < height ? h + kernel : height;
                    for (w = 0; w < strides; w += kernel4) {
                        const limit_w = w + kernel4 < strides ? w + kernel4 : strides;
                        B = 0, G = 0, R = 0, count = 0;
                        for (y = h; y < limit_h; y++) {
                            const cacheRow = cache[y];
                            for (x = w; x < limit_w; x += 4) {
                                B += cacheRow[x];
                                G += cacheRow[x + 1];
                                R += cacheRow[x + 2];
                                count++;
                            }
                        }

                        if (count === kernel_pow) B *= inv, G *= inv, R *= inv;
                        else B /= count, G /= count, R /= count;

                        for (y = h; y < limit_h; y++) {
                            const cacheRow = cache[y];
                            for (x = w; x < limit_w; x += 4) {
                                cacheRow[x] = B;
                                cacheRow[x + 1] = G;
                                cacheRow[x + 2] = R;
                            }
                        }
                    }
                }
            }

            //重複數次
            for (var i = 強度; i > 0; i -= 1)  mosaic(i);
            if (preview) {
                if (mask) {
                    for (var h = top; h < bottom; h++) {
                        const activeRow = active[h], pixelRow = pixels[h], cacheRow = cache[h], maskRow = mask[h];
                        for (var w = left * 4, w0 = 0; w < right * 4; w += 4, w0++) {
                            if (maskRow[w + 0] === 0) continue;
                            activeRow[w + 0] = cacheRow[w + 0] / 255.0;
                            activeRow[w + 1] = cacheRow[w + 1] / 255.0;
                            activeRow[w + 2] = cacheRow[w + 2] / 255.0;
                            activeRow[w + 3] = pixelRow[w + 3] / 255.0;
                        }
                    }
                } else {
                    for (var h = top; h < bottom; h++) {
                        const activeRow = active[h], pixelRow = pixels[h], cacheRow = cache[h];
                        for (var w = left * 4, w0 = 0; w < right * 4; w += 4, w0++) {
                            activeRow[w + 0] = cacheRow[w + 0] / 255.0;
                            activeRow[w + 1] = cacheRow[w + 1] / 255.0;
                            activeRow[w + 2] = cacheRow[w + 2] / 255.0;
                            activeRow[w + 3] = pixelRow[w + 3] / 255.0;
                        }
                    }
                }
                ToolSelector.project.layerManager.needRefleshRect = true;
                GUI.refleshCanvas();
            } else {
                if (mask) {
                    for (var h = top; h < bottom; h++) {
                        const pixelRow = pixels[h], cacheRow = cache[h], stride = h * width, maskRow = mask[h];
                        for (var w = left * 4, w0 = 0; w < right * 4; w += 4, w0++) {
                            if (maskRow[w + 0] === 0) continue;
                            pixelRow[w + 0] = cacheRow[w + 0] | 0;
                            pixelRow[w + 1] = cacheRow[w + 1] | 0;
                            pixelRow[w + 2] = cacheRow[w + 2] | 0;
                        }
                    }
                } else {
                    for (var h = top; h < bottom; h++) {
                        const pixelRow = pixels[h], cacheRow = cache[h], stride = h * width;
                        for (var w = left * 4, w0 = 0; w < right * 4; w += 4, w0++) {
                            pixelRow[w + 0] = cacheRow[w + 0] | 0;
                            pixelRow[w + 1] = cacheRow[w + 1] | 0;
                            pixelRow[w + 2] = cacheRow[w + 2] | 0;
                        }
                    }
                }
                GUI.refleshSandwichAndFullCanvas();
            }
        }
    }
    if (filterName == "雜訊") {
        if (layer.type == 圖層類型.影像) {
            var preview = ToolSelector.filter.preview, 強度 = parseFloat(ToolSelector.filter.強度) / 100.0;
            var root = ToolSelector.project.layerManager, cache = root.cache.cache.d2;
            const active = ToolSelector.project.layerManager.cache.active.d2;
            const pixels = layer.pixelData.d2;
            const width = layer.width, height = layer.height;

            if (ACGM.temp.length != 3)
                ACGM.temp = [new NoiseList(0n).genList(width * height), new NoiseList(1n).genList(width * height), new NoiseList(2n).genList(width * height)];
            var [noiseListR, noiseListG, noiseListB] = [ACGM.temp[0], ACGM.temp[1], ACGM.temp[2]];

            if (preview) {
                const fcache = Filter.cache.d2;
                if (mask) {
                    for (var h = top; h < bottom; h++) {
                        const activeRow = active[h], cacheRow = fcache[h], stride = h * width, maskRow = mask[h];
                        for (var w = left * 4, w0 = 0; w < right * 4; w += 4, w0++) {
                            if (maskRow[w + 0] === 0) continue;
                            activeRow[w + 0] = ((cacheRow[w + 0] * (1 - 強度)) + (noiseListR[stride + w0] * 255 * 強度)) / 255.0;
                            activeRow[w + 1] = ((cacheRow[w + 1] * (1 - 強度)) + (noiseListG[stride + w0] * 255 * 強度)) / 255.0;
                            activeRow[w + 2] = ((cacheRow[w + 2] * (1 - 強度)) + (noiseListB[stride + w0] * 255 * 強度)) / 255.0;
                            activeRow[w + 3] = cacheRow[w + 3] / 255.0;
                        }
                    }
                } else {
                    for (var h = top; h < bottom; h++) {
                        const activeRow = active[h], cacheRow = fcache[h], stride = h * width;
                        for (var w = left * 4, w0 = 0; w < right * 4; w += 4, w0++) {
                            activeRow[w + 0] = ((cacheRow[w + 0] * (1 - 強度)) + (noiseListR[stride + w0] * 255 * 強度)) / 255.0;
                            activeRow[w + 1] = ((cacheRow[w + 1] * (1 - 強度)) + (noiseListG[stride + w0] * 255 * 強度)) / 255.0;
                            activeRow[w + 2] = ((cacheRow[w + 2] * (1 - 強度)) + (noiseListB[stride + w0] * 255 * 強度)) / 255.0;
                            activeRow[w + 3] = cacheRow[w + 3] / 255.0;
                        }
                    }
                }
                ToolSelector.project.layerManager.needRefleshRect = true;
                GUI.refleshCanvas();
            } else {
                if (mask) {
                    for (var h = top; h < bottom; h++) {
                        const pixelRow = pixels[h], stride = h * width, maskRow = mask[h];
                        for (var w = left * 4, w0 = 0; w < right * 4; w += 4, w0++) {
                            if (maskRow[w + 0] === 0) continue;
                            pixelRow[w + 0] = ((pixelRow[w + 0] * (1 - 強度)) + (noiseListR[stride + w0] * 255 * 強度)) | 0;
                            pixelRow[w + 1] = ((pixelRow[w + 1] * (1 - 強度)) + (noiseListG[stride + w0] * 255 * 強度)) | 0;
                            pixelRow[w + 2] = ((pixelRow[w + 2] * (1 - 強度)) + (noiseListB[stride + w0] * 255 * 強度)) | 0;
                        }
                    }
                } else {
                    for (var h = top; h < bottom; h++) {
                        const pixelRow = pixels[h], stride = h * width;
                        for (var w = left * 4, w0 = 0; w < right * 4; w += 4, w0++) {
                            pixelRow[w + 0] = ((pixelRow[w + 0] * (1 - 強度)) + (noiseListR[stride + w0] * 255 * 強度)) | 0;
                            pixelRow[w + 1] = ((pixelRow[w + 1] * (1 - 強度)) + (noiseListG[stride + w0] * 255 * 強度)) | 0;
                            pixelRow[w + 2] = ((pixelRow[w + 2] * (1 - 強度)) + (noiseListB[stride + w0] * 255 * 強度)) | 0;
                        }
                    }
                }
                GUI.refleshSandwichAndFullCanvas();
            }
        }
    }
    if (filterName == "白平衡") {
        if (layer.type == 圖層類型.影像) {
            var preview = ToolSelector.filter.preview;
            var 色溫 = parseFloat(ToolSelector.filter.色溫) / 100.0, 色澤 = parseFloat(ToolSelector.filter.色澤) / 100.0;
            var root = ToolSelector.project.layerManager, cache = root.cache.cache.d2;
            const active = ToolSelector.project.layerManager.cache.active.d2;
            const pixels = layer.pixelData.d2;
            const 白平衡R = 1.0 + (色溫) + 色澤 / 2;
            const 白平衡G = 1.0 - (色澤) + 色溫 / 4;
            const 白平衡B = 1.0 - (色溫) + 色澤 / 4;

            if (preview) {
                const fcache = Filter.cache.d2;
                if (mask) {
                    for (var h = top; h < bottom; h++) {
                        const activeRow = active[h], cacheRow = fcache[h], maskRow = mask[h];
                        for (var w = left * 4; w < right * 4; w += 4) {
                            if (maskRow[w + 0] === 0) continue;
                            activeRow[w + 0] = (cacheRow[w + 0] * 白平衡R) / 255.0;
                            activeRow[w + 1] = (cacheRow[w + 1] * 白平衡G) / 255.0;
                            activeRow[w + 2] = (cacheRow[w + 2] * 白平衡B) / 255.0;
                            activeRow[w + 3] = cacheRow[w + 3] / 255.0;
                        }
                    }
                } else {
                    for (var h = top; h < bottom; h++) {
                        const activeRow = active[h], cacheRow = fcache[h];
                        for (var w = left * 4; w < right * 4; w += 4) {
                            activeRow[w + 0] = (cacheRow[w + 0] * 白平衡R) / 255.0;//clamp01((cacheRow[w + 0] + (255 - cacheRow[w + 0]) * 色溫) / 255.0);
                            activeRow[w + 1] = (cacheRow[w + 1] * 白平衡G) / 255.0;//clamp01((cacheRow[w + 1] + (255 - cacheRow[w + 0]) * (色溫 * 0.3)) / 255.0);
                            activeRow[w + 2] = (cacheRow[w + 2] * 白平衡B) / 255.0;//clamp01((cacheRow[w + 2] * (1 - 色溫)) / 255.0);
                            activeRow[w + 3] = cacheRow[w + 3] / 255.0;
                        }
                    }
                }

                ToolSelector.project.layerManager.needRefleshRect = true;
                GUI.refleshCanvas();
            } else {
                if (mask) {
                    for (var h = top; h < bottom; h++) {
                        const pixelRow = pixels[h], maskRow = mask[h];
                        for (var w = left * 4; w < right * 4; w += 4) {
                            if (maskRow[w + 0] === 0) continue;
                            pixelRow[w + 0] = (pixelRow[w + 0] * 白平衡R) | 0;
                            pixelRow[w + 1] = (pixelRow[w + 1] * 白平衡G) | 0;
                            pixelRow[w + 2] = (pixelRow[w + 2] * 白平衡B) | 0;
                            pixelRow[w + 3] = pixelRow[w + 3];
                        }
                    }
                } else {
                    for (var h = top; h < bottom; h++) {
                        const pixelRow = pixels[h];
                        for (var w = left * 4; w < right * 4; w += 4) {
                            pixelRow[w + 0] = (pixelRow[w + 0] * 白平衡R) | 0;
                            pixelRow[w + 1] = (pixelRow[w + 1] * 白平衡G) | 0;
                            pixelRow[w + 2] = (pixelRow[w + 2] * 白平衡B) | 0;
                            pixelRow[w + 3] = pixelRow[w + 3];
                        }
                    }
                }
                GUI.refleshSandwichAndFullCanvas();
            }
        }
    }
    if (filterName == "RGB色彩調整") {
        if (layer.type == 圖層類型.影像) {
            var preview = ToolSelector.filter.preview;
            var R = parseInt(ToolSelector.filter.紅色), G = parseInt(ToolSelector.filter.綠色), B = parseInt(ToolSelector.filter.藍色);
            var root = ToolSelector.project.layerManager, cache = root.cache.cache.d2;
            const active = ToolSelector.project.layerManager.cache.active.d2;
            const pixels = layer.pixelData.d2;
            if (preview) {
                const fcache = Filter.cache.d2;
                if (mask) {
                    for (var h = top; h < bottom; h++) {
                        const pixelRow = pixels[h], activeRow = active[h], cacheRow = fcache[h], maskRow = mask[h];
                        for (var w = left * 4; w < right * 4; w += 4) {
                            if (maskRow[w + 0] === 0) continue;
                            activeRow[w + 0] = clamp01((cacheRow[w + 0] + R) / 255.0);
                            activeRow[w + 1] = clamp01((cacheRow[w + 1] + G) / 255.0);
                            activeRow[w + 2] = clamp01((cacheRow[w + 2] + B) / 255.0);
                            activeRow[w + 3] = cacheRow[w + 3] / 255.0;
                        }
                    }
                } else {
                    for (var h = top; h < bottom; h++) {
                        const pixelRow = pixels[h], activeRow = active[h], cacheRow = fcache[h];
                        for (var w = left * 4; w < right * 4; w += 4) {
                            activeRow[w + 0] = clamp01((cacheRow[w + 0] + R) / 255.0);
                            activeRow[w + 1] = clamp01((cacheRow[w + 1] + G) / 255.0);
                            activeRow[w + 2] = clamp01((cacheRow[w + 2] + B) / 255.0);
                            activeRow[w + 3] = cacheRow[w + 3] / 255.0;
                        }
                    }
                }

                ToolSelector.project.layerManager.needRefleshRect = true;
                GUI.refleshCanvas();
            } else {
                if (mask) {
                    for (var h = top; h < bottom; h++) {
                        const pixelRow = pixels[h], maskRow = mask[h];
                        for (var w = left * 4; w < right * 4; w += 4) {
                            if (maskRow[w + 0] === 0) continue;
                            pixelRow[w + 0] += R;
                            pixelRow[w + 1] += G;
                            pixelRow[w + 2] += B;
                        }
                    }
                } else {
                    for (var h = top; h < bottom; h++) {
                        const pixelRow = pixels[h];
                        for (var w = left * 4; w < right * 4; w += 4) {
                            pixelRow[w + 0] += R;
                            pixelRow[w + 1] += G;
                            pixelRow[w + 2] += B;
                        }
                    }
                }

                GUI.refleshSandwichAndFullCanvas();
            }
        }
    }
    if (filterName == "色相、飽和度、明度") {
        if (layer.type == 圖層類型.影像) {
            var preview = ToolSelector.filter.preview;
            var 色相 = parseInt(ToolSelector.filter.色相) / 360.0, 飽和度 = parseInt(ToolSelector.filter.飽和度) / 100.0, 明度 = parseInt(parseFloat(ToolSelector.filter.明度));
            var root = ToolSelector.project.layerManager, cache = root.cache.cache.d2;
            const active = ToolSelector.project.layerManager.cache.active.d2;
            const pixels = layer.pixelData.d2;

            // 0~1, 0~1, 0~1
            function hsv2rgb(h, s, v) {
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
                return [(r * 255) | 0, (g * 255) | 0, (b * 255) | 0];
            }

            function rgb2hsv(r, g, b) {
                var max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min, h, s = (max === 0 ? 0 : d / max), v = max;
                if (max === min) h = 0; // 灰色，無色相
                else {
                    switch (max) {
                        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                        case g: h = (b - r) / d + 2; break;
                        case b: h = (r - g) / d + 4; break;
                    }
                    h /= 6;
                }
                // 0~1, 0~1, 0~255
                return [h, s, v];
            }

            if (preview) {
                const fcache = Filter.cache.d2;
                if (mask) {
                    for (var h = top; h < bottom; h++) {
                        const pixelRow = pixels[h], activeRow = active[h], cacheRow = fcache[h], maskRow = mask[h];
                        for (var w = left * 4; w < right * 4; w += 4) {
                            if (maskRow[w + 0] === 0) continue;
                            var [H, S, V] = rgb2hsv(cacheRow[w + 0], cacheRow[w + 1], cacheRow[w + 2])
                            H = H + 色相, S = S + 飽和度, V = V + 明度;
                            H = H % 360 < 0 ? (H % 360) + 360 : H % 360, S = S < 0 ? 0 : (S > 1 ? 1 : S), V = V < 0 ? 0 : (V > 255 ? 255 : V);
                            var [r, g, b] = hsv2rgb(H, S, V / 255.0);
                            activeRow[w + 0] = r / 255.0;
                            activeRow[w + 1] = g / 255.0;
                            activeRow[w + 2] = b / 255.0;
                            activeRow[w + 3] = cacheRow[w + 3] / 255.0;
                        }
                    }
                } else {
                    for (var h = top; h < bottom; h++) {
                        const pixelRow = pixels[h], activeRow = active[h], cacheRow = fcache[h];
                        for (var w = left * 4; w < right * 4; w += 4) {
                            var [H, S, V] = rgb2hsv(cacheRow[w + 0], cacheRow[w + 1], cacheRow[w + 2]);
                            H = H + 色相, S = S + 飽和度, V = V + 明度;
                            H = H % 360 < 0 ? (H % 360) + 360 : H % 360, S = S < 0 ? 0 : (S > 1 ? 1 : S), V = V < 0 ? 0 : (V > 255 ? 255 : V);
                            var [r, g, b] = hsv2rgb(H, S, V / 255.0);
                            activeRow[w + 0] = r / 255.0;
                            activeRow[w + 1] = g / 255.0;
                            activeRow[w + 2] = b / 255.0;
                            activeRow[w + 3] = cacheRow[w + 3] / 255.0;
                        }
                    }
                }

                ToolSelector.project.layerManager.needRefleshRect = true;
                GUI.refleshCanvas();
            } else {
                if (mask) {
                    for (var h = top; h < bottom; h++) {
                        const pixelRow = pixels[h], maskRow = mask[h];
                        for (var w = left * 4; w < right * 4; w += 4) {
                            if (maskRow[w + 0] === 0) continue;
                            var [H, S, V] = rgb2hsv(pixelRow[w + 0], pixelRow[w + 1], pixelRow[w + 2]);
                            H = H + 色相, S = S + 飽和度, V = V + 明度;
                            H = H % 360 < 0 ? (H % 360) + 360 : H % 360, S = S < 0 ? 0 : (S > 1 ? 1 : S), V = V < 0 ? 0 : (V > 255 ? 255 : V);
                            var [r, g, b] = hsv2rgb(H, S, V / 255.0);
                            pixelRow[w + 0] = r;
                            pixelRow[w + 1] = g;
                            pixelRow[w + 2] = b;
                            pixelRow[w + 3] = pixelRow[w + 3];
                        }
                    }
                } else {
                    for (var h = top; h < bottom; h++) {
                        const pixelRow = pixels[h];
                        for (var w = left * 4; w < right * 4; w += 4) {
                            var [H, S, V] = rgb2hsv(pixelRow[w + 0], pixelRow[w + 1], pixelRow[w + 2]);
                            H = H + 色相, S = S + 飽和度, V = V + 明度;
                            H = H % 360 < 0 ? (H % 360) + 360 : H % 360, S = S < 0 ? 0 : (S > 1 ? 1 : S), V = V < 0 ? 0 : (V > 255 ? 255 : V);
                            var [r, g, b] = hsv2rgb(H, S, V / 255.0);
                            pixelRow[w + 0] = r;
                            pixelRow[w + 1] = g;
                            pixelRow[w + 2] = b;
                            pixelRow[w + 3] = pixelRow[w + 3];
                        }
                    }
                }

                GUI.refleshSandwichAndFullCanvas();
            }
        }
    }
    if (filterName == "色調分離") {
        if (layer.type == 圖層類型.影像) {
            var preview = ToolSelector.filter.preview, 色彩數 = parseInt(ToolSelector.filter.色彩數);
            var root = ToolSelector.project.layerManager, cache = root.cache.cache.d2;
            const active = ToolSelector.project.layerManager.cache.active.d2;
            const pixels = layer.pixelData.d2;

            var colorList = new Array(256);
            for (var i = 0; i < 256; i++)  colorList[i] = i;
            if (色彩數 <= 0) 色彩數 = 1;
            var newNum = 255 / (色彩數);
            for (var i = 0; i < 128; i++) {
                for (var j = 0; j < 256; j += newNum)
                    if (i >= j) colorList[i] = j;
            }
            for (var i = 128; i < 256; i++) {
                for (var j = 255; j >= 0; j -= newNum)
                    if (i <= j) colorList[i] = j;
            }

            if (preview) {
                if (mask) {
                    for (var h = top; h < bottom; h++) {
                        const pixelRow = pixels[h], activeRow = active[h], maskRow = mask[h];
                        for (var w = left * 4; w < right * 4; w += 4) {
                            if (maskRow[w + 0] === 0) continue;
                            activeRow[w + 0] = colorList[pixelRow[w + 0]] / 255.0;
                            activeRow[w + 1] = colorList[pixelRow[w + 1]] / 255.0;
                            activeRow[w + 2] = colorList[pixelRow[w + 2]] / 255.0;
                            activeRow[w + 3] = pixelRow[w + 3] / 255.0;
                        }
                    }
                } else {
                    for (var h = top; h < bottom; h++) {
                        const pixelRow = pixels[h], activeRow = active[h];
                        for (var w = left * 4; w < right * 4; w += 4) {
                            activeRow[w + 0] = colorList[pixelRow[w + 0]] / 255.0;
                            activeRow[w + 1] = colorList[pixelRow[w + 1]] / 255.0;
                            activeRow[w + 2] = colorList[pixelRow[w + 2]] / 255.0;
                            activeRow[w + 3] = pixelRow[w + 3] / 255.0;
                        }
                    }
                }

                ToolSelector.project.layerManager.needRefleshRect = true;
                GUI.refleshCanvas();
            } else {
                if (mask) {
                    for (var h = top; h < bottom; h++) {
                        const pixelRow = pixels[h], activeRow = active[h], maskRow = mask[h];
                        for (var w = left * 4; w < right * 4; w += 4) {
                            if (maskRow[w + 0] === 0) continue;
                            pixelRow[w + 0] = colorList[pixelRow[w + 0]];
                            pixelRow[w + 1] = colorList[pixelRow[w + 1]];
                            pixelRow[w + 2] = colorList[pixelRow[w + 2]];
                            pixelRow[w + 3] = pixelRow[w + 3];
                        }
                    }
                } else {
                    for (var h = top; h < bottom; h++) {
                        const pixelRow = pixels[h], activeRow = active[h];
                        for (var w = left * 4; w < right * 4; w += 4) {
                            pixelRow[w + 0] = colorList[pixelRow[w + 0]];
                            pixelRow[w + 1] = colorList[pixelRow[w + 1]];
                            pixelRow[w + 2] = colorList[pixelRow[w + 2]];
                            pixelRow[w + 3] = pixelRow[w + 3];
                        }
                    }
                }

                GUI.refleshSandwichAndFullCanvas();
            }
        }
    }
    if (filterName == "亮度與對比度調整") {
        if (layer.type == 圖層類型.影像) {
            var preview = ToolSelector.filter.preview;
            var brightness = parseInt(ToolSelector.filter.亮度), contrast = -parseInt(ToolSelector.filter.對比度);
            var root = ToolSelector.project.layerManager, cache = root.cache.cache.d2;
            const active = ToolSelector.project.layerManager.cache.active.d2;
            const pixels = layer.pixelData.d2;
            if (preview) {
                const fcache = Filter.cache.d2;
                var colorList = new Array(256), color = 0, c = 0, colorB = 0, colorG = 0, colorR = 0;
                for (var i = 0; i < 256; i++) {
                    if (contrast > 0) {
                        c = parseInt((i + brightness) * ((255 - contrast * 1) / 255.0));
                        colorList[i] = c > 255 ? 255 : (c < 0 ? 0 : c);
                    }
                    else if (contrast == -255) colorList[i] = i > 127 ? 255 : 0;
                    else {
                        var temp = 255.0 / (255 - (-contrast) >= 3 ? 255 - (-contrast) : 0);
                        c = i > 127 ? (127 + parseInt(temp * (i - 127)) + brightness) : (127 - parseInt(temp * (127 - i)) + brightness);
                        colorList[i] = c > 255 ? 255 : (c < 0 ? 0 : c);
                    }
                }

                if (mask) {
                    for (var h = top; h < bottom; h++) {
                        const pixelRow = pixels[h], activeRow = active[h], cacheRow = fcache[h], maskRow = mask[h];
                        for (var w = left * 4; w < right * 4; w += 4) {
                            if (maskRow[w + 0] === 0) continue;
                            activeRow[w + 0] = colorList[cacheRow[w + 0]] / 255.0;
                            activeRow[w + 1] = colorList[cacheRow[w + 1]] / 255.0;
                            activeRow[w + 2] = colorList[cacheRow[w + 2]] / 255.0;
                            activeRow[w + 3] = cacheRow[w + 3] / 255.0;
                        }
                    }
                } else {
                    for (var h = top; h < bottom; h++) {
                        const pixelRow = pixels[h], activeRow = active[h], cacheRow = fcache[h];
                        for (var w = left * 4; w < right * 4; w += 4) {
                            activeRow[w + 0] = colorList[cacheRow[w + 0]] / 255.0;
                            activeRow[w + 1] = colorList[cacheRow[w + 1]] / 255.0;
                            activeRow[w + 2] = colorList[cacheRow[w + 2]] / 255.0;
                            activeRow[w + 3] = cacheRow[w + 3] / 255.0;
                        }
                    }
                }

                ToolSelector.project.layerManager.needRefleshRect = true;
                GUI.refleshCanvas();
            } else {
                var colorList = new Array(256), color = 0, c = 0, colorB = 0, colorG = 0, colorR = 0;
                for (var i = 0; i < 256; i++) {
                    if (contrast > 0) {
                        c = parseInt((i + brightness) * ((255 - contrast * 1) / 255.0));
                        colorList[i] = c > 255 ? 255 : (c < 0 ? 0 : c);
                    }
                    else if (contrast == -255) colorList[i] = i > 127 ? 255 : 0;
                    else {
                        var temp = 255.0 / (255 - (-contrast) >= 3 ? 255 - (-contrast) : 0);
                        c = i > 127 ? (127 + parseInt(temp * (i - 127)) + brightness) : (127 - parseInt(temp * (127 - i)) + brightness);
                        colorList[i] = c > 255 ? 255 : (c < 0 ? 0 : c);
                    }
                }
                if (mask) {
                    for (var h = top; h < bottom; h++) {
                        const pixelRow = pixels[h], maskRow = mask[h];
                        for (var w = left * 4; w < right * 4; w += 4) {
                            if (maskRow[w + 0] === 0) continue;
                            pixelRow[w + 0] = colorList[pixelRow[w + 0]];
                            pixelRow[w + 1] = colorList[pixelRow[w + 1]];
                            pixelRow[w + 2] = colorList[pixelRow[w + 2]];
                        }
                    }
                } else {
                    for (var h = top; h < bottom; h++) {
                        const pixelRow = pixels[h];
                        for (var w = left * 4; w < right * 4; w += 4) {
                            pixelRow[w + 0] = colorList[pixelRow[w + 0]];
                            pixelRow[w + 1] = colorList[pixelRow[w + 1]];
                            pixelRow[w + 2] = colorList[pixelRow[w + 2]];
                        }
                    }
                }
                GUI.refleshSandwichAndFullCanvas();
            }
        }
    }
    if (filterName == "grayScale") {
        if (layer.type == 圖層類型.影像) {
            const pixels = layer.pixelData.d2;
            if (mask) {
                for (var h = top; h < bottom; h++) {
                    const pixelRow = pixels[h], maskRow = mask[h];
                    for (var w = left * 4; w < right * 4; w += 4) {
                        if (maskRow[w + 0] === 0) continue;
                        const grayColor = (0.114 * pixelRow[w + 0] + 0.587 * pixelRow[w + 1] + 0.299 * pixelRow[w + 2]) | 0;
                        pixelRow[w + 0] = pixelRow[w + 1] = pixelRow[w + 2] = grayColor;
                    }
                }
            } else {
                for (var h = top; h < bottom; h++) {
                    const pixelRow = pixels[h];
                    for (var w = left * 4; w < right * 4; w += 4) {
                        const grayColor = (0.114 * pixelRow[w + 0] + 0.587 * pixelRow[w + 1] + 0.299 * pixelRow[w + 2]) | 0;
                        pixelRow[w + 0] = pixelRow[w + 1] = pixelRow[w + 2] = grayColor;
                    }
                }
            }

            GUI.refleshSandwichAndFullCanvas();
        }
    }
    if (filterName == "xFlip") {
        if (layer.type == 圖層類型.影像) {
            var root = ToolSelector.project.layerManager, cache = root.cache.cache.d2;
            const pixels = layer.pixelData.d2;
            if (mask) {
                var maskTop = layer.height - 1, maskLeft = layer.width - 1, maskRight = 0, maskBottom = 0;
                for (var h = top; h < bottom; h++) {
                    for (var w = left * 4, w0 = left; w < right * 4; w += 4, w0++) {
                        if (mask[h][w + 0] === 0) continue;
                        if (h < maskTop) maskTop = h;
                        if (w0 < maskLeft) maskLeft = w0;
                        if (h > maskBottom) maskBottom = h;
                        if (w0 > maskRight) maskRight = w0;
                    }
                }
                for (var h = maskTop; h < maskBottom; h++) {
                    const pixelRow = pixels[h], cacheRow = cache[h], maskRow = mask[h];
                    for (var w = maskLeft * 4, w2 = maskRight * 4 - 4; w < maskRight * 4; w += 4, w2 -= 4) {
                        if (maskRow[w + 0] === 0) continue;
                        cacheRow[w + 0] = pixelRow[w2 + 0];
                        cacheRow[w + 1] = pixelRow[w2 + 1];
                        cacheRow[w + 2] = pixelRow[w2 + 2];
                        cacheRow[w + 3] = pixelRow[w2 + 3];
                    }
                }
                for (var h = maskTop; h < maskBottom; h++) {
                    const pixelRow = pixels[h], cacheRow = cache[h], maskRow = mask[h];
                    for (var w = maskLeft * 4; w < maskRight * 4; w += 4) {
                        if (maskRow[w + 0] === 0) continue;
                        pixelRow[w + 0] = cacheRow[w + 0];
                        pixelRow[w + 1] = cacheRow[w + 1];
                        pixelRow[w + 2] = cacheRow[w + 2];
                        pixelRow[w + 3] = cacheRow[w + 3];
                    }
                }
            } else {
                for (var h = top; h < bottom; h++) {
                    const pixelRow = pixels[h], cacheRow = cache[h];
                    for (var w = left * 4; w < right * 4; w += 4) {
                        cacheRow[w + 0] = pixelRow[(right * 4 - 4 - w) + 0];
                        cacheRow[w + 1] = pixelRow[(right * 4 - 4 - w) + 1];
                        cacheRow[w + 2] = pixelRow[(right * 4 - 4 - w) + 2];
                        cacheRow[w + 3] = pixelRow[(right * 4 - 4 - w) + 3];
                    }
                }
                for (var h = top; h < bottom; h++) {
                    const pixelRow = pixels[h], cacheRow = cache[h];
                    for (var w = left * 4; w < right * 4; w += 4) {
                        pixelRow[w + 0] = cacheRow[w + 0];
                        pixelRow[w + 1] = cacheRow[w + 1];
                        pixelRow[w + 2] = cacheRow[w + 2];
                        pixelRow[w + 3] = cacheRow[w + 3];
                    }
                }
            }
            GUI.refleshSandwichAndFullCanvas();
        }
    }
    if (filterName == "yFlip") {
        if (layer.type == 圖層類型.影像) {
            var root = ToolSelector.project.layerManager, cache = root.cache.cache.d2;
            const pixels = layer.pixelData.d2;
            if (mask) {
                var maskTop = layer.height - 1, maskLeft = layer.width - 1, maskRight = 0, maskBottom = 0;
                for (var h = top; h < bottom; h++) {
                    for (var w = left * 4, w0 = left; w < right * 4; w += 4, w0++) {
                        if (mask[h][w + 0] === 0) continue;
                        if (h < maskTop) maskTop = h;
                        if (w0 < maskLeft) maskLeft = w0;
                        if (h > maskBottom) maskBottom = h;
                        if (w0 > maskRight) maskRight = w0;
                    }
                }
                for (var h = maskTop, h2 = maskBottom - 1; h < maskBottom; h++, h2--) {
                    const pixelRow = pixels[h], cacheRow = cache[h2], maskRow = mask[h];
                    for (var w = maskLeft * 4; w < maskRight * 4; w += 4) {
                        if (maskRow[w + 0] === 0) continue;
                        cacheRow[w + 0] = pixelRow[w + 0];
                        cacheRow[w + 1] = pixelRow[w + 1];
                        cacheRow[w + 2] = pixelRow[w + 2];
                        cacheRow[w + 3] = pixelRow[w + 3];
                    }
                }
                for (var h = maskTop; h < maskBottom; h++) {
                    const pixelRow = pixels[h], cacheRow = cache[h], maskRow = mask[h];
                    for (var w = maskLeft * 4; w < maskRight * 4; w += 4) {
                        if (maskRow[w + 0] === 0) continue;
                        pixelRow[w + 0] = cacheRow[w + 0];
                        pixelRow[w + 1] = cacheRow[w + 1];
                        pixelRow[w + 2] = cacheRow[w + 2];
                        pixelRow[w + 3] = cacheRow[w + 3];
                    }
                }
            } else {
                for (var h = top; h < bottom; h++) {
                    const pixelRow = pixels[h], cacheRow = cache[bottom - 1 - h];
                    for (var w = left * 4; w < right * 4; w += 4) {
                        cacheRow[w + 0] = pixelRow[w + 0];
                        cacheRow[w + 1] = pixelRow[w + 1];
                        cacheRow[w + 2] = pixelRow[w + 2];
                        cacheRow[w + 3] = pixelRow[w + 3];
                    }
                }
                for (var h = top; h < bottom; h++) {
                    const pixelRow = pixels[h], cacheRow = cache[h];
                    for (var w = left * 4; w < right * 4; w += 4) {
                        pixelRow[w + 0] = cacheRow[w + 0];
                        pixelRow[w + 1] = cacheRow[w + 1];
                        pixelRow[w + 2] = cacheRow[w + 2];
                        pixelRow[w + 3] = cacheRow[w + 3];
                    }
                }
            }
            GUI.refleshSandwichAndFullCanvas();
        }
    }
}

class Filter {
    static cache = null;
    static binarization = {
        name: "二質化",
        parm: { "門檻值": 128 },
        preview: false,
        lock: false,
        UIs: [
            { type: "slider", name: "門檻值", min: 0, max: 255, value: 128, default: 128 }, { type: "br", name: "換行", }, { type: "br", name: "換行", },
            { type: "bool", name: "使用調色盤色彩", min: 0, max: 1, value: 0, default: 0 }, { type: "br", name: "換行", }, { type: "br", name: "換行", },
            { type: "button", name: "取消❌", target: "cancel", },
            { type: "button", name: "確定✔️", target: "filter", }
        ],
        啟動時: [], 預覽時: [], 套用時: [], 關閉時: []
    }
    static rgbAdj = {
        name: "RGB色彩調整",
        parm: { "紅色": 0, "綠色": 0, "藍色": 0 },
        preview: false,
        lock: false,
        UIs: [
            { type: "slider", name: "紅色", min: -255, max: 255, value: 0, default: 0 }, { type: "br", name: "換行", }, { type: "br", name: "換行", },
            { type: "slider", name: "綠色", min: -255, max: 255, value: 0, default: 0 }, { type: "br", name: "換行", }, { type: "br", name: "換行", },
            { type: "slider", name: "藍色", min: -255, max: 255, value: 0, default: 0 }, { type: "br", name: "換行", }, { type: "br", name: "換行", },
            { type: "button", name: "取消❌", target: "cancel", },
            { type: "button", name: "確定✔️", target: "filter", }
        ],
    }
    static hsvAdj = {
        name: "色相、飽和度、明度",
        parm: { "色相": 0, "飽和度": 0, "明度": 0 },
        preview: false,
        lock: false,
        UIs: [
            { type: "slider", name: "色相", min: -180, max: 180, value: 0, default: 0 }, { type: "br", name: "換行", }, { type: "br", name: "換行", },
            { type: "slider", name: "飽和度", min: -100, max: 100, value: 0, default: 0 }, { type: "br", name: "換行", }, { type: "br", name: "換行", },
            { type: "slider", name: "明度", min: -100, max: 100, value: 0, default: 0 }, { type: "br", name: "換行", }, { type: "br", name: "換行", },
            { type: "button", name: "取消❌", target: "cancel", },
            { type: "button", name: "確定✔️", target: "filter", }
        ],
    }
    static colorTemperature = {
        name: "白平衡",
        parm: { "色溫": 0, "色澤": 0 },
        preview: false,
        lock: false,
        UIs: [
            { type: "slider", name: "色溫", min: -100, max: 100, value: 0, default: 0 }, { type: "br", name: "換行", }, { type: "br", name: "換行", },
            { type: "slider", name: "色澤", min: -100, max: 100, value: 0, default: 0 }, { type: "br", name: "換行", }, { type: "br", name: "換行", },
            { type: "button", name: "取消❌", target: "cancel", },
            { type: "button", name: "確定✔️", target: "filter", }
        ],
    }
    static brightnessContrast = {
        name: "亮度與對比度調整",
        parm: { "亮度": 0, "對比度": 0 },
        preview: false,
        lock: false,
        UIs: [
            { type: "slider", name: "亮度", min: -255, max: 255, value: 0, default: 0 }, { type: "br", name: "換行", }, { type: "br", name: "換行", },
            { type: "slider", name: "對比度", min: -255, max: 255, value: 0, default: 0 }, { type: "br", name: "換行", }, { type: "br", name: "換行", },
            { type: "button", name: "取消❌", target: "cancel", },
            { type: "button", name: "確定✔️", target: "filter", }
        ],
    }
    static Posterization = {
        name: "色調分離",
        parm: { "色彩數": 8 },
        preview: false,
        lock: false,
        UIs: [
            { type: "slider", name: "色彩數", min: 2, max: 128, value: 8, default: 8 }, { type: "br", name: "換行", }, { type: "br", name: "換行", },
            { type: "button", name: "取消❌", target: "cancel", },
            { type: "button", name: "確定✔️", target: "filter", }
        ],
    }
    static glassBlur = {
        name: "玻璃模糊",
        parm: { "強度": 5 },
        preview: false,
        lock: false,
        UIs: [
            { type: "slider", name: "強度", min: 0, max: 10, value: 5, default: 5 }, { type: "br", name: "換行", }, { type: "br", name: "換行", },
            { type: "button", name: "取消❌", target: "cancel", },
            { type: "button", name: "確定✔️", target: "filter", }
        ],
    }
    static mosaic = {
        name: "馬賽克",
        parm: { "大小": 15 },
        preview: false,
        lock: false,
        UIs: [
            { type: "slider", name: "大小", min: 1, max: 100, value: 15, default: 15 }, { type: "br", name: "換行", }, { type: "br", name: "換行", },
            { type: "button", name: "取消❌", target: "cancel", },
            { type: "button", name: "確定✔️", target: "filter", }
        ],
    }
    static tile = {
        name: "磁磚",
        parm: { "大小": 60 },
        parm: { "陰影深度": 10 },
        preview: false,
        lock: false,
        UIs: [
            { type: "slider", name: "大小", min: 5, max: 100, value: 60, default: 60 }, { type: "br", name: "換行", }, { type: "br", name: "換行", },
            { type: "slider", name: "陰影深度", min: 0, max: 50, value: 10, default: 10 }, { type: "br", name: "換行", }, { type: "br", name: "換行", },
            { type: "button", name: "取消❌", target: "cancel", },
            { type: "button", name: "確定✔️", target: "filter", }
        ],
    }
    static emboss = {
        name: "浮雕",
        parm: { "距離": 10 },
        parm: { "角度": 45 },
        parm: { "灰階": 0 },
        preview: false,
        lock: false,
        UIs: [
            { type: "slider", name: "距離", min: 0, max: 50, value: 10, default: 10 }, { type: "br", name: "換行", }, { type: "br", name: "換行", },
            { type: "slider", name: "角度", min: 0, max: 360, value: 45, default: 45 }, { type: "br", name: "換行", }, { type: "br", name: "換行", },
            { type: "bool", name: "灰階", min: 0, max: 1, value: 0, default: 0 }, { type: "br", name: "換行", }, { type: "br", name: "換行", },
            { type: "button", name: "取消❌", target: "cancel", },
            { type: "button", name: "確定✔️", target: "filter", }
        ],
    }
    static noise = {
        name: "雜訊",
        parm: { "強度": 50 },
        preview: false,
        lock: false,
        UIs: [
            { type: "slider", name: "強度", min: 0, max: 100, value: 50, default: 50 }, { type: "br", name: "換行", }, { type: "br", name: "換行", },
            { type: "button", name: "取消❌", target: "cancel", },
            { type: "button", name: "確定✔️", target: "filter", }
        ],
    }
    static airbrush = {
        name: "噴槍",
        parm: { "距離": 8 },
        preview: false,
        lock: false,
        UIs: [
            { type: "slider", name: "距離", min: 1, max: 64, value: 16, default: 16 }, { type: "br", name: "換行", }, { type: "br", name: "換行", },
            { type: "button", name: "取消❌", target: "cancel", },
            { type: "button", name: "確定✔️", target: "filter", }
        ],
    }
}

// 讓某些按鈕按了可以啟動Filter的動作
function setStaticFilterTrigger() {
    var toolSpans = getClass("filter");
    for (const ToolElem of toolSpans) {
        const main = "filter", parm = ToolElem.id;
        getByid("" + ToolElem.id).onclick = function () { Command.cmd(main, parm); }
    }
}
setStaticFilterTrigger();

// 讓某些按鈕按了可以啟動Filter視窗的動作
function setWindowFilterTrigger() {
    var toolSpans = getClass("prefilter");
    for (const ToolElem of toolSpans) {
        getByid("" + ToolElem.id).onclick = function () {
            ToolSelector.filter = deepCloneJSON(Filter[this.id]);
            var window = new FilterWindow(ToolSelector.filter);
        }
    }
}
setWindowFilterTrigger(); 