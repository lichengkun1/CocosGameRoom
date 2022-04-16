const {ccclass, property} = cc._decorator;

@ccclass
export default class BaseComp extends cc.Component {

    public viewMap: {[key: string]: cc.Node} = {};

    __preload() {
        console.log('preload');
        this._loadAllNode(this.node,'');
    }

    onLoad () {
        this._initEvents();
    }

    private _initEvents() {
        /** 前后台事件触发浏览器不是100%触发 */
        cc.game.on(cc.game.EVENT_HIDE,this.hide,this);
        cc.game.on(cc.game.EVENT_SHOW,this.show,this);
    }

    /**
     * 游戏切换到后台时候触发
     * @returns void
     */
    protected hide(): void {
        console.log("后台");
    }

    /**
     * 游戏切换到前台触发
     * @returns void
     */
    protected show(): void {
        console.log("前台");
    }

    private _loadAllNode(node: cc.Node,path: string): void {
        if(!node) {
            return;
        }
        for(let i = 0,len = node.childrenCount; i < len; i++) {
            const nodeItem: cc.Node = node.children[i];
            this.viewMap[path + nodeItem.name] = nodeItem;
            this._loadAllNode(nodeItem,path + nodeItem.name + '/');
        }
    }

    start () {

    }

    onDestroy() {
        this.viewMap = {};   
    }
    
    
}
