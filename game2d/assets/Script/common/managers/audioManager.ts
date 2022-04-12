/**
 * 
 * 音频管理器
 * 
 */
// import { preloadAssetInBundle } from "../myutils/myutil";

import { preloadAssetInBundle } from "../utils/util";

const {ccclass, property} = cc._decorator;

@ccclass
export default class AudioManager {

    /** 音频开关默认开启 */
    public audioOn: boolean = true;

    /** 正在播放的音效id */
    private _effectId: number = -1;

    /** 正在播放的背景音乐id */
    private _curBgmId: number = -1;

    /** 背景音乐是否开启 */
    private _bgmOn: boolean = true;
    /** 音效开关是否开启 */
    private _effectOn: boolean = true;


    public set bgmOn(tag: boolean) {
        this._bgmOn = tag;
        if(!tag) {
            cc.audioEngine.pauseMusic();
            if(cc.sys.isBrowser && cc.sys.os === cc.sys.OS_IOS) {

                //@ts-ignore
                if(cc.sys.__audioSupport.context && cc.sys.__audioSupport.context['suspend']) {
                    //@ts-ignore
                    cc.sys.__audioSupport.context.suspend();
                }
            }
        } else {
            cc.audioEngine.resumeMusic();
            if(cc.sys.isBrowser && cc.sys.os === cc.sys.OS_IOS) {
                //@ts-ignore
                cc.sys.__audioSupport.context.resume();
            }
        }
    }


    public get bgmOn() {
        return this._bgmOn;
    }

    public set effectOn(tag: boolean) {
        this._effectOn = tag;
        if(!tag) {
            cc.audioEngine.stopAllEffects();
        }
    }

    public get effectOn() {
        return this._effectOn;
    }

    /**
     * 根据bundle名字和url加载对应的clip
     * @param  {string='resources'} bundleName
     * @param  {string} url
     * @returns Promise
     */
    private async _loadBundleWithNameAndUrl(url: string,bundleName: string = 'resources'): Promise<cc.AudioClip> {
        const clip = await preloadAssetInBundle(url,cc.AudioClip,bundleName) as cc.AudioClip;
        if(!clip) return;
        return clip;
    }

    /**
     * 根据bundle名字播放背景音乐
     * @param  {string='resources'} bundleName
     * @param  {string} url
     * @returns Promise
     */
    public async playBgm(url: string,bundleName: string = 'resources'): Promise<void> {
        if(!this.bgmOn) return;
        cc.audioEngine.stop(this._curBgmId);
        const clip = await this._loadBundleWithNameAndUrl(url,bundleName);
        this._curBgmId = cc.audioEngine.playMusic(clip,true);
    }

    public playLocalBgm(clip: cc.AudioClip): void {
        if(!this.bgmOn) return;
        cc.audioEngine.stop(this._curBgmId);
        this._curBgmId = cc.audioEngine.playMusic(clip,true);
    }

    public stopBgm(): void {
        cc.audioEngine.stop(this._curBgmId);
        cc.audioEngine.stopMusic();
    }

    /**
     * 根据bundle名字和url播放音效
     * @param  {string='resources'} bundleName
     * @param  {string} url
     * @param  {boolean=false} isLoop 是否循环播放音效
     * @returns Promise
     */
    public async playEffect(url: string,bundleName: string = 'resources',isLoop: boolean = false): Promise<void> {
        if(!this.effectOn) return;
        const clip = await this._loadBundleWithNameAndUrl(url,bundleName);
        cc.audioEngine.playEffect(clip,isLoop);
    }
    
    public stopEffect() {
        if(this._effectId !== -1) {
            cc.audioEngine.stopEffect(this._effectId);
        }
    }

    public stopAllEffect() {
        cc.audioEngine.stopAllEffects();
    }

    

}

export const audioManager = new AudioManager();
