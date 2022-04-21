import { PopupManager } from './PopupManager';
const { ccclass, property } = cc._decorator;

@ccclass
export class Popup extends cc.Component {

    isLevel2Popup: boolean = false;
    Init(arg?: any) {
        
    }
    close() {
        PopupManager.ClosePopup(this.isLevel2Popup);
    }
}
