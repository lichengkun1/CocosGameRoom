

import MessageManager from '../../../Script/CommonScripts/Utils/MessageManager';
import MyEvent from '../../../Script/CommonScripts/Utils/MyEvent';
import GlobalGameData from '../Global/SFGlobalGameData';

const { ccclass, property } = cc._decorator;

@ccclass
export default class userSelfLogic extends cc.Component {

    @property(cc.Node)
    queueItemList: cc.Node[] = [];

    @property(cc.SpriteAtlas)
    iconAtlas: cc.SpriteAtlas = null;

    @property(cc.Node)
    speakNode: cc.Node = null;

    private readyPro: cc.Sprite = null;                  //倒计时的进度，动态的，每次获取数组的第一个值;
    private isUpdate: boolean = false;                   //是否开启update；
    private proNumber: number = 0;                       //进度的值0->-1；
    private countTimeNumber: number = 3;                 //倒计时时间，做成全局;
    private randIcom: number[] = [];                     //纹理数组；
    private setTextureIndex: number = 0;                 //当前设置的纹理index；
    private nowShowIndex: number = 0;                    //当前点击应该发送的纹理;
    private isReady: boolean = false;                    //羊是否已经准备好了;
    private isDestine: boolean = false;                  //是否已经预定了，如果预定了，则直接下一个;
    private isSetIcon: boolean = true;
    private selfCamp: number = 0;                        //自己的阵营;
    private goAway: cc.Node = null;                      //自己是否掉线;
    private isCanSendMessage: boolean = false;           //是否能发送羊消息;
    private speedType: cc.Node = null;                   //加速状态;
    private countDwon: cc.Node = null;                   //倒计时节点;
    private speedTimeLabel: cc.Label = null;             //倒计时label;
    private isSpeakType: boolean = false;                //是否是说话状态;


    start() {
        this.init();
        this.countDownFunc();
    }

    init() {
        let userDi = this.node.getChildByName('userDi');
        this.goAway = userDi.getChildByName('goAway');
        this.speedType = this.node.getChildByName('speedType');
        this.countDwon = this.node.getChildByName('countDwon');
        this.speedTimeLabel = this.countDwon.getChildByName('speedTimeLabel').getComponent(cc.Label);

        userDi.on(cc.Node.EventType.TOUCH_START, () => {
            MessageManager.showPlayerInfo(GlobalGameData.userId);
        }, this);
    }

    //设置自己的状态;
    setUserStatus(status) {
        if (status == 'online') {
            this.goAway.active = false;
        } else {
            this.goAway.active = true;
        }

        if (status == 'abandoned' || status == 'kickoff') {
            this.isCanSendMessage = false;
        } else {
            this.isCanSendMessage = true;
        }
    }

    //设置显示的纹理;
    setIconSpriteFrame() {
        let len = this.queueItemList.length;
        for (let i = 0; i < len; i++) {
            let item = this.queueItemList[i];
            let icon = item.getChildByName('icon');
            let frameStr = '';
            if (this.selfCamp == 0) {
                frameStr = this.getBullTexture(this.randIcom[i]);
            } else {
                frameStr = this.getSheepTexture(this.randIcom[i]);
            }
            icon.getComponent(cc.Sprite).spriteFrame = this.iconAtlas.getSpriteFrame(frameStr);
        }
        this.setTextureIndex = len;
        this.nowShowIndex = 0;
    }

    //获取羊的纹理;
    getSheepTexture(index): string {
        let textureStr: string = '';
        switch (index) {
            case 0:
                textureStr = 'sheepSmall';
                break;
            case 1:
                textureStr = 'sheepMid';
                break;
            case 2:
                textureStr = 'sheepBig';
                break;
            case 3:
                textureStr = 'sheepMax';
                break;

        }
        return textureStr;
    }

    //获取牛的纹理;
    getBullTexture(index): string {
        let textureStr: string = '';
        switch (index) {
            case 0:
                textureStr = 'bullSmall';
                break;
            case 1:
                textureStr = 'bullMid';
                break;
            case 2:
                textureStr = 'bullBig';
                break;
            case 3:
                textureStr = 'bullMax';
                break;
        }
        return textureStr;
    }

    //出羊顺序数组增加;
    concatRandIcom(bullets: number[]) {
        this.randIcom = bullets;
        this.setTextureIndex = 0;
        // if(this.isSetIcon){
        //     this.isSetIcon = false;
        this.setIconSpriteFrame();
        // }
    }

    //倒计时;
    countDownFunc() {
        let item: cc.Node = this.queueItemList[0];
        item.getChildByName('lodingDi1').active = true;
        this.readyPro = item.getChildByName('lodingDi2').getComponent(cc.Sprite);
        this.isReady = false;
        this.proNumber = 0;
        this.isUpdate = true;
    }

    //停止update;
    stopUpdate() {
        this.isUpdate = false;
        this.readyPro = null;
        // this.node.once(cc.Node.EventType.TOUCH_START,this.changeShowItem.bind(this),this);
    }

