import MessageManager from "../../Script/CommonScripts/Utils/MessageManager";
import MyEvent from "../../Script/CommonScripts/Utils/MyEvent";
import NDB from "../../Script/CommonScripts/Utils/NDBTS";
import GlobalGameData from "./Global/SFGlobalGameData";

/***
 * 
 * 
 * 赶羊消息管理器，赶羊的特定消息在这里处理
 * 
 */
export class SFMessageManager extends MessageManager {
    public static messageArr = [];
    static continueTimeOut: number = -1;                                        //继续游戏定时器;    
    public static isStartContinue: boolean = false;                             //是否开启重新请求; 


    public static getStatus(roomId) {
        let url = `v1/sf/chatroom/${roomId}/`;
        this.httpResult('get', url, {}, (data) => {
            console.log('getStatus:::');
            console.log(data);
            MyEvent.I.emit('emit_status', { statusData: data });
        });
    }

    //继续游戏，当2.2秒没有收到服务器消息的时候，就调用此方法，主动请求获取服务器消息；
    public static continueGame(number) {
        // console.log('continueGame====??:'+number);
        if (this.continueTimeOut >= 0) {
            clearTimeout(this.continueTimeOut);
            this.continueTimeOut = -1;
        }
        if (this.isStartContinue) {
            this.continueTimeOut = setTimeout(() => {
                let url = `v1/sf/${GlobalGameData.channelId}/continue/`;
                this.httpResult('post', `${url}`, {}, (data) => {
                    // console.log('请求重新获取游戏内socket数据:');
                    // console.log(data);
                    if (data.status == 'ok') {
                        this.continueTimeOut = -1;
                    }
                });
                if (this.continueTimeOut >= 0 && number > 0) {
                    this.continueGame(--number);
                }
            }, 2200);
        }

    }

    public static clearStartContinue() {
        if (this.continueTimeOut >= 0) {
            clearTimeout(this.continueTimeOut);
            this.continueTimeOut = -1;
        }
    }

     //发送表情的管理；
     public static sendEmojiMessage(type: string, svga?: string) {
        if (type == 'show') {
            NDB.gameRoom('show_bottom_emoji', null, null);
        } else {
            NDB.gameRoom('send_emoji', type, null, svga);
        }
    }
}   