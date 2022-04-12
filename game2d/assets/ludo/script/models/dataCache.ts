import { stringify } from "querystring";

const {ccclass, property} = cc._decorator;

/**
 * 
 * 本地数据缓存类
 * 
 */
@ccclass
export default class DataCacheManager {
    
    /**
     * 保存数据到本地
     * @param  {string} key 键
     * @param  {string} value 值 需要json序列化
     */
    setLocalData<T>(key: string,value: T) {
        const jsonValueStr = JSON.stringify(value);
        cc.sys.localStorage.setItem(key,jsonValueStr);
        this.getLocalData(key);
    }

    /**
     * 根据键值来获取对应的value值
     * @param  {string} key
     */
    getLocalData<T>(key: string): T | null {
        const localDataStr = cc.sys.localStorage.getItem(key);
        if(!localDataStr) return;
        
        try {
            const value = JSON.parse(cc.sys.localStorage.getItem(key));
            console.log('value is ',value);
            return value as T;
        } catch(e) {
            console.log("解析数据失败",e);
            return null;
        }
    }
    
}

export const dataCacheManager = new DataCacheManager();
