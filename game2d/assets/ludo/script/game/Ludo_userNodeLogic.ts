

const ANIMATIONNAME = {
    DAIJI: 'daiji',
    WAIT: 'wait',
    TIAOYUE: 'tiaoyue',
    JINRU: 'jinru',
    SHENGLI: 'shengli',
    SIWANG1: 'siwang1',
    SIWANG2: 'siwang2',
    BAOZHA1: 'baozha1',
    BAOZHA2: 'baozha2',
    XIAJIANG: 'xiajiang',
    NONE: '',
}

import Ludo_userNodeList from './Ludo_userNodeList';
import Global from '../Global/Ludo_GlobalGameData';
import MyEvent from '../../../Script/CommonScripts/Utils/MyEvent';
import MessageSoundManager from '../../../Script/CommonScripts/Utils/MessageSoundManager';


const { ccclass, property } = cc._decorator;

@ccclass
export default class Ludo_userNodeLogic extends cc.Component {

    @property(cc.String)
    userType: string = '';

    @property(cc.Integer)
    currIndex: number = -1;

    @property({ type: cc.AudioClip })
    pieceEn: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    pieveMove: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    piecePass1: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    piecePass2: cc.AudioClip = null;

    private _isCanTouch: boolean = false;                //是否可以点击触摸;
    private _nowPos: number = -1;                        //当前位置;
    /** 每一个节点的位置 */
    private startPos: cc.Vec2 = cc.v2(0, 0);              //节点一开始的位置，用于节点被T回家以后的坐标;
    private _nodeTrackArr: number[][] = [];              //节点的所有路径;
    private nowAnimation: string = ANIMATIONNAME.NONE;  //当前执行的动画;
    private startPoints: number = -322;
    private mapSize: number = 46;
    public userKey: string = '';                        //当前棋子在服务器中的key;
    public endPos: number[] = [0, 0];
    public isPropType: boolean = false;                 //是否是隐身衣的状态;
    public seatIndex: number = 0;                       // 玩家座位号

    public viewIndex: number = 0;                       // 第几视角
    public _lastMapIndex: number = 0;                    // 最后一次移动的地图索引 包括踢出，炸回，正常移动，ufo移动

    public isOutHome: boolean = false;                  // 棋子是否出家 出家之后的棋子才会去设置zIndex
    public _zIndex: number = 0;

    public _movePath: number[][] = [];

    /** 下降动作播放完毕之后应该播放什么动画默认待机 */
    public downOverAnimName: string = 'daiji';
    public nodeListComp: Ludo_userNodeList = null;

    start() {
    }

