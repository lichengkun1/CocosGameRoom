import Global from '../Global/Ludo_GlobalGameData';
import { Pieces } from '../models/player';
import Ludo_GameMode from '../ModeSceneScripts/Ludo_GameMode';
import Ludo_userNodeLogic from './Ludo_userNodeLogic';
export default class Ludo_userNodeList {

    private nodeList: cc.Node[] = [];                //4个节点;
    private nodeListPos: cc.Node[] = [];                //4个节点;
    private moveTrack: number[][] = [];              //节点所有移动的坐标；
    private startPoints: number = -322;              //地图的起始坐标；
    private mapSize: number = 46;                    //地图的宽度；
    private nodePos: number[] = [];                  //棋子的坐标;
    private oldPieces = null;                       //保存移动之前服务器给的坐标;
    public userKey: number = -1;                    //属于第几视角;
    public endNode: cc.Node[] = [];                 //在终点的棋子;

    public repeat52To58Nodes: {[key: string]: number} = {};        // 52 - 58之间的节点数组 第几个棋子 -> 地图块索引

    //类的构造函数，把2个节点传进来;
    constructor(nodeList: cc.Node[], nodeListPos: cc.Node[], moveTrack: number[][], posArr: number[][], userType: string, playerid: number,viewKey: number) {
        this.nodeList = nodeList;
        this.nodeListPos = nodeListPos;
        this.moveTrack = moveTrack;
        this.setUserKey(viewKey);

        let nodeListLen = this.nodeList.length;
        for (let i = 0; i < Ludo_GameMode.piceNum; i++) {//setUserType
            const nodeLogicComp = this.nodeList[i].getComponent(Ludo_userNodeLogic);
            nodeLogicComp.nodeTrackArr = this.moveTrack;
            nodeLogicComp.nodeListComp = this;
            let userIndex = userType.slice(-1);
            nodeLogicComp.movePath = Global[`moveUser${userIndex}MoveTrack`];
            nodeLogicComp.viewIndex = viewKey;

            nodeLogicComp.setStartPos(posArr[i]);
            nodeLogicComp.setUserType(userType);
            if (playerid == Global.userId) {
                nodeLogicComp.addEventTouch();
            }
            this.nodeList[i].x = posArr[i][0];
            this.nodeList[i].y = posArr[i][1];

            this.nodeListPos[i].x = posArr[i][0];
            this.nodeListPos[i].y = posArr[i][1];
        }
    }

    public clearRepeat52To58Map() {
        this.repeat52To58Nodes = {};
    }
    public setUserKey(key: number) {
        this.userKey = key;
    }

    public getUserKey() {
        return this.userKey;
    }

    //获取某个棋子;
    public getNodeListIndex(index: number): cc.Node {
        return this.nodeList[index];
    }

    //设置某个棋子隐身衣;
    public setIndexPiecePropInViCloak(index) {
        let piece = this.nodeList[index]
        let pAni = piece.getComponent(dragonBones.ArmatureDisplay).armature();
        let glassSlot = pAni.getSlot("yinshenyi");
        glassSlot.displayIndex = 0;
    }

    //设置所有棋子隐藏隐身衣;
    public setAllPiecePiecePropInViCloak() {
        for (let i = 0, len = Ludo_GameMode.piceNum; i < len; i++) {
            let piece = this.nodeList[i]
            let pAni = piece.getComponent(dragonBones.ArmatureDisplay).armature();
            if (pAni) {
                let glassSlot = pAni.getSlot("yinshenyi");
                glassSlot.displayIndex = -1;
                piece.getComponent(Ludo_userNodeLogic).isPropType = false;
            }

        }
    }

