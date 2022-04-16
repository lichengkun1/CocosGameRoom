
import { GameConfig } from "../../../gameConfig";
import MessageData, { GameCoinType, GameType } from "../../../roomCommon/CommonScripts/Utils/MessageData";
import MessageManager from "../../../roomCommon/CommonScripts/Utils/MessageManager";
import NDB from "../../../roomCommon/CommonScripts/Utils/NDBTS";
import Dominoe_BetsConfig from "../bets/Dominoe_BetsConfig";
import Dominoe_GlobalGameData, { GameModeDominoe } from "../Utils/Dominoe_GlobalGameData";
// import Ludo_BetsConfig from "../game/Ludo_BetsConfig";
// import Ludo_GlobalGameData from "../Global/Ludo_GlobalGameData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Dominoe_GameMode extends cc.Component {
    public static piceNum = 4;
    public static roomModeData = {};

    // private parentNode: cc.Node;

    private btnSubtrat: cc.Button;
    private btnAdd: cc.Button;
    private coinLabel: cc.Label;
    private bg_tab_2_1: cc.Node;
    private bg_tab_4_1: cc.Node;
    private mode_quick_1: cc.Node;
    private mode_classical_1: cc.Node;
    // private betsType_gameCoin: cc.Node;
    // private betsType_coin: cc.Node;
    private coin: cc.Node;
    private gamecoin: cc.Node;

    /** 每局多少赌注 只有在Round模式才显示 */
    private perBetLabel: cc.Label = null;

    private bets: number[] = [100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000];
    private betLists: {
        coin: number[],
        game: number[]
    } = {
            coin: [],
            game: []
        }
    private bet_type: string = ''
    private bet_limit: string = ''
    private player_count: string = ''
    private model: string = ''
    private bet_limit_index: number = 0;



    private ModeLabel: cc.Label = null;
    private QuickLabel: cc.Label = null;
    private ClassicalLabel: cc.Label = null;
    private QuickLabel2: cc.Label = null;
    private ClassicalLabel2: cc.Label = null;
    private ChooseBetLabel: cc.Label = null;
    private ConfirmLabel: cc.Label = null;


    private ruletip: cc.Node;
    private ModeRule: cc.Node;
    private ModeRule_game_mode: cc.Label;
    private ModeRule_quick: cc.Label;
    private ModeRule_classical: cc.Label;
    private ModeRule_quick_mode_rule: cc.Label;
    private ModeRule_classical_mode_rule: cc.Label;


    // 一局模式：200 / 400 / 800 / 1200 / 1600 / 2000
    // 100分模式：200 / 400 / 800 / 1200 / 1600 / 2000
    /** 一局游戏币变化范围 */
    private oneRoundBets: number[] = [200,400,800,1200];
    /** 分数模式游戏币变化范围 */
    private scoreBets: number[] = [200,400,800,1200];

    //model= quick(快速),classical(经典)
    //prop=true(有道具)  
    onEnable() {
        console.log('enable');
        
        if (MessageData.gameType == GameType.single) {
            // 大厅最多1000游戏币赌金
            this.bets = [100, 200, 500, 1000];
            this.bet_limit = MessageManager.getUrlParameterValue('bet_limit');
            this.player_count = MessageManager.getUrlParameterValue('player_count');
            this.model = MessageManager.getUrlParameterValue('model');
    
            // console.log(`bet_limit is ${this.bet_limit} and playerCount is ${this.player_count} and model is ${this.model}`);
            if(this.model === 'score') {
                this.bets = this.scoreBets;
            } else {
                this.bets = this.oneRoundBets;
            }
        }


        this.init();
    }

    onDisable() {
        console.log('不可用');
    }

    onLoad() {
        if (!MessageData.extra || MessageData.extra == '') {
            let nowTime = new Date().getTime();
            let time = NDB.startTime;
            let t = ((nowTime - time) / 1000).toFixed(1);
            let gameType = MessageManager.getUrlParameterValue('is_lobby') == "true" ? "Lobby" : "Room"
            let obj = {
                eventName: "game_load_complete",
                name: `${GameConfig.gameName}${gameType}`,
                time: t
            }
            if (gameType == "Lobby")
                NDB.sendAutoJoinEvent(obj);
        }

        let vcode = MessageManager.getUrlParameterValue('vcode');
        const bgDominoe = cc.find("Canvas/bg_dominoe");

        if ((cc.sys.os === cc.sys.OS_ANDROID && Number(vcode) < 17300) || (cc.sys.os === cc.sys.OS_IOS && Number(vcode) <= 16200) && GameConfig.gameName == 'dominoe') {
            bgDominoe.active = true;
        }
    }
    init() {
        console.log('初始化接节点');
        this.initNode();
        this.initLanguage();
        this.initValue();
    }
    initNode() {
        this.btnAdd = this.node.getChildByName("btnAdd").getComponent(cc.Button);
        this.btnSubtrat = this.node.getChildByName("btnSubtrat").getComponent(cc.Button);

        const coinLabelNode = cc.find("Canvas/LobbySetMode/coinCon/coinLayout/coinLabel");
        this.coinLabel = coinLabelNode.getComponent(cc.Label);

        this.bg_tab_2_1 = this.node.getChildByName("bg_tab_2_1");
        this.bg_tab_4_1 = this.node.getChildByName("bg_tab_4_1");
        this.mode_quick_1 = this.node.getChildByName("mode_quick_1");
        this.mode_classical_1 = this.node.getChildByName("mode_classical_1");

        this.perBetLabel = this.node.getChildByName("rule_label").getComponent(cc.Label);
        // this.isProp = this.node.getChildByName("isProp");
        // this.betsType_gameCoin = this.node.getChildByName("betsType_gameCoin");
        // this.betsType_coin = this.node.getChildByName("betsType_coin");
        // this.coin = this.node.getChildByName("coin");
        this.gamecoin = cc.find('Canvas/LobbySetMode/coinCon/coinLayout/gamecoin');

        this.ModeLabel = this.node.getChildByName('selectModeLabel').getComponent(cc.Label);
        this.QuickLabel = this.node.getChildByName('mode_quick_0').getChildByName('Label').getComponent(cc.Label);
        this.QuickLabel2 = this.node.getChildByName('mode_quick_1').getChildByName('Label').getComponent(cc.Label);
        this.ClassicalLabel = this.node.getChildByName('mode_classical_0').getChildByName('Label').getComponent(cc.Label);
        this.ClassicalLabel2 = this.node.getChildByName('mode_classical_1').getChildByName('Label').getComponent(cc.Label);
        // this.MagicLabel = this.node.getChildByName('magicLabel').getComponent(cc.Label);
        this.ChooseBetLabel = this.node.getChildByName('chooseBetLabel').getComponent(cc.Label);
        this.ConfirmLabel = this.node.getChildByName('btnLabel').getComponent(cc.Label);


        this.ruletip = this.node.getChildByName('ruletip');
        // this.MagicRule = this.ruletip.getChildByName('MagicRule');
        this.ModeRule = this.ruletip.getChildByName('ModeRule');
        this.ModeRule_game_mode = this.ModeRule.getChildByName('game_mode').getComponent(cc.Label);
        this.ModeRule_quick = this.ModeRule.getChildByName('quick').getComponent(cc.Label);
        this.ModeRule_classical = this.ModeRule.getChildByName('classical').getComponent(cc.Label);
        this.ModeRule_quick_mode_rule = this.ModeRule.getChildByName('quick_mode_rule').getComponent(cc.Label);
        this.ModeRule_classical_mode_rule = this.ModeRule.getChildByName('classical_mode_rule').getComponent(cc.Label);

    }

    initLanguage() {
        console.log('in gamemode lang is ',MessageData.langDominoe);
        MessageData.langDominoe.select_mode ? (this.ModeLabel.string = MessageData.langDominoe.select_mode) : (this.ModeLabel.string = MessageData.langDominoeEnglish.select_mode);

        MessageData.langDominoe.one_round ? (this.QuickLabel.string = MessageData.langDominoe.one_round) : (this.QuickLabel.string = MessageData.langDominoeEnglish.one_round);
        MessageData.langDominoe.score_100 ? (this.ClassicalLabel.string = MessageData.langDominoe.score_100) : (this.ClassicalLabel.string = MessageData.langDominoeEnglish.score_100);
        MessageData.langDominoe.one_round ? (this.QuickLabel2.string = MessageData.langDominoe.one_round) : (this.QuickLabel2.string = MessageData.langDominoeEnglish.one_round);
        MessageData.langDominoe.score_100 ? (this.ClassicalLabel2.string = MessageData.langDominoe.score_100) : (this.ClassicalLabel2.string = MessageData.langDominoeEnglish.score_100);
        // MessageData.langDominoe.magic && (this.MagicLabel.string = MessageData.langDominoe.magic)
        this.ChooseBetLabel.string = MessageData.langDominoe.choose_bets ? MessageData.langDominoe.choose_bets : MessageData.langDominoeEnglish.choose_bets;
        // if (MessageData.gameType == GameType.single)
        // else
        //     this.ChooseBetLabel.string = MessageData.langDominoe.bets ? MessageData.langDominoe.bets : "BETS";
        
        if (MessageData.gameType == GameType.single)
            this.ConfirmLabel.string = MessageData.langDominoe.start ? MessageData.langDominoe.start : MessageData.langDominoeEnglish.start;
        else
            this.ConfirmLabel.string = MessageData.langDominoe.confirm ? MessageData.langDominoe.confirm : MessageData.langDominoeEnglish.confirm;

        MessageData.langDominoe.game_mode ? (this.ModeRule_game_mode.string = MessageData.langDominoe.game_mode) : this.ModeRule_game_mode.string = MessageData.langDominoeEnglish.game_mode;
        MessageData.langDominoe.one_round ? (this.ModeRule_quick.string = MessageData.langDominoe.one_round) : this.ModeRule_quick.string = MessageData.langDominoeEnglish.one_round;
        MessageData.langDominoe.score ? (this.ModeRule_classical.string = MessageData.langDominoe.score) : this.ModeRule_classical.string = MessageData.langDominoeEnglish.score;
        MessageData.langDominoe.one_round_explain ? (this.ModeRule_quick_mode_rule.string = MessageData.langDominoe.one_round_explain) : this.ModeRule_quick_mode_rule.string = MessageData.langDominoeEnglish.one_round_explain;
        MessageData.langDominoe.score_100_explain ? (this.ModeRule_classical_mode_rule.string = MessageData.langDominoe.score_100_explain) : this.ModeRule_classical_mode_rule.string = MessageData.langDominoeEnglish.score_100_explain;
        
    }
    /**初始化数据 */
    initValue() {
        if (MessageData.gameType == GameType.single) {
            console.log('extra is ',MessageData.extra);
            if (!MessageData.extra || MessageData.extra == '') {
                this.bet_limit = MessageManager.getUrlParameterValue('bet_limit');
                this.bet_type = MessageManager.getUrlParameterValue('bet_type');
                this.player_count = MessageManager.getUrlParameterValue('player_count');
                this.model = MessageManager.getUrlParameterValue('model');
                // this.prop = MessageManager.getUrlParameterValue('is_prop');
                console.log(`bet_limit is ${this.bet_limit} and betType is ${this.bet_type} and playerCount is ${this.player_count} and model is ${this.model}`);
            } else {
                let str: string = MessageData.extra.extra;
                let arr = str.split('&');
                for (let i = 0; i < arr.length; i++) {
                    const valueArr = arr[i].split('=');
                    switch (valueArr[0]) {
                        case 'bet_type':
                            this.bet_type = valueArr[1];
                            break;
                        case 'bet_limit':
                            this.bet_limit = valueArr[1];
                            break;
                        case 'player_count':
                            this.player_count = valueArr[1];
                            break;
                        case 'model':
                            this.model = valueArr[1];
                            break;
                        case 'is_prop':
                            break;
                    }
                }
            }
            this.initBetType();
            this.initBet();
            this.initPlayerNumber();
            this.initGameMode();
            // this.initProp();
        } else {
            console.log('roomModeData is ',Dominoe_GameMode.roomModeData);
            this.setRoomMode(Dominoe_GameMode.roomModeData);
        }
    }

    public initGameMode() {
        if(this.model === 'one') {
            this.setOneModel();
        } else {
            this.setScoreModel();
        }
    }

    public setRoomMode(data) {
        this.bet_limit = data.bets;
        this.bet_type = data.coin_type;
        
        if (MessageData.gameType == GameType.room) {
            // this.betLists.coin = data.coin_list || this.betLists.coin;
            // this.betLists.game = data.diamond_list || this.betLists.game;
            this.oneRoundBets = data.diamond_one || this.oneRoundBets;
            this.scoreBets = data.diamond_score || this.scoreBets;
        }
        this.player_count = '4';
        this.model = data.model;
        this.initGameMode();

        this.initBetType();
        this.initBet();
        this.initPlayerNumber();
        // this.initProp();
    }

    /**初始化赌注数据 */
    initBet() {
        this.bet_limit = this.bet_limit ? this.bet_limit : "200";
        if (MessageData.gameType == GameType.room) {
            // this.bet_limit = Dominoe_GlobalGameData.roomBets + "";
        }
        MessageData.bet_limit = Number(this.bet_limit);
        if(this.model === 'score') {
            this.bets = this.scoreBets;
        } else {
            this.bets = this.oneRoundBets;
        }
        this.bet_limit_index = this.bets.indexOf(Number(this.bet_limit));

        this.setBetLabel();
        if (this.bet_limit_index >= this.bets.length - 1) {
            this.btnAdd.interactable = false;
        } else {
            this.btnAdd.interactable = true;
        }
        
        if (this.bet_limit_index <= 0) {
            this.btnSubtrat.interactable = false;
            return;
        } else {
            this.btnSubtrat.interactable = true;
        }
    }
    /**初始化赌金类型 */
    initBetType() {
        this.bet_type = "diamond";
        if (this.bet_type == 'diamond')
            MessageData.game_coinType = GameCoinType.game_coin;
    }
    /**初始化玩家数量 */
    initPlayerNumber() {
        this.player_count = this.player_count ? this.player_count : "2";
        this.player_count == '2' ? this.setTwoPlayer() : this.setForePlayer();
        if (MessageData.gameType == GameType.room) {
            this.player_count = "4"
            this.bg_tab_2_1.active = false;
            this.bg_tab_4_1.active = false;
        }
        /** 匹配界面的时候显示几个位置 */
        MessageData.player_number = this.player_count;
    }
    
    /**设置两人局 */
    setTwoPlayer() {
        this.player_count = '2';
        this.bg_tab_2_1.active = true;
        this.bg_tab_4_1.active = false;
        MessageData.player_number = '2';
    }

    /**设置四人局 */
    setForePlayer() {
        this.player_count = '4';
        this.bg_tab_2_1.active = false;
        this.bg_tab_4_1.active = true;
        MessageData.player_number = '4';
    }

    /**赌金加 */
    addBetLimit() {
        this.btnSubtrat.interactable = true;
        this.bet_limit_index++;
        this.bet_limit = this.bets[this.bet_limit_index] + "";
        this.setBetLabel();
        if (this.bet_limit_index >= this.bets.length - 1) {
            this.btnAdd.interactable = false;
        }
    }

    /**赌金减 */
    subtratBetLimit() {
        this.btnAdd.interactable = true;
        this.bet_limit_index--;
        this.bet_limit = this.bets[this.bet_limit_index] + "";
        this.setBetLabel();
        if (this.bet_limit_index <= 0) {
            this.btnSubtrat.interactable = false;
        }
    }

    /**设置赌金数额显示 */
    setBetLabel() {
        if(Dominoe_GlobalGameData.gameMode === GameModeDominoe.ROUND) {
            this.coinLabel.string = +this.bet_limit / 40 + ' / ' + (MessageData.langDominoe.point ? MessageData.langDominoe.point : MessageData.langDominoeEnglish.point);
            const totStr = this.langLimitsRound();
            // 设置底下的赌金
            this.perBetLabel.string = `${this.bet_limit} ${totStr}`;
        } else {
            this.coinLabel.string = this.bet_limit;
        }
        // this.coinLabel.string = this.bet_limit + (Dominoe_GlobalGameData.gameMode === GameModeDominoe.ROUND ? ' / points' : '');
        Dominoe_GlobalGameData.roomBets = Number(this.bet_limit);
    }

    private langLimitsRound(): string {
        let resStr = 'Limits/Round';
        resStr = (MessageData.langDominoe.limit ? MessageData.langDominoe.limit : MessageData.langDominoeEnglish.limit) + '/' + 
            (MessageData.langDominoe.round ? MessageData.langDominoe.round : MessageData.langDominoeEnglish.round);
        return resStr;
    }
    /**设置一局游戏模式 */
    setOneModel() {
        this.model = 'one'
        this.mode_quick_1.active = true;
        this.mode_classical_1.active = false;

        Dominoe_GlobalGameData.gameMode = GameModeDominoe.ROUND;
        this.bets = this.oneRoundBets;

        const totStr = this.langLimitsRound();
        this.perBetLabel.string = `${this.bet_limit} ${totStr}`;
        this.setBetLabel();
    }

    /**设置分数游戏模式 */
    setScoreModel() {
        this.model = 'score'
        this.mode_quick_1.active = false;
        this.mode_classical_1.active = true;
        Dominoe_GlobalGameData.gameMode = GameModeDominoe.SCORE100;

        this.bets = this.scoreBets;
        this.perBetLabel.string = '';
        this.setBetLabel();
    }

    // 发送
    setExtra() {
        MessageData.bet_limit = Number(this.bet_limit);
        MessageData.extra = { extra: `bet_type=${this.bet_type}&bet_limit=${this.bet_limit}&player_count=${this.player_count}&model=${this.model}` };

        // this.model === "one" ? Dominoe_GlobalGameData.gameMode === GameModeDominoe.ROUND : Dominoe_GlobalGameData.gameMode === GameModeDominoe.SCORE100;
        if (MessageData.gameType == GameType.room) {
            // TODO 对接接口
            const sendData = {
                coin_type: this.bet_type,
                bets: Number(this.bet_limit),
                model: this.model,
            }
            console.log('sendData is ',sendData);
            Dominoe_BetsConfig.getRoomConfig(MessageData.gameRoomId,(data) => {
                console.log('设置模式结果data is ',data);
            },sendData);
            this.exitBtn();
        } else {
            cc.director.loadScene("MatchScene");
        }
    }
    exitBtn() {
        this.node.active = false;
    }

    showModeRule() {
        this.ruletip.active = true;
        this.ModeRule.active = true;
    }
    closeRule() {
        this.ruletip.active = false;
        this.ModeRule.active = false;
    }

}

