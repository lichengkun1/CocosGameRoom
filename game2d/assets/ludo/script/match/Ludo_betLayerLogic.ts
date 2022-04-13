
import MessageData, { GameType, LudoLangType } from '../../../roomCommon/CommonScripts/Utils/MessageData';
import Ludo_BetsConfig from '../game/Ludo_BetsConfig';
import GlobalGameData from '../Global/Ludo_GlobalGameData';
import Ludo_MessageType from '../Utils/Ludo_MessageType';



const { ccclass, property } = cc._decorator;

@ccclass
export default class betLayerLogic extends cc.Component {

    @property({ type: cc.Label, tooltip: "设置筹码标题" })
    titleLabel: cc.Label = null;

    @property({ type: cc.Label, tooltip: "设置页面提示" })
    promptLabel: cc.Label = null;

    @property({ type: cc.Label, tooltip: "筹码类型" })
    typeLabel: cc.Label = null;

    @property({ type: cc.Label, tooltip: "下注设置" })
    betsLabel: cc.Label = null;

    @property({ type: cc.Label, tooltip: "完成设置" })
    conLabel: cc.Label = null;

    @property({ type: cc.Label, tooltip: "筹码值" })
    chipLabel: cc.Label = null;

    @property({ type: cc.Label, tooltip: "扣除文本" })
    winnerLabel: cc.Label = null;

    @property({ type: cc.SpriteFrame, tooltip: '选择模式' })
    selectIcon: cc.SpriteFrame = null;

    @property({ type: cc.SpriteFrame, tooltip: '非选择模式' })
    unSelectIcon: cc.SpriteFrame = null;

    @property({ type: cc.SpriteFrame, tooltip: 'YoYo金币Icon' })
    yoyoCoinIcon: cc.SpriteFrame = null;

    @property({ type: cc.SpriteFrame, tooltip: '游戏币Icon' })
    gameCoinIcon: cc.SpriteFrame = null;

    @property({ type: cc.Node, tooltip: "游戏币底" })
    gameIconKuang: cc.Node = null;

    @property({ type: cc.Node, tooltip: "YoYo币底" })
    yoyoIconKuang: cc.Node = null;

    @property({ type: cc.Node, tooltip: "Bet纹理" })
    betNode: cc.Node = null;

    @property({ type: cc.Node, tooltip: "游戏背景，用于阻隔点击事件" })
    popBG: cc.Node = null;

    @property({ type: cc.JsonAsset, tooltip: "多语言json" })
    langJson: cc.JsonAsset = null;

    @property({ type: cc.Node, tooltip: "iocn" })
    iconPrompt: cc.Node = null;

    private nowBetsType: string = 'diamond';                 //当前赌注的类型;
    private betsCount: number = 100;                         //赌注金额;
    private betsListLen: number = 0;


    start() {
        this.popBG.off(cc.Node.EventType.TOUCH_START);
        this.popBG.on(cc.Node.EventType.TOUCH_START, (event) => { event.stopPropagation() }, this);
        this.node.off(cc.Node.EventType.TOUCH_START)
        this.node.on(cc.Node.EventType.TOUCH_START, (event) => { this.node.active = false }, this);
        this.betsCount = GlobalGameData.roomBets;
        this.betsListLen = GlobalGameData.bets_list.length;
        this.setBetsModel(GlobalGameData.roomBetsType);
        this.setBetsString();

        this.setLayerLangText(MessageData.lang);
    }

    setLayerLangText(langJson: Partial<LudoLangType>) {
        this.titleLabel.string = langJson.setbet;
        this.promptLabel.string = langJson.host_configure;
        this.typeLabel.string = langJson.coin_type;
        this.betsLabel.string = langJson.bets;
        this.winnerLabel.string = langJson.winner;
        this.conLabel.string = langJson.confirm;
    }

    setBetsModel(model: string) {
        this.nowBetsType = model;
        if (model === 'coin') {
            this.gameIconKuang.getComponent(cc.Sprite).spriteFrame = this.unSelectIcon;
            this.yoyoIconKuang.getComponent(cc.Sprite).spriteFrame = this.selectIcon;
            this.betNode.getComponent(cc.Sprite).spriteFrame = this.yoyoCoinIcon;
            this.winnerLabel.node.active = true;
        } else if (model === 'diamond') {
            this.gameIconKuang.getComponent(cc.Sprite).spriteFrame = this.selectIcon;
            this.yoyoIconKuang.getComponent(cc.Sprite).spriteFrame = this.unSelectIcon;
            this.betNode.getComponent(cc.Sprite).spriteFrame = this.gameCoinIcon;
            this.winnerLabel.node.active = false;
        }
    }

    //游戏币模式;
    diamondType_callback() {
        if (this.nowBetsType === 'diamond') {
            return;
        }
        this.nowBetsType = 'diamond';
        this.setBetsModel('diamond');
    }

    //游戏币模式;
    coinType_callback() {
        if (this.nowBetsType === 'coin') {
            return;
        }
        this.nowBetsType = 'coin';
        this.setBetsModel('coin');
    }

    //增加筹码；
    addBets_callback() {
        let index = GlobalGameData.bets_list.indexOf(this.betsCount);
        console.log('index:' + index + '===this.betsListLen:' + this.betsListLen);
        if (index < 0 && GlobalGameData.bets_list[0]) {
            this.betsCount = GlobalGameData.bets_list[0];
            this.setBetsString();
            return;
        }

        if (index < this.betsListLen - 1) {
            this.betsCount = GlobalGameData.bets_list[++index];
            this.setBetsString();
        }
    }

    //减少筹码；
    subBets_callback() {
        let index = GlobalGameData.bets_list.indexOf(this.betsCount);
        if (index < 0 && GlobalGameData.bets_list[0]) {
            this.betsCount = GlobalGameData.bets_list[0];
            this.setBetsString();
            return;
        }
        if (index > 0) {
            this.betsCount = GlobalGameData.bets_list[--index];
            this.setBetsString();
        }
    }

    confirm_callback() {
        if (MessageData.gameType == GameType.single) return;
        if (!GlobalGameData.countTimeIsZero || (this.betsCount === GlobalGameData.roomBets && this.nowBetsType === GlobalGameData.roomBetsType)) {
            Ludo_BetsConfig.getRoomConfig( MessageData.gameRoomId,(data) => {},{ coin_type: this.nowBetsType, bets: this.betsCount })
        }
        this.node.active = false;
    }

    //设置bets显示;
    setBetsString() {
        this.chipLabel.string = this.betsCount.toString();
    }
}
