
getByid("imgListOpetion").onchange = function () {
    if (getByid("Animal_Choose").selected == true) ImgListDiv.style.display = "";
    else ImgListDiv.style.display = "none";
    if (getByid("Background_Choose").selected == true) BackgroundListDiv.style.display = "";
    else BackgroundListDiv.style.display = "none";
    if (getByid("WaterBall_Choose").selected == true) WaterBallListDiv.style.display = "";
    else WaterBallListDiv.style.display = "none";
    if (getByid("Anime_Choose").selected == true) AnimeListDiv.style.display = "";
    else AnimeListDiv.style.display = "none";
    if (getByid("Material_Choose").selected == true) MaterialListDiv.style.display = "";
    else MaterialListDiv.style.display = "none";
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
    cells.innerHTML = "座標X: " + "<input type='text'  value='" + obj.x + "' size='8' onchange='ChooseObj.originX=ChooseObj.x=parseInt(this.value);refleshGame();'/>";

    cells = Table.insertRow(3);
    cells = cells.insertCell(0);
    cells.style = "word-break:break-word; word-wrap:break-word;"
    cells.innerHTML = "座標Y: " + "<input type='text'  value='" + obj.y + "' size='8' onchange='ChooseObj.originY=ChooseObj.y=parseInt(this.value);refleshGame();'/>";

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
    cells.innerHTML = "模式: " + "<input type='button'  value='" + displayGameWorldStatus() + "' size='8' onclick='ChooseObj.status=changeGameWorldStatus();ObjSelect(GameObj);refleshGame();'/>" +
        " 版本: " + ChooseObj.version + "";
    ;

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
    if (getByid("StatusEvent_Choose").selected == true)
        cells.innerHTML = "狀態事件: ";//+ obj.name;
    if (getByid("Variable_Choose").selected == true)
        cells.innerHTML = "自訂變數: ";//+ obj.name;
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
    if (getByid("Event_Choose").selected == true) {
        cells = eTable.insertRow(1);
        cells = cells.insertCell(0);
        cells.style = "word-break:break-word; word-wrap:break-word;"
        cells.innerHTML = `當按下<input  id="` + obj.id + `_KeydownGameWorldJump_key" size='1' type='text' value='w'/>,啟動跳躍,
        Y軸移動<input  id="`+ obj.id + `_KeydownGameWorldJump_y"  min="-1000" max="1000" type='number' value='-4' style='width:60px;'/>,持續
    <input  id="`+ obj.id + `_KeydownGameWorldJump_steps"  min="0" max="1000" type='number' value='10' style='width:60px;'/>
    <button  onclick="KeydownGameWorldJumpRegistered(`+ obj.id + `)">ok</button>
    `;
    }
    if (getByid("SpecialEvent_Choose").selected == true) {
        cells = eTable.insertRow(1);
        cells = cells.insertCell(0);
        cells.style = "word-break:break-word; word-wrap:break-word;"
        cells.innerHTML = `設定地心引力為Y軸移動
    <input  id="`+ obj.id + `_GravityGameWorldY_y"  min="-1000" max="1000" type='number' value='2' style='width:60px;'/>
    <button  onclick="GravityGameWorldYRegistered(`+ obj.id + `)">ok</button>
    `;

        cells = eTable.insertRow(2);
        cells = cells.insertCell(0);
        cells.style = "word-break:break-word; word-wrap:break-word;"
        cells.innerHTML = `設定視野X不斷移動
    <input  id="`+ obj.id + `_ScreenGameWorld_x"  min="-1000" max="1000" type='number' value='2' style='width:60px;'/>像素
    <button  onclick="ScreenGameWorldYRegistered(`+ obj.id + `)">ok</button>
    `;

        //<input id="`+ obj.id + `_pounching_obj" size='6' type='text' value='輸入類別'/>
        // 廣播<input id="`+ obj.id + `_pounching_broadcast" size='6' type='text' value='事件2'/>
        // <button onclick="KeyPounchRegistered(`+ obj.id + `)";>ok</button>

        cells = eTable.insertRow(3);
        cells = cells.insertCell(0);
        cells.style = "word-break:break-word; word-wrap:break-word;"
        cells.innerHTML = `當  <input id="` + obj.id + `_ScreenPounchBorder_obj" size='6' type='text' value='輸入類別'/>
    與<select id="`+ obj.id + `_ScreenPounchBorder_direction"><option>左邊界</option><option>右邊界</option><option>上邊界</option><option>下邊界</option></select>距離
<input  id="`+ obj.id + `_ScreenPounchBorder_distance"  min="0" max="10000" type='number' value='100' style='width:50px;'/>以內時,視野X增加
<input  id="`+ obj.id + `_ScreenPounchBorder_x"  min="-10000" max="10000" type='number' value='1' style='width:50px;'/>Y增加
<input  id="`+ obj.id + `_ScreenPounchBorder_y"  min="-10000" max="10000" type='number' value='1' style='width:50px;'/>
<button  onclick="ScreenPounchBorderYRegistered(`+ obj.id + `)">ok</button>
`;
    }
    var eTable2 = document.createElement("table");
    eTable2.id = "ObjEventTable2";
    // /Table.className = "table table-dark table-striped";
    eTable2.setAttribute("border", 2);

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
        if (eventobj[e1][0] == 'GravityGameWorldYRegistered') {
            cells.innerHTML = "設定地心引力為Y軸移動" + eventobj[e1][1] + "像素";//+
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

        if (eventobj[e1][0] == 'KeydownGameWorldJumpRegistered') {
            cells.innerHTML = "當按下" + eventobj[e1][1] + ",啟動跳躍,Y軸移動" + eventobj[e1][2] +
                ",持續" + eventobj[e1][3];//+
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

        if (eventobj[e1][0] == 'ScreenPounchBorderYRegistered') {
            cells.innerHTML = "當" + eventobj[e1][1] + "與" + eventobj[e1][2] + "距離" + eventobj[e1][3] + "以內時,視野X增加" +
                eventobj[e1][4] + "Y增加" + eventobj[e1][5];//+
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
        if (eventobj[e1][0] == 'ScreenGameWorldYRegistered') {
            cells.innerHTML = "設定視野X不斷移動" + eventobj[e1][1] + "像素";//+
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
    cells.innerHTML = "座標X: " + "<input type='text'  value='" + obj.x + "' size='6' onchange='ChooseObj.originX=ChooseObj.x=parseInt(this.value);refleshGame();'/>" +
        "座標Y: " + "<input type='text'  value='" + obj.y + "' size='6' onchange='ChooseObj.originY=ChooseObj.y=parseInt(this.value);refleshGame();'/>";

    cells = Table.insertRow(3);
    cells = cells.insertCell(0);
    cells.style = "word-break:break-word; word-wrap:break-word;"
    cells.innerHTML = "寬度:" + "<input type='text'  value='" + obj.width + "' size='6' onchange='ChooseObj.width=parseInt(this.value);refleshGame();'/>" +
        "長度: " + "<input type='text'  value='" + obj.height + "' size='6' onchange='ChooseObj.height=parseInt(this.value);refleshGame();'/>";

    cells = Table.insertRow(4);
    cells = cells.insertCell(0);
    cells.style = "word-break:break-word; word-wrap:break-word;"
    cells.innerHTML = "左右反轉: " + "<input type='button'  value='" + obj.flipx + "' size='8' onclick='ChooseObj.flipx=this.value=!(ChooseObj.flipx);refleshGame();'/>" +
        "上下反轉: " + "<input type='button'  value='" + obj.flipy + "' size='8' onclick='ChooseObj.flipy=this.value=!(ChooseObj.flipy);refleshGame();'/>";

    cells = Table.insertRow(5);
    cells = cells.insertCell(0);
    cells.style = "word-break:break-word; word-wrap:break-word;"
    cells.innerHTML = "繪圖優先度：" + "<input type='button'  value='" + obj.layer + "' size='8' onclick='ChooseObj.layer=this.value=!(ChooseObj.layer);refleshGame();'/>"
        + ",顯示隱藏：<input type='button'  value='" + obj.display + "' size='8' onclick='ChooseObj.display=this.value=!(ChooseObj.display);refleshGame();'/>";

    cells = Table.insertRow(6);
    cells = cells.insertCell(0);
    cells.style = "word-break:break-word; word-wrap:break-word;"
    cells.innerHTML = "類別: " + "<input type='text'  value='" + obj.class + "' size='6' onchange='ChooseObj.class=this.value;refleshGame();'/>" +
        "對齊：<input type='checkbox' id='AlignCheckbox' onchange='AlignCheck=this.checked;refleshGame()'> ";

    if (obj.type != 'img') {
        cells = Table.insertRow(7);
        cells = cells.insertCell(0);
        cells.style = "word-break:break-word; word-wrap:break-word;"
        cells.innerHTML = "轉換類型: " + "<input type='button'  value='" + obj.type + "' size='7' onclick='ChooseObj.originType=ChooseObj.type;ChooseObj.type=`img`;" +
            "if(ChooseObj.type==`img`){ChooseObj.x=ChooseObj.originX-=GameObj.x;ChooseObj.y=ChooseObj.originY-=GameObj.y;}else{ChooseObj.x=ChooseObj.originX+=GameObj.x;ChooseObj.y=ChooseObj.originY+=GameObj.y;}" +
            "refleshGame();getByid(`RefleshImgButton`).click();'/>";
        //getByid("RefleshImgButton").onclick();
    } else if (obj.originType != undefined) {
        cells = Table.insertRow(7);
        cells = cells.insertCell(0);
        cells.style = "word-break:break-word; word-wrap:break-word;"
        cells.innerHTML = "轉換類型: " + "<input type='button' value='" + obj.type + "' size='7' onclick='ChooseObj.type=ChooseObj.originType;" +
            "if(ChooseObj.type==`img`){ChooseObj.x=ChooseObj.originX-=GameObj.x;ChooseObj.y=ChooseObj.originY-=GameObj.y;}else{ChooseObj.x=ChooseObj.originX+=GameObj.x;ChooseObj.y=ChooseObj.originY+=GameObj.y;}" +
            "refleshGame();getByid(`RefleshImgButton`).click();'/>";
        //getByid("RefleshImgButton").onclick();
    }/*var cells = Table.insertRow(2);
    cells = cells.insertCell(0);
    cells.style = "word-break:break-word; word-wrap:break-word;"
    cells.innerHTML = "類型: " + obj.classtype_tw; 
    */
    getByid("selectObjectDiv").appendChild(Table);
    getByid("ObjTable").parentNode.replaceChild(Table, getByid("ObjTable"));
    if (AlignCheck == true || AlignCheck == "checked") getByid("AlignCheckbox").checked = true;
    else getByid("AlignCheckbox").checked = false;


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
    if (getByid("StatusEvent_Choose").selected == true)
        cells.innerHTML = "狀態事件: ";//+ obj.name;
    if (getByid("Variable_Choose").selected == true)
        cells.innerHTML = "自訂變數: ";//+ obj.name;
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
        cells.innerHTML = //`如果按住<select id="` + obj.id + `_keydowning"><option>w</option><option>a</option><option>s</option><option>d</option></select>
            `如果按住<input  id="` + obj.id + `_keydowning" size='1' type='text' value='w'/>
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
        cells.innerHTML = //`如果按下<select id="` + obj.id + `_keydownBroadcast" ><option>w</option><option>a</option><option>s</option><option>d</option><option>space</option></select>
            `如果按下<input  id="` + obj.id + `_keydownBroadcast" size='1' type='text' value='w'/>
        廣播<input  id="`+ obj.id + `_keydownBroadcast_broadcast" size='6' type='text' value='事件1'/>
        <button  onclick="KeyDownBroadcastRegistered(`+ obj.id + `)">ok</button>
        `;

        cells = eTable.insertRow(3);
        cells = cells.insertCell(0);
        cells.style = "word-break:break-word; word-wrap:break-word;"
        cells.innerHTML = //`如果按下<select id="` + obj.id + `_keydown" ><option>w</option><option>a</option><option>s</option><option>d</option></select>
            `如果按下<input  id="` + obj.id + `_keydown" size='1' type='text' value='w'/>
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

        cells = eTable.insertRow(3);
        cells = cells.insertCell(0);
        cells.style = "word-break:break-word; word-wrap:break-word;"
        cells.innerHTML = `受地心引力影響，但碰到<input  id="` + obj.id + `_pounchGravity_obj" size='6' type='text' value='場景'/>除外
<button  onclick="pounchGravityRegistered(`+ obj.id + `)">ok</button>
`;
    }
    if (getByid("AnimeEvent_Choose").selected == true) {
        cells = eTable.insertRow(1);
        cells = cells.insertCell(0);
        cells.innerHTML =// `如果按下<select id="` + obj.id + `_keydownAnime" ><option>w</option><option>a</option><option>s</option><option>d</option></select>
            `如果按下<input  id="` + obj.id + `_keydownAnime" size='1' type='text' value='w'/>
        轉換為第<input class="number_keydownAnime_target" id="`+ obj.id + `_keydownAnime_target" min="0" max="1000" type='number' value='1'/>型態
        <button  onclick="KeyDownAnimeEventRegistered(`+ obj.id + `)">ok</button>
        `;
        cells = eTable.insertRow(2);
        cells = cells.insertCell(0);
        cells.innerHTML = `當狀態為<input  id="` + obj.id + `_statusAnime" size='4' type='text' value='normal'/>
        時保持第<input  id="` + obj.id + `_statusAnime_target" size='1' type='text' value='0'/>型態
        <button  onclick="statusAnimeEventRegistered(`+ obj.id + `)">ok</button>
        `;
        cells = eTable.insertRow(3);
        cells = cells.insertCell(0);
        cells.innerHTML = `當狀態為<input  id="` + obj.id + `_statusFormeList" size='4' type='text' value='normal'/>
        時保持<input  id="` + obj.id + `_statusFormeList_target" size='4' type='text' value='型態表1'/>型態表
        <button  onclick="statusFormeListEventRegistered(`+ obj.id + `)">ok</button>
        `;
    }
    if (getByid("StatusEvent_Choose").selected == true) {
        cells = eTable.insertRow(1);
        cells = cells.insertCell(0);
        cells.innerHTML = `按住<input  id="` + obj.id + `_keyPressStatus" size='1' type='text' value='w'/>
        時的狀態為<input  id="` + obj.id + `_keyPressStatus_target" size='4' type='text' value='走路'/>
        <button  onclick="KeyPressStatusEventRegistered(`+ obj.id + `)">ok</button>
        `;
        cells = eTable.insertRow(2);
        cells = cells.insertCell(0);
        cells.innerHTML = `碰到<input  id="` + obj.id + `_pounchStatus_obj" size='4' type='text' value='輸入類別'/>
        時的狀態為<input  id="` + obj.id + `_pounchStatus_target" size='4' type='text' value='爬梯子'/>
        <button  onclick="PounchStatusEventRegistered(`+ obj.id + `)">ok</button>
        `;
    }
    if (getByid("Variable_Choose").selected == true) {
        cells = eTable.insertRow(1);
        cells = cells.insertCell(0);
        cells.innerHTML = `設定<input id="` + obj.id + `_customVariable_target" value='變數1' size='6' type='text'/>,其值為
        <input id="`+ obj.id + `_customVariable_number" value='1' min="0" max="1000" type='number' />
        <button  onclick="CustomVariableRegistered(`+ obj.id + `)">ok</button>
        `;
        cells = eTable.insertRow(2);
        cells = cells.insertCell(0);//JSON.parse("[3,4,5]")
        cells.innerHTML = `設定型態表<input id="` + obj.id + `_customFormeList_name" value='型態表1' size='4' type='text'/>,其值為
        <input id="`+ obj.id + `_customFormeList_list" value='[1,2,3]' size='4' type='text'/>,間隔
        <input id="`+ obj.id + `_customFormeList_timer" value='500' min="10" max="1000000" type='number' />毫秒
        <button  onclick="CustomFormeListRegistered(`+ obj.id + `)">ok</button>
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
        if (eventobj[e1][0] == 'pounchGravityRegistered') {
            cells.innerHTML = "受地心引力影響，但碰到" + eventobj[e1][1] + "除外";//+
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
        if (eventobj[e1][0] == 'statusAnimeEventRegistered') {
            cells.innerHTML = "當狀態為" + eventobj[e1][1] + "時保持第" + eventobj[e1][2] + "型態";//+
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
        if (eventobj[e1][0] == 'statusFormeListEventRegistered') {
            cells.innerHTML = "當狀態為" + eventobj[e1][1] + "時保持" + eventobj[e1][2] + "型態表";//+
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

        if (eventobj[e1][0] == 'KeyPressStatusEventRegistered') {
            cells.innerHTML = "按住" + eventobj[e1][1] + "時的狀態為" + eventobj[e1][2];//+
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

        if (eventobj[e1][0] == 'PounchStatusEventRegistered') {
            cells.innerHTML = "碰到" + eventobj[e1][1] + "時的狀態為" + eventobj[e1][2];//+
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
    var variableobj = getObjById(obj.id).variable;
    for (var e2 = 0; e2 < variableobj.length; e2++) {
        var cells = eTable2.insertRow(e1);//yes
        cells = cells.insertCell(0);
        cells.style = "word-break:break-word; word-wrap:break-word;"
        if (variableobj[e2][0] == 'CustomVariableRegistered') {
            cells.innerHTML = "設定" + variableobj[e2][1] + ",其值為" + variableobj[e2][2] + "";//+
            var button_tmp = document.createElement("BUTTON");
            button_tmp.id = "button_variable" + e2;
            button_tmp.obj = variableobj[e2];
            button_tmp.style.float = "right middle";
            button_tmp.innerText = "刪除";
            button_tmp.onclick = function () {
                this.obj[0] = "delete";
                getByid("RefleshImgButton").onclick();
            }
            cells.appendChild(button_tmp);
            getByid("button_variable" + (e2)).parentNode.replaceChild(button_tmp, getByid("button_variable" + e2));
        }
    }

    var formeobj = getObjById(obj.id).forme;
    for (var e2 = 0; e2 < formeobj.length; e2++) {
        var cells = eTable2.insertRow(e1);//yes
        cells = cells.insertCell(0);
        cells.style = "word-break:break-word; word-wrap:break-word;"
        if (formeobj[e2][0] == 'CustomFormeListRegistered') {
            cells.innerHTML = "設定型態表" + formeobj[e2]["name"] + ",其值為" + JSON.stringify(formeobj[e2]["list"]) + ",間隔" +
                formeobj[e2]["timer"] + "毫秒";//+
            var button_tmp = document.createElement("BUTTON");
            button_tmp.id = "button_variable" + e2;
            button_tmp.obj = formeobj[e2];
            button_tmp.style.float = "right middle";
            button_tmp.innerText = "刪除";
            button_tmp.onclick = function () {
                this.obj[0] = "delete";
                getByid("RefleshImgButton").onclick();
            }
            cells.appendChild(button_tmp);
            getByid("button_variable" + (e2)).parentNode.replaceChild(button_tmp, getByid("button_variable" + e2));
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
function CustomFormeListRegistered(id) {
    try {
        var obj = getObjById(id);
        var custom = {
            0: "CustomFormeListRegistered",
            name: "" + getByid(id + "_customFormeList_name").value,
            list: JSON.parse(getByid(id + "_customFormeList_list").value),
            timer: parseInt(getByid(id + "_customFormeList_timer").value),
            nowTicks: 0,
            nowForme: JSON.parse(getByid(id + "_customFormeList_list").value)[0],
            nowFrame: 0,
            enable: true//,
           // returnForme: function () { return this.nowForme; }
        }

        if (!obj.forme) { obj.forme = []; }
        obj.forme.push(custom);
    } catch (ex) {
        console.log(ex);
    }

    getByid("RefleshImgButton").onclick();
}

function CustomVariableRegistered(id) {
    var obj = getObjById(id);

    if (!obj.variable) { obj.variable = []; }
    obj.variable.push(['CustomVariableRegistered',

        getByid(id + "_customVariable_target").value, parseFloat(getByid(id + "_customVariable_number").value), false]);
    getByid("RefleshImgButton").onclick();
}

function ScreenPounchBorderYRegistered(id) {
    var obj = getObjById(id);
    obj.event.push(['ScreenPounchBorderYRegistered',
        getByid(id + "_ScreenPounchBorder_obj").value, getByid(id + "_ScreenPounchBorder_direction").value, getByid(id + "_ScreenPounchBorder_distance").value,
        getByid(id + "_ScreenPounchBorder_x").value, getByid(id + "_ScreenPounchBorder_y").value, false]);
    getByid("RefleshImgButton").onclick();
}

function ScreenGameWorldYRegistered(id) {
    var obj = getObjById(id);
    obj.event.push(['ScreenGameWorldYRegistered',
        getByid(id + "_ScreenGameWorld_x").value, false]);
    getByid("RefleshImgButton").onclick();
}

function KeydownGameWorldJumpRegistered(id) {
    var obj = getObjById(id);
    obj.event.push(['KeydownGameWorldJumpRegistered',
        getByid(id + "_KeydownGameWorldJump_key").value, getByid(id + "_KeydownGameWorldJump_y").value,
        getByid(id + "_KeydownGameWorldJump_steps").value, 0, false]);
    getByid("RefleshImgButton").onclick();
}

function GravityGameWorldYRegistered(id) {
    var obj = getObjById(id);
    obj.event.push(['GravityGameWorldYRegistered',
        getByid(id + "_GravityGameWorldY_y").value, false]);
    getByid("RefleshImgButton").onclick();
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

function statusFormeListEventRegistered(id) {
    var obj = getObjById(id);
    obj.event.push(['statusFormeListEventRegistered',
        getByid(id + "_statusFormeList").value, getByid(id + "_statusFormeList_target").value, false]);
    getByid("RefleshImgButton").onclick();
}

function statusAnimeEventRegistered(id) {
    var obj = getObjById(id);
    obj.event.push(['statusAnimeEventRegistered',
        getByid(id + "_statusAnime").value, getByid(id + "_statusAnime_target").value, false]);
    getByid("RefleshImgButton").onclick();
}

function PounchStatusEventRegistered(id) {
    var obj = getObjById(id);
    obj.event.push(['PounchStatusEventRegistered',
        getByid(id + "_pounchStatus_obj").value, getByid(id + "_pounchStatus_target").value, false]);
    getByid("RefleshImgButton").onclick();
}

function KeyPressStatusEventRegistered(id) {
    var obj = getObjById(id);
    obj.event.push(['KeyPressStatusEventRegistered',
        getByid(id + "_keyPressStatus").value, getByid(id + "_keyPressStatus_target").value, false]);
    getByid("RefleshImgButton").onclick();
}

function KeyDownAnimeEventRegistered(id) {
    var obj = getObjById(id);
    obj.event.push(['KeyDownAnimeEventRegistered',
        getByid(id + "_keydownAnime").value, getByid(id + "_keydownAnime_target").value, false]);
    getByid("RefleshImgButton").onclick();
}

function pounchGravityRegistered(id) {
    var obj = getObjById(id);
    obj.event.push(['pounchGravityRegistered',
        getByid(id + "_pounchGravity_obj").value, false]);
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
