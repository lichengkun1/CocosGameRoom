

const { ccclass, property } = cc._decorator;

@ccclass
export default class Ludo_BlockLogic extends cc.Component {


    @property(cc.Button)
    againButton: cc.Button = null;

    @property(cc.Label)
    countTimeLabel: cc.Label = null;

    private callfunc = null;

    start() {

    }

    onEnable(){
        this.setAgainButtoninteractable(false);
    }

    //倒计时;
    playerCountDown(callback: Function) {
        let number: number = 3;
        this.countTimeLabel.node.active = true;
        this.countTimeLabel.string = String(number);
        this.callfunc = ()=>{
            this.countTimeLabel.string = String(--number);
            if (number <= 0) {
                this.countTimeLabel.node.active = false;
                this.callfunc = null;
                callback();
            }
        }
        this.schedule(this.callfunc, 1, 2);
    }

    //主动停止倒计时;
    stopCountDown(){
        if(this.callfunc){
            this.countTimeLabel.node.active = false;
            this.unschedule(this.callfunc);
            this.callfunc = null;
        }
    }

    setAgainButtoninteractable(flag: boolean) {
        this.againButton.interactable = flag;
    }

    getAgainButtoninteractable() {
        return this.againButton.interactable;
    }

}
