
// 本人專用的語法糖

function getByid(s) {
    return document.getElementById(s);
}

function getClass(s) {
    return document.getElementsByClassName(s);
}

function showClass(s, b = true) {
    for (var obj of document.getElementsByClassName(s)) {
        if (b == true) obj.style.display = "";
        else obj.style.display = "none";
    }
}

function createElem(tagName = "div", id = null, className = null, innerText = null) {
    var Elem = document.createElement(tagName);
    if (id != null) Elem.id = id;
    if (className != null) Elem.className = className;
    if (innerText != null) Elem.innerText = innerText;
    return Elem;
}

function deepCloneJSON(json) {
    return JSON.parse(JSON.stringify(json));
}

function CloneObj(obj) {
    return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
}

function cloneInstance(instance) {
    const proto = Object.getPrototypeOf(instance);
    const copy = Object.create(proto);
    for (const key of Reflect.ownKeys(instance)) {
        if (instance[key] != null && typeof instance[key] == 'object') copy[key] = cloneInstance(instance[key]);
        else copy[key] = instance[key];
    }
    return copy;
}

function log(s) {
    return console.log(s);
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function appendChilds(parent, chinds) {
    for (var child of chinds) parent.appendChild(child);
}

function setAttributesWithJson(elem, json) {
    for (var [key, value] of Object.entries(json))
        elem.setAttribute("" + key, "" + value);
}

///////////////////

const clamp255 = (v) => v > 255 ? 255 : (v < 0 ? 0 : (v * 255) | 0);
const clamp01 = (v) => v > 1.0 ? 1.0 : (v < 0 ? 0 : (v));
const inv255 = 1.0 / 255.0;

/////////////////

class NoiseList {
    // 1701 = (-2700) + (-384) + (-484) + (1452) + (1820) + (1997)
    // 這是印和闐、亞里斯多德、希羅多德、達文西、南丁格爾、加上我的生日，所創造的數字
    // 你如果看到這段字，建議把我的生日改成你的生日，因為我沒有證明這不是一個「我的袖子裡沒有東西」數字
    // 我的袖子裡沒有東西數字：(英語：Nothing-up-my-sleeve number)
    constructor(seed = 1701n) { 
        this.seeds = new BigUint64Array(2);
        this.seeds[0] = seed;
        this.seeds[1] = seed ^ 0x9E3779B97F4A7C15n;
    }
    generateList(length) {
        const buffer = new Float32Array(length);
        const seeds = this.seeds;

        for (let i = 0; i < length; i++) {
            var s0 = seeds[0], s1 = seeds[1], result = s0 + s1;
            s1 ^= s0;
            seeds[0] = ((s0 << 24n) | (s0 >> 40n)) ^ s1 ^ (s1 << 16n);
            seeds[1] = (s1 << 37n) | (s1 >> 27n);

            // 轉換為 0 到 1 的浮點數
            buffer[i] = Number(result & 0xFFFFFFn) / 16777216; // 針對Float32最佳化的精確度
        }
        return buffer;
    }
    genList(length) { return this.generateList(length) }
}