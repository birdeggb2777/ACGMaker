

class 圖層類型 {
    static 影像 = 0;
    static 顏色 = 50;
    static 空 = 400;
}

class 混合模式 {
    static 普通 = 0;
    static 變暗 = 1;
    static 相乘 = 2;
    static 加深顏色 = 3;
    static 變亮 = 4;
    static 濾色 = 5;
    static 加亮顏色 = 6;
    static 覆蓋 = 7;
    static 柔光 = 8;
    static 實光 = 9;
    static 差異化 = 10;
    static 排除 = 11;
    static 色相 = 12;
    static 彩度 = 13;
    static 顏色 = 14;
    static 輝度 = 15;
    static 完全覆蓋 = 100;
    static 筆刷 = 201;
    static 連續塗抹 = 210;
    static 橡皮擦 = 251;
}

function ActiveData2PixelData(src, sx, sy, sWidth, sHeight, dst, dx, dy, dWidth, dHeight) {
    var root = ToolSelector.project.layerManager, cache = root.cache.cache.d2;
    var [left, top, right, bottom] = [dx, dy, dx + dWidth, dy + dHeight];

    // 邊界檢查
    left = clamp(left, 0, dst.w), top = clamp(top, 0, dst.h), right = clamp(right, 0, dst.w), bottom = clamp(bottom, 0, dst.h);

    // 計算縮放比例
    const 比例X = sWidth / dWidth, 比例Y = sHeight / dHeight;
    root.cache.cache.clear();
    for (let h = top; h < bottom; h++) {
        for (let w = left; w < right; w++) {
            // 計算對應來源影像的座標 (最近鄰法)
            const 來源X = clamp((sx + (w - dx) * 比例X) | 0, 0, src.w) * 4;
            const 來源Y = clamp((sy + (h - dy) * 比例Y) | 0, 0, src.h);
            if (src.d2[來源Y][來源X + 3] === 0) continue;
            // 1. 處理 dst 疊加到 cache (去除陣列解構，直接展開計算)
            const dstA = dst.d2[來源Y][來源X + 3] * inv255;
            const dstFactor = 1.0 - dstA;
            cache[來源Y][來源X + 0] = (dst.d2[來源Y][來源X + 0] * inv255 * dstA) + (cache[來源Y][來源X + 0] * dstFactor);
            cache[來源Y][來源X + 1] = (dst.d2[來源Y][來源X + 1] * inv255 * dstA) + (cache[來源Y][來源X + 1] * dstFactor);
            cache[來源Y][來源X + 2] = (dst.d2[來源Y][來源X + 2] * inv255 * dstA) + (cache[來源Y][來源X + 2] * dstFactor);
            cache[來源Y][來源X + 3] = dstA + (cache[來源Y][來源X + 3] * dstFactor);
            // 2. 處理 src 疊加到 cache
            const srcA = src.d2[來源Y][來源X + 3];
            const srcFactor = 1.0 - srcA;
            cache[來源Y][來源X + 0] = (src.d2[來源Y][來源X + 0] * srcA) + (cache[來源Y][來源X + 0] * srcFactor);
            cache[來源Y][來源X + 1] = (src.d2[來源Y][來源X + 1] * srcA) + (cache[來源Y][來源X + 1] * srcFactor);
            cache[來源Y][來源X + 2] = (src.d2[來源Y][來源X + 2] * srcA) + (cache[來源Y][來源X + 2] * srcFactor);
            cache[來源Y][來源X + 3] = srcA + (cache[來源Y][來源X + 3] * srcFactor);
            // 3. 反預乘並寫回 dst
            const a = cache[來源Y][來源X + 3];
            dst.d2[h][w * 4 + 0] = clamp255(a > 0 ? cache[來源Y][來源X + 0] / a : 0);
            dst.d2[h][w * 4 + 1] = clamp255(a > 0 ? cache[來源Y][來源X + 1] / a : 0);
            dst.d2[h][w * 4 + 2] = clamp255(a > 0 ? cache[來源Y][來源X + 2] / a : 0);
            dst.d2[h][w * 4 + 3] = clamp255(a);
        }
    }
}

