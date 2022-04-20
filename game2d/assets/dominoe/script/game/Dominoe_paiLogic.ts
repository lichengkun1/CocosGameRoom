



import MessageSoundManager from '../../../Script/CommonScripts/Utils/MessageSoundManager';
import MyEvent from '../../../Script/CommonScripts/Utils/MyEvent';
import Global from '../Utils/Dominoe_GlobalGameData';

/**
 * 
 * 每一张牌的具体逻辑
 * 
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class Dominoe_paiLogic extends cc.Component {

    @property(cc.SpriteAtlas)
    pointPlist: cc.SpriteAtlas = null;

    @property(cc.Node)
    pointTop: cc.Node = null;

    @property(cc.Node)
    pointBoom: cc.Node = null;

    @property(cc.ParticleSystem)
    particleSys: cc.ParticleSystem = null;

    @property(cc.ParticleSystem)
    particleSys2: cc.ParticleSystem = null;

    @property(cc.ParticleSystem)
    particleSys3: cc.ParticleSystem = null;

    @property(cc.Node)
    meng: cc.Node = null;

    @property(cc.Node)
    selectNode:cc.Node = null;

    @property({type:cc.AudioClip})
    playPockerAudio:cc.AudioClip = null;

   


    private _paiType: number = Global.paiType.NONE;              //牌的类型;
    private _paiIndex: number = -2;                              //牌的位置 -1代表中间牌，-2代表是玩家手里的牌；
    private _isTouch: boolean = false;                           //是否触摸该牌;
    private _paiPoints: number[] = [];                           //排的数据;
    // private selectNode: cc.Node = null;                          //选择框;
    private _isCanTouch: boolean = false;                        //是否可以点击拖动;
    private _paiPosType: string = '';                            //牌的位置类型;
    private _key: number = -1;                                   //牌的key值;
    private _previousPoint: number = 0;                          //连接的上一个点;
    private _touchStartPoint: cc.Vec2 = cc.v2(0, 0);              //触摸时候的坐标;
    private _isTouchType: Boolean = false;                       //是否是点击的状态;
    private _startPos: cc.Vec2 = cc.v2(0, 0);                     //默认坐标;

    start() {
        this.init();
    }

    init() {
        // this._startPos = cc.v2(this.node.x, this.node.y);
        this.selectNode = this.node.getChildByName('selectNode');
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchMove, this);
    }

    //设置牌的显示；
    setPaiShow(points: number[]) {
        this._paiPoints = points;
        let topTexture = this.pointPlist.getSpriteFrame(`point_${points[0]}`);
        let boomTexture = this.pointPlist.getSpriteFrame(`point_${points[1]}`);
        this.pointTop.getComponent(cc.Sprite).spriteFrame = topTexture;
        this.pointBoom.getComponent(cc.Sprite).spriteFrame = boomTexture;
    }

    touchStart(event) {
        //可以点击，并且当前节点不是已经点击状态;
        if (this._isCanTouch) {
            if (Global.isTouchPocker) {
                return;
            }
            Global.isTouchPocker = true;
            this._touchStartPoint = event.touch.getLocation();
            this._isTouch = true;
            this.selectNode.active = true;
            MyEvent.I.emit('paiTouchStart', { paiNode: this.node, points: this._paiPoints});

            this.node.zIndex = 2;
            if (this._isTouchType && Global.isCanSendPocker) {
                Global.isCanSendPocker = false;
                let pos = event.touch.getLocation();
                pos = this.node.getParent().convertToNodeSpaceAR(pos);
                MyEvent.I.emit('paiTouchEnd', { paiNode: this.node, pos: pos });
            }
        }
    }

    touchMove(event) {
        if (this._isTouch && this._isCanTouch) {
            let pos = event.touch.getLocation();
            //移动的距离;
            let distance = pos.sub(cc.v2(this._touchStartPoint.x, this._touchStartPoint.y)).mag();
            if (distance >= 30) {
                pos = this.node.getParent().convertToNodeSpaceAR(pos);
                if(pos.y > -350){
                    this.node.x = pos.x;
                    this.node.y = pos.y;
                }
            }
        }
    }

    touchEnd(event) {
        let pos = event.touch.getLocation();
        if (this._isTouch && this._isCanTouch) {
            let distance = pos.sub(cc.v2(this._touchStartPoint.x, this._touchStartPoint.y)).mag();
            Global.isTouchPocker = false;
            if (pos.x == this._touchStartPoint.x && pos.y == this._touchStartPoint.y || distance <= 20) {
                if (!this._isTouchType) {
                    Global.selectSendPocker = this.node;
                    this.setNodeTouchType(true);
                }
            } else {
                pos = this.node.getParent().convertToNodeSpaceAR(pos);
                if (pos.y > -250) {
                    MyEvent.I.emit('paiTouchEnd', { paiNode: this.node, pos: pos });
                } else {
                    let move = cc.moveTo(0.3, cc.v2(this._startPos.x, this._startPos.y));
                    this.node.runAction(move);
                    this._isTouchType = false;
                    MyEvent.I.emit('cancelTouch');
                    Global.isTouchPocker = false;
                }
            }
        }
        this._isTouch = false;
        // this.selectNode.active = false;
    }

    touchCancel(event) {
        if (this._isTouch && this._isCanTouch) {
            let pos = event.touch.getLocation();
            //移动的距离;
            let distance = pos.sub(cc.v2(this._touchStartPoint.x, this._touchStartPoint.y)).mag();
            pos = this.node.getParent().convertToNodeSpaceAR(pos);
            if (distance >= 30 && pos.y > -350) {
                this.node.x = pos.x;
                this.node.y = pos.y;
            } else {
                let move = cc.moveTo(0.3, cc.v2(this._startPos.x, this._startPos.y));
                this.node.runAction(move);
                this._isTouchType = false;
                MyEvent.I.emit('cancelTouch');
                Global.isTouchPocker = false;
            }
        }
    }

    //牌被放入桌子上，显示一下粒子;
    moveEnd() {
        this.particleSys.node.active = true;
        this.particleSys.resetSystem();
        this.particleSys2.node.active = true;
        this.particleSys2.resetSystem();
    }

    otherMoveEnd(){
        this.particleSys3.node.active = true;
        this.particleSys3.resetSystem();
        this.particleSys2.node.active = true;
        this.particleSys2.resetSystem();
    }

    //设置牌的状态;
    set paiType(type: number) {
        this._paiType = type;
    }

    //获取牌的状态；
    get paiType() {
        return this._paiType;
    }

    //设置牌的位置；
    set paiIndex(index: number) {
        this._paiIndex = index;
    }

    //获取牌的位置；
    get paiIndex() {
        return this.paiIndex;
    }

    get points() {
        return this._paiPoints;
    }

    //当前牌是否可以点击;
    set isCanTouch(flag: boolean) {
        this._isCanTouch = flag;
        if (flag) {
            this.showMeng = false;
        } else {
            this.selectNode.active = false;
            this.showMeng = true;
        }
    }

    get isCanTouch(): boolean {
        return this._isCanTouch;
    }

    set paiPosType(type: string) {
        this._paiPosType = type;
    }

    get paiPosType(): string {
        return this._paiPosType;
    }

    //牌的key值；
    set key(key: number) {
        this._key = key;
    }

    get key(): number {
        return this._key;
    }

    //对应的衔接点;
    set previousPoint(point) {
        this._previousPoint = point;
    }

    get previousPoint() {
        return this._previousPoint;
    }

    //设置梦层是否显示；
    set showMeng(flag: boolean) {
        this.meng.active = flag;
    }
    
    //设置节点是否是点击状态;
    setNodeTouchType(flag: Boolean) {
        if (flag) {
            if (!this._isTouchType) {
                this.setTouchType(true);
            }
        } else {
            if (this._isTouchType) {
                this.setTouchType(false);
            }
        }
    }
    
    //设置为点击状态;
    setTouchType(flag: Boolean) {
        if (flag) {
            this.selectNode.active = true;
            this._isTouchType = true;
            this.node.stopAllActions();
            let move = cc.moveBy(0.2, cc.v2(0, 40));
            this.node.runAction(move);
            MessageSoundManager.playLoadEffect(this.playPockerAudio);
        } else {
            this.selectNode.active = false;
            this._isTouchType = false;
            this.node.stopAllActions();
            let move = cc.moveBy(0.2, cc.v2(0, -40));
            this.node.runAction(move);
        }
    }

    setStartPos(pos: cc.Vec2) {
        this._startPos = cc.v2(pos.x, pos.y);
    }

    hideSelectNode(){
        this.selectNode.active = false;
        this._isCanTouch = false;
    }
}
