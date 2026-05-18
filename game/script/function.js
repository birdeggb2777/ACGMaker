function getByid(str) {
    return document.getElementById(str);
}

function getClass(str) {
    return document.getElementsByClassName(str);
}

function PathCompare(path1, path2) {
    if (path1 == path2) return true;
    if (!PathCompare.A || PathCompare.A2) {
        PathCompare.A = document.createElement("A");
        PathCompare.A2 = document.createElement("A");
    }

    PathCompare.A.href = path1;
    if (PathCompare.A.href == path2) return true;
    PathCompare.A2.href = path2;
    if (PathCompare.A2.href == path1) return true;
    if (PathCompare.A.href == PathCompare.A2.href) return true;
    return false;
}

function getObjById(id) {
    if (id == 0) return GameObj;
    for (var i = 0; i < AllObjList.length; i++) {
        if (AllObjList[i].id == id) return AllObjList[i];
    }
}

function getObjByClass(class1) {
    for (var i = 0; i < AllObjList.length; i++) {
        if (AllObjList[i].class == class1) return AllObjList[i];
    }
}

function createPounchObj(obj, x, y) {
    if (!x) x = 0;
    if (!y) y = 0;
    createPounchObj.obj = {};
    createPounchObj.obj.x = obj.x + x;
    createPounchObj.obj.y = obj.y + y;
    createPounchObj.obj.width = obj.width;
    createPounchObj.obj.height = obj.height;
    createPounchObj.obj.type = obj.type;
    return createPounchObj.obj;
}

function pounch(obj, obj2) {
    try {
        function pounch1(x, y, w, h, x2, y2, w2, h2) {
            if (y + h >= y2 && x + w >= x2 && y < y2 + h2 && x < x2 + w2)
                return true;
            return false;
        }
        if (obj.type != "scenes" && obj2.type != "scenes") {
            if (pounch1(obj.x, obj.y, obj.width, obj.height,
                obj2.x, obj2.y, obj2.width, obj2.height) == true) {
                return true
            }
        } else if (obj.type == "scenes" && obj2.type == "scenes") {
            if (pounch1(obj.x - GameObj.x, obj.y - GameObj.y, obj.width, obj.height,
                obj2.x - GameObj.x, obj2.y - GameObj.y, obj2.width, obj2.height) == true) {
                return true
            }
        } else if (obj.type == "scenes" && obj2.type != "scenes") {
            if (pounch1(obj.x - GameObj.x, obj.y - GameObj.y, obj.width, obj.height,
                obj2.x, obj2.y, obj2.width, obj2.height) == true) {
                return true
            }
        } else if (obj.type != "scenes" && obj2.type == "scenes") {
            if (pounch1(obj.x, obj.y, obj.width, obj.height,
                obj2.x - GameObj.x, obj2.y - GameObj.y, obj2.width, obj2.height) == true) {
                return true
            }
        } else {
            if (pounch1(obj.x, obj.y, obj.width, obj.height,
                obj2.x, obj2.y, obj2.width, obj2.height) == true) {
                return true
            }
        }
    } catch (ex) { return false; };
    return false;
}

function createGameWorldObj() {
    var obj = {
        x: 0,
        y: 0,
        width: getByid("game").width,
        height: getByid("game").height
    }
    return obj;
}

function CloneObj(obj) {
    var clone = JSON.parse(JSON.stringify(obj));
    GameObj.id_length++;
    clone.id = GameObj.id_length;//
    clone.img = obj.img;
    clone.x = obj.x + 25;
    clone.y = obj.y + 25;
    AllObjList.push(clone);

    ChooseObj = clone;
    ObjSelect(clone);
    checkPouch = true;
}

function DeleteObj(obj) {
    obj.clone = true;
    obj.class = "delete";
}

function changeGameWorldStatus() {
    if (GameObj.State == "MakeGame") return "PlayGame";
    else if (GameObj.State == "PlayGame") return "MakeGame";
    else return "MakeGame";
}

function displayGameWorldStatus() {
    if (GameObj.State == "MakeGame") return "開發模式";
    else if (GameObj.State == "PlayGame") return "遊戲模式(模擬)";
    else return "開發模式";
}

function copyJSon(json) {
    var jsonData = JSON.stringify(json);
    return JSON.parse(jsonData);
}

function exportGameWorldJSON() {
    var jsonData = JSON.stringify(AllObjList);
    return jsonData;
}

function exportGameWorldJSONFile() {
    var jsonData = JSON.stringify(AllObjList);
    function download(content, fileName, contentType) {
        var a = document.createElement("a");
        var file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }
    download(jsonData, '專案資料.json', 'text/plain');
}

