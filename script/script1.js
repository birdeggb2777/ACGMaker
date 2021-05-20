function getByid(str) {
    return document.getElementById(str);
}

function getClass(str) {
    return document.getElementsByClassName(str);
}


function getObjById(id) {
    for (var i = 0; i < AllObjList.length; i++) {
        if (AllObjList[i].id == id) return AllObjList[i];
    }
}

function getObjByClass(class1) {
    for (var i = 0; i < AllObjList.length; i++) {
        if (AllObjList[i].class == class1) return AllObjList[i];
    }
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

var GameWorld = [];
GameWorld.broadcast = [];
GameWorld.tool = [];
GameWorld.tool.AutoSelect = function (obj) {
    for (var i = 0; i < obj.select.length; i++) {
        //var choose = getByid(obj.select.id);
        var choose = getByid(obj.select[i].id);
        //  console.log(choose, obj.select[i].id);
        // console.log(choose.options, obj.select[i].id);
        if (choose && choose.options) {
            for (var j = 0; j < choose.options.length; j++) {
                if (choose.options[j].text == obj.select[i].choose) {
                    choose.options[j].selected = true;
                }
            }
        }
    }
}

let image_json;
let imgListSize = [75, 75];
imgListSize.width = imgListSize[0];
imgListSize.height = imgListSize[1];
let ImgListDiv = getByid("ImgListDiv");
let BackgroundListDiv = getByid("BackgroundListDiv");
let WaterBallListDiv = getByid("WaterBallListDiv");
let MouseDrag = false;
let NowChoose = null;
let AllObjList = []
let id_length = 0;
let GameObj = {}
let ChooseObj = null;
let MouseLeftClick = false;
let MouseRightClick = false;
let checkPouch = false;
GameObj.width = 750;
GameObj.height = 550;

getByid("imgListOpetion").onchange = function () {
    if (getByid("Animal_Choose").selected == true) ImgListDiv.style.display = "";
    else ImgListDiv.style.display = "none";
    if (getByid("Background_Choose").selected == true) BackgroundListDiv.style.display = "";
    else BackgroundListDiv.style.display = "none";
    if (getByid("WaterBall_Choose").selected == true) WaterBallListDiv.style.display = "";
    else WaterBallListDiv.style.display = "none";
}

getByid("EventListOpetion").onchange = function () {
    getByid("RefleshImgButton").onclick();
}

function ObjSelect(obj, move) {
    var Table = document.createElement("table");
    Table.id = "ObjTable";
    // /Table.className = "table table-dark table-striped";
    Table.setAttribute("border", 2);
    Table.style = "table-layout:fixed;"
    Table.width = "300";
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
    cells.innerHTML = "左右反轉: " + "<input type='button'  value='" + obj.flipx + "' size='8' onclick='ChooseObj.flipx=this.value=!(ChooseObj.flipx);refleshGame();'/>" +
        "上下反轉: " + "<input type='button'  value='" + obj.flipy + "' size='8' onclick='ChooseObj.flipy=this.value=!(ChooseObj.flipy);refleshGame();'/>";

    cells = Table.insertRow(7);
    cells = cells.insertCell(0);
    cells.style = "word-break:break-word; word-wrap:break-word;"
    cells.innerHTML = "繪圖優先度：" + "<input type='button'  value='" + obj.layer + "' size='8' onclick='ChooseObj.layer=this.value=!(ChooseObj.layer);refleshGame();'/>"
        + ",顯示隱藏：<input type='button'  value='" + obj.display + "' size='8' onclick='ChooseObj.display=this.value=!(ChooseObj.display);refleshGame();'/>";

    cells = Table.insertRow(8);
    cells = cells.insertCell(0);
    cells.style = "word-break:break-word; word-wrap:break-word;"
    cells.innerHTML = "類別: " + "<input type='text'  value='" + obj.class + "' size='8' onchange='ChooseObj.class=this.value;refleshGame();'/>";

    /*var cells = Table.insertRow(2);
    cells = cells.insertCell(0);
    cells.style = "word-break:break-word; word-wrap:break-word;"
    cells.innerHTML = "類型: " + obj.classtype_tw; 
    */


    getByid("selectObjectDiv").appendChild(Table);
    getByid("ObjTable").parentNode.replaceChild(Table, getByid("ObjTable"));
    var button_tmp2 = document.createElement("BUTTON");
    button_tmp2.id = "RefleshImgButton";
    button_tmp2.style.float = "right middle";
    button_tmp2.innerText = "刷新";
    button_tmp2.obj = obj;
    button_tmp2.onclick = function () { (ObjSelect(this.obj)) };

    getByid('selectObjectDiv').appendChild(button_tmp2);
    getByid("RefleshImgButton").parentNode.replaceChild(button_tmp2, getByid("RefleshImgButton"));


    var eTable = document.createElement("table");
    eTable.id = "ObjEventTable";
    // /Table.className = "table table-dark table-striped";
    eTable.setAttribute("border", 2);

    getByid("selectObjectEventDiv").appendChild(eTable);
    getByid("ObjEventTable").parentNode.replaceChild(eTable, getByid("ObjEventTable"));

    eTable.style = "table-layout:fixed;"
    eTable.width = "320";
    var cells = eTable.insertRow(0);
    cells = cells.insertCell(0);
    cells.style = "word-break:break-word; word-wrap:break-word;"
    if (getByid("Event_Choose").selected == true)
        cells.innerHTML = "一般事件: ";//+ obj.name;
    if (getByid("CloneEvent_Choose").selected == true)
        cells.innerHTML = "分身事件: ";//+ obj.name;
    if (getByid("SpecialEvent_Choose").selected == true)
        cells.innerHTML = "特殊事件: ";//+ obj.name;
    /*
    var cells = Table.insertRow(1);
    cells = cells.insertCell(0);
    cells.style = "word-break:break-word; word-wrap:break-word;"
    cells.innerHTML = "中文名稱: " + obj.title_tw;
    */
    if (getByid("Event_Choose").selected == true) {
        cells = eTable.insertRow(1);
        cells = cells.insertCell(0);
        cells.style = "word-break:break-word; word-wrap:break-word;"
        cells.innerHTML = `如果按住<select id="` + obj.id + `_keydowning"><option>w</option><option>a</option><option>s</option><option>d</option></select>
    <select id="`+ obj.id + `_keydowning_direction"><option>往右移動</option><option>往左移動</option><option>往上移動</option><option>往下移動</option></select>
    <select id="`+ obj.id + `_keydowning_move"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>7</option><option>10</option><option>15</option><option>20</option></select>格。
    <button onclick="KeyDowningMoveRegistered(`+ obj.id + `)";>ok</button>
    `;

        cells = eTable.insertRow(2);
        cells = cells.insertCell(0);
        cells.style = "word-break:break-word; word-wrap:break-word;"
        cells.innerHTML = `如果碰到
    <input id="`+ obj.id + `_pounching_obj" size='6' type='text' value='輸入類別'/>
    廣播<input id="`+ obj.id + `_pounching_broadcast" size='6' type='text' value='事件2'/>
    <button onclick="KeyPounchRegistered(`+ obj.id + `)";>ok</button>
    `;

        cells = eTable.insertRow(3);
        cells = cells.insertCell(0);
        cells.style = "word-break:break-word; word-wrap:break-word;"
        cells.innerHTML = `如果按下<select id="` + obj.id + `_keydownBroadcast" ><option>w</option><option>a</option><option>s</option><option>d</option><option>space</option></select>
    廣播<input  id="`+ obj.id + `_keydownBroadcast_broadcast" size='6' type='text' value='事件1'/>
    <button  onclick="KeyDownBroadcastRegistered(`+ obj.id + `)">ok</button>
    `;

        cells = eTable.insertRow(3);
        cells = cells.insertCell(0);
        cells.style = "word-break:break-word; word-wrap:break-word;"
        cells.innerHTML = `如果按下<select id="` + obj.id + `_keydown" ><option>w</option><option>a</option><option>s</option><option>d</option></select>
    <select id="`+ obj.id + `_keydown_action" ><option>取消隱形</option><option>隱形</option><option>銷毀</option><option>左右正向</option><option>左右反向</option><option>左右反轉</option><option>上下正向</option><option>上下反向</option><option>上下反轉</option></select>
    <button  onclick="KeyDownEventRegistered(`+ obj.id + `)">ok</button>
    `;

        cells = eTable.insertRow(4);
        cells = cells.insertCell(0);
        cells.style = "word-break:break-word; word-wrap:break-word;"
        cells.innerHTML = `如果收到廣播<input id="` + obj.id + `_broadcast_get" size='6' type='text' value='事件1'/>
    <select id="`+ obj.id + `_broadcast_action" ><option>取消隱形</option><option>隱形</option><option>銷毀</option><option>左右正向</option><option>左右反向</option><option>左右反轉</option><option>上下正向</option><option>上下反向</option><option>上下反轉</option><option>產生分身</option></select>
    <button onclick="broadcastRegistered(`+ obj.id + `)">ok</button>   `;



    }
    if (getByid("CloneEvent_Choose").selected == true) {
        cells = eTable.insertRow(1);
        cells = cells.insertCell(0);
        cells.style = "word-break:break-word; word-wrap:break-word;"
        cells.innerHTML = `如果分身產生
    <select id="`+ obj.id + `_clonemove" ><option>移動到</option></select>
    <input id="`+ obj.id + `_clonemove_obj" size='6' type='text' value='輸入類別'/>
    <button onclick="cloneActionRegistered(`+ obj.id + `)">ok</button>   `;

        cells = eTable.insertRow(2);
        cells = cells.insertCell(0);
        cells.style = "word-break:break-word; word-wrap:break-word;"
        cells.innerHTML = `如果分身產生,等待
    <input id="`+ obj.id + `_clonewait_time" size='3' type='text' value='100'/>毫秒後
    <select id="`+ obj.id + `_clonewait_action" ><option>取消隱形</option><option>隱形</option><option>銷毀</option><option>左右正向</option><option>左右反向</option><option>左右反轉</option><option>上下正向</option><option>上下反向</option><option>上下反轉</option></select>
    <button onclick="cloneWaitRegistered(`+ obj.id + `)">ok</button>   `;

        cells = eTable.insertRow(3);
        cells = cells.insertCell(0);
        cells.style = "word-break:break-word; word-wrap:break-word;"
        cells.innerHTML = `如果分身產生,等待
<input id="`+ obj.id + `_clonewaitbroadcast_time" size='3' type='text' value='100'/>毫秒後,廣播
<input  id="`+ obj.id + `_clonewaitbroadcast_broadcast" size='6' type='text' value='事件1'/>
<button onclick="cloneWaitBroadcastnRegistered(`+ obj.id + `)">ok</button>   `;
    }

    if (getByid("SpecialEvent_Choose").selected == true) {
        cells = eTable.insertRow(1);
        cells = cells.insertCell(0);
        cells.style = "word-break:break-word; word-wrap:break-word;"
        cells.innerHTML = `如果碰到<input  id="` + obj.id + `_pounchstop_obj" size='6' type='text' value='障礙物'/>,停止前進
    <button  onclick="pounchStopRegistered(`+ obj.id + `)">ok</button>
    `;
    }
    var eTable2 = document.createElement("table");
    eTable2.id = "ObjEventTable2";
    // /Table.className = "table table-dark table-striped";
    eTable2.setAttribute("border", 2);

    getByid("selectObjectEventDiv").appendChild(eTable2);
    getByid("ObjEventTable2").parentNode.replaceChild(eTable2, getByid("ObjEventTable2"));



    eTable2.style = "table-layout:fixed;"
    eTable2.width = "300";

    var eventobj = getObjById(obj.id).event;
    for (var e1 = 0; e1 < eventobj.length; e1++) {
        var cells = eTable2.insertRow(e1);
        cells = cells.insertCell(0);
        cells.style = "word-break:break-word; word-wrap:break-word;"
        if (eventobj[e1][0] == 'KeyDowningMoveRegistered') {
            cells.innerHTML = "如果按住" + eventobj[e1][1] + eventobj[e1][2] + eventobj[e1][3];//+
            var button_tmp = document.createElement("BUTTON");
            button_tmp.id = "button_event" + e1;
            button_tmp.obj = eventobj[e1];
            button_tmp.style.float = "right middle";
            button_tmp.innerText = "刪除";
            button_tmp.onclick = function () {
                this.obj[0] = "delete";
                getByid("RefleshImgButton").onclick();
            }
            cells.appendChild(button_tmp);
            getByid("button_event" + e1).parentNode.replaceChild(button_tmp, getByid("button_event" + e1));
        }
        if (eventobj[e1][0] == 'KeyPounchRegistered') {
            cells.innerHTML = "如果碰到" + eventobj[e1][1] + ":廣播" + eventobj[e1][2];//+
            var button_tmp = document.createElement("BUTTON");
            button_tmp.id = "button_event" + e1;
            button_tmp.obj = eventobj[e1];
            button_tmp.style.float = "right middle";
            button_tmp.innerText = "刪除";
            button_tmp.onclick = function () {
                this.obj[0] = "delete";
                getByid("RefleshImgButton").onclick();
            }
            cells.appendChild(button_tmp);
            getByid("button_event" + e1).parentNode.replaceChild(button_tmp, getByid("button_event" + e1));
        }
        if (eventobj[e1][0] == 'KeyDownBroadcastRegistered') {
            cells.innerHTML = "如果按下" + eventobj[e1][1] + ",廣播:" + eventobj[e1][2];//+
            var button_tmp = document.createElement("BUTTON");
            button_tmp.id = "button_event" + e1;
            button_tmp.obj = eventobj[e1];
            button_tmp.style.float = "right middle";
            button_tmp.innerText = "刪除";
            button_tmp.onclick = function () {
                this.obj[0] = "delete";
                getByid("RefleshImgButton").onclick();
            }
            cells.appendChild(button_tmp);
            getByid("button_event" + e1).parentNode.replaceChild(button_tmp, getByid("button_event" + e1));
        }
        if (eventobj[e1][0] == 'KeyDownEventRegistered') {
            cells.innerHTML = "如果按下" + eventobj[e1][1] + ",執行:" + eventobj[e1][2];//+
            var button_tmp = document.createElement("BUTTON");
            button_tmp.id = "button_event" + e1;
            button_tmp.obj = eventobj[e1];
            button_tmp.style.float = "right middle";
            button_tmp.innerText = "刪除";
            button_tmp.onclick = function () {
                this.obj[0] = "delete";
                getByid("RefleshImgButton").onclick();
            }
            cells.appendChild(button_tmp);
            getByid("button_event" + e1).parentNode.replaceChild(button_tmp, getByid("button_event" + e1));
        }
        if (eventobj[e1][0] == 'cloneActionRegistered') {
            cells.innerHTML = "如果分身產生," + eventobj[e1][1] + ":" + eventobj[e1][2];//+
            var button_tmp = document.createElement("BUTTON");
            button_tmp.id = "button_event" + e1;
            button_tmp.obj = eventobj[e1];
            button_tmp.style.float = "right middle";
            button_tmp.innerText = "刪除";
            button_tmp.onclick = function () {
                this.obj[0] = "delete";
                getByid("RefleshImgButton").onclick();
            }
            cells.appendChild(button_tmp);
            getByid("button_event" + e1).parentNode.replaceChild(button_tmp, getByid("button_event" + e1));
        }
        if (eventobj[e1][0] == 'broadcastRegistered') {
            cells.innerHTML = "如果收到廣播" + eventobj[e1][1] + ":" + eventobj[e1][2];//+
            var button_tmp = document.createElement("BUTTON");
            button_tmp.id = "button_event" + e1;
            button_tmp.obj = eventobj[e1];
            button_tmp.style.float = "right middle";
            button_tmp.innerText = "刪除";
            button_tmp.onclick = function () {
                this.obj[0] = "delete";
                getByid("RefleshImgButton").onclick();
            }
            cells.appendChild(button_tmp);
            getByid("button_event" + e1).parentNode.replaceChild(button_tmp, getByid("button_event" + e1));
        }
        if (eventobj[e1][0] == 'cloneWaitRegistered') {
            cells.innerHTML = "如果分身產生,等待" + eventobj[e1][1] + "毫秒後," + eventobj[e1][2];//+
            var button_tmp = document.createElement("BUTTON");
            button_tmp.id = "button_event" + e1;
            button_tmp.obj = eventobj[e1];
            button_tmp.style.float = "right middle";
            button_tmp.innerText = "刪除";
            button_tmp.onclick = function () {
                this.obj[0] = "delete";
                getByid("RefleshImgButton").onclick();
            }
            cells.appendChild(button_tmp);
            getByid("button_event" + e1).parentNode.replaceChild(button_tmp, getByid("button_event" + e1));
        }
        if (eventobj[e1][0] == 'cloneWaitBroadcastnRegistered') {
            cells.innerHTML = "如果分身產生,等待" + eventobj[e1][1] + "毫秒後,廣播:" + eventobj[e1][2];//+
            var button_tmp = document.createElement("BUTTON");
            button_tmp.id = "button_event" + e1;
            button_tmp.obj = eventobj[e1];
            button_tmp.style.float = "right middle";
            button_tmp.innerText = "刪除";
            button_tmp.onclick = function () {
                this.obj[0] = "delete";
                getByid("RefleshImgButton").onclick();
            }
            cells.appendChild(button_tmp);
            getByid("button_event" + e1).parentNode.replaceChild(button_tmp, getByid("button_event" + e1));
        }
        if (eventobj[e1][0] == 'pounchStopRegistered') {
            cells.innerHTML = "如果碰到" + eventobj[e1][1] + "停止前進";//+
            var button_tmp = document.createElement("BUTTON");
            button_tmp.id = "button_event" + e1;
            button_tmp.obj = eventobj[e1];
            button_tmp.style.float = "right middle";
            button_tmp.innerText = "刪除";
            button_tmp.onclick = function () {
                this.obj[0] = "delete";
                getByid("RefleshImgButton").onclick();
            }
            cells.appendChild(button_tmp);
            getByid("button_event" + e1).parentNode.replaceChild(button_tmp, getByid("button_event" + e1));
        }
    }




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

function WindowRegisterKeyDowning() {

    function KeyDown(KeyboardKeys) {
        var key = KeyboardKeys.which;
        for (var i = 0; i < AllObjList.length; i++) {
            if (AllObjList[i].class == "delete") continue;
            if (AllObjList[i].event) {
                for (var e1 = 0; e1 < AllObjList[i].event.length; e1++) {
                    if (AllObjList[i].event[e1][0] == 'KeyDowningMoveRegistered' &&
                        key == keyCode[AllObjList[i].event[e1][1]]) {
                        AllObjList[i].event[e1][4] = true;
                    }
                    if (AllObjList[i].event[e1][0] == 'KeyDownEventRegistered' &&
                        key == keyCode[AllObjList[i].event[e1][1]]) {
                        if (AllObjList[i].event[e1][2] == "隱形") {
                            AllObjList[i].display = false;
                        }
                        else if (AllObjList[i].event[e1][2] == "取消隱形") {
                            AllObjList[i].display = true;
                        }
                        else if (AllObjList[i].event[e1][2] == "銷毀") {
                            AllObjList[i].class = "delete";
                        }
                        else if (AllObjList[i].event[e1][2] == "左右正向") {
                            AllObjList[i].flipx = false;
                        }
                        else if (AllObjList[i].event[e1][2] == "左右反向") {
                            AllObjList[i].flipx = true;
                        }
                        else if (AllObjList[i].event[e1][2] == "左右反轉") {
                            AllObjList[i].flipx = !AllObjList[i].flipx;
                        }
                        else if (AllObjList[i].event[e1][2] == "上下正向") {
                            AllObjList[i].flipy = false;
                        }
                        else if (AllObjList[i].event[e1][2] == "上下反向") {
                            AllObjList[i].flipy = true;
                        }
                        else if (AllObjList[i].event[e1][2] == "上下反轉") {
                            AllObjList[i].flipy = !AllObjList[i].flipy;
                        }
                        //flag1
                        getByid("RefleshImgButton").onclick();
                    }
                    if (AllObjList[i].event[e1][0] == 'KeyDownBroadcastRegistered' &&
                        key == keyCode[AllObjList[i].event[e1][1]]) {
                        GameWorld.broadcast.push(AllObjList[i].event[e1][2]);
                        //alert(i);
                    }
                }
            }
        }
    }

    function KeyUp(KeyboardKeys) {
        var key = KeyboardKeys.which;
        for (var i = 0; i < AllObjList.length; i++) {
            if (AllObjList[i].class == "delete") continue;
            if (AllObjList[i].event) {
                for (var e1 = 0; e1 < AllObjList[i].event.length; e1++) {
                    if (AllObjList[i].event[e1][0] == 'KeyDowningMoveRegistered' &&
                        key == keyCode[AllObjList[i].event[e1][1]]) {
                        AllObjList[i].event[e1][4] = false;
                    }
                }
                //getByid("RefleshImgButton").onclick();
            }
        }
    }
    setInterval(function () {
        for (var i = 0; i < AllObjList.length; i++) {
            if (AllObjList[i].class == "delete") continue;
            if (AllObjList[i].event) {
                for (var e1 = 0; e1 < AllObjList[i].event.length; e1++) {
                    if (AllObjList[i].event[e1][0] == 'KeyDowningMoveRegistered' &&
                        AllObjList[i].event[e1][4] == true) {
                        //AllObjList[i].event[e1][3]=true;
                        //遇到障礙物停止前進
                        var pounchList = [];
                        for (var ec = 0; ec < AllObjList[i].event.length; ec++) {
                            if (AllObjList[i].event[ec][0] == 'pounchStopRegistered') {
                                for (var j = 0; j < AllObjList.length; j++) {
                                    if (AllObjList[j].class == AllObjList[i].event[ec][1])
                                        pounchList.push(AllObjList[j]);
                                }

                            }
                        }

                        if (AllObjList[i].event[e1][2] == "往右移動") {
                            AllObjList[i].x += parseInt(AllObjList[i].event[e1][3]);
                            //碰到障礙物就後退
                            for (var j = 0; j < pounchList.length; j++) {
                                if (pounch(AllObjList[i], pounchList[j]) == true) {
                                    AllObjList[i].x -= parseInt(AllObjList[i].event[e1][3]);
                                }
                            }

                        }
                        else if (AllObjList[i].event[e1][2] == "往左移動") {
                            AllObjList[i].x -= parseInt(AllObjList[i].event[e1][3]);
                            //碰到障礙物就後退
                            for (var j = 0; j < pounchList.length; j++) {
                                if (pounch(AllObjList[i], pounchList[j]) == true) {
                                    AllObjList[i].x += parseInt(AllObjList[i].event[e1][3]);
                                }
                            }
                        }
                        else if (AllObjList[i].event[e1][2] == "往上移動") {
                            AllObjList[i].y -= parseInt(AllObjList[i].event[e1][3]);
                            //碰到障礙物就後退
                            for (var j = 0; j < pounchList.length; j++) {
                                if (pounch(AllObjList[i], pounchList[j]) == true) {
                                    AllObjList[i].y += parseInt(AllObjList[i].event[e1][3]);
                                }
                            }
                        }
                        else if (AllObjList[i].event[e1][2] == "往下移動") {
                            AllObjList[i].y += parseInt(AllObjList[i].event[e1][3]);
                            //碰到障礙物就後退
                            for (var j = 0; j < pounchList.length; j++) {
                                if (pounch(AllObjList[i], pounchList[j]) == true) {
                                    AllObjList[i].y -= parseInt(AllObjList[i].event[e1][3]);
                                }
                            }
                        }
                        // getByid("RefleshImgButton").onclick();
                    }
                }
            }
        }
    }, 10);

    setInterval(function () {
        for (var i = 0; i < AllObjList.length; i++) {
            if (AllObjList[i].class == "delete") continue;
            if (AllObjList[i].event) {
                for (var e1 = 0; e1 < AllObjList[i].event.length; e1++) {
                    if (AllObjList[i].event[e1][0] == 'KeyPounchRegistered') {
                        for (var j = 0; j < AllObjList.length; j++) {
                            if (AllObjList[j].class == AllObjList[i].event[e1][1] && i != j) {
                                if (pounch(AllObjList[i], AllObjList[j]) == true) {
                                    GameWorld.broadcast.push(AllObjList[i].event[e1][2]);
                                    //alert(AllObjList[i].event[e1][2]);
                                }
                            }
                        }
                    }
                }
            }
        }
        for (var i = 0; i < AllObjList.length; i++) {
            if (AllObjList[i].class == "delete") continue;
            if (AllObjList[i].event) {
                for (var e1 = 0; e1 < AllObjList[i].event.length; e1++) {
                    if (AllObjList[i].event[e1][0] == 'broadcastRegistered') {
                        for (var g = 0; g < GameWorld.broadcast.length; g++) {
                            if (GameWorld.broadcast[g] == AllObjList[i].event[e1][1]) {
                                if (AllObjList[i].event[e1][2] == "隱形") {
                                    AllObjList[i].display = false;
                                }
                                else if (AllObjList[i].event[e1][2] == "取消隱形") {
                                    AllObjList[i].display = true;
                                }
                                else if (AllObjList[i].event[e1][2] == "銷毀") {
                                    AllObjList[i].class = "delete";
                                }
                                else if (AllObjList[i].event[e1][2] == "左右正向") {
                                    AllObjList[i].flipx = false;
                                }
                                else if (AllObjList[i].event[e1][2] == "左右反向") {
                                    AllObjList[i].flipx = true;
                                }
                                else if (AllObjList[i].event[e1][2] == "左右反轉") {
                                    AllObjList[i].flipx = !AllObjList[i].flipx;
                                }
                                else if (AllObjList[i].event[e1][2] == "上下正向") {
                                    AllObjList[i].flipy = false;
                                }
                                else if (AllObjList[i].event[e1][2] == "上下反向") {
                                    AllObjList[i].flipy = true;
                                }
                                else if (AllObjList[i].event[e1][2] == "上下反轉") {
                                    AllObjList[i].flipy = !AllObjList[i].flipy;
                                }
                                else if (AllObjList[i].event[e1][2] == "產生分身" && !AllObjList[i].clone) {
                                    var clone = JSON.parse(JSON.stringify(AllObjList[i]));
                                    id_length++;
                                    clone.id = id_length;//
                                    clone.clone = true;
                                    clone.img = AllObjList[i].img;
                                    //clone.event[e1][2]="delete";
                                    //clone.event=AllObjList[i].event;
                                    //console.log(clone);
                                    for (var ec = 0; ec < clone.event.length; ec++) {
                                        if (clone.event[ec][0] == 'KeyDownBroadcastRegistered') {
                                            clone.event[ec][0] = "delete";
                                        }
                                    }
                                    AllObjList.push(clone);
                                    console.log(i);
                                    for (var ec = 0; ec < clone.event.length; ec++) {
                                        if (clone.event[ec][0] == 'cloneActionRegistered') {
                                            var move2obj = getObjByClass(clone.event[ec][2]);
                                            if (!move2obj) continue;
                                            clone.x = move2obj.x;
                                            clone.y = move2obj.y;
                                        }
                                    }

                                    for (var ec = 0; ec < clone.event.length; ec++) {
                                        if (clone.event[ec][0] == 'cloneWaitRegistered') {
                                            if (!isNaN(parseInt(clone.event[ec][1]))) {
                                                if (parseInt(clone.event[ec][1]) >= 0 && parseInt(clone.event[ec][1]) < 100000000) {
                                                    const ec_const2 = ec;
                                                    window.setTimeout(function () {
                                                        if (clone.event[ec_const2][2] == "隱形") {
                                                            clone.display = false;
                                                        }
                                                        else if (clone.event[ec_const2][2] == "取消隱形") {
                                                            clone.display = true;
                                                        }
                                                        else if (clone.event[ec_const2][2] == "銷毀") {
                                                            clone.class = "delete";
                                                        }
                                                        else if (clone.event[ec_const2][2] == "左右正向") {
                                                            clone.flipx = false;
                                                        }
                                                        else if (clone.event[ec_const2][2] == "左右反向") {
                                                            clone.flipx = true;
                                                        }
                                                        else if (clone.event[ec_const2][2] == "左右反轉") {
                                                            clone.flipx = !clone.flipx;
                                                        }
                                                        else if (clone.event[ec_const2][2] == "上下正向") {
                                                            clone.flipy = false;
                                                        }
                                                        else if (clone.event[ec_const2][2] == "上下反向") {
                                                            clone.flipy = true;
                                                        }
                                                        else if (clone.event[ec_const2][2] == "上下反轉") {
                                                            clone.flipy = !clone.flipy;
                                                        }
                                                    }, parseInt(clone.event[ec][1]));
                                                }
                                            }
                                        }
                                    }

                                    for (var ec = 0; ec < clone.event.length; ec++) {
                                        if (clone.event[ec][0] == 'cloneWaitBroadcastnRegistered') {
                                            if (!isNaN(parseInt(clone.event[ec][1]))) {
                                                if (parseInt(clone.event[ec][1]) >= 0 && parseInt(clone.event[ec][1]) < 100000000) {
                                                    const ec_const = ec;
                                                    window.setTimeout(function () {
                                                        GameWorld.broadcast.push(clone.event[ec_const][2]);
                                                    }, parseInt(clone.event[ec][1]));
                                                }
                                            }
                                        }
                                    }




                                }
                                getByid("RefleshImgButton").onclick();
                                //alert('');
                            }
                        }
                    }
                }
            }
        }
        GameWorld.broadcast = [];
        //broadcast
    }, 10);

    window.addEventListener("keydown", KeyDown, true);
    window.addEventListener("keyup", KeyUp, true);
}
setInterval(function () {
    if (checkPouch == true) return;
    refleshGame();
}, 10);
WindowRegisterKeyDowning();


function pounchStopRegistered(id) {
    var obj = getObjById(id);
    obj.event.push(['pounchStopRegistered',
        getByid(id + "_pounchstop_obj").value, false]);
    getByid("RefleshImgButton").onclick();
}

function cloneWaitRegistered(id) {
    var obj = getObjById(id);
    obj.event.push(['cloneWaitRegistered',
        getByid(id + "_clonewait_time").value, getByid(id + "_clonewait_action").value, false]);
    getByid("RefleshImgButton").onclick();
}

function cloneWaitBroadcastnRegistered(id) {
    var obj = getObjById(id);
    obj.event.push(['cloneWaitBroadcastnRegistered',
        getByid(id + "_clonewaitbroadcast_time").value, getByid(id + "_clonewaitbroadcast_broadcast").value, false]);
    getByid("RefleshImgButton").onclick();
}

function cloneActionRegistered(id) {
    var obj = getObjById(id);
    obj.event.push(['cloneActionRegistered',
        getByid(id + "_clonemove").value, getByid(id + "_clonemove_obj").value, false]);
    getByid("RefleshImgButton").onclick();
}
function KeyDownEventRegistered(id) {
    var obj = getObjById(id);
    obj.event.push(['KeyDownEventRegistered',
        getByid(id + "_keydown").value, getByid(id + "_keydown_action").value, false]);
    getByid("RefleshImgButton").onclick();
}

function KeyDownBroadcastRegistered(id) {
    var obj = getObjById(id);
    obj.event.push(['KeyDownBroadcastRegistered',
        getByid(id + "_keydownBroadcast").value, getByid(id + "_keydownBroadcast_broadcast").value, false]);
    getByid("RefleshImgButton").onclick();
}
function broadcastRegistered(id) {
    var obj = getObjById(id);
    obj.event.push(['broadcastRegistered',
        getByid(id + "_broadcast_get").value, getByid(id + "_broadcast_action").value, false]);
    getByid("RefleshImgButton").onclick();
}

function KeyPounchRegistered(id) {
    var obj = getObjById(id);
    obj.event.push(['KeyPounchRegistered',
        getByid(id + "_pounching_obj").value, getByid(id + "_pounching_broadcast").value, false]);
    getByid("RefleshImgButton").onclick();
}
function KeyDowningMoveRegistered(id) {

    var obj = getObjById(id);
    obj.event.push(['KeyDowningMoveRegistered',
        getByid(id + "_keydowning").value, getByid(id + "_keydowning_direction").value, getByid(id + "_keydowning_move").value, false]);

    getByid("RefleshImgButton").onclick();
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
                if (AllObjList[d].class == "delete") continue;
                if (AllObjList[d].display == false) continue;
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
                if (AllObjList[d].class == "delete") continue;
                if (AllObjList[d].display == false) continue;
                if (AllObjList[d].layer == true) continue;
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
        for (var d = 0; d < AllObjList.length; d++) {
            if (AllObjList[d].type == "img") {
                if (AllObjList[d].class == "delete") continue;
                if (AllObjList[d].display == false) continue;
                if (AllObjList[d].layer != true) continue;
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
            if (AllObjList[d].type == "img") {
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

var keyCode = { backspace: 8, tab: 9, enter: 13, shift: 16, ctrl: 17, alt: 18, pausebreak: 19, capslock: 20, esc: 27, space: 32, pageup: 33, pagedown: 34, end: 35, home: 36, leftarrow: 37, uparrow: 38, rightarrow: 39, downarrow: 40, insert: 45, delete: 46, 0: 48, 1: 49, 2: 50, 3: 51, 4: 52, 5: 53, 6: 54, 7: 55, 8: 56, 9: 57, a: 65, b: 66, c: 67, d: 68, e: 69, f: 70, g: 71, h: 72, i: 73, j: 74, k: 75, l: 76, m: 77, n: 78, o: 79, p: 80, q: 81, r: 82, s: 83, t: 84, u: 85, v: 86, w: 87, x: 88, y: 89, z: 90, leftwindowkey: 91, rightwindowkey: 92, selectkey: 93, numpad0: 96, numpad1: 97, numpad2: 98, numpad3: 99, numpad4: 100, numpad5: 101, numpad6: 102, numpad7: 103, numpad8: 104, numpad9: 105, multiply: 106, add: 107, subtract: 109, decimalpoint: 110, divide: 111, f1: 112, f2: 113, f3: 114, f4: 115, f5: 116, f6: 117, f7: 118, f8: 119, f9: 120, f10: 121, f11: 122, f12: 123, numlock: 144, scrolllock: 145, semicolon: 186, equalsign: 187, comma: 188, dash: 189, period: 190, forwardslash: 191, graveaccent: 192, openbracket: 219, backslash: 220, closebracket: 221, singlequote: 222 };
