import BaseComp from "./baseComp";

const {ccclass, property} = cc._decorator;

export enum PanelType {
    /** 带按钮的提示框 */
    TOAST_WITHBTN = 1,
    /** 不带按钮的提示框 */
    TOAST_NOBTN = 2,

}

@ccclass
export default class BasePanel extends BaseComp {

    onLoad () {

    }

    start () {

    }

    closeBtnEvent() {

    }

}
