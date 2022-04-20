
/*
    * 资源加载管理
*/

import { resourceManager } from "../../../Script/common/managers/resourceManager";


export default class ResourcesManager {
    public static userHeadMap = new Map();                  //将用户头像做一个缓存;
    //加载预制体;
    public static loadPrefab(url: string, bundleName: string,callBack: Function) {
        resourceManager.loadAssetInBundle(url,cc.Prefab,bundleName,null).then((res: cc.Prefab) => {
            let prebNode = cc.instantiate(res);
            callBack && callBack(prebNode);
        }).catch(err => {
            console.log(`loadPrefab ${url} err:${err}`);
        });
    }


    //加载网络图片 头像等;
    public static loadHeadImag(netUrl, userId, number, callback) {
        resourceManager.loadRemoteAsset(netUrl,'.png').then((res: cc.Texture2D) => {
            this.userHeadMap[userId] = res;
            callback && callback(res, userId);
        }).catch(err => {
            if (number > 0) {
                this.loadHeadImag(netUrl, userId, --number, callback);
            }
        });
    }
    
    public static loadImage(netUrl, number, callback) {
        resourceManager.loadRemoteAsset(netUrl,'.png').then((res: cc.Texture2D) => {
            callback && callback(res);
        }).catch(err => {
            if (number > 0) {
                this.loadImage(netUrl, --number, callback);
            }
        });
    }

    //预加载文件夹;
    public static loadResDir(dirUrl: string, num: number, bundleName: string,type: typeof cc.Asset,callback) {
        resourceManager.loadBundleDir(bundleName,dirUrl,type,null,(err,ress) => {
            if (err) {
                if (num > 0) {
                    this.loadResDir(dirUrl, --num, bundleName,type, callback);
                } else {
                    callback();
                }
                return;
            }
            callback && callback();
        });
        
    }

    //加载龙骨资源；
    public static loadDragonBonesRes(bundleName: string,path: string, cb) {
        console.log(path);
        this.loadRes(bundleName,`${path}_ske`, dragonBones.DragonBonesAsset, 2, (res) => {
            console.log("DragonBonesRes---------ske====================>");
            console.log(res);
            this.loadRes(bundleName,`${path}_tex`, dragonBones.DragonBonesAtlasAsset, 2, (eRes) => {
                console.log("DragonBonesRes---------tex====================>");
                console.log(res);
                cb && cb({ asset: res, atlasAsset: eRes });
            });
        });
    }

    //加载图集资源;
    public static loadSpriteAtlas(bundleName: string,url: string, cb: Function) {
        this.loadRes(bundleName,url, cc.SpriteAtlas, 2, (res: cc.SpriteAtlas) => {
            cb && cb(res);
        });
    }
    private static loadRes(bundleName: string,url: string, type: typeof cc.Asset, count: number = 2, cb?) {
        resourceManager.loadAssetInBundle(url,type,bundleName,null).then((res) => {
            cb && cb(res);
        }).catch(err => {
            if (count >= 0) {
                this.loadRes(bundleName,url, type, --count);
            }
        });
    }

    /**
     * 动态加载resource里面的图片
     * @param  {string} url 图片url
     * @returns Promise
     */
    public static async loadSpriteFrame(bundleName: string,url: string): Promise<cc.SpriteFrame> {
        return new Promise((resolve,reject) => {
            resourceManager.loadAssetInBundle(url,cc.SpriteFrame,bundleName,null).then((res: cc.SpriteFrame) => {
                resolve(res);
            }).catch(err => {
                reject(err);
            });
        });
    }

}