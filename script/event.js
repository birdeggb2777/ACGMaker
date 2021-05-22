
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
    if (MouseDrag == "enter") return;
    refleshGame();
}, 10);
WindowRegisterKeyDowning();
