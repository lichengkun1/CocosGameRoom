import Message from "../../../CommonScripts/Utils/Message";
import MessageData, { GameCoinType } from "../../../CommonScripts/Utils/MessageData";
import MessageManager from "../../../CommonScripts/Utils/MessageManager";
import MyEvent from "../../../CommonScripts/Utils/MyEvent";
import ResourcesManager from "../../../CommonScripts/Utils/ResourcesManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TopUINode extends cc.Component {
    static I: TopUINode;
    @property(cc.SpriteFrame)
    coin: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    gamecoin: cc.SpriteFrame = null;

    //用户头像UI
    private userIcon: cc.Node = null;
    private coinShow: cc.Sprite = null;
    private userNameLabel: cc.Label = null;
    private first: cc.Node = null;
    private firstNameLabel: cc.Label = null;
    private rank: cc.Node = null;
    private rankLabel: cc.Label = null;
    private gameCoinLabel: cc.Label = null;

    onLoad() {
        TopUINode.I = this.node.getComponent(TopUINode);
        this.userIcon = this.node.getChildByName("userIcon");
        this.coinShow = this.node.getChildByName("coinShow").getChildByName("coinShow").getComponent(cc.Sprite);
        this.userNameLabel = this.node.getChildByName("userNameLabel").getComponent(cc.Label);
        this.first = this.node.getChildByName("first");
        this.firstNameLabel = this.node.getChildByName("firstNameLabel").getComponent(cc.Label);
        this.rank = this.node.getChildByName("rank");
        this.rankLabel = this.node.getChildByName("rankLabel").getComponent(cc.Label);
        this.gameCoinLabel = this.node.getChildByName("gameCoinLabel").getComponent(cc.Label);

        this.updateTopUI();
        this.userIcon.off(cc.Node.EventType.TOUCH_START);
        this.userIcon.on(cc.Node.EventType.TOUCH_START, () => {
            if (MessageData.userId) {
                MessageManager.showPlayerInfo(MessageData.userId);
            }
        }, this);

        MyEvent.I.on("onAndroidResume", this.updateTopUI.bind(this), this.node);
    }
    updateTopUI() {
        if (MessageData.game_coinType == GameCoinType.coin) {
            this.coinShow.spriteFrame = this.coin;
        } else {
            this.coinShow.spriteFrame = this.gamecoin;
        }
        if (MessageData.userInfo) {
            this.setTopUserData(MessageData.userInfo);
        } else {
            Message.getUserInfo((userInfo) => {
                MessageData.userInfo = userInfo;
                MessageData.userId = Number(userInfo.userId);
                this.setTopUserData(userInfo);
            });
        }
    }
    setTopUserData(userInfo) {
        let avatar = userInfo.avatar;
        let name = userInfo.userName;
        let uid = userInfo.userId;
        ResourcesManager.loadHeadImag(avatar, uid, 2, (res: cc.Texture2D) => {
            res.packable = false;
            this.userIcon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(res);
        });
        this.userNameLabel.string = MessageManager.subNickName(name, 8);

        Message.getCoinNum((coin, diamond, crystal) => {
            if (MessageData.game_coinType == GameCoinType.game_coin)
                this.gameCoinLabel.string = diamond + "";
            else
                this.gameCoinLabel.string = coin + "";
        });

        // Message.getRankData((data) => {
        //     if (data) {
        //         //第一名数据;
        //         if (data.leaderboard && data.leaderboard[0]) {
        //             let name = MessageManager.subNickName(data.leaderboard[0].name);
        //             this.firstNameLabel.string = name + "";
        //         }
        //         if (data.own) {
        //             let ranking = data.own.ranking;
        //             if (ranking == 0) {
        //                 ranking = 999;
        //             }
        //             this.rankLabel.string = ranking + "";
        //         }
        //     }
        // });
    }

    buyGameCion() {
        MessageManager.buyGameCion();
    }
}
