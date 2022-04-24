import { MyComponent } from "../Game/MyComponent";
import SoundManager from "./SoundManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class soundBtn extends MyComponent {
    sp: cc.Sprite | null = null;
    @property(cc.SpriteFrame)
    OnSoundFrame: cc.SpriteFrame | null = null;
    @property(cc.SpriteFrame)
    OffSoundFrame: cc.SpriteFrame | null = null;

    start() {
        this.sp = this.node.getComponent(cc.Sprite);
        if (!this.sp) {
            console.error("此结点没有Sprite组件");
            return
        }
        if (SoundManager.AudioSourceVolume == 1) {
            this.sp.spriteFrame = this.OnSoundFrame;
        }
        else if (SoundManager.AudioSourceVolume == 0) {
            this.sp.spriteFrame = this.OffSoundFrame;
        }
    }
    soundBtn(event: any, name: any) {
        if (SoundManager.AudioSourceVolume == 1) {
            SoundManager.isAudioOn = false;
            SoundManager.AudioSourceVolume = 0;
            SoundManager.SetBGMusicVolume(0, name);
            SoundManager.SetSourceVolume(0);
            if (this.sp)
                this.sp.spriteFrame = this.OffSoundFrame;
        }
        else if (SoundManager.AudioSourceVolume == 0) {
            SoundManager.isAudioOn = true;
            SoundManager.AudioSourceVolume = 1;
            SoundManager.SetBGMusicVolume(1, name);
            SoundManager.SetSourceVolume(1);
            if (this.sp)
                this.sp.spriteFrame = this.OnSoundFrame;
        }
    }
}
