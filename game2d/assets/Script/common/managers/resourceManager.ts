import { debugLog } from "../utils/util";

/**
 * 
 * 资源管理器 单例
 * 
 */
 export class ResourceManager {
    
    /**
     * 加载本地bundle loadBundle只会加载配置文件和index.js没有必要加入进度回调
     * @param  {string} bundleName bundle名称
     * @returns Promise<cc.AssetManager.Bundle>
     */
    public async loadBundle(bundleName: string = 'resources'): Promise<cc.AssetManager.Bundle> {
        return new Promise((resolve,reject) => {
            cc.assetManager.loadBundle(bundleName,(err: Error,bundle: cc.AssetManager.Bundle) => {
                if(err) {
                    console.warn('加载bundle出错');
                    reject(err);
                    return;
                }
                resolve(bundle);
            });
        })
    }

    public async loadBundleDir(bundleName: string,url: string,type: typeof cc.Asset,progressFunc: (finished,total,item) => void,finishFunc: (err,res) => void) {
        const bundle = await this.loadBundle(bundleName);
        debugLog('bundle的依赖数量: ',bundle.deps.length);
        // debugLog('资源数量：',bundle.getAssetInfo());
        debugLog('加载bundle dir: ',bundle);
        bundle.loadDir(url,type,progressFunc,finishFunc);
    }

    /**
     * 加载bundle里面的资源 除去场景外的资源
     * @param  {cc.AssetManager.Bundle} bundle budnle资源
     * @param  {string} url 资源在bundle里面的路径
     * @param  {typeofcc.Asset} type 资源的类型
     * @param  {Function} progressFunc 进度方法
     * @returns Promise
     */
    public async loadAssetInBundle<T extends cc.Asset>(url: string,type: typeof cc.Asset,bundleName: string,progressFunc?: (finished,total,item) => {}): Promise<T> {
        if(!url) return;
        const bundle: cc.AssetManager.Bundle = await this.loadBundle(bundleName);
        debugLog('bundle is ',bundle);

        return new Promise((resolve,reject) => {
            bundle.load(url,type,progressFunc,(err: Error,assets: T) => {
                if(err) {
                    reject(new Error('加载bundle内的资源失败'));
                }
                resolve(assets);
            })
        });
        
    }

    /**
     * 加载bundle里面的场景资源
     * @param  {string} url
     * @param  {string} bundleName
     * @returns Promise
     */
    public async loadSceneInBundle(url: string,bundleName: string,completeFunc: Function,progressFunc?: Function): Promise<cc.SceneAsset> {
        const bundle: cc.AssetManager.Bundle = await this.loadBundle(bundleName);
        if(!bundle) {
            console.warn(`bundle ${bundleName} 不存在`);
            return;
        }
        console.log('loadSceneInBundle bundle is ',bundle);
        return new Promise((resolve,reject) => {
            bundle.preloadScene(url,progressFunc,(err) => {
                if(err) {
                    console.warn(`加载bundle里面的场景err is bundleName: ${bundleName},url: ${url}`);
                    reject(err);
                    return;
                }
                resolve(null);
                completeFunc();
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
        const asset = await this.loadAssetInBundle<T>(url,type,bundleName);
        return asset;
    }

    public async getBundleDirDepsCount(bundleName: string,bundleDir: string): Promise<void> {
        let res = [];
        const bundle = await this.loadBundle(bundleName);
        // @ts-ignore
        const bundleMap = bundle._config.paths._map;

        // uuid数组
        const targetRes = [];
        const bundleMapKeys = Object.keys(bundleMap);
        for(let i = 0; i < bundleMapKeys.length; i++) {
            let keyItem = bundleMapKeys[i];
            if(keyItem.indexOf(bundleDir) >= 0) {
                targetRes.push(bundleMap[keyItem].map(it => it.uuid));
            }
        }

        // console.log('depends is ',cc.assetManager.dependUtil._depends);
        // @ts-ignore
        const depsArr = cc.assetManager.dependUtil._depends;
        targetRes.forEach(item => {
            const assetInfo = bundle.getAssetInfo(item);
            // getNativeDep
            // getDepsRecursively
            const deps = depsArr._map[item];
            // const deps = cc.assetManager.dependUtil.getNativeDep(item);
            // res.concat(deps.)
        });
        return void 0;
        
    }

    /**
     * 加载远程资源
     * @param  {string} url string 资源路径
     * @param  {string} type 选项 png 告诉资源的后缀名是什么
     * @returns Promise
     */
    public async loadRemoteAsset<T extends cc.Asset>(url: string,type: string = '.png'): Promise<T> {
        if(!url) return;
        const hasPng = url.indexOf('.png') >= 0;
        
        return new Promise((resolve,reject) => {
            if(!hasPng) {
                cc.assetManager.loadRemote(url,{ext: type},(err: Error,res: T) => {
                    if(err) {
                        reject(err);
                        return;
                    }
                    if(res instanceof cc.Texture2D) {
                        res.packable = false;
                        return;
                    }
                    resolve(res);
                });
            } else {
                cc.assetManager.loadRemote(url,(err: Error,res: T) => {
                    if(err) {
                        reject(err);
                        return;
                    }
                    if(res instanceof cc.Texture2D) {
                        res.packable = false;
                    }
                    resolve(res);
                });
            }
        })
    }
}

export const resourceManager = new ResourceManager();