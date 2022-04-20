
import { GameConfig } from "../../../gameConfig";
import MessageData, { GameCoinType, GameType } from "../../../Script/CommonScripts/Utils/MessageData";
import MessageManager from "../../../Script/CommonScripts/Utils/MessageManager";
import NDB from "../../../Script/CommonScripts/Utils/NDBTS";

import Ludo_BetsConfig from "../game/Ludo_BetsConfig";
import Ludo_GlobalGameData from "../Global/Ludo_GlobalGameData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Ludo_GameMode extends cc.Component {
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
    private isProp: cc.Node;
    private betsType_gameCoin: cc.Node;
    private betsType_coin: cc.Node;
    private coin: cc.Node;
    private gamecoin: cc.Node;


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
    private prop: string = ''
    private bet_limit_index: number = 0;



    private ModeLabel: cc.Label = null;
    private QuickLabel: cc.Label = null;
    private ClassicalLabel: cc.Label = null;
    private QuickLabel2: cc.Label = null;
    private ClassicalLabel2: cc.Label = null;
    private MagicLabel: cc.Label = null;
    private ChooseBetLabel: cc.Label = null;
    private ConfirmLabel: cc.Label = null;


    private ruletip: cc.Node;
    private MagicRule: cc.Node;
    private ModeRule: cc.Node;
    private ModeRule_game_mode: cc.Label;
    private ModeRule_quick: cc.Label;
    private ModeRule_classical: cc.Label;
    private ModeRule_quick_mode_rule: cc.Label;
    private ModeRule_classical_mode_rule: cc.Label;

    private MagicRule_magic_mode: cc.Label;
    private MagicRule_ufo_title_label: cc.Label;
    private MagicRule_dice_title_label: cc.Label;
    private MagicRule_invisi_title_label: cc.Label;
    private MagicRule_miss_title_label: cc.Label;

    private MagicRule_magic_mode_rule: cc.Label;
    private MagicRule_ufo_label: cc.Label;
    private MagicRule_dice_label: cc.Label;
    private MagicRule_invisi_label: cc.Label;
    private MagicRule_miss_label: cc.Label;

    //model= quick(快速),classical(经典)
    //prop=true(有道具)  
    onEnable() {
        console.log('添加香港语言');
        if (MessageData.gameType == GameType.single) {
            this.bets = [100, 200, 500, 1000];

        }
        this.init();
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
    }
    init() {
        this.initNode();
        this.initLanguage();
        this.initValue();

    }
    initNode() {
        this.btnAdd = this.node.getChildByName("btnAdd").getComponent(cc.Button);
        this.btnSubtrat = this.node.getChildByName("btnSubtrat").getComponent(cc.Button);
        this.coinLabel = this.node.getChildByName("coinLabel").getComponent(cc.Label);
        this.bg_tab_2_1 = this.node.getChildByName("bg_tab_2_1");
        this.bg_tab_4_1 = this.node.getChildByName("bg_tab_4_1");
        this.mode_quick_1 = this.node.getChildByName("mode_quick_1");
        this.mode_classical_1 = this.node.getChildByName("mode_classical_1");
        this.isProp = this.node.getChildByName("isProp");
        this.betsType_gameCoin = this.node.getChildByName("betsType_gameCoin");
        this.betsType_coin = this.node.getChildByName("betsType_coin");
        this.coin = this.node.getChildByName("coin");
        this.gamecoin = this.node.getChildByName("gamecoin");

        this.ModeLabel = this.node.getChildByName('selectModeLabel').getComponent(cc.Label);
        this.QuickLabel = this.node.getChildByName('mode_quick_0').getChildByName('Label').getComponent(cc.Label);
        this.QuickLabel2 = this.node.getChildByName('mode_quick_1').getChildByName('Label').getComponent(cc.Label);
        this.ClassicalLabel = this.node.getChildByName('mode_classical_0').getChildByName('Label').getComponent(cc.Label);
        this.ClassicalLabel2 = this.node.getChildByName('mode_classical_1').getChildByName('Label').getComponent(cc.Label);
        this.MagicLabel = this.node.getChildByName('magicLabel').getComponent(cc.Label);
        this.ChooseBetLabel = this.node.getChildByName('chooseBetLabel').getComponent(cc.Label);
        this.ConfirmLabel = this.node.getChildByName('btnLabel').getComponent(cc.Label);


        this.ruletip = this.node.getChildByName('ruletip');
        this.MagicRule = this.ruletip.getChildByName('MagicRule');
        this.ModeRule = this.ruletip.getChildByName('ModeRule');
        this.ModeRule_game_mode = this.ModeRule.getChildByName('game_mode').getComponent(cc.Label);
        this.ModeRule_quick = this.ModeRule.getChildByName('quick').getComponent(cc.Label);
        this.ModeRule_classical = this.ModeRule.getChildByName('classical').getComponent(cc.Label);
        this.ModeRule_quick_mode_rule = this.ModeRule.getChildByName('quick_mode_rule').getComponent(cc.Label);
        this.ModeRule_classical_mode_rule = this.ModeRule.getChildByName('classical_mode_rule').getComponent(cc.Label);

        let content = this.MagicRule.getChildByName('ScrollView').getChildByName('view').getChildByName('content');
        this.MagicRule_magic_mode = content.getChildByName('magic_mode').getComponent(cc.Label);
        this.MagicRule_ufo_title_label = content.getChildByName('ufo_title_label').getComponent(cc.Label);
        this.MagicRule_dice_title_label = content.getChildByName('dice_title_label').getComponent(cc.Label);
        this.MagicRule_invisi_title_label = content.getChildByName('invisi_title_label').getComponent(cc.Label);
        this.MagicRule_miss_title_label = content.getChildByName('miss_title_label').getComponent(cc.Label);
        this.MagicRule_magic_mode_rule = content.getChildByName('magic_mode_rule').getComponent(cc.Label);
        this.MagicRule_ufo_label = content.getChildByName('ufo_label').getComponent(cc.Label);
        this.MagicRule_dice_label = content.getChildByName('dice_label').getComponent(cc.Label);
        this.MagicRule_invisi_label = content.getChildByName('invisi_label').getComponent(cc.Label);
        this.MagicRule_miss_label = content.getChildByName('miss_label').getComponent(cc.Label);

    }

    initLanguage() {
        MessageData.lang.game_mode && (this.ModeLabel.string = MessageData.lang.game_mode)
        MessageData.lang.quick && (this.QuickLabel.string = MessageData.lang.quick)
        MessageData.lang.classical && (this.ClassicalLabel.string = MessageData.lang.classical)
        MessageData.lang.quick && (this.QuickLabel2.string = MessageData.lang.quick)
        MessageData.lang.classical && (this.ClassicalLabel2.string = MessageData.lang.classical)
        MessageData.lang.magic && (this.MagicLabel.string = MessageData.lang.magic)
        if (MessageData.gameType == GameType.single)
            this.ChooseBetLabel.string = MessageData.lang.choose_bets ? MessageData.lang.choose_bets : 'Choose Bets';
        else
            this.ChooseBetLabel.string = MessageData.lang.bets ? MessageData.lang.bets : "BETS";
        if (MessageData.gameType == GameType.single)
            this.ConfirmLabel.string = MessageData.lang.start ? MessageData.lang.start : "START";
        else
            this.ConfirmLabel.string = MessageData.lang.confirm ? MessageData.lang.confirm : "Confirm";

        MessageData.lang.game_mode && (this.ModeRule_game_mode.string = MessageData.lang.game_mode)
        MessageData.lang.quick && (this.ModeRule_quick.string = MessageData.lang.quick)
        MessageData.lang.classical && (this.ModeRule_classical.string = MessageData.lang.classical)
        MessageData.lang.quick_mode_rule && (this.ModeRule_quick_mode_rule.string = MessageData.lang.quick_mode_rule)
        MessageData.lang.classical_mode_rule && (this.ModeRule_classical_mode_rule.string = MessageData.lang.classical_mode_rule)
        MessageData.lang.magic && (this.MagicRule_magic_mode.string = MessageData.lang.magic)
        MessageData.lang.ufo_title_label && (this.MagicRule_ufo_title_label.string = MessageData.lang.ufo_title_label)
        MessageData.lang.dice_title_label && (this.MagicRule_dice_title_label.string = MessageData.lang.dice_title_label)
        MessageData.lang.invisi_title_label && (this.MagicRule_invisi_title_label.string = MessageData.lang.invisi_title_label)
        MessageData.lang.miss_title_label && (this.MagicRule_miss_title_label.string = MessageData.lang.miss_title_label)
        MessageData.lang.magic_mode_rule && (this.MagicRule_magic_mode_rule.string = MessageData.lang.magic_mode_rule)
        MessageData.lang.ufo_label && (this.MagicRule_ufo_label.string = MessageData.lang.ufo_label)
        MessageData.lang.dice_label && (this.MagicRule_dice_label.string = MessageData.lang.dice_label)
        MessageData.lang.invisi_label && (this.MagicRule_invisi_label.string = MessageData.lang.invisi_label)
        MessageData.lang.miss_label && (this.MagicRule_miss_label.string = MessageData.lang.miss_label)
    }
    /**初始化数据 */
    initValue() {
        if (MessageData.gameType == GameType.single) {
            console.log(MessageData.extra);
            if (!MessageData.extra || MessageData.extra == '') {
                this.bet_limit = MessageManager.getUrlParameterValue('bet_limit');
                this.bet_type = MessageManager.getUrlParameterValue('bet_type');
                this.player_count = MessageManager.getUrlParameterValue('player_count');
                this.model = MessageManager.getUrlParameterValue('model');
                this.prop = MessageManager.getUrlParameterValue('is_prop');
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
                            this.prop = valueArr[1];
                            break;
                    }
                }
            }
            this.initBetType();
            this.initBet();
            this.initPlayerNumber();
            this.initPieceNumber();
            this.initProp();
        } else {
            console.log(Ludo_GameMode.roomModeData);
            this.setRoomMode(Ludo_GameMode.roomModeData);
        }

    }
    public setRoomMode(data) {
        this.bet_limit = data.bets;
        this.bet_type = data.coin_type;
        if (MessageData.gameType == GameType.room) {
            this.betLists.coin = data.coin_list || this.betLists.coin;
            this.betLists.game = data.diamond_list || this.betLists.game;
            this.setBetsList();
        }
        this.player_count = '4';
        this.model = data.model;
        this.prop = data.is_prop + "";
        console.log(data,
            this.bet_limit,
            this.bet_limit_index,
            this.bet_type,
            this.player_count,
            this.model,
            this.prop
        );

        this.initBetType();
        this.initBet();
        this.initPlayerNumber();
        this.initPieceNumber();
        this.initProp();
    }
    private setBetsList() {
        if (this.bet_type == "coin") {
            this.bets = this.betLists.coin;
        } else if (this.bet_type == "diamond") {
            this.bets = this.betLists.game;
        }
        this.btnAdd.interactable = true;
        this.bet_limit_index = this.bets.indexOf(Number(this.bet_limit));
        if (this.bet_limit_index == -1 || this.bet_limit_index >= this.bets.length - 1) {
            this.btnAdd.interactable = false;
            this.bet_limit_index = this.bets.length - 1;
        }
        this.bet_limit = this.bets[this.bet_limit_index] + "";
        console.log(this.bet_limit_index);
        if (this.bet_limit_index >= this.bets.length - 1) {
            this.btnAdd.interactable = false;
        } else {
            this.btnAdd.interactable = true;
        }
        
        if (this.bet_limit_index <= 0) {
            this.btnSubtrat.interactable = false;
        } else {
            this.btnSubtrat.interactable = true;
        }
        this.setBetLabel();

    }

    /**初始化赌注数据 */
    initBet() {
        this.bet_limit = this.bet_limit ? this.bet_limit : "200";
        if (MessageData.gameType == GameType.room) {
            this.bet_limit = Ludo_GlobalGameData.roomBets + "";
        }
        MessageData.bet_limit = Number(this.bet_limit);
        this.bet_limit_index = this.bets.indexOf(Number(this.bet_limit));
        console.log('bet_index is ',this.bet_limit_index);

        this.setBetLabel();
        if (this.bet_limit_index >= this.bets.length - 1) {
            this.btnAdd.interactable = false;
        }
        if (this.bet_limit_index <= 0) {
            this.btnSubtrat.interactable = false;
            return;
        }
    }
    /**初始化赌金类型 */
    initBetType() {
        this.bet_type = this.bet_type ? this.bet_type : "diamond";
        this.bet_type == 'coin' ? this.setCoinType() : this.setGameCoinType();
        if (this.bet_type == 'diamond')
            MessageData.game_coinType = GameCoinType.game_coin;
        else
            MessageData.game_coinType = GameCoinType.coin;
    }
    /**初始化玩家数量 */
    initPlayerNumber() {
        this.player_count = this.player_count ? this.player_count : "2";
        this.player_count == '2' ? this.setTwoPlayer() : this.setForePlayer();
        if (MessageData.gameType == GameType.room) {
            this.player_count = "4"
        }
        MessageData.player_number = this.player_count;

    }
    /**初始化棋子数量 */
    initPieceNumber() {
        this.model = this.model ? this.model : "quick";
        this.model == 'quick' ? this.setQuickModel() : this.setClassicalModel();
        Ludo_GameMode.piceNum = this.model == 'quick' ? 2 : 4;

    }
    /**初始化是否启用道具模式 */
    initProp() {
        this.prop = this.prop ? this.prop : "true";
        this.isProp.active = this.prop == 'true' ? true : false;
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
        this.coinLabel.string = this.bet_limit;
        Ludo_GlobalGameData.roomBets = Number(this.bet_limit);
    }
    /**设置快速游戏模式 */
    setQuickModel() {
        this.model = 'quick'
        this.mode_quick_1.active = true;
        this.mode_classical_1.active = false;
        Ludo_GameMode.piceNum = 2;

    }

    /**设置经典游戏模式 */
    setClassicalModel() {
        this.model = 'classical'
        this.mode_quick_1.active = false;
        this.mode_classical_1.active = true;
        Ludo_GameMode.piceNum = 4;

    }
    /**设置是否需要道具 */
    setProp() {
        if (this.prop == "true") {
            this.prop = "false";
            this.isProp.active = false;
        } else {
            this.prop = "true"
            this.isProp.active = true;
        }
    }
    /**设置金币游戏类型 */
    setCoinType() {
        this.bet_type = "coin"
        if (MessageData.gameType == GameType.room) {
            this.betsType_gameCoin.active = false;
            this.betsType_coin.active = true;
            this.setBetsList();
        }
        this.coin.active = true;
        this.gamecoin.active = false;
        Ludo_GlobalGameData.isCoinType = true;
        MessageData.game_coinType = GameCoinType.coin;
    }
    /**设置游戏币游戏类型 */
    setGameCoinType() {
        this.bet_type = "diamond";
        if (MessageData.gameType == GameType.room) {
            this.betsType_gameCoin.active = true;
            this.betsType_coin.active = false;
            this.setBetsList();
        }
        Ludo_GlobalGameData.isCoinType = false;
        this.coin.active = false;
        this.gamecoin.active = true;
        MessageData.game_coinType = GameCoinType.game_coin;
    }

    setExtra() {
        MessageData.bet_limit = Number(this.bet_limit);
        MessageData.extra = { extra: `bet_type=${this.bet_type}&bet_limit=${this.bet_limit}&player_count=${this.player_count}&model=${this.model}&is_prop=${this.prop}` };
        if (MessageData.gameType == GameType.room) {
            Ludo_BetsConfig.getRoomConfig(MessageData.gameRoomId, (data) => { }, {
                coin_type: this.bet_type,
                bets: Number(this.bet_limit),
                model: this.model,
                is_prop: this.prop == 'true' ? true : false,
            })
            this.exitBtn();
        } else {
            cc.director.loadScene("MatchScene");
        }
    }
    exitBtn() {
        this.node.active = false;
    }


    showMagicRule() {
        this.ruletip.active = true;
        this.ModeRule.active = false;
        this.MagicRule.active = true;
    }
    showModeRule() {
        this.ruletip.active = true;
        this.ModeRule.active = true;
        this.MagicRule.active = false;
    }
    closeRule() {
        this.ruletip.active = false;
        this.ModeRule.active = false;
        this.MagicRule.active = false;
    }



}

