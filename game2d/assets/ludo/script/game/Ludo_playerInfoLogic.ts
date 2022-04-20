import MessageSoundManager from "../../../Script/CommonScripts/Utils/MessageSoundManager";
import ResourcesManager from "../../../Script/CommonScripts/Utils/ResourcesManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Ludo_playerInfoLogic extends cc.Component {

    
    @property({type:cc.AudioClip})
    countTimeAudio:cc.AudioClip = null;

    private countDown:cc.Node = null;               //倒计时闹钟图片;
    private countTime:cc.Node = null;               //倒计时旋转图片;
    private headMask:cc.Node = null;                //头像节点;
    private userNickName:cc.Label = null;           //用户昵称;
    private isInit:boolean = false;                 //是否初始化了;
    private nowProgress:number = 0;                 //当前进度;   
    private isUpdate:boolean = false;               //是否开启update;   
    private goAway:cc.Node = null;                  //离开标示;
    private countTimeNum:number = 0;                //倒计时时间;
    private countTimeAudioClipNumber:number = -1;             //倒计时音效number;
    private isShowLock:boolean = false;             //是否显示闹钟了;

    start () {
       this.init();
    }

    init(){
        this.isInit = true;
        this.countDown = this.node.getChildByName('Countdown');
        this.countTime = this.node.getChildByName('countTime');
        this.headMask = this.node.getChildByName('headMask');
        this.userNickName = this.node.getChildByName('nameLabel').getComponent(cc.Label);
        this.goAway = this.node.getChildByName('goAway');
    }

    playerCaountTimeAudio(){
        if(this.countTimeAudioClipNumber >= 0){
            cc.audioEngine.stopEffect(this.countTimeAudioClipNumber);
            this.countTimeAudioClipNumber = -1;
        }
        if(MessageSoundManager.audioEngineOn){
            this.countTimeAudioClipNumber = cc.audioEngine.playEffect(this.countTimeAudio,false);

        }
    }

    setShowInfo(data){
        if(!this.isInit){
            this.init();
        }
        console.log("playerinfodata",data);
        
        ResourcesManager.loadHeadImag(data.avatar,data.id,5,(res)=>{
            if(this.node && this.node.active && this.headMask){
                let headSpr = this.headMask.getChildByName('headSpr');
                headSpr.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(res);
                headSpr.scaleX = 64 / headSpr.width;
                headSpr.scaleY = 64 / headSpr.height;
            }
        });
        if(data.status != 'online'){
            this.setleave();
        }
        let nickName = this.subNickName(data.name);
        this.userNickName.string = nickName;
    }

    //开启倒计时;
    playCountTime(){
        this.nowProgress = 0;
        this.countTimeNum = 0;
        this.isUpdate = true;
        this.isShowLock = false;
    }

    //停止倒计时；
    stopCountTime(){
        this.isUpdate = false;
        this.isShowLock = false;
        this.countTime.getComponent(cc.Sprite).fillRange = 1;
        if(this.countTimeAudioClipNumber >= 0){
            cc.audioEngine.stopEffect(this.countTimeAudioClipNumber);
            this.countTimeAudioClipNumber = -1;
        }
    }

    setJoin(){
        this.goAway.active = false;
    }

    setleave(){
        this.goAway.active = true;
    }

    //显示闹钟;
    showAlarmclock(){
        this.isShowLock = true;
        this.countDown.active = true;
        this.playerCaountTimeAudio();
    }

    //隐藏闹钟;
    stopAlarmcLack(){
        this.countDown.active = false;
    }


    subNickName(nameStr:string){
        if(nameStr.length > 8){
            nameStr = nameStr.substring(0,8) + '...';
        }
        return nameStr;
    }

    update(dt){
        if(!this.isUpdate){
            return;
        }
        this.countTime.getComponent(cc.Sprite).fillRange = 1 - this.nowProgress;
        if(this.countTimeNum >= 25){
            if(!this.isShowLock){
                this.showAlarmclock();
            }
        }else{
            this.countTimeNum += dt;
        }
        this.nowProgress += dt/30;
        if(this.nowProgress >= 1){
            this.isUpdate = false;
        }
    }
}