    public setNodePos(pieces, userKey, playerKey) {
        this.userKey = playerKey;
        this.oldPieces = pieces;
        for (let key in pieces) {
            let piecesKey = Number(pieces[key]);
            let index = Number(key) - 1;
            switch (userKey) {
                case '1':
                    break;
                case '2':
                    if (piecesKey != 0 && piecesKey <= 52) {
                        if (piecesKey <= 13) {
                            piecesKey += 52;
                        }
                        piecesKey -= 13;
                    }
                    break;
                case '3':
                    if (piecesKey != 0 && piecesKey <= 52) {
                        if (piecesKey <= 26) {
                            piecesKey += 52;
                        }
                        piecesKey -= 26;
                    }
                    break;
                case '4':
                    if (piecesKey != 0 && piecesKey <= 52) {
                        if (piecesKey <= 39) {
                            piecesKey += 52;
                        }
                        piecesKey -= 39;
                    }
                    break;
            }

            //初始化我的坐标;
            this.nodePos[index] = piecesKey;
            // if(key === '4') {
            //     console.log(`key is ${key} nodePos is `,this.nodePos);
            // }
            //终点坐标;
            if (piecesKey == 58 && this.endNode.indexOf(this.nodeList[index]) < 0) {
                // 删除到达终点的棋子
                this.repeat52To58Nodes[index] && delete this.repeat52To58Nodes[index];
                this.endNode.push(this.nodeList[index]);
            }
            
            // 根据棋子在地图中的位置设置棋子
            // console.log('piecesKey is ',piecesKey);
            this.nodeList[index].getComponent(Ludo_userNodeLogic).initNodePos(piecesKey, this.moveTrack, userKey);
            if(piecesKey > 52 && piecesKey < 58) {
                // 终点前的几个棋子设置
                this.repeat52To58Nodes[index] = piecesKey;
            }
        }
        this.setRepeat5258NodeScale();
        this.setEndNodePos();
    }

    public setRepeat5258NodeScale() {
        // 检查所有棋子有没有相同位置的棋子
        const allPieceKeys = Object.keys(this.repeat52To58Nodes);
        const valueMap = {};
        allPieceKeys.forEach(it => {
            const value = this.repeat52To58Nodes[it];
            if(!valueMap[value]) {
                valueMap[value] = [it];
            } else {
                valueMap[value].push(it);
            }
        });
        const valueMapValue = Object.values(valueMap);
        valueMapValue.forEach((valueItem: Array<string>) => {
            if(valueItem.length === 1) {
                // 设置缩放为1
                const indexNumber = +valueItem[0];
                this.nodeList[indexNumber] && (this.nodeList[indexNumber].scale = 1);
                 
            } else {
                const len = valueItem.length;
                // 设置缩放为0.8
                valueItem.forEach((indexStr,inx) => {
                    const indexNum = +indexStr;
                    const targetNode = this.nodeList[indexNum];
                    targetNode && (targetNode.scale = 0.8);
                    const endPos = targetNode.getComponent(Ludo_userNodeLogic).getEndPos();
                    if((len & 1) === 0) {
                        targetNode.x = endPos[0] - 10 - (len / 2 - 1) * 20 + inx * 20;
                    } else {
                        targetNode.x = endPos[0] - Math.floor(len / 2) * 20 + inx * 20;
                    }
                });
            }
        });
    }

    /**
     * 设置Global.allNodePos数据
     * @param  {{[key: string]: number}} pieces
     */
    savaNodePos(pieces) {
        if (pieces[1] == pieces[2] && pieces[1] > 52) {
            this.nodeList[0].scale = 0.8;
            this.nodeList[1].scale = 0.8;
            this.nodeList[0].x -= 10;
            this.nodeList[1].x += 10;
            // 次处的bug会导致 四个棋子的情况忽略了后面棋子的位置没有装入 Global.allNodePos
        }
        let keys = Object.keys(pieces);
        for (let i = 0, len = keys.length; i < len; i++) {
            let key = keys[i];
            let value = pieces[key];
            const addToNodePosMap = () => {
                if (Global.allNodePos[value]) {
                } else {
                    Global.allNodePos[value] = [];
                }
                Global.allNodePos[value].push(this.nodeList[Number(key) - 1]);
            }
            if (value != 0 && value < 53) {
                addToNodePosMap();
            } 
            if(value === 58) {
                // > 53的棋子不能加入到该列表里面因为同一个位置的坐标是不同的 包括0在内
                const targetNode = this.nodeList[+key - 1];
                if(this.endNode.indexOf(targetNode) < 0) {
                    this.endNode.push(targetNode);
                }
            }
        }
    }

