const {ccclass, property} = cc._decorator;

@ccclass
export default class DrawAnim extends cc.Component {

    private viewResolution: cc.Size = cc.size(0);
    protected onLoad(): void {
        // cc.sys.OS_IOS
        this.viewResolution = cc.view.getVisibleSize();
    }

    protected onEnable(): void {
        const arrNode = this.node;
        // cc.tween(this.arr).stop();

        const posStart: number = this.viewResolution.height / 2 - 32;
        const posCenter: number = this.viewResolution.height / 2 - 70;
        const posEnd: number = this.viewResolution.height / 2 - 107;
        this.node.setPosition(cc.v2(this.node.x,posStart));

        this.node.stopAllActions();
        cc.tween(this.node).to(0.3,{y: posCenter}).delay(0.1).to(0.2,{y: posEnd}).union().repeatForever().start();
    }

    protected onDisable(): void {
        cc.tween(this.node).stop();
        this.node.stopAllActions();
        
    }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
