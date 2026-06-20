
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
    if (ToolSelector.layer.type != 圖層類型.影像) return;
    var layer = ToolSelector.layer, [left, top, right, bottom] = [layer.x, layer.y, layer.x + layer.width, layer.y + layer.height], mask = null;
    const hasSelection = ToolSelector.hasSelection && ToolSelector.selection.getMap() ? true : false;
    const pixels = layer.pixelData.d2, root = ToolSelector.project.layerManager, cache = root.cache.cache.d2;
    const active = ToolSelector.project.layerManager.cache.active.d2;
    mask = hasSelection ? ToolSelector.selection.getMap().d2 : mask = new Uint8ClampedArray(bottom * 4).fill(255);
    if (filterName == "invertColor") invertColor(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask);
    if (filterName == "autoColorBalance") autoColorBalance(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask);
    if (filterName == "overexposed") overexposed(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask);
    if (filterName == "grayScale") grayScale(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask);
    if (filterName == "xFlip") xFlip(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask);
    if (filterName == "yFlip") yFlip(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask);
    if (filterName == "smooth") smooth(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask);
    if (filterName == "sharpening") sharpening(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask);
    if (filterName == "二質化") 二質化(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask);
    if (filterName == "噴槍") 噴槍(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask);
    if (filterName == "磁磚") 磁磚(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask);
    if (filterName == "浮雕") 浮雕(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask);
    if (filterName == "馬賽克") 馬賽克(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask);
    if (filterName == "玻璃模糊") 玻璃模糊(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask);
    if (filterName == "雜訊") 雜訊(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask);
    if (filterName == "白平衡") 白平衡(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask);
    if (filterName == "RGB色彩調整") RGB色彩調整(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask);
    if (filterName == "色相、飽和度、明度") 色相_飽和度_明度(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask);
    if (filterName == "色調分離·改") 色調分離改(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask);
    if (filterName == "亮度與對比度調整") 亮度與對比度調整(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask);
}
// 色彩反轉
function invertColor(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask) {
    for (var h = top; h < bottom; h++) {
        const pixelRow = pixels[h], maskRow = hasSelection ? mask[h] : mask;
        for (var w = left * 4; w < right * 4; w += 4) {
            if (maskRow[w + 0] === 0) continue;
            pixelRow[w + 0] = 255 - pixelRow[w + 0], pixelRow[w + 1] = 255 - pixelRow[w + 1], pixelRow[w + 2] = 255 - pixelRow[w + 2];
        }
    }
    GUI.refleshSandwichAndFullCanvas();
}
// 自動色彩平衡
function autoColorBalance(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask) {
    var totalR = 0, totalG = 0, totalB = 0, count = 0;
    for (var h = top; h < bottom; h++) {
        const pixelRow = pixels[h], maskRow = hasSelection ? mask[h] : mask;
        for (var w = left * 4; w < right * 4; w += 4) {
            if (maskRow[w + 0] === 0 || pixelRow[w + 3] === 0) continue;
            totalB += pixelRow[w + 0], totalG += pixelRow[w + 1], totalR += pixelRow[w + 2], count++;
        }
    }
    count || count++; // 避免除以0
    var avgB = totalB / count, avgG = totalG / count, avgR = totalR / count;
    var K = (avgB + avgG + avgR) / 3, kB = K / avgB, kG = K / avgG, kR = K / avgR;

    for (var h = top; h < bottom; h++) {
        const pixelRow = pixels[h], maskRow = hasSelection ? mask[h] : mask;
        for (var w = left * 4; w < right * 4; w += 4) {
            if (maskRow[w + 0] === 0) continue;
            pixelRow[w + 0] *= kB, pixelRow[w + 1] *= kG, pixelRow[w + 2] *= kR;
        }
    }
    GUI.refleshSandwichAndFullCanvas();
}
// 曝光過度
function overexposed(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask) {
    for (var h = top; h < bottom; h++) {
        const pixelRow = pixels[h], maskRow = hasSelection ? mask[h] : mask;
        for (var w = left * 4; w < right * 4; w += 4) {
            if (maskRow[w + 0] === 0) continue;
            pixelRow[w + 0] = Math.abs(128 - Math.abs(128 - pixelRow[w + 0]));
            pixelRow[w + 1] = Math.abs(128 - Math.abs(128 - pixelRow[w + 1]));
            pixelRow[w + 2] = Math.abs(128 - Math.abs(128 - pixelRow[w + 2]));
        }
    }
    GUI.refleshSandwichAndFullCanvas();
}
// 灰階
function grayScale(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask) {
    for (var h = top; h < bottom; h++) {
        const pixelRow = pixels[h], maskRow = hasSelection ? mask[h] : mask;
        for (var w = left * 4; w < right * 4; w += 4) {
            if (maskRow[w + 0] === 0) continue;
            const grayColor = (0.114 * pixelRow[w + 0] + 0.587 * pixelRow[w + 1] + 0.299 * pixelRow[w + 2]) | 0;
            pixelRow[w + 0] = pixelRow[w + 1] = pixelRow[w + 2] = grayColor;
        }
    }
    GUI.refleshSandwichAndFullCanvas();
}
// 水平翻轉
function xFlip(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask) {
    if (hasSelection) {
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
// 垂直翻轉
function yFlip(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask) {
    if (hasSelection) {
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
// 平滑化
function smooth(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask) {
    const idx = [0, 1, 2, 3, 4, 5, 6, 7, 8], k = 4;

    for (var h = top; h < bottom; h++) {
        const pixelRow = pixels[h], cacheRow = cache[h];
        for (var w = left * 4; w < right * 4; w += 4) {
            cacheRow[w + 0] = pixelRow[w + 0], cacheRow[w + 1] = pixelRow[w + 1], cacheRow[w + 2] = pixelRow[w + 2], cacheRow[w + 3] = pixelRow[w + 3];
        }
    }

    for (var h = top + 1; h < bottom - 1; h++) {
        const pixelRow = pixels[h], NcacheRow = cache[h], PcacheRow = cache[h - 1], LcacheRow = cache[h + 1], maskRow = hasSelection ? mask[h] : mask;
        for (var w = left * 4 + 4, w0 = left; w < right * 4 - 4; w += 4, w0++) {
            if (maskRow[w + 0] === 0) continue;
            const nums = [
                PcacheRow[w - 4] + PcacheRow[w - 4 + 1] + PcacheRow[w - 4 + 2], PcacheRow[w] + PcacheRow[w + 1] + PcacheRow[w + 2], PcacheRow[w + 4] + PcacheRow[w + 4 + 1] + PcacheRow[w + 4 + 2],
                NcacheRow[w - 4] + NcacheRow[w - 4 + 1] + NcacheRow[w - 4 + 2], NcacheRow[w] + NcacheRow[w + 1] + NcacheRow[w + 2], NcacheRow[w + 4] + NcacheRow[w + 4 + 1] + NcacheRow[w + 4 + 2],
                LcacheRow[w - 4] + LcacheRow[w - 4 + 1] + LcacheRow[w - 4 + 2], LcacheRow[w] + LcacheRow[w + 1] + LcacheRow[w + 2], LcacheRow[w + 4] + LcacheRow[w + 4 + 1] + LcacheRow[w + 4 + 2]
            ]
            for (let i = 0; i <= k; i++) {
                let maxJ = i, maxVal = nums[idx[i]], temp;
                // 找出剩下的數字中最大的一個
                for (let j = i + 1; j < 9; j++) {
                    if (nums[idx[j]] > maxVal) maxVal = nums[idx[j]], maxJ = j;
                }
                // 交換 Index
                if (maxJ !== i) temp = idx[i], idx[i] = idx[maxJ], idx[maxJ] = temp;
            }
            switch (idx[k]) {
                case 0: r = PcacheRow[w - 4], g = PcacheRow[w - 4 + 1], b = PcacheRow[w - 4 + 2]; break;
                case 1: r = PcacheRow[w + 0], g = PcacheRow[w + 1 + 0], b = PcacheRow[w + 2 + 0]; break;
                case 2: r = PcacheRow[w + 4], g = PcacheRow[w + 4 + 1], b = PcacheRow[w + 4 + 2]; break;
                case 3: r = NcacheRow[w - 4], g = NcacheRow[w - 4 + 1], b = NcacheRow[w - 4 + 2]; break;
                case 4: r = NcacheRow[w + 0], g = NcacheRow[w + 1 + 0], b = NcacheRow[w + 2 + 0]; break;
                case 5: r = NcacheRow[w + 4], g = NcacheRow[w + 4 + 1], b = NcacheRow[w + 4 + 2]; break;
                case 6: r = LcacheRow[w - 4], g = LcacheRow[w - 4 + 1], b = LcacheRow[w - 4 + 2]; break;
                case 7: r = LcacheRow[w + 0], g = LcacheRow[w + 1 + 0], b = LcacheRow[w + 2 + 0]; break;
                case 8: r = LcacheRow[w + 4], g = LcacheRow[w + 4 + 1], b = LcacheRow[w + 4 + 2]; break;
            }
            pixelRow[w + 0] = r, pixelRow[w + 1] = g, pixelRow[w + 2] = b;
        }
    }
    GUI.refleshSandwichAndFullCanvas();
}
// 銳利化
function sharpening(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask) {
    for (var h = top; h < bottom; h++) {
        const pixelRow = pixels[h], cacheRow = cache[h];
        for (var w = left * 4; w < right * 4; w += 4) {
            cacheRow[w + 0] = pixelRow[w + 0], cacheRow[w + 1] = pixelRow[w + 1], cacheRow[w + 2] = pixelRow[w + 2], cacheRow[w + 3] = pixelRow[w + 3];
        }
    }
    for (var h = top + 1; h < bottom - 1; h++) {
        const pixelRow = pixels[h], maskRow = hasSelection ? mask[h] : mask;
        for (var w = left * 4 + 4; w < right * 4 - 4; w += 4) {
            if (maskRow[w + 0] === 0) continue;
            pixelRow[w + 0] += -cache[h - 1][(w) + 0] - cache[h + 1][(w) + 0] - cache[h][(w + 4) + 0] - cache[h][(w - 4) + 0] + (cache[h][(w) + 0] * 4);
            pixelRow[w + 1] += -cache[h - 1][(w) + 1] - cache[h + 1][(w) + 1] - cache[h][(w + 4) + 1] - cache[h][(w - 4) + 1] + (cache[h][(w) + 1] * 4);
            pixelRow[w + 2] += -cache[h - 1][(w) + 2] - cache[h + 1][(w) + 2] - cache[h][(w + 4) + 2] - cache[h][(w - 4) + 2] + (cache[h][(w) + 2] * 4);
        }
    }
    GUI.refleshSandwichAndFullCanvas();
}
function 二質化(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask) {
    const preview = ToolSelector.filter.preview, 門檻值 = parseInt(ToolSelector.filter.門檻值);
    var color1 = new Color(255, 255, 255, 255), color2 = new Color(0, 0, 0, 255);
    if (ToolSelector.filter.使用調色盤色彩 == true) { color1 = ToolSelector.前背透色[0], color2 = ToolSelector.前背透色[1]; }

    const fcache = Filter.cache.d2, FL = preview ? (1 / 255.0) : 1;
    const R1 = color1.r * FL, G1 = color1.g * FL, B1 = color1.b * FL, R2 = color2.r * FL, G2 = color2.g * FL, B2 = color2.b * FL;
    for (var h = top; h < bottom; h++) {
        const tragetRow = preview ? active[h] : pixels[h], cacheRow = fcache[h], maskRow = hasSelection ? mask[h] : mask;
        for (var w = left * 4; w < right * 4; w += 4) {
            if (maskRow[w + 0] === 0) {
                if (preview) tragetRow[w + 0] = cacheRow[w + 0] * FL, tragetRow[w + 1] = cacheRow[w + 1] * FL, tragetRow[w + 2] = cacheRow[w + 2] * FL, tragetRow[w + 3] = cacheRow[w + 3] * FL;
                continue;
            }
            const grayColor = (0.114 * cacheRow[w + 0] + 0.587 * cacheRow[w + 1] + 0.299 * cacheRow[w + 2]) | 0;
            if (grayColor > 門檻值)
                tragetRow[w + 0] = R1, tragetRow[w + 1] = G1, tragetRow[w + 2] = B1;
            else
                tragetRow[w + 0] = R2, tragetRow[w + 1] = G2, tragetRow[w + 2] = B2;
            if (preview) tragetRow[w + 3] = cacheRow[w + 3] * FL;
        }
    }

    if (preview) GUI.refleshFullCanvas();
    else GUI.refleshSandwichAndFullCanvas();
}
// 還需要確定的偽亂數
function 噴槍(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask) {
    const preview = ToolSelector.filter.preview, 距離 = parseInt(ToolSelector.filter.距離);
    const width = layer.width, height = layer.height;

    var x = 0, y = 0;
    const fcache = Filter.cache.d2, FL = preview ? (1 / 255.0) : 1;
    for (var h = top; h < bottom; h++) {
        const tragetRow = preview ? active[h] : pixels[h], cacheRow = fcache[h], maskRow = hasSelection ? mask[h] : mask;
        for (var w = left * 4, w0 = left; w < right * 4; w += 4, w0++) {
            if (maskRow[w + 0] === 0) {
                if (preview) tragetRow[w + 0] = cacheRow[w + 0] * FL, tragetRow[w + 1] = cacheRow[w + 1] * FL, tragetRow[w + 2] = cacheRow[w + 2] * FL, tragetRow[w + 3] = cacheRow[w + 3] * FL;
                continue;
            }
            x = (Math.random() * 距離 * 2 - 距離) | 0, y = (Math.random() * 距離 * 2 - 距離) | 0;
            y = h + y < 0 ? -h : (h + y >= height ? height - h - 1 : y);
            x = w0 + x < 0 ? -w0 : (w0 + x >= width ? width - w0 - 1 : x);
            if (fcache[h + y][w + x * 4 + 3] == 0) x = y = 0;
            tragetRow[w + 0] = fcache[h + y][w + x * 4] * FL;
            tragetRow[w + 1] = fcache[h + y][w + x * 4 + 1] * FL;
            tragetRow[w + 2] = fcache[h + y][w + x * 4 + 2] * FL;
            if (preview) tragetRow[w + 3] = cacheRow[w + 3] * FL;
        }
    }

    if (preview) GUI.refleshFullCanvas();
    else GUI.refleshSandwichAndFullCanvas();
}
function 磁磚(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask) {
    const preview = ToolSelector.filter.preview;
    var 大小 = parseInt(ToolSelector.filter.大小), 陰影深度 = parseInt(ToolSelector.filter.陰影深度);
    const width = layer.width, height = layer.height;

    var value = 大小, value2 = 陰影深度;
    const recSize = value * value;
    const channel = 4, Stride = width * channel;

    var x = 0, y = 0, x2 = 0; var y2 = 0, B = 0, G = 0, R = 0;
    // 照搬C++語言寫的PhotEgg，請留意RGB順序
    const fcache = Filter.cache.d1, activeD1 = ToolSelector.project.layerManager.cache.active.d1;
    if (preview) for (var i = 0; i < fcache.length; i++)activeD1[i] = layer.pixelData.d1[i];
    const target = preview ? active : pixels;
    for (y = top; y < bottom; y += value) {
        for (x = left * 4; x < right * 4; x += value * 4) {
            for (y2 = 0; y2 <= value; y2++) {
                for (x2 = 0; x2 <= value2 * channel; x2 += channel) {
                    if (y + y2 < 0 || y + y2 >= height || x + x2 < 0 || x + x2 >= Stride) continue;
                    B = target[y + y2][x + x2] * (x2 / channel) / value2 + 255 * (value2 - x2 / 4) / value2;
                    G = target[y + y2][x + x2 + 1] * (x2 / channel) / value2 + 255 * (value2 - x2 / 4) / value2;
                    R = target[y + y2][x + x2 + 2] * (x2 / channel) / value2 + 255 * (value2 - x2 / 4) / value2;
                    target[y + y2][x + x2] = B > 255 ? 255 : (B < 0 ? 0 : B);
                    target[y + y2][x + x2 + 1] = G > 255 ? 255 : (G < 0 ? 0 : G);
                    target[y + y2][x + x2 + 2] = R > 255 ? 255 : (R < 0 ? 0 : R);
                    target[y + y2][x + x2 + 3] = target[y + y2][x + x2 + 3];
                }
            }
            for (y2 = 0; y2 <= value2; y2++) {
                for (x2 = 0; x2 <= value * channel; x2 += channel) {
                    if (y + y2 < 0 || y + y2 >= height || x + x2 < 0 || x + x2 >= Stride) continue;
                    B = target[y + y2][x + x2] * (y2) / value2 + 255 * (value2 - y2) / value2;
                    G = target[y + y2][x + x2 + 1] * (y2) / value2 + 255 * (value2 - y2) / value2;
                    R = target[y + y2][x + x2 + 2] * (y2) / value2 + 255 * (value2 - y2) / value2;
                    target[y + y2][x + x2] = B > 255 ? 255 : (B < 0 ? 0 : B);
                    target[y + y2][x + x2 + 1] = G > 255 ? 255 : (G < 0 ? 0 : G);
                    target[y + y2][x + x2 + 2] = R > 255 ? 255 : (R < 0 ? 0 : R);
                    target[y + y2][x + x2 + 3] = target[y + y2][x + x2 + 3];
                }
            }
            for (y2 = 0; y2 <= value; y2++) {
                for (x2 = (value - value2) * channel; x2 <= value * channel; x2 += channel) {
                    if (y + y2 < 0 || y + y2 >= height || x + x2 < 0 || x + x2 >= Stride) continue;
                    var temptra = x2 - ((value - value2) * channel);
                    B = target[y + y2][x + x2] * (value2 - temptra / channel) / value2 + (temptra / channel) / value2;
                    G = target[y + y2][x + x2 + 1] * (value2 - temptra / channel) / value2 + (temptra / channel) / value2;
                    R = target[y + y2][x + x2 + 2] * (value2 - temptra / channel) / value2 + (temptra / channel) / value2;
                    target[y + y2][x + x2] = B > 255 ? 255 : (B < 0 ? 0 : B);
                    target[y + y2][x + x2 + 1] = G > 255 ? 255 : (G < 0 ? 0 : G);
                    target[y + y2][x + x2 + 2] = R > 255 ? 255 : (R < 0 ? 0 : R);
                    target[y + y2][x + x2 + 3] = target[y + y2][x + x2 + 3];
                }
            }
            for (y2 = (value - value2); y2 <= value; y2++) {
                for (x2 = 0; x2 <= value * channel; x2 += channel) {
                    if (y + y2 < 0 || y + y2 >= height || x + x2 < 0 || x + x2 >= Stride) continue;
                    var temptra = (y2 - (value - value2)) * channel;
                    B = target[y + y2][x + x2] * (value2 - temptra / channel) / value2 + (temptra / channel) / value2;
                    G = target[y + y2][x + x2 + 1] * (value2 - temptra / channel) / value2 + (temptra / channel) / value2;
                    R = target[y + y2][x + x2 + 2] * (value2 - temptra / channel) / value2 + (temptra / channel) / value2;
                    target[y + y2][x + x2] = B > 255 ? 255 : (B < 0 ? 0 : B);
                    target[y + y2][x + x2 + 1] = G > 255 ? 255 : (G < 0 ? 0 : G);
                    target[y + y2][x + x2 + 2] = R > 255 ? 255 : (R < 0 ? 0 : R);
                    target[y + y2][x + x2 + 3] = target[y + y2][x + x2 + 3];
                }
            }
        }
    }

    if (preview) for (var i = 0; i < activeD1.length; i++)activeD1[i] = activeD1[i] / 255.0;
    if (preview) GUI.refleshFullCanvas();
    else GUI.refleshSandwichAndFullCanvas();
}
function 浮雕(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask) {
    const preview = ToolSelector.filter.preview;
    var 距離 = parseInt(ToolSelector.filter.距離), 角度 = parseInt(ToolSelector.filter.角度), 灰階 = ToolSelector.filter.灰階 == true;
    const width = layer.width, height = layer.height;

    var y = (距離 * Math.cos(角度 * Math.PI / 180)) | 0, x = (距離 * Math.sin(角度 * Math.PI / 180)) | 0, x4 = x * 4;
    const fcache = Filter.cache.d2, FL = preview ? (1 / 255.0) : 1;
    if (!灰階) {
        for (var h = top; h < bottom; h++) {
            const tragetRow = preview ? active[h] : pixels[h], cacheRow = fcache[h], maskRow = hasSelection ? mask[h] : mask;
            for (var w = left * 4, w0 = left; w < right * 4; w += 4, w0++) {
                if (maskRow[w + 0] === 0) {
                    if (preview) tragetRow[w + 0] = cacheRow[w + 0] * FL, tragetRow[w + 1] = cacheRow[w + 1] * FL, tragetRow[w + 2] = cacheRow[w + 2] * FL, tragetRow[w + 3] = cacheRow[w + 3] * FL;
                    continue;
                }
                if (h + y < 0 || w0 + x < 0 || h + y >= height || w0 + x >= width)
                    var gray = 0.114 * cacheRow[w] + 0.587 * cacheRow[w + 1] + 0.299 * cacheRow[w + 2];
                else
                    var gray = 0.114 * fcache[h + y][w + x4] + 0.587 * fcache[h + y][w + x4 + 1] + 0.299 * fcache[h + y][w + x4 + 2];
                var R = (255 - gray + cacheRow[w]) / 2, G = (255 - gray + cacheRow[w + 1]) / 2, B = (255 - gray + cacheRow[w + 2]) / 2;
                gray = (B + G + R) / 3, B = B * 2 - gray, G = G * 2 - gray, R = R * 2 - gray;
                R = R > 255 ? 255 : (R < 0 ? 0 : R), G = G > 255 ? 255 : (G < 0 ? 0 : G), B = B > 255 ? 255 : (B < 0 ? 0 : B);
                tragetRow[w + 0] = R * FL, tragetRow[w + 1] = G * FL, tragetRow[w + 2] = B * FL;
                if (preview) tragetRow[w + 3] = cacheRow[w + 3] * FL;
            }
        }
    } else {
        for (var h = top; h < bottom; h++) {
            const tragetRow = preview ? active[h] : pixels[h], cacheRow = fcache[h], maskRow = hasSelection ? mask[h] : mask;
            for (var w = left * 4, w0 = left; w < right * 4; w += 4, w0++) {
                if (maskRow[w + 0] === 0) {
                    if (preview) tragetRow[w + 0] = cacheRow[w + 0] * FL, tragetRow[w + 1] = cacheRow[w + 1] * FL, tragetRow[w + 2] = cacheRow[w + 2] * FL, tragetRow[w + 3] = cacheRow[w + 3] * FL;
                    continue;
                }
                const y_ = (h + y < 0 || h + y >= height) ? 0 : y, x_ = (w0 + x < 0 || w0 + x >= width) ? 0 : x4;
                tragetRow[w + 0] = (((255 - fcache[h][w]) + fcache[h + y_][w + x_]) / 2) * FL;
                tragetRow[w + 1] = (((255 - fcache[h][w + 1]) + fcache[h + y_][w + x_ + 1]) / 2) * FL;
                tragetRow[w + 2] = (((255 - fcache[h][w + 2]) + fcache[h + y_][w + x_ + 2]) / 2) * FL;
                if (preview) tragetRow[w + 3] = cacheRow[w + 3] * FL;
            }
        }
    }
    if (preview) GUI.refleshFullCanvas();
    else GUI.refleshSandwichAndFullCanvas();
}
function 馬賽克(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask) {
    const preview = ToolSelector.filter.preview, kernel = parseInt(ToolSelector.filter.大小);
    const width = layer.width, height = layer.height
    const FL = preview ? (1 / 255.0) : 1;
    var B, G, R, count;
    for (var h = top; h < bottom; h += kernel) {
        for (var w = left * 4; w < right * 4; w += 4 * kernel) {
            B = G = R = count = 0;
            for (var kh = 0; kh < kernel; kh++) {
                const pixelRow = pixels[h + kh];
                for (var kw = 0; kw < kernel * 4; kw += 4) {
                    if (h + kh >= height || w + kw >= width * 4) continue;
                    B += pixelRow[w + kw + 0], G += pixelRow[w + kw + 1], R += pixelRow[w + kw + 2];
                    count++;
                }
            }
            B /= count, G /= count, R /= count;
            for (var kh = 0; kh < kernel; kh++) {
                const tragetRow = preview ? active[h + kh] : pixels[h + kh], pixelRow = pixels[h + kh], maskRow = hasSelection ? mask[h + kh] : mask;
                for (var kw = 0; kw < kernel * 4; kw += 4) {
                    if (h + kh >= height || w + kw >= width * 4) continue;
                    if (maskRow[w + kw + 0] === 0) {
                        if (preview) {
                            tragetRow[w + kw + 0] = pixelRow[w + kw + 0] * FL;
                            tragetRow[w + kw + 1] = pixelRow[w + kw + 1] * FL;
                            tragetRow[w + kw + 2] = pixelRow[w + kw + 2] * FL;
                            tragetRow[w + kw + 3] = pixelRow[w + kw + 3] * FL;
                        }
                        continue;
                    }
                    tragetRow[w + kw + 0] = B * FL, tragetRow[w + kw + 1] = G * FL, tragetRow[w + kw + 2] = R * FL;
                    if (preview) tragetRow[w + kw + 3] = pixelRow[w + kw + 3] * FL;
                }
            }
        }
    }
    if (preview) GUI.refleshFullCanvas();
    else GUI.refleshSandwichAndFullCanvas();
}
function 玻璃模糊(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask) {
    var preview = ToolSelector.filter.preview, 強度 = parseFloat(ToolSelector.filter.強度);
    const width = layer.width, height = layer.height;

    for (var h = top; h < bottom; h++) {
        const activeRow = active[h], pixelRow = pixels[h], cacheRow = cache[h];
        for (var w = left * 4; w < right * 4; w += 4) {
            cacheRow[w + 0] = pixelRow[w + 0], cacheRow[w + 1] = pixelRow[w + 1], cacheRow[w + 2] = pixelRow[w + 2], cacheRow[w + 3] = pixelRow[w + 3];
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
                        B += cacheRow[x], G += cacheRow[x + 1], R += cacheRow[x + 2];
                        count++;
                    }
                }

                if (count === kernel_pow) B *= inv, G *= inv, R *= inv;
                else B /= count, G /= count, R /= count;

                for (y = h; y < limit_h; y++) {
                    const cacheRow = cache[y];
                    for (x = w; x < limit_w; x += 4) {
                        cacheRow[x] = B, cacheRow[x + 1] = G, cacheRow[x + 2] = R;
                    }
                }
            }
        }
    }

    //重複數次
    for (var i = 強度; i > 0; i -= 1)  mosaic(i);

    const FL = preview ? (1 / 255.0) : 1;
    for (var h = top; h < bottom; h++) {
        const tragetRow = preview ? active[h] : pixels[h], pixelRow = pixels[h], cacheRow = cache[h], maskRow = hasSelection ? mask[h] : mask;
        for (var w = left * 4, w0 = 0; w < right * 4; w += 4, w0++) {
            if (maskRow[w + 0] === 0) {
                if (preview) tragetRow[w + 0] = pixelRow[w + 0] * FL, tragetRow[w + 1] = pixelRow[w + 1] * FL, tragetRow[w + 2] = pixelRow[w + 2] * FL, tragetRow[w + 3] = pixelRow[w + 3] * FL;
                continue;
            }
            tragetRow[w + 0] = cacheRow[w + 0] * FL, tragetRow[w + 1] = cacheRow[w + 1] * FL, tragetRow[w + 2] = cacheRow[w + 2] * FL, tragetRow[w + 3] = pixelRow[w + 3] * FL;
        }
    }
    if (preview) GUI.refleshFullCanvas();
    else GUI.refleshSandwichAndFullCanvas();
}
function 雜訊(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask) {
    const preview = ToolSelector.filter.preview, 強度 = parseFloat(ToolSelector.filter.強度) / 100.0;
    const width = layer.width, height = layer.height;

    if (ACGM.temp.length != 3)
        ACGM.temp = [new NoiseList(0n).genList(width * height), new NoiseList(1n).genList(width * height), new NoiseList(2n).genList(width * height)];
    var [noiseListR, noiseListG, noiseListB] = [ACGM.temp[0], ACGM.temp[1], ACGM.temp[2]];

    const fcache = Filter.cache.d2, FL = preview ? (1 / 255.0) : 1;
    for (var h = top; h < bottom; h++) {
        const tragetRow = preview ? active[h] : pixels[h], cacheRow = fcache[h], stride = h * width, maskRow = hasSelection ? mask[h] : mask;
        for (var w = left * 4, w0 = 0; w < right * 4; w += 4, w0++) {
            if (maskRow[w + 0] === 0) {
                if (preview) tragetRow[w + 0] = cacheRow[w + 0] * FL, tragetRow[w + 1] = cacheRow[w + 1] * FL, tragetRow[w + 2] = cacheRow[w + 2] * FL, tragetRow[w + 3] = cacheRow[w + 3] * FL;
                continue;
            }
            tragetRow[w + 0] = ((cacheRow[w + 0] * (1 - 強度)) + (noiseListR[stride + w0] * 255 * 強度)) * FL;
            tragetRow[w + 1] = ((cacheRow[w + 1] * (1 - 強度)) + (noiseListG[stride + w0] * 255 * 強度)) * FL;
            tragetRow[w + 2] = ((cacheRow[w + 2] * (1 - 強度)) + (noiseListB[stride + w0] * 255 * 強度)) * FL;
            if (preview) tragetRow[w + 3] = cacheRow[w + 3] * FL;
        }
    }

    if (preview) GUI.refleshFullCanvas();
    else GUI.refleshSandwichAndFullCanvas();
}
function 白平衡(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask) {
    const preview = ToolSelector.filter.preview;
    var 色溫 = parseFloat(ToolSelector.filter.色溫) / 100.0, 色澤 = parseFloat(ToolSelector.filter.色澤) / 100.0;
    const 白平衡R = 1.0 + (色溫) + 色澤 / 2;
    const 白平衡G = 1.0 - (色澤) + 色溫 / 4;
    const 白平衡B = 1.0 - (色溫) + 色澤 / 4;

    const fcache = Filter.cache.d2, FL = preview ? (1 / 255.0) : 1;
    for (var h = top; h < bottom; h++) {
        const tragetRow = preview ? active[h] : pixels[h], cacheRow = fcache[h], maskRow = hasSelection ? mask[h] : mask;
        for (var w = left * 4; w < right * 4; w += 4) {
            if (maskRow[w + 0] === 0) {
                if (preview) tragetRow[w + 0] = cacheRow[w + 0] * FL, tragetRow[w + 1] = cacheRow[w + 1] * FL, tragetRow[w + 2] = cacheRow[w + 2] * FL, tragetRow[w + 3] = cacheRow[w + 3] * FL;
                continue;
            }
            tragetRow[w + 0] = (cacheRow[w + 0] * 白平衡R) * FL;
            tragetRow[w + 1] = (cacheRow[w + 1] * 白平衡G) * FL;
            tragetRow[w + 2] = (cacheRow[w + 2] * 白平衡B) * FL;
            if (preview) tragetRow[w + 3] = cacheRow[w + 3] * FL;
        }
    }
    if (preview) GUI.refleshFullCanvas();
    else GUI.refleshSandwichAndFullCanvas();
}
function RGB色彩調整(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask) {
    const preview = ToolSelector.filter.preview;
    var R = parseInt(ToolSelector.filter.紅色), G = parseInt(ToolSelector.filter.綠色), B = parseInt(ToolSelector.filter.藍色);
    const fcache = Filter.cache.d2, FL = preview ? (1 / 255.0) : 1;
    const clamp_ = preview ? clamp01 : x => x;
    for (var h = top; h < bottom; h++) {
        const tragetRow = preview ? active[h] : pixels[h], pixelRow = pixels[h], activeRow = active[h], cacheRow = fcache[h], maskRow = hasSelection ? mask[h] : mask;
        for (var w = left * 4; w < right * 4; w += 4) {
            if (maskRow[w + 0] === 0) {
                if (preview) tragetRow[w + 0] = cacheRow[w + 0] * FL, tragetRow[w + 1] = cacheRow[w + 1] * FL, tragetRow[w + 2] = cacheRow[w + 2] * FL, tragetRow[w + 3] = cacheRow[w + 3] * FL;
                continue;
            }
            tragetRow[w + 0] = clamp_((cacheRow[w + 0] + R) * FL);
            tragetRow[w + 1] = clamp_((cacheRow[w + 1] + G) * FL);
            tragetRow[w + 2] = clamp_((cacheRow[w + 2] + B) * FL);
            if (preview) tragetRow[w + 3] = cacheRow[w + 3] * FL;
        }
    }
    if (preview) GUI.refleshFullCanvas();
    else GUI.refleshSandwichAndFullCanvas();
}
function 色相_飽和度_明度(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask) {
    const preview = ToolSelector.filter.preview;
    var 色相 = parseInt(ToolSelector.filter.色相) / 360.0, 飽和度 = parseInt(ToolSelector.filter.飽和度) / 100.0, 明度 = parseInt(parseFloat(ToolSelector.filter.明度));
    const fcache = Filter.cache.d2, FL = preview ? (1 / 255.0) : 1;

    // 0~1, 0~1, 0~1
    function hsv2rgb(h, s, v) {
        var r, g, b, i, f, p, q, t;
        i = (h * 6) | 0, f = h * 6 - i, p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s);
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
        return [h, s, v]; // 0~1, 0~1, 0~255
    }

    for (var h = top; h < bottom; h++) {
        const tragetRow = preview ? active[h] : pixels[h], cacheRow = fcache[h], maskRow = hasSelection ? mask[h] : mask;
        for (var w = left * 4; w < right * 4; w += 4) {
            if (maskRow[w + 0] === 0) {
                if (preview) tragetRow[w + 0] = cacheRow[w + 0] * FL, tragetRow[w + 1] = cacheRow[w + 1] * FL, tragetRow[w + 2] = cacheRow[w + 2] * FL, tragetRow[w + 3] = cacheRow[w + 3] * FL;
                continue;
            }
            var [H, S, V] = rgb2hsv(cacheRow[w + 0], cacheRow[w + 1], cacheRow[w + 2])
            H = H + 色相, S = S + 飽和度, V = V + 明度;
            H = H % 360 < 0 ? (H % 360) + 360 : H % 360, S = S < 0 ? 0 : (S > 1 ? 1 : S), V = V < 0 ? 0 : (V > 255 ? 255 : V);
            var [r, g, b] = hsv2rgb(H, S, V / 255.0);
            tragetRow[w + 0] = r * FL, tragetRow[w + 1] = g * FL, tragetRow[w + 2] = b * FL;
            if (preview) tragetRow[w + 3] = cacheRow[w + 3] * FL;
        }
    }
    if (preview) GUI.refleshFullCanvas();
    else GUI.refleshSandwichAndFullCanvas();
}
function 色調分離改(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask) {
    const preview = ToolSelector.filter.preview, 色彩數 = parseInt(ToolSelector.filter.色彩數);

    const FL = preview ? (1 / 255.0) : 1;
    if (ToolSelector.filter.關鍵色 != true) {
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
        for (var h = top; h < bottom; h++) {
            const tragetRow = preview ? active[h] : pixels[h], pixelRow = pixels[h], maskRow = hasSelection ? mask[h] : mask;
            for (var w = left * 4; w < right * 4; w += 4) {
                if (maskRow[w + 0] === 0) {
                    if (preview) tragetRow[w + 0] = pixelRow[w + 0] * FL, tragetRow[w + 1] = pixelRow[w + 1] * FL, tragetRow[w + 2] = pixelRow[w + 2] * FL, tragetRow[w + 3] = pixelRow[w + 3] * FL;
                    continue;
                }
                tragetRow[w + 0] = colorList[pixelRow[w + 0]] * FL, tragetRow[w + 1] = colorList[pixelRow[w + 1]] * FL, tragetRow[w + 2] = colorList[pixelRow[w + 2]] * FL;
                if (preview) tragetRow[w + 3] = pixelRow[w + 3] * FL;
            }
        }
        if (preview) GUI.refleshFullCanvas();
        else GUI.refleshSandwichAndFullCanvas();
    }
    else {
        var K_value = 色彩數;
        const pixelsD1 = layer.pixelData.d1;
        var rList = [];
        for (var r = 0; r <= 255; r += 50) {
            var gList = [];
            for (var g = 0; g <= 255; g += 50) {
                var bList = [];
                for (var b = 0; b <= 255; b += 50)
                    bList.push([]);
                gList.push(bList);
            }
            rList.push(gList);
        }

        function distance(p1, p2) {
            let r = p1.r - p2.r, g = p1.g - p2.g, b = p1.b - p2.b;
            return Math.sqrt(r * r + g * g + b * b);
        }

        for (let i = 0; i < pixelsD1.length; i += 4) {
            let r = pixelsD1[i], g = pixelsD1[i + 1], b = pixelsD1[i + 2];
            rList[parseInt(r / 50)][parseInt(g / 50)][parseInt(b / 50)].push([r, g, b]);
        }

        var firstList = [];
        for (var r in rList) {
            for (var g in gList) {
                for (var b in bList) {
                    if (rList[r][g][b].length > 0) {
                        firstList.push(parseInt(rList[r][g][b].length));
                    }
                }
            }
        }
        var firstListColor = [];
        var firstList2 = firstList.sort((a, b) => a - b).reverse();
        for (var f in firstList2) {
            for (var r in rList) {
                for (var g in gList) {
                    for (var b in bList) {
                        if (rList[r][g][b].length == firstList2[f]) {
                            if (f < K_value) {//8
                                firstListColor.push([r, g, b]);
                            }
                        }
                    }
                }
            }
        }
        var centers = [];
        for (var colorList1 of firstListColor) {
            var colorList = rList[colorList1[0]][colorList1[1]][colorList1[2]];
            var r_count = 0, g_count = 0, b_count = 0;
            for (var color of colorList) {
                r_count += color[0], g_count += color[1], b_count += color[2];
            }
            var r_avg = parseInt(r_count / colorList.length);
            var g_avg = parseInt(g_count / colorList.length);
            var b_avg = parseInt(b_count / colorList.length);
            centers.push({ r: r_avg, g: g_avg, b: b_avg });
        }
        K_value = centers.length;
        var MinCenters = new Array(K_value);

        for (var h = top; h < bottom; h++) {
            const tragetRow = preview ? active[h] : pixels[h], pixelRow = pixels[h], maskRow = hasSelection ? mask[h] : mask;
            for (var w = left * 4; w < right * 4; w += 4) {
                if (maskRow[w + 0] === 0) {
                    if (preview) tragetRow[w + 0] = pixelRow[w + 0] * FL, tragetRow[w + 1] = pixelRow[w + 1] * FL, tragetRow[w + 2] = pixelRow[w + 2] * FL, tragetRow[w + 3] = pixelRow[w + 3] * FL;
                    continue;
                }
                for (var k = 0; k < K_value; k++) {
                    MinCenters[k] = (centers[k].r - pixelRow[w + 0]) ** 2 + (centers[k].g - pixelRow[w + 1]) ** 2 + (centers[k].b - pixelRow[w + 2]) ** 2;
                }
                var minCenter = MinCenters.indexOf(Math.min(...MinCenters));
                tragetRow[w + 0] = centers[minCenter].r * FL;
                tragetRow[w + 1] = centers[minCenter].g * FL;
                tragetRow[w + 2] = centers[minCenter].b * FL;
                if (preview) tragetRow[w + 3] = pixelRow[w + 3] * FL;
            }
        }
        if (preview) GUI.refleshFullCanvas();
        else GUI.refleshSandwichAndFullCanvas();
    }
}
function 亮度與對比度調整(layer, left, top, right, bottom, hasSelection, pixels, cache, active, mask) {
    const preview = ToolSelector.filter.preview;
    var brightness = parseInt(ToolSelector.filter.亮度), contrast = -parseInt(ToolSelector.filter.對比度);

    const fcache = Filter.cache.d2, FL = preview ? (1 / 255.0) : 1;
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

    for (var h = top; h < bottom; h++) {
        const tragetRow = preview ? active[h] : pixels[h], cacheRow = fcache[h], maskRow = hasSelection ? mask[h] : mask;
        for (var w = left * 4; w < right * 4; w += 4) {
            if (maskRow[w + 0] === 0) {
                if (preview) tragetRow[w + 0] = cacheRow[w + 0] * FL, tragetRow[w + 1] = cacheRow[w + 1] * FL, tragetRow[w + 2] = cacheRow[w + 2] * FL, tragetRow[w + 3] = cacheRow[w + 3] * FL;
                continue;
            }
            tragetRow[w + 0] = colorList[cacheRow[w + 0]] * FL, tragetRow[w + 1] = colorList[cacheRow[w + 1]] * FL, tragetRow[w + 2] = colorList[cacheRow[w + 2]] * FL;
            if (preview) tragetRow[w + 3] = cacheRow[w + 3] * FL;
        }
    }
    if (preview) GUI.refleshFullCanvas();
    else GUI.refleshSandwichAndFullCanvas();
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
        name: "色調分離·改",
        parm: { "色彩數": 8 },
        preview: false,
        lock: false,
        UIs: [
            { type: "slider", name: "色彩數", min: 2, max: 64, value: 8, default: 8 }, { type: "br", name: "換行", }, { type: "br", name: "換行", },
            { type: "bool", name: "關鍵色", min: 0, max: 1, value: 0, default: 0 }, { type: "br", name: "換行", }, { type: "br", name: "換行", },
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
    /*static smooth = {
        name: "平滑化",
        parm: { "強度": 5 },
        preview: false,
        lock: false,
        UIs: [
            { type: "slider", name: "強度", min: 1, max: 10, value: 5, default: 5 }, { type: "br", name: "換行", }, { type: "br", name: "換行", },
            { type: "button", name: "取消❌", target: "cancel", },
            { type: "button", name: "確定✔️", target: "filter", }
        ],
    }*/
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