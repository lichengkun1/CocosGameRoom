//消息处理类
export default class MyEvent {
    //界面类型;
    public static nowShowLayer = {
        NONE:0,
        HALL:1,
        HALLQUIT:2,
        GAMEQUIT:3,
        TUTORIAL:4,
        MATCH:5,
        GAME:6
    };
    public static eventType = MyEvent.nowShowLayer.NONE;
        list ={};
        //注册消息
        on(key,func,node) {
            if(this.list[key] == null){
                this.list[key] =[];
            }
            let d:any = {};
            d.func =func;
            d.node = node;
            this.list[key].push(d);
        }
        //移除一个消息
        remove(key,node) {
            if(this.list[key]){
                let data = this.list[key];
                for(let i=0; i<data.length;i++){
                    if(data[i].node == node)
                    {
                            data.splice(i,1);
                            --i;
                    }
                }
            }
        }
        //移除node所有消息
        removeByNode(node) {
            for ( let p in this.list ){ 
                let data = this.list[p];
                for(let i=0; i<data.length;i++){
                    if(data[i].node == node)
                    {
                        data.splice(i,1);
                        --i;
                    }
                }
            } 
        }
        //移除key注册的所以消息
        removeByKey(key) {
            delete  this.list[key];
        }
        //遍历通知消息
        emit (key: string, arg:any = null) {
            // cc.log('遍历通知消息 key:::',key);
            // cc.log('遍历通知消息',this.list);
            if(this.list[key]){
                let funcs = this.list[key].concat();
                for(let i=0;i<funcs.length;i++){
                    if (funcs[i].node && cc.isValid (funcs[i].node)) {
                        funcs[i].func(arg,funcs[i].node);
                    }
                }
            }
        }

        public static singleton:MyEvent;
        public static get I(): MyEvent{
            if(!this.singleton){
                this.singleton = new MyEvent();
            }
            return this.singleton;
        }
}

// window.MKEventDispatch = window.MKEventDispatch || MKEventDispatch;

