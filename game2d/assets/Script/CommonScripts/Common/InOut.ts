// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class InOut extends cc.Component {

    onLoad() {
        this.schedule(() => {
            cc.tween(this.node)
                .to(1, { opacity: 122 })
                .to(1, { opacity: 255 })
                .start()
        }, 2.2)
    }
}