    //设置终点节点的坐标;
    setEndNodePos() {
        let userKey = this.userKey;
        let len = this.endNode.length;
        let posArr: number[][] = [];
        let endPos = [0, 0];
        let zIndexNum = 15;
        switch (userKey) {
            case 0:
                if (len == 1) {
                    posArr = [[0, 0]];
                } else if (len == 2) {
                    posArr = [[-22, -10], [22, -10]];
                } else if (len == 3) {
                    posArr = [[0, 14], [-32, -10], [32, -10]];
                } else if (len == 4) {
                    posArr = [[0, 25], [-38, -10], [0, -10], [38, -10]];
                }
                endPos = [0, -46];
                /** 自己的层级设置为9 */
                zIndexNum = 9;
                break;
            case 1:
                if (len == 1) {
                    posArr = [[0, 0]];
                } else if (len == 2) {
                    posArr = [[0, 25], [0, -25]];
                } else if (len == 3) {
                    posArr = [[14, 0], [-10, 32], [-10, -32]];
                } else if (len == 4) {
                    posArr = [[25, 0], [-10, 38], [-10, 0], [-10, -38]];
                }
                endPos = [-46, 0];
                zIndexNum = 8;
                break;
            case 2:
                if (len == 1) {
                    posArr = [[0, 0]];
                } else if (len == 2) {
                    posArr = [[-22, 10], [22, 10]];
                } else if (len == 3) {
                    posArr = [[0, -14], [-32, 10], [32, 10]];
                } else if (len == 4) {
                    posArr = [[0, -25], [-38, 10], [0, 10], [38, 10]];
                }
                endPos = [0, 46];
                zIndexNum = 7;
                break;
            case 3:
                if (len == 1) {
                    posArr = [[0, 0]];
                } else if (len == 2) {
                    posArr = [[0, 25], [0, -25]];
                } else if (len == 3) {
                    posArr = [[-14, 0], [10, 32], [10, -32]];
                } else if (len == 4) {
                    posArr = [[-25, 0], [10, 38], [10, 0], [10, -38]];
                }
                endPos = [46, 0];
                zIndexNum = 8;
                break;
        }
        for (let i = 0; i < len; i++) {
            this.endNode[i].x = endPos[0] + posArr[i][0];
            this.endNode[i].y = endPos[1] + posArr[i][1];
            const logicComp = this.endNode[i].getComponent(Ludo_userNodeLogic);
            logicComp.zIndex = zIndexNum;
            let scaleNum = 1;
            if (len == 1) {
                scaleNum = 1;
            } else if (len > 1) {
                scaleNum = 0.8;
                if (len == Ludo_GameMode.piceNum) {
                    setTimeout(() => {
                        logicComp.playDragonAnimation('shengli', 0);
                    }, 200);
                }
            }
            this.endNode[i].scale = scaleNum;
        }
    }

    /**
     * 获取需要移动的是那个节点;
     * @param  {} pieces
     * @returns number 1 - 4
     */
    getMoveNodeIndex(pieces): number {
        for (let key in pieces) {
            if (pieces[key] != this.oldPieces[key]) {
                return Number(key);
            }
        }
    }

    /**
     * 设置当前坐标数据；
     * @param  {{[key: string]: number}} pieces
     * @param  {number[]} posArr
     */
    setOldPieces(pieces: {[key: string]: number}, posArr: number[]) {
        this.oldPieces = pieces;
        for (let i = 0, len = posArr.length; i < len; i++) {
            this.nodePos[i] = posArr[i];
        }
    }

    //获取当前坐标数据；
    getOldPieces() {
        return this.oldPieces;
    }

