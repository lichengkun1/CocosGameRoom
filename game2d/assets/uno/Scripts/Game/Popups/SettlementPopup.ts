
import FrameImageController from "../../../../Script/FrameImageComponent/FrameImageController";
import FrameImageManager from "../../../../Script/FrameImageComponent/FrameImageManager";
import { GameData } from "../../Common/Game/GameData";
import { LanguageManager } from "../../Common/Language/LanguageManager";
import Pool from "../../Common/Pool/Pool";
import { Popup } from "../../Common/Popup/Popup";
import { PopupManager } from "../../Common/Popup/PopupManager";
import { GetServerData } from "../../Common/Server/GetServerData";
import GlobalGameData, { GamePlayerCount, RoomType } from "../../GlobalGameData";
import UNOMatching from "../../Match/uno_Matching";
import PlayerManager from "../../Players/PlayerManager";
import GameSceneManager from "../GameScene/GameSceneManager";
import GameSceneUIManager from "../GameScene/GameSceneUIManager";
import Socket from "../Socket/Socket";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SettlementPopup extends Popup {

    @property(cc.Node)
    playAgainBtn: cc.Node = null;
    @property(cc.Node)
    exitBtn: cc.Node = null;

    win: cc.Node = null;
    lose: cc.Node = null;
    draw: cc.Node = null;
    tagbg1: cc.Node = null;
    tagbg2: cc.Node = null;
    tagbg3: cc.Node = null;
    tagbg4: cc.Node = null;
    tagbgs: cc.Node[] = [];
    tags = [{
        num: 0,
        userid: 0,
        Score: 0,
        MoneyNumber: 0,
    }, {
        num: 0,
        userid: 0,
        Score: 0,
        MoneyNumber: 0,
    }, {
        num: 0,
        userid: 0,
        Score: 0,
        MoneyNumber: 0,
    }, {
        num: 0,
        userid: 0,
        Score: 0,
        MoneyNumber: 0,
    }];
    playagain: cc.Label = null;
    exit: cc.Label = null;
    Init() {
        GameSceneManager.IsShowSettlement = true;
        this.playagain = this.node.getChildByName("playagain").getComponent(cc.Label);
        this.exit = this.node.getChildByName("exit").getComponent(cc.Label);
        
        const playAgainText = LanguageManager.GetType().play_again ? LanguageManager.GetType().play_again : LanguageManager.enLangJson.play_again;
        const exitText = LanguageManager.GetType().exit ? LanguageManager.GetType().exit : LanguageManager.enLangJson.exit;

        console.log('playAgainTExt is ',playAgainText,' and exit text is ',exitText);
        this.playagain.string = "" + playAgainText;
        this.exit.string = "" + exitText;

        this.win = this.node.getChildByName("win");
        this.lose = this.node.getChildByName("lose");
        this.draw = this.node.getChildByName("draw");

        this.resetTagsByPlayerCount();
        this.playExitShow();


        for (let i = 0; i < this.tagbgs.length; i++) {
            const element = this.tagbgs[i];
            this.tagbgs[i] = this.node.getChildByName("tagbg" + (i + 1));
        }
        this.SetData()

        this.adapterBtns();
        if(GlobalGameData.roomType == RoomType.ROOM) {
            // 6秒后跳转到匹配界面
            this.scheduleOnce(this.toMatchScene,6);
        }

        if(GlobalGameData.roomType === RoomType.SINGLE) {
            this.exit.node.active = false;
            this.exitBtn.active = false;
        }


    }

    private toMatchScene() {
        // VoiceManager.LeaveVoiceRoom();
        Socket.IsFirst = true;
        GameSceneManager.IsShowSettlement = false;
        PopupManager.CloseAllPopup();
        UNOMatching.PlayAgain = false;
        UNOMatching.JoinOK = true;
        cc.director.loadScene("MatchScene");
        Pool.CleanPool();
        GameData.gameid = null;
    }

    private playExitShow() {

        this.playAgainBtn.active = !GlobalGameData.isGod;
        this.playagain.node.active = !GlobalGameData.isGod;

        this.exit.node.active = !GlobalGameData.isGod;
        this.exitBtn.active = !GlobalGameData.isGod;

        this.win.active = false;
        this.lose.active = false;
        this.draw.active = false;
        
    }

    adapterBtns() {
        const designSize = cc.view.getDesignResolutionSize();
        const viewSize = cc.view.getVisibleSize();

        if(viewSize.height / viewSize.width < designSize.height / designSize.width) {
            this.playAgainBtn.setPosition(cc.v2(-141,-viewSize.height / 2 + this.playAgainBtn.height / 2 + 5));
            this.playagain.node.setPosition(cc.v2(-135,-viewSize.height / 2 + this.playAgainBtn.height / 2 + 12));
            this.exitBtn.setPosition(cc.v2(191,-viewSize.height / 2 + this.playAgainBtn.height / 2 + 5));
            this.exit.node.setPosition(cc.v2(191,-viewSize.height / 2 + this.playAgainBtn.height / 2 + 12));
        } else {
            this.playAgainBtn.setPosition(cc.v2(0,-295));
            this.playagain.node.setPosition(cc.v2(5,-292));
            this.exitBtn.setPosition(cc.v2(0,-400));
            this.exit.node.setPosition(cc.v2(0,-392));
        }
    }

    resetTagsByPlayerCount() {
        switch(GlobalGameData.playerCount) {
            case GamePlayerCount.TWO:
                this.tags.splice(2,2);
                this.tagbgs = new Array<cc.Node>(2);
                this.node.getChildByName("tagbg3").active = false;
                this.node.getChildByName("tagbg4").active = false;
                break;
            case GamePlayerCount.THREE:
                this.tagbgs = new Array<cc.Node>(3);
                this.tags.pop();
                this.node.getChildByName("tagbg4").active = false;
                break;
            case GamePlayerCount.FOUR:
                this.tagbgs = new Array<cc.Node>(4);
                break;
        }
    }

    SetData() {
        console.log("SettlementPopup:\n", GameData.completedMessage);
        GameSceneUIManager.I.TimeEnd();

        const players = GameData.completedMessage.data.players.filter(item => item.id);
        // const completeData = 
        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            if(!player.id) continue;
            let tagbg = this.tagbgs[player.rank - 1];
            if(!tagbg) continue;
            //设置高亮
            if (player.id == PlayerManager.thisPlayer_user_id) {
                tagbg.getChildByName("hightlight").active = true;
                if (player.coin > 0) {
                    GetServerData.GameEnd("UNO", "win");
                    this.win.active = true;
                    this.lose.active = false;
                } else {
                    GetServerData.GameEnd("UNO", "lose");
                    this.win.active = false;
                    this.lose.active = true;
                }
            } else {
                tagbg.getChildByName("hightlight").active = false;
            }
            tagbg.getChildByName('userName').getComponent(cc.Label).string = player.name;

            if (player.score <= -1000) {
                tagbg.getChildByName('Score').getComponent(cc.Label).string = "";
                tagbg.getChildByName('iconLeave').active = true;
            } else {
                tagbg.getChildByName('Score').getComponent(cc.Label).string = player.score + "";
            }
            tagbg.getChildByName('MoneyNumber').getComponent(cc.Label).string = player.coin + "";
            if (player.coin > 0) {
                tagbg.getChildByName('MoneyNumber').color = new cc.Color(255, 222, 59, 255);
            } else {
                tagbg.getChildByName('MoneyNumber').color = new cc.Color(5, 255, 24, 255);
            }
            tagbg.getChildByName('gameIcon').active = true;
            tagbg.getChildByName('Icon').active = false;
            tagbg.getChildByName("headImage").getComponent(cc.Sprite).spriteFrame = PlayerManager.GetPlayer(player.id).user_headImage;
            if (player.id != PlayerManager.thisPlayer_user_id) {
                tagbg.getChildByName("headImage").on(cc.Node.EventType.TOUCH_START, () => {
                    FrameImageManager.ShowUserDataCard(this.node, player.id, PlayerManager.thisPlayer_user_id)
                });
            }

            this.tags[i].userid = player.id;
            this.tags[i].Score = player.score;
            this.tags[i].MoneyNumber = player.coin;
        }
        for (let i = 0; i < players.length - 1; i++) {
            for (let j = i + 1; j < players.length; j++) {
                if (this.tags[i].Score < this.tags[j].Score) {
                    let s = this.tags[j];
                    this.tags[j] = this.tags[i]
                    this.tags[i] = s;
                }
            }
        }
        let index = 1;
        this.tags[0].num = index;
        for (let i = 1; i < this.tags.length; i++) {
            index++;
            if (this.tags[i].Score == this.tags[i - 1].Score) {
                this.tags[i].num = this.tags[i - 1].num;
            } else {
                this.tags[i].num = index;
            }
        }
        let frameUids = [];
        for (let i = 0; i < this.tags.length; i++) {
            frameUids.push(this.tags[i].userid);
            if (this.tags[i].num == 1) {
                if (this.tags[i].MoneyNumber >= 0) {
                    this.tagbgs[i].getChildByName("hightlightbg").active = true;
                }
                this.tagbgs[i].getChildByName("number_1").active = true;
                this.tagbgs[i].getChildByName("number_2").active = false;
                this.tagbgs[i].getChildByName("image01").active = true;
            } else if (this.tags[i].num == 2) {
                if (this.tags[i].MoneyNumber >= 0) {
                    this.tagbgs[i].getChildByName("hightlightbg").active = true;
                }
                this.tagbgs[i].getChildByName("number_1").active = false;
                this.tagbgs[i].getChildByName("number_2").active = true;
                this.tagbgs[i].getChildByName("image01").active = false;
            }
        }
        this.node.getComponent(FrameImageController).SetAllUsersFrame(frameUids);
        console.log(this.tags);

        // this.tags[0].num = 1;
        // let index = 1;
        // for (let i = 1; i < this.tags.length; i++) {
        //     index++;
        //     if (this.tags[i].Score == this.tags[i - 1].Score) {
        //         this.tags[i].num = this.tags[i - 1].num;
        //     } else {
        //         this.tags[i].num = index;
        //     }
        // }


    }

    PlayAgainBtn() {
        // 清除6秒后跳转场景的倒计时逻辑
        this.unscheduleAllCallbacks();
        // VoiceManager.LeaveVoiceRoom();
        Socket.IsFirst = true;
        GameSceneManager.IsShowSettlement = false;
        PopupManager.CloseAllPopup();
        UNOMatching.PlayAgain = true;
        UNOMatching.JoinOK = false;
        cc.director.loadScene("MatchScene");
        Pool.CleanPool();
        GameData.gameid = null;
    }
    ExitBtn() {
        GameSceneManager.IsShowSettlement = false;
        // .exitRoomGame(() => {});
        this.close();

        if(GlobalGameData.roomType === RoomType.ROOM) {
            this.unscheduleAllCallbacks();
            // VoiceManager.LeaveVoiceRoom();
            Socket.IsFirst = true;
            GameSceneManager.IsShowSettlement = false;
            PopupManager.CloseAllPopup();
            UNOMatching.PlayAgain = false;
            UNOMatching.JoinOK = true;
            cc.director.loadScene("MatchScene");
            Pool.CleanPool();
            GameData.gameid = null;
        }

    }
}