    //设置是否订阅,当不能放入应该放的地方时，需要取消订阅;
    setIsDesine(flag: boolean) {
        this.isDestine = flag;
    }

    setSelfCamp(camp) {
        this.selfCamp = camp;
    }

    //游戏层请求Icon;
    getReadyIcon() {
        // console.log('getReadyIcon::::'+this.randIcom[this.nowShowIndex]);
        // console.log(this.randIcom);
        // console.log(this.nowShowIndex);
        let len = this.randIcom.length;
        if (this.setTextureIndex >= len - 3) {
            MyEvent.I.emit('needGetBulletNo');
        }

        let obj = {
            iconType: this.randIcom[this.nowShowIndex],
            iconReady: this.isReady
        };
        //如果是准备好的状态，那么直接下一个倒计时;
        if (this.isReady) {
            // this.changeShowItem();
        } else {
            //如果没有准备好，就算预定;
            this.isDestine = true;
        }
        return obj;
    }

    //更换第一个显示的icon;
    changeShowItem() {
        //告诉game应该创建的icon；
        this.nowShowIndex++;
        let posList: number[] = [-270, -220, -120, -36, 48];
        let opacityList: number[] = [0, 255, 200, 170];
        let item0 = this.queueItemList[0];
        item0.stopAllActions();
        item0.scale = 1;
        cc.tween(item0)
            .to(0.1, { position: cc.v3(-270, posList[0],0), opacity: opacityList[0] })
            .call((event) => {
                event.getChildByName('lodingDi2').getComponent(cc.Sprite).fillRange = 0;
                event.getChildByName('lodingDi1').active = false;
                event.y = posList[4];
                event.y = -270;
                let frameStr = '';
                if (this.selfCamp == 0) {
                    frameStr = this.getBullTexture(this.randIcom[this.setTextureIndex]);
                } else {
                    frameStr = this.getSheepTexture(this.randIcom[this.setTextureIndex]);
                }
                event.getChildByName('icon').getComponent(cc.Sprite).spriteFrame = this.iconAtlas.getSpriteFrame(frameStr);
                //新显示一个icon;
                this.setTextureIndex++;

                let item = this.queueItemList.shift();
                this.queueItemList.push(item);
                this.countDownFunc();
            })
            .start();

        let item1 = this.queueItemList[1];
        cc.tween(item1)
            .to(0.1, { position: cc.v3(-270, posList[1],0), opacity: opacityList[1] })
            .start();

        let item2 = this.queueItemList[2];
        cc.tween(item2)
            .to(0.1, { position: cc.v3(-270, posList[2],0), opacity: opacityList[2] })
            .start();

        let item3 = this.queueItemList[3];
        cc.tween(item3)
            .to(0.1, { position: cc.v3(-270, posList[3],0), opacity: opacityList[3] })
            .start();
    }

    //购买加速成功以后;
    quickenSuccees() {
        this.speedType.active = true;
        this.countDwon.active = true;
        this.countTimeNumber = 1.5;
        let num = 5;
        this.speedTimeLabel.string = String(num);
        this.schedule(() => {
            num--;
            this.speedTimeLabel.string = String(num);
            if (num == 0) {
                this.countDwon.active = false;
                this.speedType.active = false;
                this.countTimeNumber = 3;
            }
        }, 1, 4);
    }

    //设置是否为说话状态;
    setPlayerSpeakType() {
        if (this.isSpeakType) {
            return;
        }
        this.isSpeakType = true;
        this.speakNode.active = true;
        let peadDrag = this.speakNode.getComponent(dragonBones.ArmatureDisplay);
        peadDrag.addEventListener(dragonBones.EventObject.COMPLETE, () => {
            peadDrag.removeEventListener(dragonBones.EventObject.COMPLETE);
            this.isSpeakType = false;
            this.speakNode.active = false;
        }, this);
        peadDrag.playAnimation('newAnimation', 1);
    }

    update(dt) {
        if (this.isUpdate && this.readyPro) {
            this.proNumber -= dt / this.countTimeNumber;
            this.readyPro.fillRange = this.proNumber;
            if (this.proNumber <= -1) {
                this.stopUpdate();
                this.isReady = true;
                MyEvent.I.emit('icon_ready');
                //如果预定了，那么告诉上一层，倒计时已经好了;
                if (this.isDestine) {
                    //////console.log('icon_ready');
                    this.isDestine = false;
                    // this.changeShowItem();
                }
                // }else{
                //如果没有预定，那么现在是准备好的状态，可以随时点击切换，如果已经预定了，那么会开始下一轮倒计时;
                let item: cc.Node = this.queueItemList[0];
                let scaleTime: number = 0.3;
                cc.tween(item)
                    .repeatForever(cc.tween()
                        .to(scaleTime, { scale: 1.2 })
                        .to(scaleTime, { scale: 1 })
                    )
                    .start();
                // }
            }
        }
    }

}