    /**
     * 根据传进来的数据和当前的数据对比，让棋子移动;
     * @param  {Pieces} pieces 棋子位置对象
     * @param  {string} userKey 视角 如果是上帝视角的话就是1
     */
    public NodeComparedMove(pieces, userKey) {
        this.oldPieces = pieces;
        let keys = Object.keys(pieces);
        for (let i = 0, len = keys.length; i < len; i++) {
            let key = keys[i];
            let piecesKey = Number(pieces[key]);
            let index = Number(key) - 1;
            switch (userKey) {
                case '1':
                    break;
                case '2':
                    if (piecesKey != 0 && piecesKey <= 52) {
                        if (piecesKey <= 13) {
                            piecesKey += 52;
                        }
                        piecesKey -= 13;
                    }
                    break;
                case '3':
                    if (piecesKey != 0 && piecesKey <= 52) {
                        if (piecesKey <= 26) {
                            piecesKey += 52;
                        }
                        piecesKey -= 26;
                    }
                    break;
                case '4':
                    if (piecesKey != 0 && piecesKey <= 52) {
                        if (piecesKey <= 39) {
                            piecesKey += 52;
                        }
                        piecesKey -= 39;
                    }
                    break;
            }
            if (this.nodePos[index] != piecesKey) {
                this.runMoveNode(index, this.nodePos[index], piecesKey);
                // 同位置的有几个棋子，防止出现两个棋子的地方其他的棋子移动走了，另外几个缩放不对和位
                this.nodePos[index] = piecesKey;
                if (piecesKey == 58 && this.endNode.indexOf(this.nodeList[index]) < 0) {
                    this.endNode.push(this.nodeList[index]);
                    this.repeat52To58Nodes[index] && delete this.repeat52To58Nodes[index];
                }
                break;
            }
        }
    }

    //设置所有节点为待机状态;
    public setAllNodeStandby() {
        for (let i = 0; i < Ludo_GameMode.piceNum; i++) {
            this.nodeList[i].getComponent(Ludo_userNodeLogic).isCanTouch = false;
            this.nodeList[i].getComponent(Ludo_userNodeLogic).playDragonAnimation('daiji', 0);
        }
    }

    /**
     * 一个节点移动影响原来位置的棋子状态和终点棋子状态
     * 通过旧的数据获取起始坐标相同的点;
     * @param  {number} startPos 开始索引
     * @param  {number} index 需要检查的第几个棋子
     * @param  {boolean} isOther 开始位置对于自己来说是false,因为已经从该位置走出去了，不是自己的时候就是true
     */
    public getStartPos(startPos: number, index: number, isOther: boolean): cc.Node[] {
        let startPosArr: cc.Node[] = [];
        let keyArr = Object.keys(this.oldPieces);

        for (let i = 0, len = keyArr.length; i < len; i++) {
            let Key = Number(keyArr[i]);
            let number = Key - 1;
            if (isOther) {
                if (this.oldPieces[Key] == startPos && this.oldPieces[Key] != 0 && this.oldPieces[Key] < 53) {
                    // 此处会出现bug 飞船把人运到一个已经有人的地方且这个地方的地图块索引 >= 53
                    startPosArr.push(this.nodeList[number]);
                }
            } else {
                if (this.oldPieces[Key] == startPos && this.oldPieces[Key] != 0 && index != Key) {
                    // 跟自己的棋子的索引不同，例如第 1号位有三个棋子，走了一个，走的哪一个的索引肯定和其他两个不同
                    startPosArr.push(this.nodeList[number]);
                }
            }
        }
        return startPosArr;
    }

    
    /**
     * 一个节点移动影响原来位置的棋子状态和终点棋子状态 包括当前节点
     * 通过旧的数据获取起始坐标相同的点;
     * @param  {number} endPos 结束索引
     * @param  {Pieces} pieces 需要检查的第几个棋子
     * @param  {boolean} isOther 开始位置对于自己来说是false,因为已经从该位置走出去了，不是自己的时候就是true
     */
    public getEndPosArr(endPos: number, pieces: Pieces, isSelf: boolean): cc.Node[] {
        let endPosArr: cc.Node[] = [];
        let keys = Object.keys(pieces);
        for (let i = 0, len = keys.length; i < len; i++) {
            let key = Number(keys[i]);
            if (isSelf) {
                if (pieces[key] == endPos && pieces[key] != 0) {
                    let number = key - 1;
                    endPosArr.push(this.nodeList[number]);
                }
            } else {
                if (pieces[key] == endPos && pieces[key] != 0 && pieces[key] <= 52) {
                    // 此处的bug会导致
                    let number = key - 1;
                    endPosArr.push(this.nodeList[number]);
                }
            }
        }
        return endPosArr;
    }

    //通过新的数据和旧的数据对比，获取被T的数据；
    getTPosArr(pieces) {
        let tPosArr: number[] = [];
        for (let key in pieces) {
            if (pieces[key] == 0 && this.oldPieces[key] != pieces[key]) {
                let number = Number(key) - 1;
                tPosArr.push(number);
            }
        }
        return tPosArr;
    }