// 假設src和dst都是0到255
function pastePixelData(來源, sx, sy, sWidth, sHeight, 目標, dx, dy, dWidth, dHeight, mixBlendMode = 0, pressure = 1.0) {
    var root = ToolSelector.project.layerManager, cache = root.cache.cache.d2, mask = null;
    var [left, top, right, bottom] = [dx, dy, dx + dWidth, dy + dHeight];
    if (ToolSelector.hasSelection && ToolSelector.selection.getMap()) mask = ToolSelector.selection.getMap().d2;

    // 邊界檢查
    left = clamp(left, 0, 目標.w), top = clamp(top, 0, 目標.h), right = clamp(right, 0, 目標.w), bottom = clamp(bottom, 0, 目標.h);

    // 計算縮放比例
    const 比例X = sWidth / dWidth, 比例Y = sHeight / dHeight;

    if (mask) {
        // 完全100%照搬，連透明都直接覆蓋
        switch (mixBlendMode) {
            case 混合模式.完全覆蓋:
                for (let h = top; h < bottom; h++) {
                    const maskRow = mask[h];
                    for (let w = left; w < right; w++) {
                        if (maskRow[w * 4 + 0] === 0) continue;
                        // 計算對應來源影像的座標 (最近鄰法)
                        const 來源X = clamp((sx + (w - dx) * 比例X) | 0, 0, 來源.w) * 4;
                        const 來源Y = clamp((sy + (h - dy) * 比例Y) | 0, 0, 來源.h);
                        目標.d2[h][w * 4 + 0] = (來源.d2[來源Y][來源X + 0]) | 0;
                        目標.d2[h][w * 4 + 1] = (來源.d2[來源Y][來源X + 1]) | 0;
                        目標.d2[h][w * 4 + 2] = (來源.d2[來源Y][來源X + 2]) | 0;
                        目標.d2[h][w * 4 + 3] = (來源.d2[來源Y][來源X + 3]) | 0;
                    }
                }
                break;
            case 混合模式.筆刷:
                for (let h = top; h < bottom; h++) {
                    const 來源Y = clamp((sy + (h - dy) * 比例Y) | 0, 0, 來源.h);
                    const target = 目標.d2[h], 來源Row = 來源.d2[來源Y], maskRow = mask[h];
                    for (let w = left, w4 = left * 4; w < right; w++, w4 += 4) {
                        if (maskRow[w4 + 0] === 0) continue;
                        const v = (sx + (w - dx) * 比例X) | 0;
                        const 來源X = v > 來源.w ? 來源.w : (v < 0 ? 0 : v) * 4;
                        if (來源Row[來源X + 3] * inv255 <= target[w4 + 3]) continue;
                        target[w4 + 0] = (來源Row[來源X + 0]) * inv255;
                        target[w4 + 1] = (來源Row[來源X + 1]) * inv255;
                        target[w4 + 2] = (來源Row[來源X + 2]) * inv255;
                        target[w4 + 3] = (來源Row[來源X + 3]) * inv255 * pressure;
                    }
                }
                break;
            case 混合模式.連續塗抹:
                for (let h = top; h < bottom; h++) {
                    const 來源Y = clamp((sy + (h - dy) * 比例Y) | 0, 0, 來源.h);
                    const target = 目標.d2[h], 來源Row = 來源.d2[來源Y], maskRow = mask[h];
                    for (let w = left, w4 = left * 4; w < right; w++, w4 += 4) {
                        if (maskRow[w4 + 0] === 0) continue;
                        const v = (sx + (w - dx) * 比例X) | 0;
                        const 來源X = v > 來源.w ? 來源.w : (v < 0 ? 0 : v) * 4;
                        if (來源Row[來源X + 3] * inv255 <= target[w4 + 3]) continue;
                        target[w4 + 0] = (來源Row[來源X + 0]) * inv255;
                        target[w4 + 1] = (來源Row[來源X + 1]) * inv255;
                        target[w4 + 2] = (來源Row[來源X + 2]) * inv255;
                        target[w4 + 3] += (來源Row[來源X + 3]) * inv255;
                    }
                }
                break;
            case 混合模式.橡皮擦:
                for (let h = top; h < bottom; h++) {
                    const 來源Y = clamp((sy + (h - dy) * 比例Y) | 0, 0, 來源.h);
                    const target = 目標.d2[h], 來源Row = 來源.d2[來源Y], maskRow = mask[h];
                    for (let w = left, w4 = left * 4; w < right; w++, w4 += 4) {
                        if (maskRow[w4 + 0] === 0) continue;
                        const v = (sx + (w - dx) * 比例X) | 0;
                        const 來源X = v > 來源.w ? 來源.w : (v < 0 ? 0 : v) * 4;
                        if (來源Row[來源X + 0] > 0) {
                            target[w4 + 3] -= 來源Row[來源X + 3] * pressure;
                        }
                    }
                }
                break;
            case 混合模式.普通:
                root.cache.cache.clear();
                for (let h = top; h < bottom; h++) {
                    const maskRow = mask[h];
                    for (let w = left; w < right; w++) {
                        if (maskRow[w * 4 + 0] === 0) continue;
                        const 來源X = clamp((sx + (w - dx) * 比例X) | 0, 0, 來源.w) * 4;
                        const 來源Y = clamp((sy + (h - dy) * 比例Y) | 0, 0, 來源.h);
                        if (來源.d2[來源Y][來源X + 3] === 0) continue;
                        const 來源的上層比重 = 來源.d2[來源Y][來源X + 3] * inv255, 來源的下層比重 = 1.0 - 來源的上層比重;
                        cache[來源Y][來源X + 0] = (來源.d2[來源Y][來源X + 0] * inv255 * 來源的上層比重) + (cache[來源Y][來源X + 0] * 來源的下層比重);
                        cache[來源Y][來源X + 1] = (來源.d2[來源Y][來源X + 1] * inv255 * 來源的上層比重) + (cache[來源Y][來源X + 1] * 來源的下層比重);
                        cache[來源Y][來源X + 2] = (來源.d2[來源Y][來源X + 2] * inv255 * 來源的上層比重) + (cache[來源Y][來源X + 2] * 來源的下層比重);
                        cache[來源Y][來源X + 3] = 來源的上層比重 + (cache[來源Y][來源X + 3] * 來源的下層比重);
                        const a = cache[來源Y][來源X + 3];
                        目標.d2[h][w * 4 + 0] = (a > 0 ? cache[來源Y][來源X + 0] / a : 0);
                        目標.d2[h][w * 4 + 1] = (a > 0 ? cache[來源Y][來源X + 1] / a : 0);
                        目標.d2[h][w * 4 + 2] = (a > 0 ? cache[來源Y][來源X + 2] / a : 0);
                        目標.d2[h][w * 4 + 3] = (a);
                    }
                }
                break;
        }
    }
    else {
        // 完全100%照搬，連透明都直接覆蓋
        switch (mixBlendMode) {
            case 混合模式.完全覆蓋:
                for (let h = top; h < bottom; h++) {
                    for (let w = left; w < right; w++) {
                        // 計算對應來源影像的座標 (最近鄰法)
                        const 來源X = clamp((sx + (w - dx) * 比例X) | 0, 0, 來源.w) * 4;
                        const 來源Y = clamp((sy + (h - dy) * 比例Y) | 0, 0, 來源.h);
                        目標.d2[h][w * 4 + 0] = (來源.d2[來源Y][來源X + 0]) | 0;
                        目標.d2[h][w * 4 + 1] = (來源.d2[來源Y][來源X + 1]) | 0;
                        目標.d2[h][w * 4 + 2] = (來源.d2[來源Y][來源X + 2]) | 0;
                        目標.d2[h][w * 4 + 3] = (來源.d2[來源Y][來源X + 3]) | 0;
                    }
                }
                break;
            case 混合模式.筆刷:
                for (let h = top; h < bottom; h++) {
                    const 來源Y = clamp((sy + (h - dy) * 比例Y) | 0, 0, 來源.h);
                    const target = 目標.d2[h], 來源Row = 來源.d2[來源Y];
                    for (let w = left, w4 = left * 4; w < right; w++, w4 += 4) {
                        const v = (sx + (w - dx) * 比例X) | 0;
                        const 來源X = v > 來源.w ? 來源.w : (v < 0 ? 0 : v) * 4;
                        if (來源Row[來源X + 3] * inv255 <= target[w4 + 3]) continue;
                        target[w4 + 0] = (來源Row[來源X + 0]) * inv255;
                        target[w4 + 1] = (來源Row[來源X + 1]) * inv255;
                        target[w4 + 2] = (來源Row[來源X + 2]) * inv255;
                        target[w4 + 3] = (來源Row[來源X + 3]) * inv255 * pressure;
                    }
                }
                break;
            case 混合模式.連續塗抹:
                for (let h = top; h < bottom; h++) {
                    const 來源Y = clamp((sy + (h - dy) * 比例Y) | 0, 0, 來源.h);
                    const target = 目標.d2[h], 來源Row = 來源.d2[來源Y];
                    for (let w = left, w4 = left * 4; w < right; w++, w4 += 4) {
                        const v = (sx + (w - dx) * 比例X) | 0;
                        const 來源X = v > 來源.w ? 來源.w : (v < 0 ? 0 : v) * 4;
                        if (來源Row[來源X + 3] * inv255 <= target[w4 + 3]) continue;
                        target[w4 + 0] = (來源Row[來源X + 0]) * inv255;
                        target[w4 + 1] = (來源Row[來源X + 1]) * inv255;
                        target[w4 + 2] = (來源Row[來源X + 2]) * inv255;
                        target[w4 + 3] += (來源Row[來源X + 3]) * inv255;
                    }
                }
                break;
            case 混合模式.橡皮擦:
                for (let h = top; h < bottom; h++) {
                    const 來源Y = clamp((sy + (h - dy) * 比例Y) | 0, 0, 來源.h);
                    const target = 目標.d2[h], 來源Row = 來源.d2[來源Y];
                    for (let w = left, w4 = left * 4; w < right; w++, w4 += 4) {
                        const v = (sx + (w - dx) * 比例X) | 0;
                        const 來源X = v > 來源.w ? 來源.w : (v < 0 ? 0 : v) * 4;
                        if (來源Row[來源X + 0] > 0) {
                            target[w4 + 3] -= 來源Row[來源X + 0] * pressure;
                        }
                    }
                }
                break;
            case 混合模式.普通:
                root.cache.cache.clear();
                for (let h = top; h < bottom; h++) {
                    for (let w = left; w < right; w++) {
                        // 計算對應來源影像的座標 (最近鄰法)
                        const 來源X = clamp((sx + (w - dx) * 比例X) | 0, 0, 來源.w) * 4;
                        const 來源Y = clamp((sy + (h - dy) * 比例Y) | 0, 0, 來源.h);
                        if (來源.d2[來源Y][來源X + 3] === 0) continue;
                        // 1. 將 目標 疊加到 cache
                        /*const 目標的上層比重 = 目標.d2[來源Y][來源X + 3] * inv255, 目標的下層比重 = 1.0 - 目標的上層比重;
                        cache[來源Y][來源X + 0] = (目標.d2[來源Y][來源X + 0] * inv255 * 目標的上層比重) + (cache[來源Y][來源X + 0] * 目標的下層比重);
                        cache[來源Y][來源X + 1] = (目標.d2[來源Y][來源X + 1] * inv255 * 目標的上層比重) + (cache[來源Y][來源X + 1] * 目標的下層比重);
                        cache[來源Y][來源X + 2] = (目標.d2[來源Y][來源X + 2] * inv255 * 目標的上層比重) + (cache[來源Y][來源X + 2] * 目標的下層比重);
                        cache[來源Y][來源X + 3] = 目標的上層比重 + (cache[來源Y][來源X + 3] * 目標的下層比重);*/
                        // 2. 將 來源 疊加到 cache
                        const 來源的上層比重 = 來源.d2[來源Y][來源X + 3] * inv255, 來源的下層比重 = 1.0 - 來源的上層比重;
                        cache[來源Y][來源X + 0] = (來源.d2[來源Y][來源X + 0] * inv255 * 來源的上層比重) + (cache[來源Y][來源X + 0] * 來源的下層比重);
                        cache[來源Y][來源X + 1] = (來源.d2[來源Y][來源X + 1] * inv255 * 來源的上層比重) + (cache[來源Y][來源X + 1] * 來源的下層比重);
                        cache[來源Y][來源X + 2] = (來源.d2[來源Y][來源X + 2] * inv255 * 來源的上層比重) + (cache[來源Y][來源X + 2] * 來源的下層比重);
                        cache[來源Y][來源X + 3] = 來源的上層比重 + (cache[來源Y][來源X + 3] * 來源的下層比重);
                        // 3. 反預乘並寫回 目標
                        const a = cache[來源Y][來源X + 3];
                        目標.d2[h][w * 4 + 0] = (a > 0 ? cache[來源Y][來源X + 0] / a : 0);
                        目標.d2[h][w * 4 + 1] = (a > 0 ? cache[來源Y][來源X + 1] / a : 0);
                        目標.d2[h][w * 4 + 2] = (a > 0 ? cache[來源Y][來源X + 2] / a : 0);
                        目標.d2[h][w * 4 + 3] = (a);
                    }
                }
                break;
        }
    }
}

