
window.onload = function () {
    refleshGame();

    function readTextFile(file, callback) {
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4 && rawFile.status == "200") {
                callback(rawFile.responseText);
            }
        }
        rawFile.send(null);
    }

    readTextFile("image/image_json.json", function (text) {
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
            image_tmp.onmousedown = function () {
                ImgObjChoose(this.obj);
            }
            getByid('ImgListDiv').appendChild(image_tmp);
        }
    });
    readTextFile("image/waterball_json.json", function (text) {
        waterball_json = JSON.parse(text);
        waterball_json = waterball_json.image_json;
        for (var j1 = 0; j1 < waterball_json.length; j1++) {
            var image_tmp = document.createElement("IMG");
            image_tmp.width = imgListSize[0];
            image_tmp.height = imgListSize[1];
            image_tmp.src = waterball_json[j1].path;
            image_tmp.alt = waterball_json[j1].title;
            image_tmp.obj = waterball_json[j1];
            image_tmp.className = "leftimg objimg";
            image_tmp.onmousedown = function () {
                ImgObjChoose(this.obj);
            }
            getByid('WaterBallListDiv').appendChild(image_tmp);
        }
    });
    readTextFile("image/background_json.json", function (text) {
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
            image_tmp.onmousedown = function () {
                ImgObjChoose(this.obj);
            }
            getByid('BackgroundListDiv').appendChild(image_tmp);
        }
    });

    readTextFile("image/anime_json.json", function (text) {
        anime_json = JSON.parse(text);
        anime_json = anime_json.anime_json;
        //console.log(anime_json[0]);
        //  for (var j2 = 0; j2 < anime_json.length; j2++) {
        var image_tmp = document.createElement("IMG");
        image_tmp.width = imgListSize[0];
        image_tmp.height = imgListSize[1];
        image_tmp.src = anime_json[0].path;
        image_tmp.alt = anime_json[0].title;
        image_tmp.obj = anime_json[0];
        image_tmp.animeList = [];
        //for (var j1 = 0; j1 < anime_json.length; j1++) {
        //    image_tmp.animeList.push(anime_json[j1].path);
        // }

        image_tmp.className = "leftimg animeimg";
        image_tmp.onmousedown = function () {
            ImgObjChoose(this.obj);
        }
        getByid('AnimeListDiv').appendChild(image_tmp);

        // }
    });

    function getCurrPoint(e, canvas) {
        var currX = parseFloat(parseFloat((e.pageX - canvas.getBoundingClientRect().left)));
        var currY = parseFloat(parseFloat((e.pageY - canvas.getBoundingClientRect().top)));
        return [currX, currY];
    }
    getByid("game").onmousedown = function (e) {
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
            if (AllObjList[d].type == "img" || AllObjList[d].type == "anime") {
                if (AllObjList[d].class == "delete") continue;
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
    getByid("game").onmouseup = function (e) {
        //ChooseObj = null;
        MouseLeftClick = false;
        MouseRightClick = false;
    }
    getByid("game").onmousemove = function (e) {

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
            if (NowChoose.obj.classtype == "anime")
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
                    layer: false,
                    display: true,
                    event: [],
                    span: [],
                    select: [],
                    broadcast: [],
                    class: "角色",
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
                    display: true,
                    event: [],
                    span: [],
                    select: [],
                    broadcast: [],
                    class: "場景",
                    rotate: 0
                };
                AllObjList.push(tempObject);
                ChooseObj = tempObject;
                ObjSelect(ChooseObj);
            }

            if (NowChoose.obj.classtype == "anime") {
                tempObject = {
                    name: NowChoose.obj.title,
                    animeList: NowChoose.obj.animeList,
                    type: "anime",
                    img: document.createElement("IMG"),
                    x: currX - imgListSize[0] / 2,
                    y: currY - imgListSize[1] / 2,
                    id: id_length,
                    width: imgListSize[0],
                    height: imgListSize[1],
                    flipx: false,
                    flipy: false,
                    layer: false,
                    display: true,
                    event: [],
                    span: [],
                    select: [],
                    broadcast: [],
                    class: "動畫",
                    rotate: 0
                }
                tempObject.img.src = NowChoose.src;
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
        ondropactivate: function (event) {
            event.target.classList.add('drop-active')
        },
        ondragenter: function (event) {
            var draggableElement = event.relatedTarget
            var dropzoneElement = event.target
            dropzoneElement.classList.add('drop-target')
            draggableElement.classList.add('can-drop')
            MouseDrag = "enter";
        },
        ondragleave: function (event) {
            event.target.classList.remove('drop-target')
            event.relatedTarget.classList.remove('can-drop')
            MouseDrag = "leave";
        },
        ondrop: function (event) {
            MouseDrag = false;
            MouseDrag = "complete";
        },
        ondropdeactivate: function (event) {
            event.target.classList.remove('drop-active')
            event.target.classList.remove('drop-target')
        }
    })
}
