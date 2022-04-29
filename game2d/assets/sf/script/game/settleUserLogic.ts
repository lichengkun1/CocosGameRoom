import MessageManager from "../../../Script/CommonScripts/Utils/MessageManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class settleUserLogic extends cc.Component {

    private crown:cc.Node = null;                                   //皇冠；             
    private headIcon:cc.Node = null;                                //头像；
    private damageLabel:cc.Label = null;                            //伤害值；
    private nickNameLabel:cc.Label = null;                          //昵称；
    private playerId:number = -1;                                   //头像展示的用户ID;
    
    start () {
        // this.init();
        this.node.on(cc.Node.EventType.TOUCH_START,()=>{
            if(this.playerId > 0){
                MessageManager.showPlayerInfo(this.playerId);
            }
        },this);
    }

    init(){
        this.crown = this.node.getChildByName('crown');
        this.headIcon = this.node.getChildByName('headMask').getChildByName('headIcon');
        this.damageLabel = this.node.getChildByName('damageLabel').getComponent(cc.Label);
        this.nickNameLabel = this.node.getChildByName('nickNameLabel').getComponent(cc.Label);
    }

    setPlayerId(id){
        this.playerId = id;
    }

    getPlayerId(d){
        return this.playerId;
    }


    

}
