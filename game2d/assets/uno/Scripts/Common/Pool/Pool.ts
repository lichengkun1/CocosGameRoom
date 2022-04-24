
const { ccclass, property } = cc._decorator;

@ccclass
export default class Pool {

    static pool: Map<String, Array<cc.Node>> = new Map<String, Array<cc.Node>>();
    static anypool: Map<String, Array<any>> = new Map<String, Array<any>>();
    /**
     * 从对象池中获取Node类型并且active值为false的对象
     * @param key 标识符
     * @param pfb 预制体（用于生成新的Node）
     */
    static GetNodeInstanceFromPool(key: string, pfb: cc.Prefab): cc.Node {
        let arr = this.pool.get(key);
        if (arr) {
            for (let i = 0; i < arr.length; i++) {
                const ele = arr[i];
                if (ele.active == false) {
                    return ele;
                }
            }
            let newins = cc.instantiate(pfb);
            arr.push(newins);
            this.pool.set(key, arr);
            return newins
        }
        else {
            arr = new Array<cc.Node>();
            let newins = cc.instantiate(pfb);
            arr.push(newins);
            this.pool.set(key, arr);
            return newins;
        }

    }
    /**
     * 从对象池中获取指定类型的对象
     * @param key key
     * @param createFunc 创建对象的方法
     * @param func 判定对象符合取出条件的方法，包含参数ele
     */
    static GetAnyInstanceFromPool<T>(key: string, createFunc: Function, func: Function): T {
        let arr = this.anypool.get(key);
        let element: T = null;
        if (arr) {
            for (let i = 0; i < arr.length; i++) {
                const ele = arr[i];
                if (func(ele)) {
                    return ele;
                }
            }
            let newins = createFunc();
            arr.push(newins);
            this.anypool.set(key, arr);
            return newins
        }
        else {
            arr = new Array<T>();
            let newins = createFunc();
            arr.push(newins);
            this.anypool.set(key, arr);
            return newins;
        }

    }
    static CleanNodePoolFromKey(key: string) {
        this.pool.delete(key);
    }
    static CleanAnyPoolFromKey(key: string) {
        this.anypool.delete(key);
    }
    static CleanNodePool() {
        this.pool.clear()
    }
    static CleanAnyPool() {
        this.anypool.clear()
    }
    static CleanPool() {
        this.pool.clear()
        this.anypool.clear()
    }
}