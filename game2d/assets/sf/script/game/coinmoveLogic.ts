import MyEvent from "../../../Script/CommonScripts/Utils/MyEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class coinmoveLogic extends cc.Component {

    @property(cc.Node)
    coins: cc.Node[] = [];

    start() {
    }

    runCoinAction(startPos: cc.Vec2, endPos: cc.Vec2) {
        let waitNum = 0;
        for (let i = 0; i < 10; i++) {
            let rand = 200;
            waitNum += rand;
            setTimeout(() => {
                let dis1 = 150;
                if (startPos.x > 0) {
                    dis1 = -dis1;
                }
                let coin = this.coins[i];
                let coinDrag = coin.getComponent(dragonBones.ArmatureDisplay);
                let timeRand = Math.random() + 1;
                coinDrag.timeScale = timeRand;
                coinDrag.playAnimation('zhuan', 0);
                let pos1 = cc.v2(startPos.x,startPos.y);
                coin.x = pos1.x;
                coin.y = pos1.y;
                let rand = Math.random() * 0.3 + 0.3;
                coin.scale = rand;
                let pos2 = cc.v2(pos1.x + dis1, pos1.y - 150);
                let pos3 = cc.v2(endPos.x, endPos.y);
                let bezier = cc.bezierTo(1, [pos1, pos2, pos3]).easing(cc.easeOut(1));
                let scale1 = cc.scaleTo(0.48, rand + 0.2);
                let scaleTo2 = cc.scaleTo(0.5, 0.4);
                let scaleTo3 = cc.scaleTo(0.02, 0.1);
                let spawB = cc.spawn(bezier, cc.sequence(scale1, scaleTo2, scaleTo3));
                let call = cc.callFunc(() => {
                    coin.scale = 1;
                    MyEvent.I.emit('coinMoveOver');
                    coinDrag.addEventListener(dragonBones.EventObject.COMPLETE, () => {
                        coin.scale = 0;
                    }, this);
                    coinDrag.playAnimation('shanguang', 1);
                });
                coin.runAction(cc.sequence(spawB, call));
            }, waitNum);
        }
    }
}