// !注意是layer還是PixelData
function layers2flData(layers, d2) {
    if (!layers.length) return;
    var root = ToolSelector.project.layerManager, layers = layers.slice();

    if (root.cache.needReflesh == true) root.cache.needReflesh = new Rect(0, 0, root.width, root.height);
    // 需要更新的區域、並防止超出範圍
    var [left, top, right, bottom] = root.cache.needReflesh.toList();

    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        if (layer.type == 圖層類型.影像) {
            const 圖層透明度 = layer.opacity, width4 = right * 4;
            for (let h = top; h < bottom; h++) {
                const pixelDataD2H = layer.pixelData.d2[h];
                const d2H = d2[h];
                for (var w0 = left, w = left * 4; w0 < right; w0++, w += 4) {
                    if (pixelDataD2H[w + 3] === 0) continue;
                    const 上層比重 = pixelDataD2H[w + 3] * inv255 * 圖層透明度, 下層比重 = 1.0 - 上層比重;
                    const 混A的下層比重 = d2H[w + 3] * 下層比重, 混RGB的上層比重 = inv255 * 上層比重;
                    const outA = 上層比重 + (混A的下層比重), invOutA = 1.0 / outA;
                    if (outA === 0) { d2H[w + 0] = d2H[w + 1] = d2H[w + 2] = d2H[w + 3] = 0; continue; }
                    d2H[w + 0] = ((pixelDataD2H[w + 0] * 混RGB的上層比重) + (d2H[w + 0] * 混A的下層比重)) * invOutA;
                    d2H[w + 1] = ((pixelDataD2H[w + 1] * 混RGB的上層比重) + (d2H[w + 1] * 混A的下層比重)) * invOutA;
                    d2H[w + 2] = ((pixelDataD2H[w + 2] * 混RGB的上層比重) + (d2H[w + 2] * 混A的下層比重)) * invOutA;
                    d2H[w + 3] = outA;
                }
            }
        }
        else if (layer.type == "color") {
            const [r, g, b, a] = [layer.color.r, layer.color.g, layer.color.b, layer.color.a];
            const [normR, normG, normB, normA] = [r * inv255, g * inv255, b * inv255, a * inv255];
            const currentAlpha = normA * layer.opacity;
            for (var h = 0; h < root.height; h++) {
                for (var w = 0 * 4; w < root.width * 4; w += 4) {
                    // ！！！注意，我直接假設x,y為0，且當作沒有deep存在！！！
                    const [premulR, premulG, premulB] = [normR * currentAlpha, normG * currentAlpha, normB * currentAlpha];
                    // 混合 (Blend Over Operator)
                    const factor = 1.0 - currentAlpha;
                    d2[h][w + 0] = premulR + (d2[h][w + 0] * factor);
                    d2[h][w + 1] = premulG + (d2[h][w + 1] * factor);
                    d2[h][w + 2] = premulB + (d2[h][w + 2] * factor);
                    d2[h][w + 3] = currentAlpha + (d2[h][w + 3] * factor);
                }
            }
        }
    }
}

