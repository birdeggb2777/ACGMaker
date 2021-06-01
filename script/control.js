
getByid("imgListOpetion").onchange = function () {
    if (getByid("Animal_Choose").selected == true) ImgListDiv.style.display = "";
    else ImgListDiv.style.display = "none";
    if (getByid("Background_Choose").selected == true) BackgroundListDiv.style.display = "";
    else BackgroundListDiv.style.display = "none";
    if (getByid("WaterBall_Choose").selected == true) WaterBallListDiv.style.display = "";
    else WaterBallListDiv.style.display = "none";
    if (getByid("Anime_Choose").selected == true) AnimeListDiv.style.display = "";
    else AnimeListDiv.style.display = "none";
}

getByid("jsonfile").onchange = function (e) {
    var file = e.target.files[0];
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {

        var contents = e.target.result;
        convertJSONtoGameWorld(contents);
    };
    reader.readAsText(file);
}

getByid("EventListOpetion").onchange = function () {
    getByid("RefleshImgButton").onclick();
}

function GameWorldSelect(obj, move) {
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
    cells.innerHTML = "模式: " + "<input type='button'  value='" + displayGameWorldStatus() + "' size='8' onclick='ChooseObj.status=changeGameWorldStatus();ObjSelect(GameObj);refleshGame();'/>";

    getByid("selectObjectDiv").appendChild(Table);
    getByid("ObjTable").parentNode.replaceChild(Table, getByid("ObjTable"));

    var button_tmp2 = document.createElement("BUTTON");
    button_tmp2.id = "RefleshImgButton";
    button_tmp2.style.float = "right middle";
    button_tmp2.innerText = "刷新";
    button_tmp2.obj = obj;
    button_tmp2.style.display = "none";
    button_tmp2.onclick = function () { (ObjSelect(this.obj)) };

    getByid('selectObjectDiv').appendChild(button_tmp2);
    getByid("RefleshImgButton").parentNode.replaceChild(button_tmp2, getByid("RefleshImgButton"));

    var button_tmp3 = document.createElement("BUTTON");
    button_tmp3.id = "ClearImgButton";
    button_tmp3.style.float = "right middle";
    button_tmp3.innerText = "回復原狀(刪除分身與恢復被刪除的物件)";
    button_tmp3.obj = obj;
    button_tmp3.style.display = "";
    button_tmp3.onclick = function () { clearGameWorld(); };
    //button_tmp3.onclick = function () { (ObjSelect(this.obj)) };

    getByid('selectObjectDiv').appendChild(button_tmp3);
    getByid("ClearImgButton").parentNode.replaceChild(button_tmp3, getByid("ClearImgButton"));

    var button_tmp4 = document.createElement("BUTTON");
    button_tmp4.id = "CopyImgButton";
    button_tmp4.style.float = "right middle";
    button_tmp4.innerText = "複製";
    button_tmp4.obj = obj;
    button_tmp4.style.display = "none";
    button_tmp4.onclick = function () { CloneObj(obj); };
    //button_tmp3.onclick = function () { (ObjSelect(this.obj)) };

    getByid('selectObjectDiv').appendChild(button_tmp4);
    getByid("CopyImgButton").parentNode.replaceChild(button_tmp4, getByid("CopyImgButton"));

    var button_tmp5 = document.createElement("BUTTON");
    button_tmp5.id = "DeleteImgButton";
    button_tmp5.style.float = "right middle";
    button_tmp5.innerText = "永久刪除";
    button_tmp5.obj = obj;
    button_tmp5.style.display = "none";
    button_tmp5.onclick = function () { DeleteObj(obj); };
    //button_tmp3.onclick = function () { (ObjSelect(this.obj)) };

    getByid('selectObjectDiv').appendChild(button_tmp5);
    getByid("DeleteImgButton").parentNode.replaceChild(button_tmp5, getByid("DeleteImgButton"));



    var image_tmp = document.createElement("IMG");
    image_tmp.id = "selectObjImg";
    image_tmp.width = imgListSize[0];
    image_tmp.height = imgListSize[1];
    image_tmp.src = "";
    image_tmp.style.display = "none";
    getByid('selectObjectDiv').appendChild(image_tmp);
    getByid("selectObjImg").parentNode.replaceChild(image_tmp, getByid("selectObjImg"));


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
        cells.innerHTML = "特殊事件: ";//+ obj.name;i
    if (getByid("AnimeEvent_Choose").selected == true)
        cells.innerHTML = "動畫事件: ";//+ obj.name;
    if (getByid("GameWorld_Choose").selected == true)
        cells.innerHTML = "遊戲設定: ";//+ obj.name;

    if (getByid("GameWorld_Choose").selected == true) {
        cells = eTable.insertRow(1);
        cells = cells.insertCell(0);
        cells.innerHTML = `<button onclick="exportGameWorldJSONFile();">輸出專案資料</button>`

        cells = eTable.insertRow(2);
        cells = cells.insertCell(0);
        cells.innerHTML = `<button onclick="getByid('jsonfile').click();">匯入專案資料</button>`;

        cells = eTable.insertRow(3);
        cells = cells.insertCell(0);
        cells.innerHTML = `<button onclick="ExportGAME();">輸出遊戲</button>`;
    }
    var eTable2 = document.createElement("table");
    eTable2.id = "ObjEventTable2";
    // /Table.className = "table table-dark table-striped";
    eTable2.setAttribute("border", 2);

    getByid("selectObjectEventDiv").appendChild(eTable2);
    getByid("ObjEventTable2").parentNode.replaceChild(eTable2, getByid("ObjEventTable2"));
}

