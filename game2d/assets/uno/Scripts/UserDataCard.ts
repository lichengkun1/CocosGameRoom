import FrameImage from "../../Script/FrameImageComponent/FrameImage";
import FrameImageManager from "../../Script/FrameImageComponent/FrameImageManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UserDataCard extends cc.Component {


    @property(cc.SpriteAtlas)
    public UserAtlas: cc.SpriteAtlas = null;
    public thisPlayerID: number = 0;

    private vip: cc.Sprite;
    private icon_num: cc.Sprite;
    private vipicon: cc.Sprite;
    private user_levelicon: cc.Sprite;
    private familyIcon: cc.Sprite;
    private playerHead: cc.Sprite;
    private btn_follow: cc.Sprite;
    private familyLabel: cc.Label;
    private playername: cc.Label;
    private LVLabel: cc.Label;
    private playedCount: cc.Label;
    private winCount: cc.Label;
    private follwLabel: cc.Label;


    private frameImage: FrameImage;

    onEnable() {
        // console.log(this.familyAtlas.getSpriteFrame("family" + 0));
        // console.log(this.familyAtlas.getSpriteFrame("icon_num_" + 0));
        // console.log(this.familyAtlas.getSpriteFrame("user_level" + 0));
        this.InitNode();
    }

    private InitNode() {
        this.vip = this.node.getChildByName("vip").getComponent(cc.Sprite);
        this.icon_num = this.vip.node.getChildByName("icon_num").getComponent(cc.Sprite);
        this.vipicon = this.vip.node.getChildByName("vipicon").getComponent(cc.Sprite);

        this.user_levelicon = this.node.getChildByName("user_levelicon").getComponent(cc.Sprite);
        this.familyIcon = this.node.getChildByName("familyIcon").getComponent(cc.Sprite);
        this.playerHead = this.node.getChildByName("playerHead").getComponent(cc.Sprite);
        this.btn_follow = this.node.getChildByName("btn_follow").getComponent(cc.Sprite);

        this.familyLabel = this.familyIcon.node.getChildByName("familyLabel").getComponent(cc.Label);
        this.follwLabel = this.btn_follow.node.getChildByName("follwLabel").getComponent(cc.Label);
        this.playername = this.node.getChildByName("playername").getComponent(cc.Label);
        this.LVLabel = this.node.getChildByName("LVLabel").getComponent(cc.Label);
        this.playedCount = this.node.getChildByName("playedCount").getComponent(cc.Label);
        this.winCount = this.node.getChildByName("winCount").getComponent(cc.Label);

        this.frameImage = this.playerHead.node.getChildByName("frameImage").getComponent(FrameImage);
    }
    /**
     * 初始化
     * @param uid 需要显示的用户的UID
     * @param thisPlayer_user_id 当前玩家的UID
     */
    public Init(uid, thisPlayer_user_id: number) {
        if (FrameImageManager.GetDataErr) return;
        this.thisPlayerID = thisPlayer_user_id;
        this.InitNode();
        let data = FrameImageManager.GetDataForUid(uid);
        console.log(data);
        this.SetHeadImage(data);
        this.SetLevel(data);
        this.SetVip(data);
        this.SetFamily(data);
        this.SetPlayData(data);
        this.SetFollow(data, uid);
    }

    public Close() {
        this.node.active = false;
    }

    private SetHeadImage(data: any) {
        this.playername.string = data.name;
        // this.frameImage.node.getComponent(cc.Sprite).spriteFrame = null;
        this.frameImage.InitFrameImage(data.user_id);
        if (!data.avatar_sprite) {
            let url = data.avatar;
            if (url) {
                FrameImageManager.LoadImage(url, data.user_id, (res) => {
                    let image = new cc.SpriteFrame(res);
                    data.avatar_sprite = image;
                    this.playerHead.spriteFrame = data.avatar_sprite;
                })
            }
        } else {
            this.playerHead.spriteFrame = data.avatar_sprite;
        }
    }

    private SetLevel(data: any) {
        let lv = Math.floor(data.level / 10)
        console.log(lv);
        this.user_levelicon.spriteFrame = this.UserAtlas.getSpriteFrame("user_level" + lv);
        this.LVLabel.string = "LV." + data.level;
    }

    private SetVip(data: any) {
        if (data.is_vip) {
            // this.familyIcon.node.x = -50;
            this.vip.node.active = true;
            this.icon_num.spriteFrame = this.UserAtlas.getSpriteFrame("icon_num_" + data.vip_level);
            this.vipicon.spriteFrame = this.UserAtlas.getSpriteFrame("vip" + data.vip_level);
        } else {
            this.vip.node.active = false;
            // this.familyIcon.node.x = -145;
        }
    }

    private SetFamily(data: any) {
        if (data.family_tag) {
            this.familyIcon.node.active = true;
            if (data.is_vip) {
                this.familyIcon.node.x = -50;
            } else {
                this.familyIcon.node.x = -145;
            }
            // this.familyLabel.node.on(cc.Node.EventType.SIZE_CHANGED, () => {
            //     this.familyIcon.node.width = this.familyLabel.node.width + 38;
            // }, this);
            this.familyLabel.string = data.family_tag;
            let familyLV = data.family_level;
            this.familyIcon.spriteFrame = this.UserAtlas.getSpriteFrame("family" + familyLV);
        } else {
            this.familyIcon.node.active = false;
        }
    }
    private SetPlayData(data: any) {
        this.playedCount.string = "" + data.play_count;
        this.winCount.string = "" + data.win_count;
    }

    private SetFollow(data: any, uid) {
        if (this.thisPlayerID == uid || this.IsFollow(data)) {
            this.btn_follow.spriteFrame = this.UserAtlas.getSpriteFrame('btn_following');
            this.follwLabel.string = 'Following';
            this.follwLabel.node.color = new cc.Color(83, 179, 185, 255);
        } else {
            //关注;
            this.btn_follow.spriteFrame = this.UserAtlas.getSpriteFrame('btn_follow');
            this.follwLabel.string = 'Follow';
            this.follwLabel.node.color = new cc.Color(255, 255, 255, 255);
            this.btn_follow.node.off(cc.Node.EventType.TOUCH_START);
            this.btn_follow.node.once(cc.Node.EventType.TOUCH_START, () => {
                FrameImageManager.FollowPoint();
                FrameImageManager.followedPlayer(data.user_id, (uid) => {
                    if (data.follow.indexOf(this.thisPlayerID) < 0)
                        data.follow.push(this.thisPlayerID);
                    if (this.node && this.node.active) {
                        this.btn_follow.spriteFrame = this.UserAtlas.getSpriteFrame('btn_following');
                        this.follwLabel.string = 'Following';
                        this.follwLabel.node.color = cc.color(83, 179, 185);
                    }
                });
            }, this);
        }
    }
    private IsFollow(data) {
        for (let i = 0; i < data.follow.length; i++) {
            const element = data.follow[i];
            if (element == this.thisPlayerID) {
                return true;
            }
        }
        return false
    }

}
