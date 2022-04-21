// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    isShow = true;
    @property(cc.Float)
    top = 254;
    @property(cc.Float)
    bottom = 1;
    @property(cc.Float)
    lerp = 5;
    update() {
        if (this.isShow) {
            if (this.node.opacity > this.bottom)
                this.node.opacity -= this.lerp;
            else
                this.isShow = false;
        } else {
            if (this.node.opacity < this.top)
                this.node.opacity += this.lerp;
            else
                this.isShow = true;
        }
    }
}