    addEventTouch() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
    }

    set zIndex(index: number) {
        /** 先赋值 防止当前帧拿不到该值 */
        this._zIndex = index;
        // zIndex（修改localZindex） 水太深把握不住的不要用最好用setSiblingIndex(将节点重新排序)
        this.node.zIndex = index;
        this.node.setSiblingIndex(index);
    }
    get zIndex() {
        return this._zIndex;
    }

    set lastMapIndex(value: number) {

        this._lastMapIndex = value;
        console.log(`@lastMapIndex is ${value} and currentIndex is ${this.currIndex} and name is ${this.node.name}`);
    }

    get lastMapIndex() {
        return this._lastMapIndex;
    }

    set movePath(path: number[][]) {
        this._movePath = path;
    }

    get movePath() {
        return this._movePath;
    }

    //设置是否可以点击;
    set isCanTouch(flag: boolean) {
        this._isCanTouch = flag;
    }

    get isCanTouch(): boolean {
        return this._isCanTouch;
    }

    //设置当前位置；
    set nowPos(index: number) {
        this._nowPos = index;
    }

    get nowPos(): number {
        return this._nowPos;
    }

    set nodeTrackArr(trackArr) {
        this._nodeTrackArr = trackArr;
    }

    get nodeTrackArr() {
        return this._nodeTrackArr;
    }

    setUserType(type: string) {
        this.userType = type;
    }

    /**
     * 初始化节点坐标，刚进来的时候调用和更新状态的时候调用
     * @param  {number} index 棋子所在的第几个网格 1 - 58
     * @param  {number[][]} moveTrack 棋子移动路径
     * @param  {string} userKey 当前正在移动的棋子的索引
     */
    initNodePos(index: number, moveTrack: number[][], userKey) {
        this.userKey = userKey;
        this.seatIndex = +userKey;
        if (index != 0) {
            //终点坐标单独设置;
            if (index == 58) {
                this.playDragonAnimation(ANIMATIONNAME.JINRU, 0);
            } else {
                let posX = this.startPoints + moveTrack[index - 1][0] * this.mapSize;
                let posY = this.startPoints + moveTrack[index - 1][1] * this.mapSize;
                let zIndexNum = 15 - moveTrack[index - 1][1];
                // this.node.zIndex = zIndexNum;
                this.zIndex = zIndexNum;
                this.node.x = posX;
                this.node.y = posY;
                this.endPos = [posX, posY];
            }
        } else {
            //
            if(this.startPos.x !== 0 && this.startPos.y !== 0) {
                console.log('将节点放回到原来的位置');
                // 重置位置
                [this.node.x,this.node.y] = [this.startPos.x,this.startPos.y];
                // 重置层级，缩放
                this.setGoHomePiecezIndex();
            }
        }
    }

    //节点的点击时间;
    touchStart(event) {
        if (this._isCanTouch) {
            this._isCanTouch = false;
            // 重置人物下落之后应该播放的动画名字
            this.downOverAnimName = ANIMATIONNAME.DAIJI;
            MyEvent.I.emit('touch_user1', { touchIndex: this.currIndex });
        }
    }

    getEndPos(): number[] {
        return this.endPos;
    }

    showYSY() {
        let pAni = this.node.getComponent(dragonBones.ArmatureDisplay).armature();
        let glassSlot = pAni.getSlot("yinshenyi");
        glassSlot.displayIndex = 0;
        this.isPropType = true;
    }

    hideYSY() {
        let pAni = this.node.getComponent(dragonBones.ArmatureDisplay).armature();
        let glassSlot = pAni.getSlot("yinshenyi");
        glassSlot.displayIndex = -1;
        this.isPropType = false;
    }

    /*
        执行移动动作;
        @param moveTrack  移动的路径
        @param moveCount  移动的距离
    */
    runMoveFunc(startPos: number, endPos: number,nodeList?: Ludo_userNodeList,index?: number) {
        this._isCanTouch = false;
        let promiseArr = [];                        //promise数组;
        let _moveTrack = [];
        let userType = this.userType;
        let subNumber = 0;
        const relativePos = endPos;
        const relativeStartPos = startPos;
        
        switch (userType) {
            case 'user1':
                subNumber = 0;
                _moveTrack = Global.moveUser1MoveTrack;
                this.seatIndex = 1;
                break;
            case 'user2':
                subNumber = 13;
                _moveTrack = Global.moveUser2MoveTrack;
                this.seatIndex = 2;
                break;
            case 'user3':
                subNumber = 26;
                _moveTrack = Global.moveUser3MoveTrack;
                this.seatIndex = 3;
                break;
            case 'user4':
                subNumber = 39;
                _moveTrack = Global.moveUser4MoveTrack;
                this.seatIndex = 4;
                break;
        }

        //一开始的时候  是否小于52;
        let isSub: boolean = endPos <= 52 ? true : false;
        if (startPos != 0 && startPos <= 52) {
            if (startPos < subNumber) {
                startPos += 52;
            }
            if (endPos < subNumber) {
                endPos += 52;
            }
            startPos -= subNumber;
        }

        if (isSub) {
            // endPos <= 52 结束位置转换成自己视角的结束位置
            endPos -= subNumber;
        }


        if (startPos >= 52) {
            startPos -= 1;
        }

        if (endPos >= 52) {
            endPos -= 1;
        }

        let moveCount = endPos - startPos;
        this.node.scale = 1;
        this.node.zIndex = 18;
        this.zIndex = 18;
        let drag = this.node.getComponent(dragonBones.ArmatureDisplay);
        if (startPos == 0 && endPos == 1) {   //是否为出门的第一步;
            console.log(`${this.node.name}出家`);
            // 出门了
            this.isOutHome = true;
            if (MessageSoundManager.audioEngineOn) {
                cc.audioEngine.playEffect(this.pieceEn, false);
            }
            drag.timeScale = 0.6;
            let moveX = this.startPoints + _moveTrack[startPos][0] * this.mapSize;
            let moveY = this.startPoints + _moveTrack[startPos][1] * this.mapSize;
            let move = cc.moveTo(0.3, cc.v2(moveX, moveY));
            drag.playAnimation('tiaoyue', 1);
            let call = cc.callFunc(() => {
                drag.timeScale = 1;
                //刷新自己的纵坐标;
                let zIndexNum = 15 - _moveTrack[startPos][1];
                // this.node.zIndex = zIndexNum;
                this.zIndex = zIndexNum;
                this.endPos = [moveX, moveY];
                MyEvent.I.emit('move_end', { endPos: endPos, pos: [moveX, moveY] });
                drag.playAnimation('daiji', 0);
            });
            this.node.runAction(cc.sequence(move, call));
        } else {
            let endNum: number = moveCount - 1;
            for (let i = 0; i < moveCount; ++i) {
                let promise = () => {
                    return new Promise((resolve, reject) => {
                        let nowPos = startPos + i;
                        let moveX = this.startPoints + _moveTrack[nowPos][0] * this.mapSize;
                        let moveY = this.startPoints + _moveTrack[nowPos][1] * this.mapSize;
                        let move = cc.moveTo(0.15, cc.v2(moveX, moveY));
                        drag.timeScale = 1;
                        drag.playAnimation('tiaoyue', 1);
                        let call = cc.callFunc(() => {
                            if (MessageSoundManager.audioEngineOn) {
                                cc.audioEngine.playEffect(this.pieveMove, false);
                            }
                            if (i == 0) {
                                MyEvent.I.emit('move_tart');
                            }
                            const setNodeIndex = () => {
                                let zIndexNum = 15 - _moveTrack[nowPos][1];
                                // this.node.zIndex = zIndexNum;
                                this.zIndex = zIndexNum;
                            }
                            if (i === endNum) {
                                // 刷新自己的层级 最下面的层级最大，最上面的层级最小
                                setNodeIndex();
                                this.endPos = [moveX, moveY];
                                console.log(`棋子${this.node.name}pos is (${moveX},${moveY}) and 是从地图上的点${relativeStartPos} -> ${relativePos}`);
                                MyEvent.I.emit('move_end', { endPos: endPos, pos: [moveX, moveY] });
                            }
                            resolve(null);
                        });
                        this.node.runAction(cc.sequence(move, call));
                    });
                }
                promiseArr.push(promise);
            }

            let promise = () => {
                return new Promise((resolve, reject) => {
                    if (endPos == 57) {
                        this.playDragonAnimation(ANIMATIONNAME.JINRU, 0);
                        if(nodeList && index !== undefined && typeof index === 'number') {
                            delete nodeList.repeat52To58Nodes[index];
                        } else {
                            delete this.nodeListComp.repeat52To58Nodes[this.currIndex];
                        }
                    } else {
                        drag.playAnimation('daiji', 0);
                    }
                    resolve(null);
                });
            }
            promiseArr.push(promise);
            this.runPromiseArray(promiseArr);
        }
    }

    //设置坐标相同点的缩放;
    settNodePosScale(nodePos, nodeLen) {
        let len = nodeLen;
        let endPos = nodePos[0].getComponent(Ludo_userNodeList).getEndPos();
        if (len == 1) {
            nodePos[0].scale = 1;
            nodePos[0].x = endPos.x;
            nodePos[0].y = endPos.y;
        } else {
            for (let i = 0; i < len; i++) {
                if (len % 2 == 0) {
                    nodePos[i].x = endPos.x - 10 - (len / 2 - 1) * 20 + i * 20;
                } else {
                    nodePos[i].x = endPos.x - Math.floor(len / 2) * 20 + i * 20;
                }
            }
        }
    }

    setTNodeGoStart(tNode, nodeLen) {
        for (let i = 0; i < nodeLen; i++) {
            tNode.getComponent(Ludo_userNodeList).runGoStart();
        }
    }

    setStartPos(pos: number[]) {
        this.startPos.x = pos[0];
        this.startPos.y = pos[1];
    }

    //被T了，回到初始位置;
    public runGoStart(callback?) {
        let drag = this.node.getComponent(dragonBones.ArmatureDisplay);
        let promise1 = () => {
            return new Promise((resolve, reject) => {
                let isResolve = false;
                if (MessageSoundManager.audioEngineOn) {
                    cc.audioEngine.playEffect(this.piecePass1, false);
                }
                drag.timeScale = 1.2;
                this.playDragonAnimation(ANIMATIONNAME.SIWANG1, 1, () => {
                    resolve(null);
                    isResolve = true;
                })
            })
        }

        let promise2 = () => {
            return new Promise((resolve, reject) => {
                let isResolve = false;
                if (MessageSoundManager.audioEngineOn) {
                    cc.audioEngine.playEffect(this.piecePass2, false);
                }
                const lastDeal = () => {
                    this.node.x = this.startPos.x;
                    this.node.y = this.startPos.y;
                    this.node.scale = 1;
                    drag.timeScale = 1.2;
                }
                lastDeal();
                this.playDragonAnimation(ANIMATIONNAME.SIWANG2, 1, () => {
                    resolve(null);
                    isResolve = true;
                });
            });
        }

        let promise3 = () => {
            return new Promise((resolve, reject) => {
                this.playDragonAnimation(ANIMATIONNAME.DAIJI, 0);
                this._nowPos = -1;
                drag.timeScale = 1;
                callback && callback();
                resolve(null);
            })
        }
        this.setGoHomePiecezIndex();
        this.isOutHome = false;
        this.runPromiseArray([promise1, promise2, promise3]);
    }

    setGoHomePiecezIndex() {
        if(this.node.name.indexOf('piece1') >= 0 || this.node.name.indexOf('piece2') >= 0) {
            this.zIndex = 0;
        } else {
            this.zIndex = 15;
        }
        this.node.scale = 1;

        delete this.nodeListComp.repeat52To58Nodes[this.currIndex];
        this.endPos = [0,0];
        
    }

    /**
     * 将棋子的位置设置成最开始的位置
     */
    public setSelfToOrigin(): void {
        if(!this.startPos.x && !this.startPos.y) return;
        [this.node.x,this.node.y] = [this.startPos.x,this.startPos.y];
        this.setGoHomePiecezIndex();
    }

    //被炸回家;
    public runBoomStart(callback?) {
        let drag = this.node.getComponent(dragonBones.ArmatureDisplay);
        let promise1 = () => {
            return new Promise((resolve, reject) => {
                let isResolve = false;
                drag.timeScale = 1.2;
                this.playDragonAnimation(ANIMATIONNAME.BAOZHA1, 1, () => {
                    resolve(null);
                    isResolve = true;
                })
                this.scheduleOnce(() => {
                    if(!isResolve) {
                        resolve(null);
                    }
                },2);
            })
        }

        let promise2 = () => {
            return new Promise((resolve, reject) => {
                let isResolve = false;
                this.node.x = this.startPos.x;
                this.node.y = this.startPos.y;
                this.node.scale = 1;
                drag.timeScale = 1.2;
                const lastDeal = () => {
                    this.node.x = this.startPos.x;
                    this.node.y = this.startPos.y;
                    this.node.scale = 1;
                }
                this.playDragonAnimation(ANIMATIONNAME.BAOZHA2, 1, () => {
                    lastDeal();
                    isResolve = true;
                    resolve(null);
                })
                this.scheduleOnce(() => {
                    if(!isResolve) {
                        lastDeal();
                        resolve(null);
                    }
                },2);
            })
        }

        let promise3 = () => {
            return new Promise((resolve, reject) => {
                drag.timeScale = 1;
                this.playDragonAnimation(ANIMATIONNAME.DAIJI, 0);
                this._nowPos = -1;
                callback && callback();
                resolve(null);
            })
        }
        this.setGoHomePiecezIndex();
        this.isOutHome = false;
        this.runPromiseArray([promise1, promise2, promise3]);
    }

    //执行Promise的队列动作,这里不用Global里面的是因为没必要因为这个方法专门应用global;
    private runPromiseArray(parray) { //这个方法可以放到G里
        let p = Promise.resolve(null);
        for (let promise of parray) {
            p = p.then(promise);
        }
        return p;
    }

    /*
        播放动画
        @param aniName      动画名字
        @param playCount    播放次数  x:x次   0：循环 
    */
    //播放动画;
    playDragonAnimation(aniName: string, playCount: number, callback?) {
        let drag = this.node.getComponent(dragonBones.ArmatureDisplay);

        if(drag.animationName === 'xiajiang' && aniName === 'wait') {
            /** 人物没有下降完毕return防止出现飞碟不消失的问题 */
            console.log('人物下降动画没有播放完毕');
        }

        if (aniName == 'shengli' || this.nowAnimation == 'shengli') {
            this.nowAnimation == aniName;

            drag.playAnimation(aniName, 0);
            return;
        }

        //如果将要执行的动作就是当前执行的动作，直接跳过 跳跃阶段 和 胜利阶段不要打断;
        if (this.nowAnimation == aniName || this.nowAnimation == ANIMATIONNAME.JINRU ||
            this.nowAnimation == ANIMATIONNAME.SHENGLI) {
            this.nowAnimation = aniName;
            callback && callback();
            return;
        }
        
        this.nowAnimation = aniName;
        this.downOverAnimName = 'daiji';
        if (playCount > 0) {
            drag.addEventListener(dragonBones.EventObject.COMPLETE, () => {
                drag.removeEventListener(dragonBones.EventObject.COMPLETE);
                callback && callback();
            });
        }
        drag.playAnimation(aniName, playCount);
    }
}
