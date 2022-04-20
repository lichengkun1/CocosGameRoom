
import MessageType from "../CommonScripts/Utils/MessageType";
import MyEvent from "../CommonScripts/Utils/MyEvent";
import ResourcesManager from "../CommonScripts/Utils/ResourcesManager";
import FrameImageData from "./FrameImageData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FrameImageManager {

    /**users的信息(包含spriteframe) */
    public static Datas: Map<number, FrameImageData> = new Map<number, FrameImageData>();

    private static node: cc.Node = new cc.Node();
    public static Init() {
        MyEvent.I.on(MessageType.MESSAGE_MIC_USERS, this.mainSocket.bind(this), this.node);
    }
    private static mainSocket(data) {
        for (let i = 0; i < data.data.data.users.length; i++) {
            const element = data.data.data.users[i];
            if (element) {
                const framedata = new FrameImageData();
                framedata.user_id = Number(element.id);
                framedata.frame_image_url = element.photo_frame_image;
                FrameImageManager.Datas.set( framedata.user_id, framedata);
            }
        }
    }

    /** 通过uid获取头像框相关数据
     * @param uid 用户id
     * @returns 
     */
    public static GetDataForUid(uid): FrameImageData {
        return this.Datas.get(uid);
    }

    /** 加载图片
     * @param success 获取成功
     * @param err 获取失败
     */
    public static LoadImage(url: string, uid: number, success: Function) {
        ResourcesManager.loadHeadImag(url, uid, 3, (res: cc.Texture2D) => {
            success && success(res);
        });
    }
}
