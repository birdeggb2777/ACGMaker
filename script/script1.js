function getByid(str) {
    return document.getElementById(str);
}

function getClass(str) {
    return document.getElementsByClassName(str);
}

function pounch(obj, obj2) {
    function pounch1(x, y, w, h, x2, y2, w2, h2) {
        if (y + h >= y2 && x + w >= x2 && y < y2 + h2 && x < x2 + w2)
            return true;
        return false;
    }
    if (pounch1(obj.x, obj.y, obj.width, obj.height,
            obj2.x, obj2.y, obj2.width, obj2.height) == true) {
        return true
    }
    return false;
}

let image_json;
let imgListSize = [75, 75];
imgListSize.width = imgListSize[0];
imgListSize.height = imgListSize[1];
let ImgListDiv = getByid("ImgListDiv");
let BackgroundListDiv = getByid("BackgroundListDiv");
let MouseDrag = false;
let NowChoose = null;
let AllObjList = []
let id_length = 0;
let GameObj = {}
let ChooseObj = null;
let MouseLeftClick = false;
let MouseRightClick = false;
GameObj.width = 750;
GameObj.height = 550;

getByid("imgListOpetion").onchange = function() {
    if (getByid("Animal_Choose").selected == true) ImgListDiv.style.display = "";
    else ImgListDiv.style.display = "none";
    if (getByid("Background_Choose").selected == true) BackgroundListDiv.style.display = "";
    else BackgroundListDiv.style.display = "none";
}

function ObjSelect(obj, move) {
    var Table = document.createElement("table");
    Table.id = "ObjTable";
    // /Table.className = "table table-dark table-striped";
    Table.setAttribute("border", 2);
    Table.style = "table-layout:fixed;"
    Table.width = "200";
    var cells = Table.insertRow(0);
    cells = cells.insertCell(0);
    cells.style = "word-break:break-word; word-wrap:break-word;"
    cells.innerHTML = "名稱: " + obj.name;
    /*
    var cells = Table.insertRow(1);
    cells = cells.insertCell(0);
    cells.style = "word-break:break-word; word-wrap:break-word;"
    cells.innerHTML = "中文名稱: " + obj.title_tw;
    */
    cells = Table.insertRow(1);
    cells = cells.insertCell(0);
    cells.style = "word-break:break-word; word-wrap:break-word;"
    cells.innerHTML = "ID: " + obj.id;

    cells = Table.insertRow(2);
    cells = cells.insertCell(0);
    cells.style = "word-break:break-word; word-wrap:break-word;"
    cells.innerHTML = "座標X: " + "<input type='text'  value='" + obj.x + "' size='8' onchange='ChooseObj.x=parseInt(this.value);refleshGame();'/>";

    cells = Table.insertRow(3);
    cells = cells.insertCell(0);
    cells.style = "word-break:break-word; word-wrap:break-word;"
    cells.innerHTML = "座標Y: " + "<input type='text'  value='" + obj.y + "' size='8' onchange='ChooseObj.y=parseInt(this.value);refleshGame();'/>";

    cells = Table.insertRow(4);
    cells = cells.insertCell(0);
    cells.style = "word-break:break-word; word-wrap:break-word;"
    cells.innerHTML = "寬度:" + "<input type='text'  value='" + obj.width + "' size='8' onchange='ChooseObj.width=parseInt(this.value);refleshGame();'/>";

    cells = Table.insertRow(5);
    cells = cells.insertCell(0);
    cells.style = "word-break:break-word; word-wrap:break-word;"
    cells.innerHTML = "長度: " + "<input type='text'  value='" + obj.height + "' size='8' onchange='ChooseObj.height=parseInt(this.value);refleshGame();'/>";

    cells = Table.insertRow(6);
    cells = cells.insertCell(0);
    cells.style = "word-break:break-word; word-wrap:break-word;"
    cells.innerHTML = "左右反轉: " + "<input type='button'  value='" + obj.flipx + "' size='8' onclick='ChooseObj.flipx=this.value=!(ChooseObj.flipx);refleshGame();'/>";

    cells = Table.insertRow(7);
    cells = cells.insertCell(0);
    cells.style = "word-break:break-word; word-wrap:break-word;"
    cells.innerHTML = "上下反轉: " + "<input type='button'  value='" + obj.flipy + "' size='8' onclick='ChooseObj.flipy=this.value=!(ChooseObj.flipy);refleshGame();'/>";

    /*var cells = Table.insertRow(2);
    cells = cells.insertCell(0);
    cells.style = "word-break:break-word; word-wrap:break-word;"
    cells.innerHTML = "類型: " + obj.classtype_tw; 
    */


    getByid("selectObjectDiv").appendChild(Table);
    getByid("ObjTable").parentNode.replaceChild(Table, getByid("ObjTable"));
    if (!move) {
        var image_tmp = document.createElement("IMG");
        image_tmp.id = "selectObjImg";
        image_tmp.width = imgListSize[0];
        image_tmp.height = imgListSize[1];
        image_tmp.src = obj.img.src;
        getByid('selectObjectDiv').appendChild(image_tmp);
        getByid("selectObjImg").parentNode.replaceChild(image_tmp, getByid("selectObjImg"));
    } else {

    }



}

