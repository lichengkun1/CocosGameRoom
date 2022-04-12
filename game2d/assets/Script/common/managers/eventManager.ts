/**
 * 
 * 事件管理器
 * 
 */
const {ccclass, property} = cc._decorator;

@ccclass
export class EventManager {
    /** 记录事件 */
    private _record: {[key: string]: {target: any,handler: Function}[]} = {};

    /**
     * 发射事件 发布事件通知所有的订阅者更新
     * @param  {string} eventName 事件名
     * @returns void
     */
    public emit(eventName: string,data?: any): void {
        if(!eventName) return;
        const handleArr = this._record[eventName];
        if(!handleArr) return;
        handleArr.forEach((handle: {target: any,handler: Function}) => {
            handle.handler.call(handle.target,data);
        });
        
    }
    /**
     * 订阅某一个消息
     * @param  {string} eventName 事件名
     * @param  {Function} handle 事件处理程序
     * @param  {any} context 事件处理的上下文
     */
    public on(eventName: string,handle: Function,context: any) {
        if(!eventName) return;
        if(!handle || typeof handle !== 'function') return;

        context && handle.bind(context);
        
        if(!this._record[eventName]) {
            this._record[eventName] = [{target: context,handler: handle}];
        } else {
            const handleObj = {
                target: context,
                handler: handle
            }
            this._record[eventName].push(handleObj);
        }
    }

    /**
     * 移除一个事件监听
     * @param  {string} eventName 事件名
     * @param  {Function} handle 事件处理程序
     * @returns void
     */
    public remove(eventName: string,handle: Function): void {
        if(!eventName) return;
        if(!handle || typeof handle !== 'function') return;

        const targetHandleObj = this._record[eventName];
        if(targetHandleObj instanceof Array) {
            let targetIndex = -1;
            targetHandleObj.forEach((h: {target: any, handler: Function},index: number) => {
                if(h.handler === handle) {
                    targetIndex = index;
                }
            });
            if(targetIndex !== -1) {
                targetHandleObj.splice(targetIndex,1);
            }
        }
    }
    

    public removeAllHandler() {
        this._record = {};
    }
}
export const eventManager = new EventManager();
