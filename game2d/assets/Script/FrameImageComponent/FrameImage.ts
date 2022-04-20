
import FrameImageManager from "./FrameImageManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FrameImage extends cc.Component {
    @property(cc.Float)
    sizeX = 0.31;
    @property(cc.Float)
    sizeY = 0.31;
    InitFrameImage(uid: number) {
        let userData = FrameImageManager.GetDataForUid(uid);
        if (userData) {
            let sprite = this.node.getComponent(cc.Sprite);
            if (!userData.frame_image_sprite) {
                let url = userData.frame_image_url //FrameImageManager.UsersInfoData[uid].frame_image;
                if (url) {
                    FrameImageManager.LoadImage(url, uid, (res) => {
                        let image = new cc.SpriteFrame(res);
                        userData.frame_image_sprite = image;
                        sprite.spriteFrame = userData.frame_image_sprite;
                        sprite.sizeMode = cc.Sprite.SizeMode.RAW;
                        sprite.trim = false;
                        sprite.node.scaleX = this.sizeX;
                        sprite.node.scaleY = this.sizeY;
                    })
                }
            } else {
                sprite.spriteFrame = userData.frame_image_sprite;
                sprite.sizeMode = cc.Sprite.SizeMode.RAW;
                sprite.trim = false;
                sprite.node.scaleX = this.sizeX;
                sprite.node.scaleY = this.sizeY;
            }
        }
    }
}
