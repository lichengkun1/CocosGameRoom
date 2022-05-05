

const {ccclass, property} = cc._decorator;

@ccclass
export default class expressionLogic extends cc.Component {

    @property(cc.Integer)
    expressionIndex:number = -1;

    start () {
        // this.node.on(cc.Node.EventType.TOUCH_START,(event)=>{
        //     event.stopPropagation();
        //     if(Global.isCanSendExpression && Global.channel){
        //         Global.isCanSendExpression = false;
        //         setTimeout(()=>{
        //             Global.isCanSendExpression = true;
        //         },10000);
        //         let sendData = {
        //             channel:Global.channel.type,
        //             channel_id:Global.channel.id,
        //             id:this.expressionIndex
        //         };
        //         MessageManager.httpResult('post',MessageType.STICKER,sendData,(data)=>{
        //             // //console.log('STICKER data:');
        //             // //console.log(data);
        //         });
        //     }
        // },this);
    }



}