function ImgObjChoose(obj) {
    var Table = document.createElement("table");
    Table.id = "ObjTable";
    // /Table.className = "table table-dark table-striped";
    Table.setAttribute("border", 2);
    Table.style = "table-layout:fixed;"
    Table.width = "700";

    var cells = Table.insertRow(0);
    cells = cells.insertCell(0);
    cells.style = "word-break:break-word; word-wrap:break-word;"
    cells.innerHTML = "名稱: " + obj.title;

    var cells = Table.insertRow(1);
    cells = cells.insertCell(0);
    cells.style = "word-break:break-word; word-wrap:break-word;"
    cells.innerHTML = "中文名稱: " + obj.title_tw;

    var cells = Table.insertRow(2);
    cells = cells.insertCell(0);
    cells.style = "word-break:break-word; word-wrap:break-word;"
    cells.innerHTML = "類型: " + obj.classtype_tw;

    cells = Table.insertRow(3);
    cells = cells.insertCell(0);
    cells.style = "word-break:break-word; word-wrap:break-word;"
    cells.innerHTML = "路徑: <a target='_blank' href='" + obj.path + "'>" + obj.path + "</a>";

    cells = Table.insertRow(4);
    cells = cells.insertCell(0);
    cells.style = "word-break:break-word; word-wrap:break-word;"
    cells.innerHTML = "素材來源: <a target='_blank' href='" + obj.url + "'>" + obj.url + "</a>";

    getByid("selectObjectDiv").appendChild(Table);
    getByid("ObjTable").parentNode.replaceChild(Table, getByid("ObjTable"));

    var image_tmp = document.createElement("IMG");
    image_tmp.id = "selectObjImg";
    image_tmp.width = imgListSize[0];
    image_tmp.height = imgListSize[1];
    image_tmp.src = obj.path;
    getByid('selectObjectDiv').appendChild(image_tmp);
    getByid("selectObjImg").parentNode.replaceChild(image_tmp, getByid("selectObjImg"));


    var button_tmp = document.createElement("BUTTON");
    button_tmp.id = "EditImgButton";
    button_tmp.style.float = "right middle";
    button_tmp.innerText = "修改圖片";
    getByid('selectObjectDiv').appendChild(button_tmp);
    getByid("EditImgButton").parentNode.replaceChild(button_tmp, getByid("EditImgButton"));

}