function convertJSONtoGameWorld(json) {
    var objList = JSON.parse(json);
    for (var i = 0; i < objList.length; i++) {
        objList[i].img = document.createElement("IMG");
        objList[i].img.src = objList[i].src;
    }
    AllObjList = objList;
    if (!AllObjList[0].variable) AllObjList[0].variable = [];
    if (!AllObjList[0].forme) AllObjList[0].forme = [];
    //flag3
    AllObjList[0].State = GameObj.State;
    GameObj = AllObjList[0];
}

function includeElementFromEvent(event, str) {
    for (var e1 = 0; e1 < event.length; e1++) {
        if (event[e1][0] == str) {
            return true;
        }
    }
    return false;
}

function ExportGAME() {
    var jsonData = JSON.stringify(AllObjList);
    var objList = JSON.parse(jsonData);

    var canvas = document.createElement("canvas");
    var context = canvas.getContext('2d');
    for (var i = 1; i < objList.length; i++) {
        //objList[i].img = document.createElement("IMG");
        var width = AllObjList[i].img.width;
        var height = AllObjList[i].img.height;
        if (canvas.width && canvas.height) context.clearRect(0, 0, canvas.width, canvas.height);
        else context.clearRect(0, 0, 1024, 1024);
        canvas.width = width;
        canvas.height = height;
        //console.log(AllObjList[i].img.src, width, height);
        context.drawImage(AllObjList[i].img, 0, 0, width, height);
        //console.log(AllObjList[i].img.src, width, height);
        objList[i].src = canvas.toDataURL();
        //console.log(objList[i].src);
        objList[i].img.src = null
    }

    for (var i = 0; i < objList.length; i++) {
        if (!AllObjList[i].animeList) continue;
        for (var j = 0; j < AllObjList[i].animeList.length; j++) {
            for (var o = 0; o < ImageSrcList.length; o++) {
                var A = document.createElement("A");
                A.href = AllObjList[i].animeList[j];
                if (A.href == ImageSrcList[o].src) {
                    var image = ImageSrcList[o];
                    var width = image.width;
                    var height = image.height;
                    if (canvas.width && canvas.height) context.clearRect(0, 0, canvas.width, canvas.height);
                    else context.clearRect(0, 0, 1024, 1024);
                    canvas.width = width;
                    canvas.height = height;
                    //console.log(AllObjList[i].img.src, width, height);
                    context.drawImage(image, 0, 0, width, height);
                    //console.log(AllObjList[i].img.src, width, height);
                    objList[i].animeList[j] = canvas.toDataURL();
                }
            }
        }
    }
    jsonData = JSON.stringify(objList);

    jsonData = "" + jsonData;
    jsonData = ExportTEXT.replace("___loadAllObjList___", jsonData);
    function download(content, fileName, contentType) {
        var a = document.createElement("a");
        var file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }
    download(jsonData, '遊戲檔案.html', 'text/plain');
}

var keyCode = { backspace: 8, tab: 9, enter: 13, shift: 16, ctrl: 17, alt: 18, pausebreak: 19, capslock: 20, esc: 27, space: 32, pageup: 33, pagedown: 34, end: 35, home: 36, leftarrow: 37, uparrow: 38, rightarrow: 39, downarrow: 40, insert: 45, delete: 46, 0: 48, 1: 49, 2: 50, 3: 51, 4: 52, 5: 53, 6: 54, 7: 55, 8: 56, 9: 57, a: 65, b: 66, c: 67, d: 68, e: 69, f: 70, g: 71, h: 72, i: 73, j: 74, k: 75, l: 76, m: 77, n: 78, o: 79, p: 80, q: 81, r: 82, s: 83, t: 84, u: 85, v: 86, w: 87, x: 88, y: 89, z: 90, leftwindowkey: 91, rightwindowkey: 92, selectkey: 93, numpad0: 96, numpad1: 97, numpad2: 98, numpad3: 99, numpad4: 100, numpad5: 101, numpad6: 102, numpad7: 103, numpad8: 104, numpad9: 105, multiply: 106, add: 107, subtract: 109, decimalpoint: 110, divide: 111, f1: 112, f2: 113, f3: 114, f4: 115, f5: 116, f6: 117, f7: 118, f8: 119, f9: 120, f10: 121, f11: 122, f12: 123, numlock: 144, scrolllock: 145, semicolon: 186, equalsign: 187, comma: 188, dash: 189, period: 190, forwardslash: 191, graveaccent: 192, openbracket: 219, backslash: 220, closebracket: 221, singlequote: 222 };
