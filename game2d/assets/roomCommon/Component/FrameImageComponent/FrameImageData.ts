
const { ccclass, property } = cc._decorator;
@ccclass
export default class FrameImageData {
    user_id: number = -1;
    frame_image_sprite: cc.SpriteFrame = null;
    frame_image_url: string = "";
}
