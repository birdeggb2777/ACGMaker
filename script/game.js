
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
            if (AllObjList[d].type == "img" || AllObjList[d].type == "anime") {
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
            if (AllObjList[d].type == "img" || AllObjList[d].type == "anime") {
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