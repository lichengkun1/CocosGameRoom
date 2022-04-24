
/**
 * CopyRight:
 * 音效管理类
 */

import { GameConfig } from "../../../gameConfig";
import { resourceManager } from "../../../Script/common/managers/resourceManager";

export default class MessageSoundManager {
    public static audioEngineOn:boolean = true;                 //音乐开关，默认打开的;
    public static bgAudioId:number = -1;                        //背景音乐ID;
    public static audioIsOn:boolean = true;

    public static playBGEngine(url,callback?: Function){
        if(this.audioEngineOn){
            MessageSoundManager.loadAudioClip(url).then((clip: cc.AudioClip) => {
                if(this.audioEngineOn){
                    this.bgAudioId = cc.audioEngine.playMusic(clip,true);
                    cc.audioEngine.setFinishCallback(this.bgAudioId,() => {
                        console.log('背景音乐异常结束');
                    });
                    callback && callback(this.bgAudioId);
                }
            }).catch();
            // resourceManager.loadAssetInBundle(url,cc.AudioClip,GameConfig.gameName).then((clip: cc.AudioClip) => {
            //     //双重验证;
            //     c
            // }).catch(err => {
            //     console.log(`load ${url}`);
            // });
            
        }
    }

    public static async loadAudioClip(url: string) {
        return new Promise((resolve,reject) => {
            resourceManager.loadAssetInBundle(url,cc.AudioClip,GameConfig.gameName).then((clip: cc.AudioClip) => {
                //双重验证;
                resolve(clip);
                // if(this.audioEngineOn){
                //     this.bgAudioId = cc.audioEngine.playMusic(clip,true);
                //     cc.audioEngine.setFinishCallback(this.bgAudioId,() => {
                //         console.log('背景音乐异常结束');
                //     });
                //     callback && callback(this.bgAudioId);
                // }
            }).catch(err => {
                console.log(`load ${url}`);
                reject(new Error('加载资源失败'));
            });
        })
    }
    
    public static updateMusic(){
        if(this.audioEngineOn){
            this.resumeMusic();
            console.log('updateMusic id is ',this.bgAudioId);
            if(this.bgAudioId !== -1) {
                cc.audioEngine.setVolume(this.bgAudioId,1);
            }
        }else{
            this.pauseMusic();
        }
    }

    public static playEffect(url){
        if(this.audioEngineOn){
            // cc.loader.loadRes(url,cc.AudioClip,(err,clip)=>{
            //     if(err){
            //         console.log(`load ${url} err ${err}`);
            //         return;
            //     }
                
            // });
            MessageSoundManager.loadAudioClip(url).then((clip: cc.AudioClip) => {
                cc.audioEngine.playEffect(clip,false);
            });
        }
    }

    public static stopMisic(){
        cc.audioEngine.stopMusic();
    }

    public static pauseMusic() {
        console.log('暂停');
        cc.audioEngine.pauseMusic();
        if(cc.sys.isBrowser && cc.sys.os === cc.sys.OS_IOS) {

            //@ts-ignore
            if(cc.sys.__audioSupport.context && cc.sys.__audioSupport.context['suspend']) {
                //@ts-ignore
                cc.sys.__audioSupport.context.suspend();
            }
        }
    }

    public static resumeMusic(): number {
        console.log('恢复');
        const id = cc.audioEngine.resumeMusic();
        if(cc.sys.isBrowser && cc.sys.os === cc.sys.OS_IOS) {
            //@ts-ignore
            cc.sys.__audioSupport.context.resume();
        }
        //@ts-ignore
        return id;
    }

    public static playBgm(clip: cc.AudioClip) {
        if(this.bgAudioId >= 0) {
            cc.audioEngine.stop(this.bgAudioId);
        }
        this.bgAudioId = cc.audioEngine.playMusic(clip,true);
        cc.audioEngine.setVolume(this.bgAudioId,1);
        return this.bgAudioId;
    }

    public static stopAllEngine(){
        this.audioEngineOn = false;
        cc.audioEngine.stopAll();
    }

    public static stopAllBgMusic() {
        const id = cc.audioEngine._music.id;
        console.log('stop id is ',id);
        console.log('idaudioMap is ',cc.audioEngine._id2audio);
        const audio = cc.audioEngine._id2audio[id];
        
        if(audio) {
            console.log('销毁音频实例');
            audio.destroy();
        }
    }

    public static stopBgById() {
        if(this.bgAudioId === -1) return;
        cc.audioEngine.stop(this.bgAudioId);
    }

    //播放已经下载好的音效;
    public static playLoadEffect(clip){
        let audioId = -1;
        if(this.audioEngineOn) {
            audioId = cc.audioEngine.playEffect(clip,false);
        }
        return audioId;
    }

    public static preLoadRes(url:string,count = 2){
        // cc.loader.loadRes(url,cc.AudioClip,(err,clip)=>{
        //     if(err){
        //         if(count >= 0){
        //             this.preLoadRes(url,--count);
        //         }
        //         return;
        //     }
        // });
    }
}

// window.MKSound = window.MKSound||MKSound;