function createFullSandwich() {
    if (!ToolSelector?.project?.layerManager?.cache) return;
    ToolSelector.project.layerManager.cache.needReflesh = true;
    createSandwich();
}

// 建立三明治快取 
function createSandwich() {

    var root = ToolSelector.project.layerManager, layers = root.layers.slice(), index = -1;
    // 如果沒有處於需要快取的狀態，就不要浪費運算資源建立三明治快取
    if (!root.cache.needReflesh) return;

    // 沒顯示的不用考慮
    layers = layers.filter(el => el.display !== false);

    // 如果沒有圖層、或沒有選擇的圖層
    if (layers.length == 0 || !ToolSelector.layer) {
        root.cache.back.clear(); root.cache.front.clear(); root.cache.active.clear();
        root.cache.needReflesh = false;
        return;
    }
    // 如果只有一層圖層
    if (layers.length == 1) {
        root.cache.back.clear(); root.cache.front.clear(); root.cache.active.clear();
        var bottomLayers = [layers[0]].filter(el => el.display !== false);
        layers2flData(bottomLayers, root.cache.back.d2)
        root.cache.needReflesh = false;
        return;
    }

    ////////////////////////////////////////
    ////////////////////////////////////////

    // ！！！注意，暫時沒有考慮混合圖層！！！
    index = layers.findIndex((el) => el == ToolSelector.layer);

    // 清除上下層
    root.cache.front.clear(); root.cache.back.clear();

    // 預覽模式限定 (濾鏡等情況下層不能包含自己)
    if (root.cache.preview) {

        // index在最上層
        if (index == layers.length - 1) {
            // 建立下層快取(包含active，僅包含要顯示的)
            var bottomLayers = layers.slice(0, index);
            layers2flData(bottomLayers, root.cache.back.d2)
        }
        // index在最下層
        else if (index == 0) {
            // 清除下層(但又要包含自己)
            var bottomLayers = [layers[index + 1]];
            layers2flData(bottomLayers, root.cache.back.d2)
            // 建立上層快取(僅包含要顯示的)
            var topLayers = layers.slice(index + 2);
            layers2flData(topLayers, root.cache.front.d2)
        }
        // 其他大多數情況
        else {
            // 建立下層快取(包含active，僅包含要顯示的)
            var bottomLayers = layers.slice(0, index + 0);
            layers2flData(bottomLayers, root.cache.back.d2)
            // 建立上層快取(僅包含要顯示的)
            var topLayers = layers.slice(index + 1);
            layers2flData(topLayers, root.cache.front.d2);
        }
    }
    // 常見情況
    else {
        // index在最上層
        if (index == layers.length - 1) {
            // 建立下層快取(包含active，僅包含要顯示的)
            var bottomLayers = layers.slice(0, index + 1);
            layers2flData(bottomLayers, root.cache.back.d2)
        }
        // index在最下層
        else if (index == 0) {
            // 清除下層(但又要包含自己)
            var bottomLayers = [layers[index]];
            layers2flData(bottomLayers, root.cache.back.d2)
            // 建立上層快取(僅包含要顯示的)
            var topLayers = layers.slice(index + 1);
            layers2flData(topLayers, root.cache.front.d2)
        }
        // 其他大多數情況
        else {
            // 建立下層快取(包含active，僅包含要顯示的)
            var bottomLayers = layers.slice(0, index + 1);
            layers2flData(bottomLayers, root.cache.back.d2)
            // 建立上層快取(僅包含要顯示的)
            var topLayers = layers.slice(index + 1);
            layers2flData(topLayers, root.cache.front.d2);
        }
    }

    //中層也要清除
    root.cache.active.clear();
    root.cache.needReflesh = false;
}

