
function WindowRegisterKeyDowning() {

    function KeyDown(KeyboardKeys) {
        if (AllObjList[0].State == "MakeGame") return;
        if (document.activeElement.tagName == "INPUT") return;//正在打text時不要發動鍵盤事件
        var key = KeyboardKeys.which;
        //按下按鍵
        AllObjList[0].KeyPressList.push(key);
        //移除重複
        AllObjList[0].KeyPressList = AllObjList[0].KeyPressList.reduce(function (a, b) {
            if (a.indexOf(b) < 0) a.push(b);
            return a;
        }, []);

        for (var i = 0; i < AllObjList.length; i++) {
            if (AllObjList[i].class == "delete") continue;
            for (var e1 = 0; e1 < AllObjList[i].event.length; e1++) {
                if (AllObjList[i].event[e1][0] == 'KeydownGameWorldJumpRegistered' &&
                    key == keyCode[AllObjList[i].event[e1][1]]) {
                    const JumpKeyEvent_ = AllObjList[i].event[e1];
                    if (JumpKeyEvent_[5] > 0) continue;
                    var pounchList = [];
                    for (var i2 = 0; i2 < AllObjList.length; i2++) {
                        if (AllObjList[i2].class == JumpKeyEvent_[4] && AllObjList[i2] != AllObjList[i]) {
                            pounchList.push(AllObjList[i2]);
                        }
                    }
                    var pounchGravity = false;
                    //如果往下掉就會撞到了
                    for (var j = 0; j < pounchList.length; j++) {
                        if (pounch(createPounchObj(AllObjList[i], 0, 3), pounchList[j]) == true) {
                            pounchGravity = true; break;
                        }
                    }
                    if (pounchGravity == false) continue;
                    const steps_ = 200 * 2 * parseFloat(JumpKeyEvent_[3]);
                    const move_y = parseFloat(JumpKeyEvent_[2]);
                    const jumpobj = AllObjList[i];
                    JumpKeyEvent_[5] = steps_;
                    if (AllObjList[0].intervalList) {
                        AllObjList[0].intervalList["" + AllObjList[i].id + "_" + e1 + "_KeydownGameWorldJumpRegistered"] = function () {
                            if (JumpKeyEvent_[5] <= 0) return;//clearInterval(this);
                            else {
                                JumpKeyEvent_[5] -= 200;
                                jumpobj.originY = jumpobj.y -= parseFloat(move_y);
                            }
                        }
                    }
                    // jumpobj.interval = setInterval(function () {
                    //     
                    // }, 200);
                }
            }
        }

        for (var i = 0; i < AllObjList.length; i++) {
            if (AllObjList[i].class == "delete") continue;
            if (AllObjList[i].event) {
                for (var e1 = 0; e1 < AllObjList[i].event.length; e1++) {
                    if (AllObjList[i].event[e1][0] == 'KeyDowningMoveRegistered' &&
                        key == keyCode[AllObjList[i].event[e1][1]]) {
                        AllObjList[i].event[e1][4] = true;
                    }
                    if (AllObjList[i].event[e1][0] == 'keydowningStateMoveRegistered' &&
                        key == keyCode[AllObjList[i].event[e1][1]]) {
                        AllObjList[i].event[e1][5] = true;
                    }

                    if (AllObjList[i].event[e1][0] == 'KeyDownAnimeEventRegistered' &&
                        key == keyCode[AllObjList[i].event[e1][1]]) {
                        AllObjList[i].img.src = AllObjList[i].animeList[AllObjList[i].event[e1][2]];
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
                            if (AllObjList[i].class != "delete") AllObjList[i].originClass = "" + AllObjList[i].class + "";
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
        if (AllObjList[0].State == "MakeGame") return;
        var key = KeyboardKeys.which;
        //放開按鍵
        for (var i = 0; i < AllObjList[0].KeyPressList.length; i++) {
            if (key == AllObjList[0].KeyPressList[i]) {
                AllObjList[0].KeyPressList[i] = null;
            }
        }
        AllObjList[0].KeyPressList = AllObjList[0].KeyPressList.filter(n => n);

        for (var i = 0; i < AllObjList.length; i++) {
            if (AllObjList[i].class == "delete") continue;
            if (AllObjList[i].event) {
                for (var e1 = 0; e1 < AllObjList[i].event.length; e1++) {
                    if (AllObjList[i].event[e1][0] == 'KeyDowningMoveRegistered' &&
                        key == keyCode[AllObjList[i].event[e1][1]]) {
                        AllObjList[i].event[e1][4] = false;
                    }
                    if (AllObjList[i].event[e1][0] == 'keydowningStateMoveRegistered' &&
                        key == keyCode[AllObjList[i].event[e1][1]]) {
                        AllObjList[i].event[e1][5] = false;
                    }
                }
                //getByid("RefleshImgButton").onclick();
            }
        }
    }

    //註冊的事件
    setInterval(function () {
        if (!AllObjList[0].intervalList) AllObjList[0].intervalList = [];
        for (var funcName in AllObjList[0].intervalList) AllObjList[0].intervalList[funcName]();
    }, 10);
    //GameWorld的座標事件
    setInterval(function () {
        if (AllObjList[0].State == "MakeGame") return;
        for (var ec = 0; ec < AllObjList[0].event.length; ec++) {
            if (AllObjList[0].event[ec][0] == 'ScreenGameWorldYRegistered') {
                AllObjList[0].x += parseFloat(AllObjList[0].event[ec][1]);
            }

            if (AllObjList[0].event[ec][0] == 'ScreenPounchBorderYRegistered') {
                for (var i2 = 0; i2 < AllObjList.length; i2++) {
                    if (AllObjList[i2].class == AllObjList[0].event[ec][1] && AllObjList[i2] != AllObjList[0]) {
                        if (AllObjList[0].event[ec][2] == "上邊界") {
                            if (AllObjList[i2].y <= parseFloat(AllObjList[0].event[ec][3])) {
                                AllObjList[0].originX = AllObjList[0].x += parseFloat(AllObjList[0].event[ec][4]);
                                AllObjList[0].originY = AllObjList[0].y += parseFloat(AllObjList[0].event[ec][5]);
                                AllObjList[i2].originX = AllObjList[i2].x -= parseFloat(AllObjList[0].event[ec][4]) / 2;
                                AllObjList[i2].originY = AllObjList[i2].y -= parseFloat(AllObjList[0].event[ec][5]) / 2;
                            }
                        } else if (AllObjList[0].event[ec][2] == "下邊界") {
                            if (AllObjList[i2].y >= AllObjList[0].height - parseFloat(AllObjList[0].event[ec][3])) {
                                AllObjList[0].originX = AllObjList[0].x += parseFloat(AllObjList[0].event[ec][4]);
                                AllObjList[0].originY = AllObjList[0].y += parseFloat(AllObjList[0].event[ec][5]);
                                AllObjList[i2].originX = AllObjList[i2].x -= parseFloat(AllObjList[0].event[ec][4]) / 2;
                                AllObjList[i2].originY = AllObjList[i2].y -= parseFloat(AllObjList[0].event[ec][5]) / 2;
                            }
                        } else if (AllObjList[0].event[ec][2] == "左邊界") {
                            if (AllObjList[i2].x <= parseFloat(AllObjList[0].event[ec][3])) {
                                AllObjList[0].originX = AllObjList[0].x += parseFloat(AllObjList[0].event[ec][4]);
                                AllObjList[0].originY = AllObjList[0].y += parseFloat(AllObjList[0].event[ec][5]);
                                AllObjList[i2].originX = AllObjList[i2].x -= parseFloat(AllObjList[0].event[ec][4]) / 2;
                                AllObjList[i2].originY = AllObjList[i2].y -= parseFloat(AllObjList[0].event[ec][5]) / 2;
                            }
                        } else if (AllObjList[0].event[ec][2] == "右邊界") {
                            if (AllObjList[i2].x >= AllObjList[0].width - parseFloat(AllObjList[0].event[ec][3])) {
                                AllObjList[0].originX = AllObjList[0].x += parseFloat(AllObjList[0].event[ec][4]);
                                AllObjList[0].originY = AllObjList[0].y += parseFloat(AllObjList[0].event[ec][5]);
                                AllObjList[i2].originX = AllObjList[i2].x -= parseFloat(AllObjList[0].event[ec][4]) / 2;
                                AllObjList[i2].originY = AllObjList[i2].y -= parseFloat(AllObjList[0].event[ec][5]) / 2;
                            }
                        }
                    }
                    //AllObjList[0].x += parseFloat(AllObjList[0].event[ec][1]);
                }
            }
        }

        for (var i = 0; i < AllObjList.length; i++) {
            for (var ec = 0; ec < AllObjList[i].event.length; ec++) {
                if (AllObjList[i].event[ec][0] == 'pounchGravityRegistered') {
                    for (var ec2 = 0; ec2 < AllObjList[0].event.length; ec2++) {
                        var pounchList = [];
                        for (var i2 = 0; i2 < AllObjList.length; i2++) {
                            if (AllObjList[i2].class == AllObjList[i].event[ec][1] && AllObjList[i2] != AllObjList[i]) {
                                pounchList.push(AllObjList[i2]);
                            }
                        }
                        var pounchGravity = false;
                        //如果不用往下掉就會撞到了
                        for (var j = 0; j < pounchList.length; j++) {
                            if (pounch(AllObjList[i], pounchList[j]) == true) {
                                pounchGravity = true; break;
                            }
                        }
                        if (pounchGravity == true) continue;
                        //往下掉
                        if (AllObjList[0].event[ec2][0] == 'GravityGameWorldYRegistered') {
                            AllObjList[i].y = parseFloat(AllObjList[i].y) + parseFloat(AllObjList[0].event[ec2][1]);
                        }

                        //碰到例外就往後退
                        for (var j = 0; j < pounchList.length; j++) {
                            if (pounch(AllObjList[i], pounchList[j]) == true) {
                                AllObjList[i].y = parseFloat(AllObjList[i].y) - parseFloat(AllObjList[0].event[ec2][1]);
                            }
                        }
                    }
                }
            }
        }
    }, 10);

    //按住鍵盤事件
    setInterval(function () {
        if (AllObjList[0].State == "MakeGame") return;
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
                    else if (AllObjList[i].event[e1][0] == 'keydowningStateMoveRegistered' &&
                        AllObjList[i].event[e1][5] == true && AllObjList[i].event[e1][4] == AllObjList[i].State) {
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

    //通常型態設定
    setInterval(function () {
        if (AllObjList[0].State == "MakeGame") return;
        for (var i = 0; i < AllObjList.length; i++) {
            if (AllObjList[i].class == "delete") continue;
            if (AllObjList[i].forme) {
                for (var f = 0; f < AllObjList[i].forme.length; f++) {
                    var forme = AllObjList[i].forme[f];
                    if (forme[0] == "CustomFormeListRegistered") {
                        //timer常數
                        forme.nowTicks += 50;
                        if (forme.nowTicks > forme.timer) {
                            forme.nowTicks = 0;
                            forme.nowFrame = forme.nowFrame + 1 >= forme.list.length ? 0 : forme.nowFrame + 1;
                            forme.nowForme = forme.list[forme.nowFrame];
                        }
                    }
                }
            }
        }
    }, 50);
    //狀態與動畫
    setInterval(function () {
        if (AllObjList[0].State == "MakeGame") return;
        //按住某鍵或碰到某物
        for (var i = 0; i < AllObjList.length; i++) {
            if (AllObjList[i].class == "delete") continue;
            if (AllObjList[i].event) {
                var flag = null;
                if (includeElementFromEvent(AllObjList[i].event, 'KeyPressStatusEventRegistered')) flag = false;
                if (includeElementFromEvent(AllObjList[i].event, 'PounchStatusEventRegistered')) flag = false;
                for (var e1 = 0; e1 < AllObjList[i].event.length; e1++) {
                    if (AllObjList[i].event[e1][0] == 'KeyPressStatusEventRegistered') {
                        if (AllObjList[i].event[e1][1]) {
                            if (AllObjList[0].KeyPressList.includes(keyCode[AllObjList[i].event[e1][1]])) {
                                AllObjList[i].State = "" + AllObjList[i].event[e1][2];
                                flag = true;
                            }
                        }
                    }
                }
                for (var e1 = 0; e1 < AllObjList[i].event.length; e1++) {
                    if (AllObjList[i].event[e1][0] == 'PounchStatusEventRegistered') {
                        if (AllObjList[i].event[e1][1]) {
                            var pounchList0 = [];
                            for (var p = 0; p < AllObjList.length; p++) {
                                if (AllObjList[p].class == AllObjList[i].event[e1][1])
                                    pounchList0.push(AllObjList[p]);
                            }

                            var pounch0 = false;
                            for (var p = 0; p < pounchList0.length; p++) {
                                if (pounch(AllObjList[i], pounchList0[p]) == true) {
                                    pounch0 = true;
                                    flag = true;
                                }
                            }
                            if (pounch0 == true) {
                                if (AllObjList[i].class != "delete") {
                                    AllObjList[i].State = "" + AllObjList[i].event[e1][2];
                                    flag = true;
                                };
                            }
                        }
                    }
                }
                if (flag == false) AllObjList[i].State = "normal";
            }
        }
        /*
                //按住某鍵
                for (var i = 0; i < AllObjList.length; i++) {
                    if (AllObjList[i].class == "delete") continue;
                    if (AllObjList[i].event) {
                        var flag = null;
                        if (includeElementFromEvent(AllObjList[i].event, 'KeyPressStatusEventRegistered')) flag = false;
                        for (var e1 = 0; e1 < AllObjList[i].event.length; e1++) {
                            if (AllObjList[i].event[e1][0] == 'KeyPressStatusEventRegistered') {
                                if (AllObjList[i].event[e1][1]) {
                                    if (AllObjList[0].KeyPressList.includes(keyCode[AllObjList[i].event[e1][1]])) {
                                        AllObjList[i].State = "" + AllObjList[i].event[e1][2];
                                        flag = true;
                                    }
                                }
                            }
                            if (flag == false) AllObjList[i].State = "normal";
                        }
                    }
                }
                //碰到某物
                for (var i = 0; i < AllObjList.length; i++) {
                    var flag = null;
                    if (includeElementFromEvent(AllObjList[i].event, 'PounchStatusEventRegistered')) flag = false;
                    for (var e1 = 0; e1 < AllObjList[i].event.length; e1++) {
                        if (AllObjList[i].event[e1][0] == 'PounchStatusEventRegistered') {
                            if (AllObjList[i].event[e1][1]) {
                                var pounchList0 = [];
                                for (var p = 0; p < AllObjList.length; p++) {
                                    if (AllObjList[p].class == AllObjList[i].event[e1][1])
                                        pounchList0.push(AllObjList[p]);
                                }
        
                                var pounch0 = false;
                                for (var p = 0; p < pounchList0.length; p++) {
                                    if (pounch(AllObjList[i], pounchList0[p]) == true) {
                                        pounch0 = true;
                                        flag = true;
                                    }
                                }
                                if (pounch0 == true) {
                                    if (AllObjList[i].class != "delete") AllObjList[i].State = "" + AllObjList[i].event[e1][2];
                                    flag = true;
                                }
                            }
                        }
                        //if (flag == false) AllObjList[i].State = "normal";
                    }
                    if (flag == false) AllObjList[i].State = "normal";
                }*/
        //保持型態
        for (var i = 0; i < AllObjList.length; i++) {
            if (AllObjList[i].class == "delete") continue;
            if (AllObjList[i].event) {
                for (var e1 = 0; e1 < AllObjList[i].event.length; e1++) {
                    if (AllObjList[i].event[e1][0] == 'statusAnimeEventRegistered') {
                        for (var j = 0; j < AllObjList.length; j++) {
                            if (AllObjList[i].State == AllObjList[i].event[e1][1]) {
                                if (!PathCompare(AllObjList[i].img.src, AllObjList[i].animeList[AllObjList[i].event[e1][2]]))
                                    AllObjList[i].img.src = AllObjList[i].animeList[AllObjList[i].event[e1][2]];
                            }
                        }
                    }
                }
            }
        }
        //型態表
        for (var i = 0; i < AllObjList.length; i++) {
            if (AllObjList[i].class == "delete") continue;
            if (AllObjList[i].event) {
                for (var e1 = 0; e1 < AllObjList[i].event.length; e1++) {
                    if (AllObjList[i].event[e1][0] == 'statusFormeListEventRegistered') {
                        for (var j = 0; j < AllObjList.length; j++) {
                            if (AllObjList[i].State == AllObjList[i].event[e1][1]) {
                                if (AllObjList[i].forme) {
                                    for (var f = 0; f < AllObjList[i].forme.length; f++) {
                                        var forme = AllObjList[i].forme[f];
                                        if (forme.name == AllObjList[i].event[e1][2])
                                            if (!PathCompare(AllObjList[i].img.src, AllObjList[i].animeList[forme.nowForme]))
                                                AllObjList[i].img.src = AllObjList[i].animeList[forme.nowForme];
                                    }
                                }
                            }
                        }
                    }
                }
            }

        }

    }, 100);

    //通常事件
    setInterval(function () {
        if (AllObjList[0].State == "MakeGame") return;
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
            for (var ec = 0; ec < AllObjList[i].event.length; ec++) {
                if (AllObjList[i].event[ec][0] == 'pounchDeleteRegistered') {
                    var pounchList0 = [];
                    //for (var ec0 = 0; ec0 < AllObjList[i].event.length; ec0++) {
                    for (var p = 0; p < AllObjList.length; p++) {
                        if (AllObjList[p].class == AllObjList[i].event[ec][1])
                            pounchList0.push(AllObjList[p]);
                    }
                    //}
                    //console.log(pounchList0);

                    var pounch0 = false;
                    for (var p = 0; p < pounchList0.length; p++) {
                        if (pounch(AllObjList[i], pounchList0[p]) == true) {
                            pounch0 = true;
                        }
                    }
                    if (pounch0 == true) {
                        if (AllObjList[i].class != "delete") AllObjList[i].originClass = "" + AllObjList[i].class + "";
                        AllObjList[i].class = "delete";
                    }
                    //for (var j = 0; j < AllObjList.length; j++) {
                    //   if (AllObjList[j].class == AllObjList[i].event[ec][1])
                    ///       pounchList0.push(AllObjList[j]);
                    // }
                }
                //flag
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
                                    if (AllObjList[i].class != "delete") AllObjList[i].originClass = "" + AllObjList[i].class + "";
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
                                    const clone1 = clone;
                                    GameObj.id_length++;
                                    clone.id = GameObj.id_length;//
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
                                        if (clone.event[ec][0] == 'cloneLateralExpansion') {
                                            var pounchList = [];
                                            for (var ec2 = 0; ec2 < AllObjList[i].event.length; ec2++) {
                                                console.log(clone.event[ec2][1]);
                                                //if (AllObjList[i].event[ec2][0] == "cloneLateralExpansion") {
                                                for (var p = 0; p < AllObjList.length; p++) {
                                                    if (AllObjList[p].class == clone.event[ec2][1])
                                                        pounchList.push(AllObjList[p]);
                                                }

                                                // }
                                            }
                                            // console.log(pounchList);
                                            var gameobj = createGameWorldObj();
                                            for (var l = 0; l < gameobj.width; l++) {

                                                if (clone.x < gameobj.x || clone.y < gameobj.y ||
                                                    clone.x + clone.width > gameobj.x + gameobj.width ||
                                                    clone.y + clone.height > gameobj.y + gameobj.height
                                                ) {

                                                } else {
                                                    var pounch1 = false;
                                                    for (var p = 0; p < pounchList.length; p++) {
                                                        if (pounch(clone, pounchList[p]) == true) {
                                                            pounch1 = true;
                                                        }
                                                    }
                                                    if (pounch1 == true) {
                                                        clone.width -= 1;
                                                        clone.x++;
                                                        break;
                                                    };
                                                    clone.width += 1;
                                                    clone.x--;
                                                }
                                            }
                                            for (var l = 0; l < gameobj.width; l++) {

                                                if (clone.x + 1 < gameobj.x || clone.y < gameobj.y ||
                                                    clone.x + 1 + clone.width > gameobj.x + gameobj.width ||
                                                    clone.y + clone.height > gameobj.y + gameobj.height
                                                ) {

                                                } else {
                                                    var pounch1 = false;
                                                    for (var p = 0; p < pounchList.length; p++) {
                                                        if (pounch(clone, pounchList[p]) == true) {
                                                            pounch1 = true;
                                                        }
                                                    }
                                                    if (pounch1 == true) {
                                                        clone.width += 1;
                                                        //clone.x--;
                                                        break;
                                                    };
                                                    clone.width += 1;
                                                    //clone.x--;
                                                }
                                            }
                                            clone.width += 1;
                                            clone.x--;
                                            clone.width += 1;
                                        }
                                    }
                                    for (var ec = 0; ec < clone.event.length; ec++) {
                                        if (clone.event[ec][0] == 'cloneVerticalExpansion') {
                                            var pounchList2 = [];
                                            for (var ec2 = 0; ec2 < AllObjList[i].event.length; ec2++) {
                                                console.log(clone.event[ec2][1]);
                                                //if (AllObjList[i].event[ec2][0] == "cloneLateralExpansion") {
                                                for (var p = 0; p < AllObjList.length; p++) {
                                                    if (AllObjList[p].class == clone.event[ec2][1])
                                                        pounchList2.push(AllObjList[p]);
                                                }

                                                // }
                                            }
                                            //console.log(pounchList2);
                                            var gameobj = createGameWorldObj();
                                            for (var l = 0; l < gameobj.width; l++) {

                                                if (clone.x < gameobj.x || clone.y < gameobj.y ||
                                                    clone.x + clone.width > gameobj.x + gameobj.width ||
                                                    clone.y + clone.height > gameobj.y + gameobj.height
                                                ) {

                                                } else {
                                                    var pounch1 = false;
                                                    for (var p = 0; p < pounchList2.length; p++) {
                                                        if (pounch(clone, pounchList2[p]) == true) {
                                                            pounch1 = true;
                                                        }
                                                    }
                                                    if (pounch1 == true) {
                                                        clone.height -= 1;
                                                        clone.y++;
                                                        break;
                                                    };
                                                    clone.height += 1;
                                                    clone.y--;
                                                }
                                            }
                                            for (var l = 0; l < gameobj.width; l++) {

                                                if (clone.x < gameobj.x || clone.y + 1 < gameobj.y ||
                                                    clone.x + clone.width > gameobj.x + gameobj.width ||
                                                    clone.y + 1 + clone.height > gameobj.y + gameobj.height
                                                ) {

                                                } else {
                                                    var pounch1 = false;
                                                    for (var p = 0; p < pounchList2.length; p++) {
                                                        if (pounch(clone, pounchList2[p]) == true) {
                                                            pounch1 = true;
                                                        }
                                                    }
                                                    if (pounch1 == true) {
                                                        clone.height += 1;
                                                        //clone.y--;
                                                        break;
                                                    };
                                                    clone.height += 1;
                                                    //clone.y--;
                                                }
                                            }
                                            clone.height += 1;
                                            clone.y--;
                                            clone.height += 2;
                                        }
                                    }
                                    for (var ec = 0; ec < clone.event.length; ec++) {
                                        if (clone.event[ec][0] == 'cloneWaitRegistered') {

                                            if (!isNaN(parseInt(clone1.event[ec][1]))) {
                                                if (parseInt(clone1.event[ec][1]) >= 0 && parseInt(clone1.event[ec][1]) < 100000000) {
                                                    const ec_const2 = ec;

                                                    window.setTimeout(function () {
                                                        if (clone1.event[ec_const2][2] == "隱形") {
                                                            clone1.display = false;
                                                        }
                                                        else if (clone1.event[ec_const2][2] == "取消隱形") {
                                                            clone1.display = true;
                                                        }
                                                        else if (clone1.event[ec_const2][2] == "銷毀") {
                                                            clone1.class = "delete";
                                                        }
                                                        else if (clone1.event[ec_const2][2] == "左右正向") {
                                                            clone1.flipx = false;
                                                        }
                                                        else if (clone1.event[ec_const2][2] == "左右反向") {
                                                            clone1.flipx = true;
                                                        }
                                                        else if (clone1.event[ec_const2][2] == "左右反轉") {
                                                            clone1.flipx = !clone1.flipx;
                                                        }
                                                        else if (clone1.event[ec_const2][2] == "上下正向") {
                                                            clone1.flipy = false;
                                                        }
                                                        else if (clone1.event[ec_const2][2] == "上下反向") {
                                                            clone1.flipy = true;
                                                        }
                                                        else if (clone1.event[ec_const2][2] == "上下反轉") {
                                                            clone1.flipy = !clone1.flipy;
                                                        }
                                                    }, parseInt(clone1.event[ec][1]));
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


                                    for (var ec = 0; ec < clone.event.length; ec++) {
                                        if (clone.event[ec][0] == 'clonewaitchangeClassRegistered') {
                                            if (!isNaN(parseInt(clone.event[ec][1]))) {
                                                if (parseInt(clone.event[ec][1]) >= 0 && parseInt(clone.event[ec][1]) < 100000000) {
                                                    const ec_const2 = ec;
                                                    const clone2 = clone;
                                                    window.setTimeout(function () {
                                                        clone2.class = clone.event[ec_const2][2];
                                                        //GameWorld.broadcast.push(clone.event[ec_cons2][2]);
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
    //防止空白鍵滾動頁面
    window.addEventListener('keydown', function (e) {
        if (e.keyCode == 32 && e.target == document.body) {
            e.preventDefault();
        }
    });

}

setInterval(function () {
    if (MouseDrag == "enter") return;
    refleshGame();
}, 10);
WindowRegisterKeyDowning();
