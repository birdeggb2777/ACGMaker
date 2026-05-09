
window.onload = function () {
    AllObjList.push(GameObj);

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

    readTextFile("image/material_json.json", function (text) {
        material_json = JSON.parse(text);
        material_json = material_json.material_json;
        for (var j1 = 0; j1 < material_json.length; j1++) {
            if (material_json[j1].Parent_folder) {
                var Parent_folder = material_json[j1].Parent_folder;
                for (var j2 = 0; j2 < material_json[j1].subpath.length; j2++) {
                    var image_tmp = document.createElement("IMG");
                    image_tmp.width = imgListSize[0];
                    image_tmp.height = imgListSize[1];
                    image_tmp.src = Parent_folder + material_json[j1].subpath[j2];
                    var image = new Image();
                    image.src = image_tmp.src;
                    ImageSrcList.push(image);

                    image_tmp.alt = material_json[j1].title;
                    image_tmp.obj = copyJSon(material_json[j1]);
                    image_tmp.obj.path = Parent_folder + material_json[j1].subpath[j2];
                    image_tmp.className = "leftimg objimg";
                    image_tmp.onmousedown = function () {
                        ImgObjChoose(this.obj);
                    }
                    image_tmp.ondragstart = function (e) {
                        dragalt = e.target.alt;
                        MouseDrag = "enter";
                        NowChoose = e.target;
                        ChooseObj = undefined;
                    }
                    getByid('MaterialListDiv').appendChild(image_tmp);
                }
            }
        }
    });

    readTextFile("image/image_json.json", function (text) {
        image_json = JSON.parse(text);
        image_json = image_json.image_json;
        for (var j1 = 0; j1 < image_json.length; j1++) {
            var image_tmp = document.createElement("IMG");
            image_tmp.width = imgListSize[0];
            image_tmp.height = imgListSize[1];
            image_tmp.src = image_json[j1].path;

            var image = new Image();
            image.src = image_tmp.src;
            ImageSrcList.push(image);

            image_tmp.alt = image_json[j1].title;
            image_tmp.obj = image_json[j1];
            image_tmp.className = "leftimg objimg";
            image_tmp.onmousedown = function () {
                ImgObjChoose(this.obj);
            }
            image_tmp.ondragstart = function (e) {
                dragalt = e.target.alt;
                MouseDrag = "enter";
                NowChoose = e.target;
                ChooseObj = undefined;
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

            var image = new Image();
            image.src = image_tmp.src;
            ImageSrcList.push(image);

            image_tmp.alt = waterball_json[j1].title;
            image_tmp.obj = waterball_json[j1];
            image_tmp.className = "leftimg objimg";
            image_tmp.onmousedown = function () {
                ImgObjChoose(this.obj);
            }
            image_tmp.ondragstart = function (e) {
                dragalt = e.target.alt;
                MouseDrag = "enter";
                NowChoose = e.target;
                ChooseObj = undefined;
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

            var image = new Image();
            image.src = image_tmp.src;
            ImageSrcList.push(image);

            image_tmp.alt = background_json[j1].title;
            image_tmp.obj = background_json[j1];
            image_tmp.className = "leftimg backgroundimg";
            image_tmp.onmousedown = function () {
                ImgObjChoose(this.obj);
            }
            image_tmp.ondragstart = function (e) {
                dragalt = e.target.alt;
                MouseDrag = "enter";
                NowChoose = e.target;
                ChooseObj = undefined;
            }
            getByid('BackgroundListDiv').appendChild(image_tmp);
        }
    });

    readTextFile("image/anime_json.json", function (text) {
        anime_json = JSON.parse(text);
        anime_json = anime_json.anime_json;
        //console.log(anime_json[0]);
        //  for (var j2 = 0; j2 < anime_json.length; j2++) {
        for (var j1 = 0; j1 < anime_json.length; j1++) {

            var image_tmp = document.createElement("IMG");
            image_tmp.width = imgListSize[0];
            image_tmp.height = imgListSize[1];
            image_tmp.src = anime_json[j1].path;
            image_tmp.alt = anime_json[j1].title;
            image_tmp.obj = anime_json[j1];
            image_tmp.animeList = [];

            for (var o = 0; o < image_tmp.obj.animeList.length; o++) {
                var image = new Image();
                image.src = image_tmp.obj.animeList[o];
                ImageSrcList.push(image);
            }
            //for (var j1 = 0; j1 < anime_json.length; j1++) {
            //    image_tmp.animeList.push(anime_json[j1].path);
            // }
            image_tmp.className = "leftimg animeimg";
            image_tmp.onmousedown = function () {
                ImgObjChoose(this.obj);
            }
            image_tmp.ondragstart = function (e) {
                dragalt = e.target.alt;
                MouseDrag = "enter";
                NowChoose = e.target;
                ChooseObj = undefined;
            }
            getByid('AnimeListDiv').appendChild(image_tmp);
        }
        // }
    });

    function getCurrPoint(e, canvas) {
        var currX = parseFloat(parseFloat((e.pageX - canvas.getBoundingClientRect().left)));
        var currY = parseFloat(parseFloat((e.pageY - canvas.getBoundingClientRect().top)));
        return [currX, currY];
    }
    getByid("game").onmousedown = function (e) {
        //if (GameObj.State == "PlayGame") return;
        if (e.which == 1) MouseLeftClick = true;
        else if (e.which == 2) MouseMiddleClick = true;
        else if (e.which == 3) MouseRightClick = true;

        var canvas = document.getElementById('game');
        if (canvas.getContext) {
            var ctx = canvas.getContext('2d');
            var currX = getCurrPoint(e, canvas)[0];
            var currY = getCurrPoint(e, canvas)[1];
            originMouseClickPoint = [currX, currY, originMouseClickPoint[2]];
            GameObj.originX = GameObj.x;
            GameObj.originY = GameObj.y;
        }
        var mouseObj = { x: currX, y: currY, width: 3, height: 3 };
        checkPouch = false;
        for (var d = 0; d < AllObjList.length; d++) {
            if (AllObjList[d].type == "img" || AllObjList[d].type == "anime" || AllObjList[d].type == "scenes") {
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
        if (!checkPouch) {
            getByid("GameWorld_Choose").selected = true;
            ChooseObj = GameObj;
            ObjSelect(ChooseObj);
            checkPouch = true;
        }
    }
    getByid("game").onmouseup = function (e) {
        //if (GameObj.State == "PlayGame") return;
        //ChooseObj = null;
        MouseLeftClick = false;
        MouseRightClick = false;
        MouseMiddleClick = false;
    }
    getByid("game").onmousemove = function (e) {
        //if (GameObj.State == "PlayGame") return;
        var canvas = document.getElementById('game');
        if (canvas.getContext) {
            var ctx = canvas.getContext('2d');
            var currX = getCurrPoint(e, canvas)[0];
            var currY = getCurrPoint(e, canvas)[1];
        }



        //對齊周圍的物件
        var blockX, blockY;
        if (ChooseObj) {
            blockX = ChooseObj.width;
            blockY = ChooseObj.height;
        }
        else {
            blockX = imgListSize[0];
            blockY = imgListSize[1];
        }
        var leftPouchObjX, rightPouchObjY;
        var pouchObj = {
            x: currX, y: currY - blockY,
            width: 5, height: blockY + blockY
        };
        for (var d = 0; d < AllObjList.length; d++) {
            if (AllObjList[d].type == "img" || AllObjList[d].type == "anime" || AllObjList[d].type == "scenes") {
                if (AllObjList[d].class == "delete") continue;
                if (ChooseObj && AllObjList[d] == ChooseObj) continue;
                if (pounch(AllObjList[d], pouchObj)) {
                    leftPouchObjX = AllObjList[d].x;
                    if (AllObjList[d].type == "scenes") leftPouchObjX -= GameObj.x;
                }
            }
        }

        var pouchObj = {
            x: currX - blockX, y: currY,
            width: blockX + blockX, height: 5
        };
        for (var d = 0; d < AllObjList.length; d++) {
            if (AllObjList[d].type == "img" || AllObjList[d].type == "anime" || AllObjList[d].type == "scenes") {
                if (AllObjList[d].class == "delete") continue;
                if (ChooseObj && AllObjList[d] == ChooseObj) continue;
                if (pounch(AllObjList[d], pouchObj)) {
                    rightPouchObjY = AllObjList[d].y;
                    if (AllObjList[d].type == "scenes") rightPouchObjY -= GameObj.y;
                }
            }
        }


        if (leftPouchObjX == undefined) {
            leftPouchObjX = currX - blockX / 2;
        } else {
            leftPouchObjX = leftPouchObjX;
        }
        if (rightPouchObjY == undefined) {
            rightPouchObjY = currY - blockY / 2;
        } else {
            rightPouchObjY = rightPouchObjY;
        }
        if (AlignCheck == false) {
            leftPouchObjX = currX - blockX / 2;
            rightPouchObjY = currY - blockY / 2;
        }

        //已移除的不明功能，會阻止scenes物件對齊
        if (ChooseObj && ChooseObj.type && ChooseObj.type == "scenes") {
            leftPouchObjX += GameObj.x;
            rightPouchObjY += GameObj.y;
        }

        if (MouseLeftClick) {
            if (ChooseObj && ChooseObj != GameObj) {
                ChooseObj.x = leftPouchObjX;
                ChooseObj.y = rightPouchObjY;
                ChooseObj.originX = leftPouchObjX;
                ChooseObj.originY = rightPouchObjY;
                ObjSelect(ChooseObj, true);
            }
            refleshGame();
        } else if (MouseMiddleClick) {
            GameObj.x = GameObj.originX + (originMouseClickPoint[0] - currX);
            GameObj.y = GameObj.originY + (originMouseClickPoint[1] - currY);
        }
        else {
            refleshGame();
        }


        if (MouseDrag == "enter") {
            if (NowChoose.obj.classtype == "image")
                ctx.drawImage(NowChoose, leftPouchObjX, rightPouchObjY, imgListSize[0], imgListSize[1]);
            if (NowChoose.obj.classtype == "anime")
                ctx.drawImage(NowChoose, leftPouchObjX, rightPouchObjY, imgListSize[0], imgListSize[1]);
            else if (NowChoose.obj.classtype == "background")
                ctx.drawImage(NowChoose, currX, currY, GameObj.width, GameObj.height);
            else if (NowChoose.obj.classtype == "scenes")
                ctx.drawImage(NowChoose, leftPouchObjX, rightPouchObjY, imgListSize[0], imgListSize[1]);
        }

        try {
            if (NowChoose.obj.classtype == "scenes") {
                leftPouchObjX += GameObj.x;
                rightPouchObjY += GameObj.y;
            }
        } catch (ex) { }

        if (MouseDrag == "complete") {
            GameObj.id_length++;
            MouseDrag = false;

            ctx.drawImage(NowChoose, currX, currY, blockX, blockY);


            if (NowChoose.obj.classtype == "image") {
                tempObject = {
                    name: NowChoose.obj.title,
                    type: "img",
                    src: NowChoose.src,
                    img: NowChoose,
                    x: leftPouchObjX,
                    y: rightPouchObjY,
                    originX: leftPouchObjX,
                    originY: rightPouchObjY,
                    id: GameObj.id_length,
                    width: blockX,
                    height: blockY,
                    flipx: false,
                    flipy: false,
                    layer: false,
                    display: true,
                    event: [],
                    span: [],
                    select: [],
                    broadcast: [],
                    variable: [],
                    forme: [],
                    State: "normal",
                    class: "角色",
                    rotate: 0
                }
                AllObjList.push(tempObject);
                ChooseObj = tempObject;
                ObjSelect(ChooseObj);
            }
            if (NowChoose.obj.classtype == "scenes") {
                tempObject = {
                    name: NowChoose.obj.title,
                    type: "scenes",
                    src: NowChoose.src,
                    img: NowChoose,
                    x: leftPouchObjX,
                    y: rightPouchObjY,
                    originX: leftPouchObjX,
                    originY: rightPouchObjY,
                    id: GameObj.id_length,
                    width: blockX,
                    height: blockY,
                    flipx: false,
                    flipy: false,
                    layer: false,
                    display: true,
                    event: [],
                    span: [],
                    select: [],
                    broadcast: [],
                    variable: [],
                    forme: [],
                    State: "normal",
                    class: "" + NowChoose.obj.assign_class,
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
                    src: NowChoose.src,
                    x: 0,
                    y: 0,
                    originX: 0,
                    originY: 0,
                    id: GameObj.id_length,
                    width: GameObj.width,
                    height: GameObj.height,
                    flipx: false,
                    flipy: false,
                    display: true,
                    event: [],
                    span: [],
                    select: [],
                    broadcast: [],
                    variable: [],
                    forme: [],
                    State: "normal",
                    class: "背景",
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
                    src: NowChoose.src,
                    x: leftPouchObjX,
                    y: rightPouchObjY,
                    originX: leftPouchObjX,
                    originY: rightPouchObjY,
                    id: GameObj.id_length,
                    width: blockX,
                    height: blockY,
                    flipx: false,
                    flipy: false,
                    layer: false,
                    display: true,
                    event: [],
                    span: [],
                    select: [],
                    broadcast: [],
                    variable: [],
                    State: "normal",
                    forme: [],
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

    //選擇GameWorld
    getByid("GameWorld_Choose").selected = true;
    ChooseObj = GameObj;
    ObjSelect(ChooseObj);
    checkPouch = true;

    getByid("game").ondropactivate = function (e) {
        e.preventDefault();
    }
    getByid("game").ondragenter = function (e) {
        MouseDrag = "enter";
    }
    getByid("game").ondragleave = function (e) {
        MouseDrag = "leave";
    }
    getByid("game").ondragover = function (e) {
        e.preventDefault();
    }
    getByid("game").ondrop = function (e) {
        e.preventDefault();
        MouseDrag = false;
        MouseDrag = "complete";
    }
}