function refleshLayerManager(root) {
    var layers = root.layers.slice();
    if (!root.needRefleshRect) return;
    if (root.needRefleshRect == true) root.needRefleshRect = new Rect(0, 0, root.width, root.height);

    // 需要更新的區域、並防止超出範圍
    var [left, top, right, bottom] = root.needRefleshRect.toList();
    left = clamp(left, 0, root.width), top = clamp(top, 0, root.height);
    right = clamp(right, 0, root.width), bottom = clamp(bottom, 0, root.height);

    // 如果沒有任何圖層
    if (layers.length == 0) {
        root.result.clear();
        root.needRefleshRect = false;
        return;
    }

    // 我認為需要嚴格指出，圖層數量大於0的情況才做出動作，因為圖層數量可以是負的
    // 這邊假設已經有三明治快取被建立了，若沒有建立就調用，出錯是你家的事情。
    root.cache.cache.clear();
    var cache = root.cache.cache.d2;
    // 如果連選取層都不顯示，該層就什麼都不要顯示
    const sandwich = !ToolSelector.layer.display ? [root.cache.back, root.cache.front] : [root.cache.back, root.cache.active, root.cache.front];
    // 合併
    const 圖層透明度 = 1.0, left4 = left * 4, right4 = right * 4;

    for (let i = 0; i < sandwich.length; i++) {
        const layer = sandwich[i], layerD2 = layer.d2;
        for (let h = top; h < bottom; h++) {
            const cacheRow = cache[h], layerRow = layerD2[h];
            for (let w = left4; w < right4; w += 4) {
                if (layerRow[w + 3] === 0) continue;
                // ！！！注意，我直接假設x,y為0，且當作沒有deep存在！！！
                const 上層比重 = layerRow[w + 3] * 圖層透明度;//, 下層比重 = 1.0 - 上層比重;
                // 公式: 結果 = 當前圖層 + 累積結果 * (1 - SourceAlpha)
                if (上層比重 === 1.0) {
                    cacheRow[w + 0] = layerRow[w + 0]; cacheRow[w + 1] = layerRow[w + 1]; cacheRow[w + 2] = layerRow[w + 2];
                    cacheRow[w + 3] = 1.0;
                    continue;
                }
                cacheRow[w + 0] += (layerRow[w + 0] - cacheRow[w + 0]) * 上層比重;
                cacheRow[w + 1] += (layerRow[w + 1] - cacheRow[w + 1]) * 上層比重;
                cacheRow[w + 2] += (layerRow[w + 2] - cacheRow[w + 2]) * 上層比重;
                cacheRow[w + 3] += (1.0 - cacheRow[w + 3]) * 上層比重;
                /**原公式
                cacheRow[w + 0] = (layerRow[w + 0] * 上層比重) + (cacheRow[w + 0] * 下層比重);
                cacheRow[w + 1] = (layerRow[w + 1] * 上層比重) + (cacheRow[w + 1] * 下層比重);
                cacheRow[w + 2] = (layerRow[w + 2] * 上層比重) + (cacheRow[w + 2] * 下層比重);
                cacheRow[w + 3] = 上層比重 + (cacheRow[w + 3] * 下層比重);
                */
            }
        }
    }
    // 寫回Result
    const result = root.result.d2;
    for (let h = top; h < bottom; h++) {
        const cacheRow = cache[h], resultRow = result[h];
        for (let w = left4; w < right4; w += 4) {
            const a = cache[h][w + 3];
            if (a === 0) { resultRow[w + 0] = resultRow[w + 1] = resultRow[w + 2] = resultRow[w + 3] = 0; continue; }
            const invA = 1.0 / a;
            let r = cacheRow[w + 0] * invA;
            resultRow[w + 0] = r > 255 ? 255 : (r < 0 ? 0 : (r * 255) | 0);
            let g = cacheRow[w + 1] * invA;
            resultRow[w + 1] = g > 255 ? 255 : (g < 0 ? 0 : (g * 255) | 0);
            let b = cacheRow[w + 2] * invA;
            resultRow[w + 2] = b > 255 ? 255 : (b < 0 ? 0 : (b * 255) | 0);
            resultRow[w + 3] = a > 255 ? 255 : (a < 0 ? 0 : (a * 255) | 0);
        }
    }
    root.needRefleshRect = false;
}

function addNewLayer() {
    var root = ToolSelector.project.layerManager;
    var layer = new Layer(0, 0, 0, root.width, root.height, 1); layer.opacity = 1.0;

    ToolSelector.layer = layer;
    root.layers.push(layer);
    root.needRefleshRect = true;
    createFullSandwich();
    GUI.refleshGUI();
}