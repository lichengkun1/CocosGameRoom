/**
 * 
 * 资源管理器 单例
 * 用于加载bundle资源
 * 
 */
export class ResourceManager {
    /**
     * 加载本地bundle
     * @param  {string} bundleName bundle名称
     * @returns Promise<cc.AssetManager.Bundle>
     */
    public async loadBundle(bundleName: string = 'resources') {
        if(!cc.assetManager) return;
        return new Promise((resolve,reject) => {
            cc.assetManager && cc.assetManager.loadBundle(bundleName,(err: Error,bundle: cc.AssetManager.Bundle) => {
                if(err) {
                    reject(err);
                    return;
                }
                resolve(bundle);
            });
        })
    }

    /**
     * 加载bundle里面的资源
     * @param  {cc.AssetManager.Bundle} bundle budnle资源
     * @param  {string} url 资源在bundle里面的路径
     * @param  {typeofcc.Asset} type 资源的类型
     * @returns Promise
     */
    public async loadAssetInBundle<T extends cc.Asset>(url: string,type: typeof cc.Asset): Promise<T> {
        if(!url) return;

        return new Promise((resolve,reject) => {
            cc.loader.loadRes(url,type,(err: Error,asset: T) => {
                if(err) {
                    reject(err);
                    return;
                }
                resolve(asset);
            });
        });
    }

    /**
     * 根据bundle名字加载对应的资源
     * @param  {string='resources'} bundleName bundle名字
     * @param  {string} url 资源url
     * @param  {typeofcc.Asset} type 资源类型
     * @returns Promise
     */
    public async loadAseetByBundleName<T extends cc.Asset>(url: string,type: typeof cc.Asset,bundleName: string = 'resources'): Promise<T> {
        if(!url) return;
        // if(!bundleName) return;
        const asset = await this.loadAssetInBundle<T>(url,type);
        return asset;
    }

    /**
     * 加载远程资源
     * @param  {string} url string 资源路径
     * @param  {string} type 选项 png 告诉资源的后缀名是什么
     * @returns Promise
     */
    public async loadRemoteAsset<T extends cc.Asset>(url: string,type: string = 'png'): Promise<cc.SpriteFrame> {
        if(!url) return;
        const hasPng = url.indexOf('.png') >= 0;
        return new Promise((resolve,reject) => {
            if(!hasPng) {
                cc.loader.load({url,type},(err: Error,res: T) => {
                    if(err) {
                        reject(err);
                        return;
                    }
                    if(res instanceof cc.Texture2D) {
                        res.packable = false;
                        let frame = new cc.SpriteFrame(res);
                        resolve(frame);
                    }
                });
            } else {
                cc.loader.load(url,(err: Error,res: T) => {
                    if(err) {
                        reject(err);
                        return;
                    }
                    if(res instanceof cc.Texture2D) {
                        res.packable = false;
                        let frame = new cc.SpriteFrame(res);
                        resolve(frame);
                    }
                });
            }
        })
    }
}

export const resourceManager = new ResourceManager();