import { GameController } from "./GameController";

const { ccclass, property } = cc._decorator;

@ccclass
export class MyComponent extends cc.Component {


    onEnable() {
        this.Init();
        this.schedule(this.gameUpdate, 0.02, cc.macro.REPEAT_FOREVER)

    }
    private gameUpdate() {
        if (GameController.isGameStop) return;
        this.onUpDate(0.02)
    }
    onDisable() {
        this.unschedule(this.gameUpdate)
        this.myDisable();
    }

    protected Init() {

    }
    protected onUpDate(dt: number) {

    }
    protected myDisable() {

    }


}
