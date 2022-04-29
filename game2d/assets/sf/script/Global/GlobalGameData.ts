
/**
 * CopyRight:
 * 全局数据类
 */

export default class GlobalGameData {
    public static nodeStartPosX: number[] = [-130, -22, 87, 198, 308];
    public static userId: number = -1;               //用户id;
    public static isShowHint: boolean = false;       //是否显示过提示;
    public static gameStart: boolean = false;        //游戏是否已经开始;
    public static userCamp: string = '';
    public static shareUrl: string = '';
    public static gameType = {
        none: 0,
        GodSoloMode: 1,                                          //上帝2人模式;
        GodMultiplayerMode: 2,                                   //上帝4人模式;
        SoloMode: 3,                                             //2人模式；
        MultiplayerMode: 4                                       //4人模式；
    }

    public static SHEEPTYPE = {
        NONE: 0,
        TOP: 1,
        BOOM: 2
    }

    public static nowGameType: number = GlobalGameData.gameType.none;                             //游戏类型;
    public static colliderSituation = {};                                                        //碰撞情况;
    public static gameSceneIsLoad: boolean = false;                                               //游戏场景是否已经加载;
    public static isPlayerAgain: boolean = false;                                                 //是否在玩一次;
    public static gameRoomId: string = '';
    public static channelId: string = '';
    public static isCanAutoJoinGame: boolean = true;                                             //是否可以自动加入游戏;
    public static isFirstShowChangeRoom: boolean = true;                                         //是否是第一次显示切换房间弹框;
    public static UserInfo = null;
    public static RoomInfo = null;
    public static followedObj = {};
    /*
        相同类型碰撞以后的处理：
        @param    track             赛道
        @param    type              类型
        @param    isDentical        是否相同的类型
        @param    weight            重量
    */

    public static colliderCallback(track: number, type: number, animalNode: cc.Node) {
        //在相同的节点数组上加上碰撞的节点；
        this.colliderSituation[track][type].push(animalNode);
        this.setTrackColliderMove(track);
    }

    /*
        设置跑道的节点移动
        @param  track  跑道值
    */
    public static setTrackColliderMove(track) {
        //获取双边阵营的重力值；
        let topValue = this.getColliderWeithtValue(this.colliderSituation[track][this.SHEEPTYPE.TOP]);
        let boomValue = this.getColliderWeithtValue(this.colliderSituation[track][this.SHEEPTYPE.BOOM]);
        if (topValue >= 0 && boomValue >= 0) {
            if (topValue == 0) {
                this.colliderSituation[track][this.SHEEPTYPE.TOP] = [];
            }
            if (boomValue == 0) {
                this.colliderSituation[track][this.SHEEPTYPE.BOOM] = [];
            }
            if (topValue > boomValue) {
                this.setColliderNodeSpeed(track, -50);
            } else if (topValue == boomValue) {
                this.setColliderNodeSpeed(track, 0);
            } else if (topValue < boomValue) {
                this.setColliderNodeSpeed(track, 50);
            }
        }
    }

    //累加数组;
    static getColliderWeithtValue(nodeArr: cc.Node[]) {
        if (nodeArr) {
            let value = 0;
            let len = nodeArr.length;
            for (let i = 0; i < len; i++) {
                if (nodeArr[i].name) {
                    let weight = nodeArr[i].getComponent('animalLogic').weight;
                    value += weight;
                }
            }
            return value;
        }
    }

    //设置节点的移动方向和速度，速度由当前速度决定;
    static setColliderNodeSpeed(track, speedNum) {
        // //console.log(`track-----:`+track + '-------speedNum:'+speedNum);
        let topColliderArr = this.colliderSituation[track][this.SHEEPTYPE.TOP];
        if (topColliderArr) {
            let topLen = topColliderArr.length;
            // //console.log('topLen:::::'+topLen);
            for (let i = 0; i < topLen; i++) {
                if (topColliderArr[i]._components) {
                    topColliderArr[i].getComponent('animalLogic').setMoveSpeed(-speedNum);
                }
            }
        }
        let boomColliderArr = this.colliderSituation[track][this.SHEEPTYPE.BOOM];
        if (boomColliderArr) {
            let boomLen = boomColliderArr.length;
            // //console.log('boomLen:::::'+boomLen);
            for (let i = 0; i < boomLen; i++) {
                if (boomColliderArr[i]._components) {
                    boomColliderArr[i].getComponent('animalLogic').setMoveSpeed(speedNum);
                }
            }
        }
    }

    //执行Promise的队列动作;
    public static runPromiseArray(parray) { //这个方法可以放到G里
        let p = Promise.resolve();
        for (let promise of parray) {
            p = p.then(promise);
        }
        return p;
    }

    //缩短名字；
    public static subNickName(nameStr: string, len: number = 8) {
        if (nameStr.length > len) {
            nameStr = nameStr.substring(0, len) + '...';
        }
        return nameStr;
    }

    //动态Plist获取plist里面的小图;
    public static getNodeSetTexture(plistRes, pngRes, texureName) {
        let frame = plistRes.frames[`${texureName}.png`];
        frame = this.translateFrame(frame);
        let spriteFrame = new cc.SpriteFrame();
        spriteFrame.setTexture(pngRes, frame.frame, frame.rotated, frame.offset, frame.size);
        return spriteFrame;
    }

    public static translateFrame(oframe) {
        if (!oframe) {
            return null;
        }
        var tframe = {
            frame: null,
            rotated: null,
            offset: null,
            size: null
        };
        let t = oframe.frame.match(/[0-9]+/g);
        tframe.frame = cc.rect(parseInt(t[0]), parseInt(t[1]), parseInt(t[2]), parseInt(t[3]));
        tframe.rotated = oframe.rotated;
        t = oframe.offset.match(/(\-|[0-9])+/g);
        tframe.offset = cc.v2(parseInt(t[0]), parseInt(t[1]));
        t = oframe.sourceSize.match(/[0-9]+/g);
        tframe.size = cc.size(parseInt(t[0]), parseInt(t[1]));
        return tframe;
    }

    //设置切换纹理的动作;
    public static setChangeSpriteFrameAction(node1: cc.Node, node2: cc.Node) {
        let scaleF0 = cc.scaleTo(0.3, 0.9);
        let scaleF1 = cc.scaleTo(0.4, 1.1);
        let scaleF2 = cc.scaleTo(0.2, 0.9);
        let scaleF3 = cc.scaleTo(0.2, 1);
        let callfunc = cc.callFunc(() => {
            let ro = cc.rotateBy(0.6, 180);
            let deTime = cc.delayTime(0.4);
            let hi = cc.fadeOut(0.2);
            let call = cc.callFunc(() => {
                node2.active = false;
            });
            node2.active = true;
            node2.runAction(cc.sequence(cc.spawn(ro, cc.sequence(deTime, hi)), call));
        });
        node1.runAction(cc.sequence(scaleF0, callfunc, scaleF1, scaleF2, scaleF3));
    }
}