
class Command {
    static InvokeWithPen() {

    }
    static InvokeWithMouse() {

    }
    static SwitchBrush() {

    }
    static SwitchFilter() {

    }
    static SwitchLayer() {

    }
    static cmd(main, parm) {
        if (main == "filter") Command.InvokeFilter(parm);
        if (main == "move") Command.InvokeMove(parm);
        if (main == "brush") Command.InvokeBrush(parm);
        if (main == "brushClick") Command.InvokeClickBrush(parm);
        if (main == "brushRight") Command.InvokeRightBrush(parm);
        if (main == "brushMiddle") Command.InvokeMiddleBrush(parm);
        if (main == "brushEnd") Command.InvokeBrushEnd(parm);
        if (main == "changeTool") Command.InvokeChangeTool(parm);
        if (main == "transform") Command.InvokeTransform(parm);
        if (main == "text") Command.InvokeText(parm);
        if (main == "layer") Command.InvokeLayer(parm);
    }
    static InvokeFilter(parm) {
        invokeFilter(parm);
    }
    static InvokeLayer(parm) {
        if (parm == "addNew") addNewLayer();
    }
    static InvokeChangeTool(parm) {
        if (parm == "handTool") setHandTool();
        else if (parm == "selectTool1") setSelectTool1();
        else if (parm == "pencilTool") setPencilTool();
        else if (parm == "oilTool") setOilTool();
        else if (parm == "dropperTool") setDropperTool();
        else if (parm == "sprayTool") setSprayTool();
        else if (parm == "waterpenTool") setWaterpenTool();
        else if (parm == "erasorTool") setErasorTool();
        else if (parm == "lineTool") setLineTool();
        else if (parm == "gradientTool") setGradientTool();
        else if (parm == "selectTool2") setSelectTool2();
        else if (parm == "eggTool") setEggTool();
        GUI.refleshBrushBar();
        //Render.createSandwich();
    }
    static InvokeMove(parm) {
        invokeHandTool();
    }
    static InvokeRightBrush(parm) {
        invokeDropperTool(); // 右鍵，無條件使用滴管工具
    }
    static InvokeMiddleBrush(parm) {
        invokeHandTool(); // 中鍵，無條件使用手掌工具
    }
    static InvokeBrush(parm) {
        if (ToolSelector.brush == handTool) invokeHandTool();
        if (ToolSelector.brush == waterpenTool) invokeWaterpenTool();
        if (ToolSelector.brush == selectTool1) invokeSelectTool1();
        if (ToolSelector.brush == pencilTool) invokePencilTool();
        if (ToolSelector.brush == dropperTool) invokeDropperTool();
        if (ToolSelector.brush == erasorTool) invokeErasorTool();
        if (ToolSelector.brush == sprayTool) invokeSprayTool();
        if (ToolSelector.brush == lineTool) invokeLineTool();
        if (ToolSelector.brush == gradientTool) invokeGradientTool();

        if (ToolSelector.layer && ToolSelector.layer.display == false) GUI.setStatusAlert("請注意，您選擇的圖層不在顯示狀態，可能會看不見繪製的內容！！！");
    }
    static InvokeBrushEnd(parm) {
        if (ToolSelector.brush == gradientTool) invokeGradientTool();
    }
    static InvokeClickBrush(parm) {
        if (ToolSelector.brush == oilTool) invokeOilTool();
        if (ToolSelector.brush == selectTool1) invokeSelectTool1();
        if (ToolSelector.brush == selectTool2) invokeSelectTool2();
        if (ToolSelector.brush == dropperTool) invokeDropperTool();
    }
    static InvokeTransform(parm) {

    }
    static InvokeText(parm) {

    }
}