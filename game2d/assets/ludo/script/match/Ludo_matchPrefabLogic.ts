
import Ludo_MessageType from '../Utils/Ludo_MessageType';
import MyEvent from '../../../../Common/CommonScripts/Utils/MyEvent';
import Global from '../Global/Ludo_GlobalGameData';
import MessageManager from '../../../../Common/CommonScripts/Utils/MessageManager';
import ResourcesManager from '../../../../Common/CommonScripts/Utils/ResourcesManager';

const {ccclass, property} = cc._decorator;

@ccclass
export default class Ludo_matchPrefabLogic extends cc.Component {

    @property(cc.Node)
    OvalOtherNodeArr:cc.Node[] = [];                //其他人;
    private nodeType:number[] = [0,0,0,0];          //当前数据状态，用于记录上一帧的时候是否与现在是一致的。0代表没数据，1代表有数据; 
    private is2P:boolean = false;                   //是否为1v1;
    private canceButton:cc.Node = null;             //取消匹配按钮;
    private oldPlayerData = {};                     //旧的匹配数据;
    private isChangeScene:boolean = false;          //是否在加载场景中;

    
    start () {
        this.node.on(cc.Node.EventType.TOUCH_START,(event)=>{
            event.stopPropagation();
        },this);

        //监听安卓返回键;
        MyEvent.I.on('androidGoback',()=>{
            MyEvent.eventType = MyEvent.nowShowLayer.HALL;
            this.exitMatch_cakkback();
        },this.node);

        this.canceButton = this.node.getChildByName('machBG').getChildByName('canceButton');
        MyEvent.I.on('emit_message',(eData)=>{
            
            Global.channel = eData.data.channel;
            
            let method = eData.data.method;
            if(method){
                switch(method){
                    case 'ludo_matching':
                        this.setNodeShow(eData.data.data);
                        break;
                    case 'ludo_playing':
                        MessageManager.socketDatas.push(eData);
                        this.setNodeShow(eData.data.data);
                        this.changeScene();
                        break;
                }
            }
        },this.node);

        if(this.is2P){
            this.OvalOtherNodeArr[0].x = -149;
            this.OvalOtherNodeArr[0].y = 50;
            this.OvalOtherNodeArr[1].x = 149;
            this.OvalOtherNodeArr[1].y = 50;
            this.OvalOtherNodeArr[2].active = false;
            this.OvalOtherNodeArr[3].active = false;
        }else{
            this.OvalOtherNodeArr[0].x = -149;
            this.OvalOtherNodeArr[0].y = 159;
            this.OvalOtherNodeArr[1].x = 149;
            this.OvalOtherNodeArr[1].y = 159;
            this.OvalOtherNodeArr[2].x = -149;
            this.OvalOtherNodeArr[2].y = -145;
            this.OvalOtherNodeArr[3].x = 149;
            this.OvalOtherNodeArr[3].y = -145;
        }     
    }

    changeScene(){
        if(this.isChangeScene){
            return;
        }
        this.isChangeScene = true;
        this.canceButton.active = false;
        MyEvent.I.emit('changeScene');
        //延时1S切换场景;
        setTimeout(()=>{
            cc.director.loadScene("gameScene");
        },3000);
    }

    set gameType(type:boolean){
        this.is2P = type;
    }

    //收到服务器消息;
    onMessage(mDdta){
        if(!mDdta){
            return;
        }
        mDdta = JSON.parse(mDdta);
        this.setNodeShow(mDdta.players);
    }

    setNodeShow(data){
        let players = data.players;
        let keys = Object.keys(players);
        let oldKeys = [];

        if(this.oldPlayerData){
            oldKeys = Object.keys(this.oldPlayerData);
        }
      
        let keyLen = keys.length;
        let oldKeyLen = oldKeys.length;
        let len = 0;
        let dataKeys = null;
        if(keyLen > oldKeyLen){
            len = keyLen;
            dataKeys = keys;
        }else{
            len = oldKeyLen;
            dataKeys = oldKeys;
        }
        let addNum = 0;
        for(let i = 0;i < len;i++){
            let key = dataKeys[i];
            let index = Number(key) - 1;
            let num = i + addNum;
            //这次收到的有，上次是没有的，说明是新加入的;
            if(players[key] && !this.oldPlayerData[key]){
                this.updateNodeShow(this.OvalOtherNodeArr[i],i,players[key]);
            }//新收到数据没有数据，旧的有，说明取消匹配了;
            else if(!players[key] && this.oldPlayerData[key]){
                this.updateNodeShow(this.OvalOtherNodeArr[i],i,null);
            }
            if(Global.is2P){
                addNum = 1;
            }
        }

        this.oldPlayerData = data.players;
    }

    //更新节点状态;
    updateNodeShow(node:cc.Node,index,showData){
        let showBG = node.getChildByName('showBG');
        let showLabel = node.getChildByName('showLabel').getComponent(cc.Label);
        let headMask = node.getChildByName('headMask');
        //需要从loading变为显示状态;
        if(showData){
            showLabel.string = showData.name;
            ResourcesManager.loadHeadImag(showData.avatar,showData.id,5,(res)=>{
                if(this.node && this.node.active && headMask){
                    showBG.active = true;
                    headMask.active = true;
                    let headSprNode = headMask.getChildByName('headSpr');
                    let headSpr = headSprNode.getComponent(cc.Sprite);
                    headSpr.spriteFrame = new cc.SpriteFrame(res);
                    headSprNode.scaleX = 192 / headSprNode.width;
                    headSprNode.scaleY = 192 / headSprNode.height;
                }
            });
        }else{
            showBG.active = false;
            headMask.active = false;
            showLabel.string = `PLAYER ${index + 1}`;
        }
    }

    //退出匹配;
    exitMatch_cakkback(){
        let sendData = {};
        if(this.is2P){
            sendData['mode'] = '1v1';
        }else{
            sendData['mode'] = '4p';
        }
        MessageManager.httpResult('post',Ludo_MessageType.CANCELMATCH,sendData,(data)=>{
            if(data.status == 'OK'){
                console.log('取消匹配成功！！！');
            }
        });
        //调用一个退出接口;
        this.node.destroy();
    }

    onDestroy(){
        //监听服务器广播;
        MyEvent.I.remove('emit_message',this.node);
        MyEvent.I.remove('androidGoback',this.node);
    }
}