function refleshGame() {
    if (getByid("game").width != GameObj.width || getByid("game").height != GameObj.height) {
        getByid("game").width = GameObj.width;
        getByid("game").height = GameObj.height;
    }
    var canvas = document.getElementById('game');
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 1024, 1024);
        for (var d = 0; d < AllObjList.length; d++)
            if (AllObjList[d].type == "background") {
                if (AllObjList[d].flipx == true || AllObjList[d].flipy == true) {
                    ctx.save();
                    var tmp_flipx = AllObjList[d].flipx ? GameObj.width + (AllObjList[d].x - GameObj.width / 2) * 2 + AllObjList[d].width : 0;
                    var tmp_flipy = AllObjList[d].flipy ? GameObj.height + (AllObjList[d].y - GameObj.height / 2) * 2 + AllObjList[d].height : 0;
                    ctx.translate(tmp_flipx, tmp_flipy);
                    var tmp_flipx = AllObjList[d].flipx ? -1 : 1;
                    var tmp_flipy = AllObjList[d].flipy ? -1 : 1;
                    ctx.scale(tmp_flipx, tmp_flipy);
                    ctx.drawImage(AllObjList[d].img, AllObjList[d].x, AllObjList[d].y, AllObjList[d].width, AllObjList[d].height);
                    ctx.restore();
                } else {
                    ctx.drawImage(AllObjList[d].img, AllObjList[d].x, AllObjList[d].y, AllObjList[d].width, AllObjList[d].height);
                }
            }
        for (var d = 0; d < AllObjList.length; d++) {
            if (AllObjList[d].type == "img") {
                if (AllObjList[d].flipx == true || AllObjList[d].flipy == true) {
                    ctx.save();
                    var tmp_flipx = AllObjList[d].flipx ? GameObj.width + (AllObjList[d].x - GameObj.width / 2) * 2 + AllObjList[d].width : 0;
                    var tmp_flipy = AllObjList[d].flipy ? GameObj.height + (AllObjList[d].y - GameObj.height / 2) * 2 + AllObjList[d].height : 0;
                    ctx.translate(tmp_flipx, tmp_flipy);
                    var tmp_flipx = AllObjList[d].flipx ? -1 : 1;
                    var tmp_flipy = AllObjList[d].flipy ? -1 : 1;
                    ctx.scale(tmp_flipx, tmp_flipy);
                    ctx.drawImage(AllObjList[d].img, AllObjList[d].x, AllObjList[d].y, AllObjList[d].width, AllObjList[d].height);
                    ctx.restore();
                } else {
                    ctx.drawImage(AllObjList[d].img, AllObjList[d].x, AllObjList[d].y, AllObjList[d].width, AllObjList[d].height);
                }
            }
        }
    }

}

