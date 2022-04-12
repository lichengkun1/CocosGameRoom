/**
 * 
 * 弹窗管理器
 * 
 */

import { resourceManager } from "./resourceManager";

/** 游戏层级 */
export enum Layers {
    /** 游戏界面层 */
    GAMELAYER = 1,
    /** 弹窗层 */
    TOASTLAYER = 10,
    /** 视频层 */
    VIDEOLAYER = 20,

}

export class ToastManager {
    /** 当前运行的场景 弹窗是在该节点进行添加 */
    private _canvas: cc.Scene = null;

    private _init() {
        this._canvas = cc.director.getScene();
    }

    /**
     * 添加弹窗
     * @param  {string} toastUrl 弹窗资源的url
     * @param  {string} bundleName bundle名字
     * @returns Promise<boolean>
     */
    public async addToast(toastUrl: string,bundleName: string): Promise<boolean> {
        this._init();
        if(!this._canvas) {
            console.warn('添加的弹窗父节点不存在');
            return false;
        }

        let toastPrefab = await resourceManager.loadAseetByBundleName(toastUrl,cc.Prefab,bundleName) as cc.Prefab;
        if(!toastPrefab) {
            console.warn('弹窗预制体为null');
            return false;
        }
        let toastNode = cc.instantiate(toastPrefab);
        toastNode.zIndex = Layers.TOASTLAYER;
        this._canvas.addChild(cc.instantiate(toastPrefab));
        return true;
    }
}

export const toastManager = new ToastManager();