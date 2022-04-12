
import MyEvent from '../../../../Common/CommonScripts/Utils/MyEvent';
const {ccclass, property} = cc._decorator;

@ccclass
export default class Ludo_tutorialPrefabLogic extends cc.Component {

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START,(event)=>{
            // event.stopPropagation();
        },this);

        //监听安卓返回键;
        MyEvent.I.on('androidGoback',()=>{
            //退出确认；
            MyEvent.eventType = MyEvent.nowShowLayer.HALL;
            this.node.destroy();
        },this.node);
    }

    exit_callback(){
        this.node.destroy();
    }

    onDestroy(){
        MyEvent.I.remove('androidGoback',this.node);
    }
}
