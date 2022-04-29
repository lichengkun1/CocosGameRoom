import MessageManager from "../../../Script/CommonScripts/Utils/MessageManager";
import ResourcesManager from "../../../Script/CommonScripts/Utils/ResourcesManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class userHeadLogic extends cc.Component {

    @property(cc.Sprite)
    headIcon: cc.Sprite = null;

    @property(cc.Sprite)
    iconNode: cc.Sprite = null;

    @property(cc.SpriteAtlas)
    iconAtlas: cc.SpriteAtlas = null;

    @property(cc.Node)
    actionIcon: cc.Node = null;

    @property(cc.Node)
    speakNode: cc.Node = null;

    private bullers: number = -1;                //下一个放置的羊的类型;
    private bullersLen: number = 0;              //动物放置长度;
    private playerId: number = -1;               //用户头像对应的id;
    private userDi: cc.Node = null;
    private goAway: cc.Node = null;              //掉线的提示;
    private speedType: cc.Node = null;           //加速状态;
    private isSpeakType:boolean = false;         //是否是说话状态;


    start() {
        this.userDi = this.node.getChildByName('userDi');
        this.goAway = this.userDi.getChildByName('goAway');
        this.speedType = this.node.getChildByName('speedType');
        this.userDi.on(cc.Node.EventType.TOUCH_START, () => {
            if (this.playerId > 0) {
                MessageManager.showPlayerInfo(this.playerId);
            }
        }, this);
    }

    setPlayerId(id) {
        this.playerId = id;
    }

    getPlayerId() {
        return this.playerId;
    }

    setSpeedType() {
        this.speedType.active = true;
        setTimeout(() => {
            if (this.node && this.node.active) {
                this.speedType.active = false;
            }
        }, 5000);
    }

    //设置头像纹理;
    setHeadSpriteFrame(headUrl: string, uid: number) {
        ResourcesManager.loadHeadImag(headUrl, uid, 2, (spr) => {
            if (spr) {
                this.headIcon.spriteFrame = new cc.SpriteFrame(spr);
                this.headIcon.node.scaleX = 64 / this.headIcon.node.width;
                this.headIcon.node.scaleY = 64 / this.headIcon.node.height;
                return;
            }
            cc.loader.loadRes('icon', cc.SpriteFrame, (err, res) => {
                if (err) {
                    return;
                }
                this.headIcon.spriteFrame = res;
                this.headIcon.node.scaleX = 64 / this.headIcon.node.width;
                this.headIcon.node.scaleY = 64 / this.headIcon.node.height;
            });
        });
    }

    //设置放置下一个动物纹理；
    setIconSpriteFrame(bullers: number, camp: string, bullersLen, status) {
        if (status == "online") {
            this.goAway.active = false;
        } else {
            this.goAway.active = true;
        }
        if (this.bullers == bullers && this.bullersLen == bullersLen) {
            return;
        } else {
            this.bullers = bullers;
            this.bullersLen = bullersLen;
            let iconSpriteFram = '';
            if (camp == 'red') {
                iconSpriteFram = this.getBullTexture(bullers);
            } else {
                iconSpriteFram = this.getSheepTexture(bullers);
            }

            let moveTime = 0.3;
            //actionIcon 从上下来并隐藏;
            this.actionIcon.active = true;
            this.actionIcon.y = 80;
            this.actionIcon.getComponent(cc.Sprite).spriteFrame = this.iconAtlas.getSpriteFrame(iconSpriteFram);
            let moveActionIcon = cc.moveTo(moveTime, cc.v2(0, 0));
            let actionIconCall = cc.callFunc((event) => {
                event.active = false;
            });
            this.actionIcon.runAction(cc.sequence(moveActionIcon, actionIconCall));

            //icon往下并且切换纹理显示；
            let moveIcon = cc.moveBy(moveTime, cc.v2(0, -80));
            let iconCall = cc.callFunc((event) => {
                this.iconNode.spriteFrame = this.iconAtlas.getSpriteFrame(iconSpriteFram);
                event.x = 0;
                event.y = 0;
            });
            this.iconNode.node.runAction(cc.sequence(moveIcon, iconCall));
        };
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
    
    //设置是否为说话状态;
    setPlayerSpeakType() {
        if (this.isSpeakType) {
            return;
        }
        this.isSpeakType = true;
        this.speakNode.active = true;
        let userDi = this.userDi;
        if(!userDi){
            userDi = this.node.getChildByName('userDi');
        }
        this.speakNode.y = userDi.y;
        let peadDrag = this.speakNode.getComponent(dragonBones.ArmatureDisplay);
        peadDrag.addEventListener(dragonBones.EventObject.COMPLETE, () => {
            peadDrag.removeEventListener(dragonBones.EventObject.COMPLETE);
            this.isSpeakType = false;
            this.speakNode.active = false;
        }, this);
        peadDrag.playAnimation('newAnimation', 1);
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
}
