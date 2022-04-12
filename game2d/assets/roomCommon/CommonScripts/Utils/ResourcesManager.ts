
/*
    * 资源加载管理
*/


export default class ResourcesManager {
    public static userHeadMap = new Map();                  //将用户头像做一个缓存;
    //加载预制体;
    public static loadPrefab(url, callBack) {
        cc.loader.loadRes(url, cc.Prefab, (err, preb) => {
            if (err) {
                console.log(`loadPrefab ${url} err:${err}`);
                return;
            }
            let prebNode = cc.instantiate(preb);
            callBack && callBack(prebNode);
        });
    }


    //加载网络图片 头像等;
    public static loadHeadImag(netUrl, userId, number, callback) {
        cc.loader.load({ url: netUrl, type: 'png' }, (err, res) => {
            if (err) {
                console.log(`loadHeadImag ${netUrl}`);
                console.log(err);
                if (number > 0) {
                    this.loadHeadImag(netUrl, userId, --number, callback);
                }
                return;
            }
            this.userHeadMap[userId] = res;
            callback && callback(res, userId);
        });
    }
    
    public static loadImage(netUrl, number, callback) {
        cc.loader.load({ url: netUrl, type: 'png' }, (err, res) => {
            if (err) {
                if (netUrl > 0) {
                    this.loadImage(netUrl, --number, callback);
                }
                return;
            }
            callback && callback(res);
        });
    }

    //预加载文件夹;
    public static loadResDir(dirUrl: string, num: number, callback) {
        cc.loader.loadResDir(dirUrl, (err, assets) => {
            if (err) {
                if (num > 0) {
                    this.loadResDir(dirUrl, --num, callback);
                } else {
                    callback();
                }
                return;
            }
            callback();
        });
    }

    //加载龙骨资源；
    public static loadDragonBonesRes(path: string, cb) {
        console.log(path);
        this.loadRes(`${path}_ske`, dragonBones.DragonBonesAsset, 2, (res) => {
            console.log("DragonBonesRes---------ske====================>");
            console.log(res);
            this.loadRes(`${path}_tex`, dragonBones.DragonBonesAtlasAsset, 2, (eRes) => {
                console.log("DragonBonesRes---------tex====================>");
                console.log(res);
                cb && cb({ asset: res, atlasAsset: eRes });
            });
        });
    }

    //加载图集资源;
    public static loadSpriteAtlas(url: string, cb) {
        this.loadRes(url, cc.SpriteAtlas, 2, (res: cc.SpriteAtlas) => {
            cb && cb(res);
        });
    }
    private static loadRes(url: string, type, count: number = 2, cb?) {
        cc.loader.loadRes(`GamesRes/store/${url}`, type, (err, res) => {
            if (err) {
                if (count >= 0) {
                    this.loadRes(url, type, --count);
                }
                return;
            }
            cb && cb(res);
        });
    }

    /**
     * 动态加载resource里面的图片
     * @param  {string} url 图片url
     * @returns Promise
     */
    public static async loadSpriteFrame(url: string): Promise<cc.SpriteFrame> {
        return new Promise((resolve,reject) => {
            cc.loader.loadRes(url,cc.SpriteFrame,(err: Error,res: cc.SpriteFrame) => {
                if(err) {
                    reject(err);
                    return;
                }
                resolve(res);
            });
        });
    }

}