    //获取现在是在移动节点的数量;
    public getMoveingNum(moveCount: number): number {
        let num = 0;
        for (let i = 0; i < Ludo_GameMode.piceNum; i++) {
            if (this.nodePos[i] > 0 && this.nodePos[i] <= 58 - moveCount) {
                num++;
            }
        }
        return num;
    }

    //获取可以等于6以后可以点击的数量;
    public getNLessThanumber(moveCount: number): number {
        let num = 0;
        for (let i = 0; i < Ludo_GameMode.piceNum; i++) {
            if (this.nodePos[i] <= 58 - moveCount) {
                num++;
            }
        }
        return num;
    }

    //返回移动节点的坐标;
    public getNodeTrackPos(): number[][] {
        let posList: number[][] = [];
        for (let i = 0; i < Ludo_GameMode.piceNum; i++) {
            let pos = this.nodeList[i].getComponent(Ludo_userNodeLogic).nowPos;
            let mTrack: number[] = [];
            if (pos >= 0) {
                mTrack = this.moveTrack[pos];
            } else {
                mTrack = [-1, -1];
            }
            posList[i] = mTrack;
        }
        return posList;
    }

    //返回节点数组的步数位置;
    public getNodePos(): number[] {
        let posList: number[] = [];
        for (let i = 0; i < Ludo_GameMode.piceNum; i++) {
            let pos = this.nodeList[i].getComponent(Ludo_userNodeLogic).nowPos;
            posList[i] = pos;
        }
        return posList;
    }

    public clearNodePos() {
        this.nodePos = [];
    }

    /*
        根据传入的值返回node
        @param index 第哪个值   
    */
    getNodeFunc(index: number) {
        let node: cc.Node = this.nodeList[index];
        if (node) {
            return node;
        }
        return null;
    }

    /*
        获取节点当前的坐标值
        @param index 第哪个节点
    */
    public getIndexNodePos(index): number[] {
        //这个节点的当前值；
        let nowPos = this.nodeList[index].getComponent(Ludo_userNodeLogic).nowPos;
        if (nowPos == -1) {
            return [0, 0];
        }
        //节点移动以后的值；
        let mTrack: number[] = this.moveTrack[nowPos];
        return mTrack
    }

    //返回某个路径的坐标值;
    public getTra46osition(pos: number): cc.Vec2 {
        let track = this.moveTrack[pos];
        let x = this.startPoints + track[0] * this.mapSize;
        let y = this.startPoints + track[1] * this.mapSize;
        return new cc.Vec2(x, y);
    }

    //设置所有节点都能点击;
    public setAllNodeCanTouch(moceCount) {
        for (let i = 0; i < Ludo_GameMode.piceNum; i++) {
            //如果是不能点击，或者与终点的位置大于需要移动的位置;
            if (this.nodePos[i] + moceCount <= 58) {
                this.nodeList[i].getComponent(Ludo_userNodeLogic).isCanTouch = true;
                this.nodeList[i].getComponent(Ludo_userNodeLogic).playDragonAnimation('wait', 0);
            }
        }
    }

    //设置移动中的节点都能点击;
    public setMoveingCanTouch(moveCount) {
        for (let i = 0; i < Ludo_GameMode.piceNum; i++) {
            let nowPos = this.nodePos[i];
            if (nowPos > 0 && nowPos + moveCount <= 58) {
                this.nodeList[i].getComponent(Ludo_userNodeLogic).isCanTouch = true;
                this.nodeList[i].getComponent(Ludo_userNodeLogic).playDragonAnimation('wait', 0);
            }
        }
    }

    //设置某一个棋子是可以点击的;
    public setIndexPieceCantouch(index: number) {
        index -= 1;
        this.nodeList[index].getComponent(Ludo_userNodeLogic).isCanTouch = true;
        this.nodeList[index].getComponent(Ludo_userNodeLogic).playDragonAnimation('wait', 0);
    }

    //获取可以移动6个位置的棋子id；
    get6CanMovePieceId(moveCount) {
        for (let i = 0; i < Ludo_GameMode.piceNum; i++) {
            if (this.nodePos[i] <= 58 - moveCount) {
                return i + 1;
            }
        }
        return 1;
    }