function ObjSelect(obj, move) {

    if (obj == GameObj) {
        GameWorldSelect(obj, move);
        return;
    }



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
    button_tmp2.style.display = "";
    button_tmp2.onclick = function () { (ObjSelect(this.obj)) };

    getByid('selectObjectDiv').appendChild(button_tmp2);
    getByid("RefleshImgButton").parentNode.replaceChild(button_tmp2, getByid("RefleshImgButton"));

    var button_tmp3 = document.createElement("BUTTON");
    button_tmp3.id = "ClearImgButton";
    button_tmp3.style.float = "right middle";
    button_tmp3.innerText = "重新開始遊戲(刪除分身與恢復被銷毀的物件)";
    button_tmp3.obj = obj;
    button_tmp3.style.display = "none";
    //button_tmp3.onclick = function () { (ObjSelect(this.obj)) };

    getByid('selectObjectDiv').appendChild(button_tmp3);
    getByid("ClearImgButton").parentNode.replaceChild(button_tmp3, getByid("ClearImgButton"));

    var button_tmp4 = document.createElement("BUTTON");
    button_tmp4.id = "CopyImgButton";
    button_tmp4.style.float = "right middle";
    button_tmp4.innerText = "複製";
    button_tmp4.obj = obj;
    button_tmp4.style.display = "";
    button_tmp4.onclick = function () { CloneObj(obj); };
    //button_tmp3.onclick = function () { (ObjSelect(this.obj)) };

    getByid('selectObjectDiv').appendChild(button_tmp4);
    getByid("CopyImgButton").parentNode.replaceChild(button_tmp4, getByid("CopyImgButton"));


    var button_tmp5 = document.createElement("BUTTON");
    button_tmp5.id = "DeleteImgButton";
    button_tmp5.style.float = "right middle";
    button_tmp5.innerText = "永久刪除";
    button_tmp5.obj = obj;
    button_tmp5.style.display = "";
    button_tmp5.onclick = function () { DeleteObj(obj); };
    //button_tmp3.onclick = function () { (ObjSelect(this.obj)) };

    getByid('selectObjectDiv').appendChild(button_tmp5);
    getByid("DeleteImgButton").parentNode.replaceChild(button_tmp5, getByid("DeleteImgButton"));


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
        cells.innerHTML = "特殊事件: ";//+ obj.name;i
    if (getByid("AnimeEvent_Choose").selected == true)
        cells.innerHTML = "動畫事件: ";//+ obj.name;
    if (getByid("GameWorld_Choose").selected == true)
        cells.innerHTML = "遊戲設定: ";//+ obj.name;
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


        cells = eTable.insertRow(4);
        cells = cells.insertCell(0);
        cells.style = "word-break:break-word; word-wrap:break-word;"
        cells.innerHTML = `如果分身產生,橫向膨脹直到碰到
        <input id="`+ obj.id + `_cloneLateralExpansion_obj" size='6' type='text' value='輸入類別'/>或邊界
        <button onclick="cloneLateralExpansion(`+ obj.id + `)">ok</button>   `;;

        cells = eTable.insertRow(5);
        cells = cells.insertCell(0);
        cells.style = "word-break:break-word; word-wrap:break-word;"
        cells.innerHTML = `如果分身產生,縱向膨脹直到碰到
        <input id="`+ obj.id + `_cloneVerticalExpansion_obj" size='6' type='text' value='輸入類別'/>或邊界
        <button onclick="cloneVerticalExpansion(`+ obj.id + `)">ok</button>   `;

        cells = eTable.insertRow(6);
        cells = cells.insertCell(0);
        cells.style = "word-break:break-word; word-wrap:break-word;"
        cells.innerHTML = `如果分身產生,等待
        <input id="`+ obj.id + `_clonewaitchangeClass_time" size='3' type='text' value='100'/>毫秒後,變更類別為
        <input  id="`+ obj.id + `_clonewaitchangeClass_class" size='6' type='text' value='類別1'/>
        <button onclick="clonewaitchangeClassRegistered(`+ obj.id + `)">ok</button>   `;
    }

    if (getByid("SpecialEvent_Choose").selected == true) {
        cells = eTable.insertRow(1);
        cells = cells.insertCell(0);
        cells.style = "word-break:break-word; word-wrap:break-word;"
        cells.innerHTML = `如果碰到<input  id="` + obj.id + `_pounchstop_obj" size='6' type='text' value='障礙物'/>,停止前進
    <button  onclick="pounchStopRegistered(`+ obj.id + `)">ok</button>
    `;

        cells = eTable.insertRow(2);
        cells = cells.insertCell(0);
        cells.style = "word-break:break-word; word-wrap:break-word;"
        cells.innerHTML = `如果碰到<input  id="` + obj.id + `_pounchDelete_obj" size='6' type='text' value='炸藥'/>,銷毀
    <button  onclick="pounchDeleteRegistered(`+ obj.id + `)">ok</button>
    `;
    }
    if (getByid("AnimeEvent_Choose").selected == true) {
        cells = eTable.insertRow(1);
        cells = cells.insertCell(0);
        cells.innerHTML = `如果按下<select id="` + obj.id + `_keydownAnime" ><option>w</option><option>a</option><option>s</option><option>d</option></select>
        轉換為第<input class="number_keydownAnime_target" id="`+ obj.id + `_keydownAnime_target" min="0" max="1000" type='number' value='1'/>型態
        <button  onclick="KeyDownAnimeEventRegistered(`+ obj.id + `)">ok</button>
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

        if (eventobj[e1][0] == 'pounchDeleteRegistered') {
            cells.innerHTML = "如果碰到" + eventobj[e1][1] + "銷毀";//+
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

        if (eventobj[e1][0] == 'KeyDownAnimeEventRegistered') {
            cells.innerHTML = "如果按下" + eventobj[e1][1] + "轉換為第" + eventobj[e1][2] + "型態";//+
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

        if (eventobj[e1][0] == 'cloneLateralExpansion') {
            cells.innerHTML = "如果分身產生,橫向膨脹直到碰到" + eventobj[e1][1] + "或邊界";//+
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
        if (eventobj[e1][0] == 'cloneVerticalExpansion') {
            cells.innerHTML = "如果分身產生,縱向膨脹直到碰到" + eventobj[e1][1] + "或邊界";//+
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
        if (eventobj[e1][0] == 'clonewaitchangeClassRegistered') {
            cells.innerHTML = "如果分身產生,等待" + eventobj[e1][1] + "毫秒後,變更類別為" + eventobj[e1][2];//+
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

        var anime_div = document.createElement("DIV")
        anime_div.id = 'selectObjectAnimeDiv';
        getByid('selectObjectDiv').appendChild(anime_div);
        getByid("selectObjectAnimeDiv").parentNode.replaceChild(anime_div, getByid("selectObjectAnimeDiv"));
        //getByid('selectObjectDiv').appendChild();
        //console.log(obj.type);

        //console.log(obj.animeList);
        if (obj.type == "anime" && obj.animeList) {
            for (var a = 0; a < obj.animeList.length; a++) {
                var image_tmp = document.createElement("IMG");
                image_tmp.id = "selectObjImg" + "_anime_" + a;
                image_tmp.obj = obj;
                image_tmp.width = imgListSize[0];
                image_tmp.height = imgListSize[1];
                image_tmp.src = obj.animeList[a];
                image_tmp.path = obj.animeList[a];
                //console.log(1);
                image_tmp.onclick = function () {
                    //alert("");
                    // console.log(444);
                    this.obj.img.src = this.path;
                    // console.log(this.img.src);
                    getByid("RefleshImgButton").onclick();
                    refleshGame();
                }
                anime_div.appendChild(image_tmp);
                try {
                    getByid("selectObjImg" + "_anime_" + a).parentNode.replaceChild(image_tmp, getByid("selectObjImg" + "_anime_" + a));
                    // getByid("selectObjectAnimeDiv").parentNode.replaceChild(image_tmp, getByid("selectObjectAnimeDiv"));
                } catch (ex) { };
            }
        } else {

        }

    } else {

    }

}

function clonewaitchangeClassRegistered(id) {
    var obj = getObjById(id);
    obj.event.push(['clonewaitchangeClassRegistered',
        getByid(id + "_clonewaitchangeClass_time").value, getByid(id + "_clonewaitchangeClass_class").value, false]);
    getByid("RefleshImgButton").onclick();
}

function cloneVerticalExpansion(id) {
    var obj = getObjById(id);
    obj.event.push(['cloneVerticalExpansion',
        getByid(id + "_cloneVerticalExpansion_obj").value, false]);
    getByid("RefleshImgButton").onclick();
}

function cloneLateralExpansion(id) {
    var obj = getObjById(id);
    obj.event.push(['cloneLateralExpansion',
        getByid(id + "_cloneLateralExpansion_obj").value, false]);
    getByid("RefleshImgButton").onclick();
}

function KeyDownAnimeEventRegistered(id) {
    var obj = getObjById(id);
    obj.event.push(['KeyDownAnimeEventRegistered',
        getByid(id + "_keydownAnime").value, getByid(id + "_keydownAnime_target").value, false]);
    getByid("RefleshImgButton").onclick();
}
function pounchDeleteRegistered(id) {
    var obj = getObjById(id);
    obj.event.push(['pounchDeleteRegistered',
        getByid(id + "_pounchDelete_obj").value, false]);
    getByid("RefleshImgButton").onclick();
}
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


    var button_tmp3 = document.createElement("BUTTON");
    button_tmp3.id = "ClearImgButton";
    button_tmp3.style.float = "right middle";
    button_tmp3.innerText = "回復原狀(刪除分身與恢復被刪除的物件)";
    button_tmp3.obj = obj;
    button_tmp3.style.display = "none";
    //button_tmp3.onclick = function () { (ObjSelect(this.obj)) };

    getByid('selectObjectDiv').appendChild(button_tmp3);
    getByid("ClearImgButton").parentNode.replaceChild(button_tmp3, getByid("ClearImgButton"));


    var button_tmp4 = document.createElement("BUTTON");
    button_tmp4.id = "CopyImgButton";
    button_tmp4.style.float = "right middle";
    button_tmp4.innerText = "複製";
    button_tmp4.obj = obj;
    button_tmp4.style.display = "none";
    button_tmp4.onclick = function () { CloneObj(obj); };
    //button_tmp3.onclick = function () { (ObjSelect(this.obj)) };

    getByid('selectObjectDiv').appendChild(button_tmp4);
    getByid("CopyImgButton").parentNode.replaceChild(button_tmp4, getByid("CopyImgButton"));

    var button_tmp5 = document.createElement("BUTTON");
    button_tmp5.id = "DeleteImgButton";
    button_tmp5.style.float = "right middle";
    button_tmp5.innerText = "永久刪除";
    button_tmp5.obj = obj;
    button_tmp5.style.display = "none";
    button_tmp5.onclick = function () { DeleteObj(obj); };
    //button_tmp3.onclick = function () { (ObjSelect(this.obj)) };

    getByid('selectObjectDiv').appendChild(button_tmp5);
    getByid("DeleteImgButton").parentNode.replaceChild(button_tmp5, getByid("DeleteImgButton"));
    //var button_tmp = document.createElement("BUTTON");
    // button_tmp.id = "EditImgButton";
    //button_tmp.style.float = "right middle";
    //button_tmp.innerText = "修改圖片";

    //getByid('selectObjectDiv').appendChild(button_tmp);
    //getByid("EditImgButton").parentNode.replaceChild(button_tmp, getByid("EditImgButton"));

    //alert(obj.classtype == "anime");
    //console.log(obj);
    //getByid('selectObjectDiv').appendChild(document.createElement("BR"));
    var anime_div = document.createElement("DIV")
    anime_div.id = 'selectObjectAnimeDiv';
    //getByid('selectObjectDiv').appendChild();
    if (obj.classtype == "anime" && obj.animeList) {
        for (var a = 0; a < obj.animeList.length; a++) {
            var image_tmp = document.createElement("IMG");
            image_tmp.id = "selectObjImg" + "_anime_" + a;
            image_tmp.obj = obj;
            image_tmp.width = imgListSize[0];
            image_tmp.height = imgListSize[1];
            image_tmp.src = obj.animeList[a];
            image_tmp.path = obj.animeList[a];
            //image_tmp.onclick = function () {
            //this.obj.path = this.path;
            //console.log(this.obj.path);
            //getByid("RefleshImgButton").onclick();
            // }
            anime_div.appendChild(image_tmp);
            try {
                getByid("selectObjImg" + "_anime_" + a).parentNode.replaceChild(image_tmp, getByid("selectObjImg" + "_anime_" + a));
                // getByid("selectObjectAnimeDiv").parentNode.replaceChild(image_tmp, getByid("selectObjectAnimeDiv"));
            } catch (ex) { };
        }
    } else {

    }
    getByid('selectObjectDiv').appendChild(anime_div);
    getByid("selectObjectAnimeDiv").parentNode.replaceChild(anime_div, getByid("selectObjectAnimeDiv"));
}
