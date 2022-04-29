

const {ccclass, property} = cc._decorator;

@ccclass
export default class speedTypeLogic extends cc.Component {

    private isUpdate:boolean = false;

    start () {
        // let ro = cc.rotateBy(2.5,-1200);
        // this.node.runAction(cc.repeatForever(ro));
    }

    onEnable(){
        this.isUpdate = true;
        this.playShow();
    }

    onDisable(){
        this.isUpdate = false;
    }

    playShow(){
        this.node.opacity = 0;
        let fade1 = cc.fadeTo(1,255);
        let fade2 = cc.fadeTo(1.5,150);
        let fade3 = cc.fadeTo(1.5,255);
        let fade4 = cc.fadeTo(1,0);
        this.node.runAction(cc.sequence(fade1,fade2,fade3,fade4));
    }

    update(){
        if(this.isUpdate){
            this.node.rotation += 20;
        }
    }
}
