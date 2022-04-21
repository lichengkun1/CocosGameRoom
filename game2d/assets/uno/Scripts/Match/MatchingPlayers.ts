import { resourceManager } from "../../../Script/common/managers/resourceManager";
import BaseComp from "../../../Script/common/ui/baseComp";
import { usernameSlice } from "../../../Script/common/utils/util";
import GlobalGameData from "../GlobalGameData";
import UNOMatching from "./UNOMatching";

export interface MatchingPlayerInfo {
    user_id: number,
    user_name: string,
    user_avatar: string,
    poker_remain: number[],
    poker_remain_count: number,
    status: string,
    rank: number,
    score: number,
    coin: number,
    is_agent: boolean,
    country: string,
    lang: string
}

export const testPlayers = [

    {
        "user_id": 52988289,
        "user_name": "52988289_test",
        "user_avatar": 'https://static2.funshareapp.com/icon/icon_male_160.png',
        "poker_remain": [
            53,
            106,
            39,
            48,
            58,
            44,
            72
        ],
        "poker_remain_count": 7,
        "status": "online",
        "rank": 0,
        "score": 0,
        "coin": 0,
        "is_agent": false,
        "country": "TW",
        "lang": "zh_Hant"
    },
    {
        "user_id": 42430217,
        "user_name": "42430217_test",
        "user_avatar": "https://static.funshareapp.com/image/2021-07-06/image_60e4160de07ce2000145b9dd",
        "poker_remain": [],
        "poker_remain_count": 7,
        "status": "online",
        "rank": 0,
        "score": 0,
        "coin": 0,
        "is_agent": false,
        "country": "TW",
        "lang": "zh_Hant"
    },
    {
        "user_id": 23655430,
        "user_name": "23655430_test",
        "user_avatar": "https://static2.funshareapp.com/icon/icon_male_160.png",
        "poker_remain": [],
        "poker_remain_count": 7,
        "status": "online",
        "rank": 0,
        "score": 0,
        "coin": 0,
        "is_agent": false,
        "country": "TW",
        "lang": "zh_Hant"
    },
    {
        "user_id": 47448260,
        "user_name": "47448260_test",
        "user_avatar": "https://static2.funshareapp.com/icon/icon_male_160.png",
        "poker_remain": [],
        "poker_remain_count": 7,
        "status": "online",
        "rank": 0,
        "score": 0,
        "coin": 0,
        "is_agent": false,
        "country": "TW",
        "lang": "zh_Hant"
    }
]
const {ccclass, property} = cc._decorator;

@ccclass
export default class MatchingPlayers extends BaseComp {

    private tab_me: cc.Sprite = null;
    private OtherPlayer1match: dragonBones.ArmatureDisplay = null;
    private OtherPlayer0match: dragonBones.ArmatureDisplay = null;
    private OtherPlayer2match: dragonBones.ArmatureDisplay = null;
    private OtherPlayer3match: dragonBones.ArmatureDisplay = null;
    
    private OtherPlayer0HeadImage: cc.Sprite = null;
    private OtherPlayer1HeadImage: cc.Sprite = null;
    private OtherPlayer2HeadImage: cc.Sprite = null;
    private OtherPlayer3HeadImage: cc.Sprite = null;

    private name0: cc.Label = null;
    private name1: cc.Label = null;
    private name2: cc.Label = null;
    private name3: cc.Label = null;

    public ownerIsIn: boolean = false;

    __preload(): void {
        this.openFilter = true;
        super.__preload();
    }

    protected onLoad(): void {
        this.tab_me.node.active = false;

        for(let i = 0; i < 4; i++) {
            this[`name${i}`].string = "player" + (i + 1);
        }

    }

    setPlayers(playerMap: Partial<MatchingPlayerInfo>[]) {
        console.log('playermap is ',playerMap);
        console.log('当前用户的id:',GlobalGameData.userId);
        if(!playerMap) playerMap = testPlayers;

        this.resetAllPlayers();

        let matchArr = [this.OtherPlayer0match,this.OtherPlayer1match,this.OtherPlayer2match,this.OtherPlayer3match];
        let avatarArr = [this.OtherPlayer0HeadImage,this.OtherPlayer1HeadImage,this.OtherPlayer2HeadImage,this.OtherPlayer3HeadImage];
        let tabMePos = [cc.v2(-254,198),cc.v2(254,198),cc.v2(-254,-50),cc.v2(254,-50)];
        let nameLabels = [this.name0,this.name1,this.name2,this.name3];

        for(let i = 0; i < playerMap.length; i++) {
            let userData = playerMap[i] as Partial<MatchingPlayerInfo>;
            if(!userData.user_id) continue;

            console.log('初始化匹配用户的头像url: ',userData.user_avatar);
            avatarArr[i].node.active = true;
            resourceManager.loadRemoteAsset(userData.user_avatar).then((res: cc.Texture2D) => {
                let frame = new cc.SpriteFrame(res);
                avatarArr[i].spriteFrame = frame;
            });
            matchArr[i].node.active = false;

            nameLabels[i].string = usernameSlice(userData.user_name,8);
            if(userData.user_id == GlobalGameData.userId) {
                //
                console.log('找到了自己');
                this.ownerIsIn = true;
                // this.ThisPlayerHeadImage.spriteFrame = 
                this.tab_me.node.active = true;
                this.tab_me.node.setPosition(tabMePos[i]);
                
            }
            
        }
    }

    /**
     * 根据位置设置玩家信息 
     * @param  {{userId:number} userData
     * @param  {string} avatar
     * @param  {string}} username
     * @param  {number} index
     */
    setPlayerByIndex(userData: {userId: number,avatar: string,username: string},index: number) {
        let tabMePos = [cc.v2(-254,198),cc.v2(254,198),cc.v2(-254,-50),cc.v2(254,-50)];

        const matchSpine = this[`OtherPlayer${index}match`] as dragonBones.ArmatureDisplay;
        const nameItem = this[`name${index}`] as cc.Label;
        const avatarSprite = this[`OtherPlayer${index}HeadImage`] as cc.Sprite;
        nameItem.string = userData.username;
        matchSpine.node.active = false;

        if(userData.userId === GlobalGameData.userId) {
            this.tab_me.node.setPosition(tabMePos[index]);
            this.tab_me.node.active = true;
        }

        resourceManager.loadRemoteAsset(userData.avatar).then((res: cc.Texture2D) => {
            let frame = new cc.SpriteFrame(res);
            avatarSprite.spriteFrame = frame;
        });
    }

    resetAllPlayers() {
        [this.OtherPlayer0match,this.OtherPlayer1match,this.OtherPlayer2match,this.OtherPlayer3match].forEach(item => {
            item.node.active = true;
        })
        let arr = [this.OtherPlayer0HeadImage,this.OtherPlayer1HeadImage,this.OtherPlayer2HeadImage,this.OtherPlayer3HeadImage];
        arr.forEach(item => {
            item.node.active = false;
        });

        this.tab_me.node.active = false;
        this.name0.string = '';
        this.name1.string = this.name3.string = this.name2.string = '';
    }

    setTabMe(index: number) {
        let tabMePos = [cc.v2(-254,198),cc.v2(254,198),cc.v2(-254,-50),cc.v2(254,-50)];
        this.tab_me.node.active = true;
        this.tab_me.node.setPosition(tabMePos[index]);
    }

    start () {

    }

    // update (dt) {}
}