    //获取可以唯一移动的骰子的index；
    getCanMovePieceId(moveCount): number {
        for (let i = 0; i < Ludo_GameMode.piceNum; i++) {
            if (this.nodePos[i] <= 58 - moveCount && this.nodePos[i] != 0) {
                return i + 1;
            }
        }
        return 1;
    }

    //获取一个未到重点的值;
    getCanMovePieceId2() {
        for (let i = 0; i < Ludo_GameMode.piceNum; i++) {
            if (this.nodePos[i] < 58) {
                return i + 1;
            }
        }
        return 1;
    }

    //当只有一个节点属于移动的状态时，直接让那个节点移动;
    public setNodeMoveTrack(arr?): number {
        for (let i = 0; i < Ludo_GameMode.piceNum; i++) {
            if (this.nodePos[i] > 0) {
                return i;
            }
        }
    }

    //获取唯一移动节点的坐标;
    public getOnlyMoveNodeTrack(): number[] {
        for (let i = 0; i < Ludo_GameMode.piceNum; i++) {
            let nowPos = this.nodeList[i].getComponent(Ludo_userNodeLogic).nowPos;
            if (nowPos >= 0) {
                return this.getIndexNodePos(i);
            }
        }
        return [0, 0];
    }

    //移动具体节点;
    /*
        @param index 第几个棋子
        @param startPos 其实点
        @param endPos   结束点
    */
    public runMoveNode(index: number, startPos: number, endPos: number) {
        // let moveTrack = this.moveTrack;             //移动路径坐标;
        this.nodeList[index].getComponent(Ludo_userNodeLogic).runMoveFunc(startPos, endPos,this,index);
    }

    //节点被T回调;
    public setNodeResult(posArr) {
        let len = posArr.length;
        for (let i = 0; i < len; i++) {
            let num = posArr[i];
            this.nodeList[num].getComponent(Ludo_userNodeLogic).runGoStart();
            this.nodePos[num] = 0;
            this.oldPieces[String(num + 1)] = 0;
        }
    }

    //被炸弹炸回家;
    public boomGoHome(posArr) {
        let len = posArr.length;
        for (let i = 0; i < len; i++) {
            let num = posArr[i];
            this.nodeList[num].getComponent(Ludo_userNodeLogic).runBoomStart();
            this.nodePos[num] = 0;
            this.oldPieces[String(num + 1)] = 0;
        }
    }

    //当前这个值的数量;
    public currentPosCount(num: number) {
        // this.setAllNodeResulletPos();
        let posArr = [];
        for (let i = 0; i < Ludo_GameMode.piceNum; i++) {
            if (this.nodeList[i].getComponent(Ludo_userNodeLogic).nowPos == num) {
                posArr.push(i);
            }
        }
        let posLen = posArr.length;
        if (posLen == 2) {
            for (let i = 0; i < posLen; i++) {
                this.nodeList[posArr[i]].scale = 0.6;
                this.nodeList[posArr[i]].x = this.startPoints + this.moveTrack[num][0] * this.mapSize - 15 + 30 * i;
            }
        } else if (posLen == 3) {
            for (let i = 0; i < posLen; i++) {
                this.nodeList[posArr[i]].scale = 0.6;
                this.nodeList[posArr[i]].x = this.startPoints + this.moveTrack[num][0] * this.mapSize - 20 + 20 * i;
            }
        } else if (posLen == 4) {
            for (let i = 0; i < posLen; i++) {
                this.nodeList[posArr[i]].scale = 0.6;
                this.nodeList[posArr[i]].x = this.startPoints + this.moveTrack[num][0] * this.mapSize - 30 + 20 * i;
            }
        }
    }

    //根据传过来坐标值，返回在这个数组位置的节点;
    getTrackNode(_track): cc.Node[] {
        let trackArr = [];
        for (let i = 0; i < Ludo_GameMode.piceNum; i++) {
            let nowPos = this.nodeList[i].getComponent(Ludo_userNodeLogic).nowPos;
            let track = this.moveTrack[nowPos];
            if (track && track[0] == _track[0] && track[1] == _track[1]) {
                trackArr.push(this.nodeList[i]);
            }
        }
        return trackArr;
    }

    setNodeListTouchEven() {

    }
}