window.onload = function() {
    refleshGame();

    function readTextFile(file, callback) {
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function() {
            if (rawFile.readyState === 4 && rawFile.status == "200") {
                callback(rawFile.responseText);
            }
        }
        rawFile.send(null);
    }

    readTextFile("image/image_json.json", function(text) {
        image_json = JSON.parse(text);
        image_json = image_json.image_json;
        for (var j1 = 0; j1 < image_json.length; j1++) {
            var image_tmp = document.createElement("IMG");
            image_tmp.width = imgListSize[0];
            image_tmp.height = imgListSize[1];
            image_tmp.src = image_json[j1].path;
            image_tmp.alt = image_json[j1].title;
            image_tmp.obj = image_json[j1];
            image_tmp.className = "leftimg objimg";
            image_tmp.onmousedown = function() {
                ImgObjChoose(this.obj);
            }
            getByid('ImgListDiv').appendChild(image_tmp);
        }
    });
    readTextFile("image/background_json.json", function(text) {
        background_json = JSON.parse(text);
        background_json = background_json.background_json;
        for (var j1 = 0; j1 < background_json.length; j1++) {
            var image_tmp = document.createElement("IMG");
            image_tmp.width = imgListSize[0];
            image_tmp.height = imgListSize[1];
            image_tmp.src = background_json[j1].path;
            image_tmp.alt = background_json[j1].title;
            image_tmp.obj = background_json[j1];
            image_tmp.className = "leftimg backgroundimg";
            image_tmp.onmousedown = function() {
                ImgObjChoose(this.obj);
            }
            getByid('BackgroundListDiv').appendChild(image_tmp);
        }
    });

    function getCurrPoint(e, canvas) {
        var currX = parseFloat(parseFloat((e.pageX - canvas.getBoundingClientRect().left)));
        var currY = parseFloat(parseFloat((e.pageY - canvas.getBoundingClientRect().top)));
        return [currX, currY];
    }
    getByid("game").onmousedown = function(e) {
        if (e.which == 1) MouseLeftClick = true;
        else if (e.which == 3) MouseRightClick = true;

        var canvas = document.getElementById('game');
        if (canvas.getContext) {
            var ctx = canvas.getContext('2d');
            var currX = getCurrPoint(e, canvas)[0];
            var currY = getCurrPoint(e, canvas)[1];
        }
        var mouseObj = { x: currX, y: currY, width: 3, height: 3 };
        checkPouch = false;
        for (var d = 0; d < AllObjList.length; d++) {
            if (AllObjList[d].type == "img") {
                var p = pounch(AllObjList[d], mouseObj);
                if (p == true) {
                    ChooseObj = AllObjList[d];
                    ObjSelect(ChooseObj);
                    checkPouch = true;
                    break;
                }
            }
        }
        if (!checkPouch) ChooseObj = null;
    }
    getByid("game").onmouseup = function(e) {
        //ChooseObj = null;
        MouseLeftClick = false;
        MouseRightClick = false;
    }
    getByid("game").onmousemove = function(e) {

        var canvas = document.getElementById('game');
        if (canvas.getContext) {
            var ctx = canvas.getContext('2d');
            var currX = getCurrPoint(e, canvas)[0];
            var currY = getCurrPoint(e, canvas)[1];
        }

        if (MouseLeftClick) {
            if (ChooseObj) {
                ChooseObj.x = currX - ChooseObj.width / 2;
                ChooseObj.y = currY - ChooseObj.height / 2;
                ObjSelect(ChooseObj, true);
            }
            refleshGame();
        } else {
            refleshGame();
        }

        if (MouseDrag == "enter") {
            if (NowChoose.obj.classtype == "image")
                ctx.drawImage(NowChoose, currX - imgListSize[0] / 2, currY - imgListSize[1] / 2, imgListSize[0], imgListSize[1]);
            else if (NowChoose.obj.classtype == "background")
                ctx.drawImage(NowChoose, currX, currY, GameObj.width, GameObj.height);
        }
        if (MouseDrag == "complete") {
            id_length++;
            MouseDrag = false;
            ctx.drawImage(NowChoose, currX, currY, imgListSize[0], imgListSize[1]);
            if (NowChoose.obj.classtype == "image") {
                tempObject = {
                    name: NowChoose.obj.title,
                    type: "img",
                    img: NowChoose,
                    x: currX - imgListSize[0] / 2,
                    y: currY - imgListSize[1] / 2,
                    id: id_length,
                    width: imgListSize[0],
                    height: imgListSize[1],
                    flipx: false,
                    flipy: false,
                    rotate: 0
                }
                AllObjList.push(tempObject);
                ChooseObj = tempObject;
                ObjSelect(ChooseObj);
            }

            if (NowChoose.obj.classtype == "background") {
                for (var d = 0; d < AllObjList.length; d++) {
                    if (AllObjList[d].type == "background") {
                        AllObjList[d].type = "false";
                        AllObjList[d].img = null;
                    }
                }
                tempObject = {
                    name: NowChoose.obj.title,
                    type: "background",
                    img: NowChoose,
                    x: 0,
                    y: 0,
                    id: id_length,
                    width: GameObj.width,
                    height: GameObj.height,
                    flipx: false,
                    flipy: false,
                    rotate: 0
                };
                AllObjList.push(tempObject);
                ChooseObj = tempObject;
                ObjSelect(ChooseObj);
            }
            refleshGame();
        }
    }

    interact('.leftimg').draggable({
        onmove(event) {
            dragalt = event.target.alt;
            MouseDrag = "enter";
            NowChoose = event.target;
        }
    })


    interact('#game').dropzone({
        accept: '.leftimg',
        ondropactivate: function(event) {
            event.target.classList.add('drop-active')
        },
        ondragenter: function(event) {
            var draggableElement = event.relatedTarget
            var dropzoneElement = event.target
            dropzoneElement.classList.add('drop-target')
            draggableElement.classList.add('can-drop')
            MouseDrag = "enter";
        },
        ondragleave: function(event) {
            event.target.classList.remove('drop-target')
            event.relatedTarget.classList.remove('can-drop')
            MouseDrag = "leave";
        },
        ondrop: function(event) {
            MouseDrag = false;
            MouseDrag = "complete";
        },
        ondropdeactivate: function(event) {
            event.target.classList.remove('drop-active')
            event.target.classList.remove('drop-target')
        }
    })
}