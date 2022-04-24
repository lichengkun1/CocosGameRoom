import { GameConfig } from "../../../../gameConfig";
import { resourceManager } from "../../../../Script/common/managers/resourceManager";
import { MyComponent } from "../Game/MyComponent";
import AndroidGoback from "../Server/AndroidGoback";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SoundManager {

    static audios: cc.AudioClip[] = [];

    static AudioSourceVolume: number = 1;
    static BGMVolume: number = 1;

    static isVolume: boolean = true;
    /** 默认开启音频开关 */
    static isAudioOn: boolean = true;

    /**
     * 加载音效，并初始化SoundManager.I.audios
     */
    public static LoadSound(func?: Function) {
        resourceManager.loadBundleDir(GameConfig.gameName,`resources_${GameConfig.gameName}/sounds`,cc.AudioClip,null,(err: Error,assets: cc.AudioClip[]) => {
            if (err) {
                console.error(err);
                return;
            }
            for (let i = 0; i < assets.length; i++) {
                const element = assets[i];
                SoundManager.audios.push(element);
            }
            if (func) {
                func();
            }
            SoundManager.PlayBGMusic();
        });
    }

    static PlayBGMusic(name: string = "BGMusic") {
        if (AndroidGoback.IsOut) return;
        for (let i = 0; i < this.audios.length; i++) {
            const element = this.audios[i];
            if (element.name == name) {
                cc.audioEngine.playMusic(element, true);
            }
        }
    }

    public static pauseMusic() {
        cc.audioEngine.pauseMusic();
        if(cc.sys.isBrowser && cc.sys.os == cc.sys.OS_IOS) {
            //@ts-ignore
            if(cc.sys.__audioSupport.context && cc.sys.__audioSupport.context['suspend']) {
                //@ts-ignore
                cc.sys.__audioSupport.context.suspend();
            }
        }    
    }

    public static resumeMusic() {
        const id = cc.audioEngine.resumeMusic();
        if(cc.sys.isBrowser && cc.sys.os === cc.sys.OS_IOS) {
            //@ts-ignore
            cc.sys.__audioSupport.context.resume();
        }
    }

    static PlaySource(name: string, loop: boolean = false) {
        if (AndroidGoback.IsOut) return;
        for (let i = 0; i < this.audios.length; i++) {
            const element = this.audios[i];
            if (element.name == name) {
                cc.audioEngine.playEffect(element, loop);
                // element.playOneShot(this.AudioSourceVolume);
            }
        }
    }
    static StopSource() {
        cc.audioEngine.stopAllEffects();
    }
    static SetSourceVolume(volume: number) {
        if (AndroidGoback.IsOut) return;
        if (volume == 0) {
            cc.audioEngine.setEffectsVolume(volume);
            this.isVolume = false;
        }
        if (this.isVolume) {
            cc.audioEngine.setEffectsVolume(volume);
        }
        // this.AudioSourceVolume = volume;
    }
    static SetBGMusicVolume(volume: number, BGMusicName: string = "BGMusic") {
        if (volume == 1) {
            this.isVolume = true;
        } else {
            this.isVolume = false;
        }
        // this.BGMVolume = volume;
        // for (let i = 0; i < this.audios.length; i++) {
        //     const element = this.audios[i];
        //     if (element.name == BGMusicName) {
        cc.audioEngine.setMusicVolume(volume);
        // element.setVolume(this.BGMVolume);
        //     }
        // }
    }
}
