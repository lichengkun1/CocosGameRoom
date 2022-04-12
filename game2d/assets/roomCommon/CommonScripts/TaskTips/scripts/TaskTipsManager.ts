import { GameConfig } from "../../../../../gameConfig";
import { GameType } from "../../Utils/MessageData";
import MessageManager from "../../Utils/MessageManager";
import MessageType from "../../Utils/MessageType";
import MyEvent from "../../Utils/MyEvent";
import NDB from "../../Utils/NDBTS";
import ResourcesManager from "../../Utils/ResourcesManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TaskTipsManager extends cc.Component {
    @property(cc.Prefab)
    prefab: cc.Prefab = null;

    TaskArr: Array<any> = new Array<any>();
    private readonly ShowTaskTipEvent = 'showTaskTipEvent';
    private isPlaying = false;
    private TaskTip: cc.Node;
    private icon: cc.Sprite;
    private Progress: cc.ProgressBar;
    private titleLabel: cc.Label;
    private taskProgressLabel: cc.Label;
    private masklight: cc.Node;

    private deeplink: string = '';
    onLoad() {
        let vcode = MessageManager.getUrlParameterValue('vcode')
        if ((cc.sys.os == cc.sys.OS_IOS && Number(vcode) < 18000) || (cc.sys.os == cc.sys.OS_ANDROID && Number(vcode) < 17900)) {
            return;
        }
        this.InitNode();
        cc.game.addPersistRootNode(this.node);
        MyEvent.I.on(MessageType.MESSAGE_TASK_COMPLETE, this.AddTaskArr.bind(this), this.node);
        MyEvent.I.on(this.ShowTaskTipEvent, this.showTaskTip.bind(this), this.node);
    }
    InitNode() {
        this.TaskTip = this.node.getChildByName('TaskTip')
        this.icon = this.TaskTip.getChildByName('icon').getComponent(cc.Sprite);
        this.Progress = this.TaskTip.getChildByName('Progress').getComponent(cc.ProgressBar);
        this.titleLabel = this.TaskTip.getChildByName('titleLabel').getComponent(cc.Label);
        this.taskProgressLabel = this.TaskTip.getChildByName('taskProgressLabel').getComponent(cc.Label);
        this.masklight = this.TaskTip.getChildByName('masklight');
    }

    AddTaskArr(data) {
        this.TaskArr.push(data);
        MyEvent.I.emit(this.ShowTaskTipEvent);
    }

    showTaskTip() {
        if (this.isPlaying || !this.TaskArr[0]) {
            return;
        }
        this.isPlaying = true;
        let iconurl = this.TaskArr[0].data.data.icon;
        this.deeplink = this.TaskArr[0].data.data.deeplink;
        this.TaskTip.off(cc.Node.EventType.TOUCH_START,this.addLogOnTouchTip,this);
        this.TaskTip.on(cc.Node.EventType.TOUCH_START, this.addLogOnTouchTip,this);
        ResourcesManager.loadImage(iconurl, 2, (res: cc.Texture2D) => {
            if (this.icon && res)
                this.icon.spriteFrame = new cc.SpriteFrame(res);
        });

        let total = Number(this.TaskArr[0].data.data.total);
        let after_adding = Number(this.TaskArr[0].data.data.after_adding);
        let before_adding = Number(this.TaskArr[0].data.data.before_adding);
        let oldnumber = before_adding / total;
        let newnumber = after_adding / total;
        let lerp = (newnumber - oldnumber) / 50;
        this.taskProgressLabel.string = before_adding + "/" + total;
        this.Progress.progress = oldnumber;
        let lang = MessageManager.getUrlParameterValue('ui_lang')
        if (lang == 'en') {
            this.titleLabel.string = this.TaskArr[0].data.data.desc.en;
        } else {
            this.titleLabel.string = this.TaskArr[0].data.data.desc.country;
        }
        cc.tween(this.TaskTip)
            .to(1, { position: cc.v3(0, 0, 0) }, { easing: 'expoOut' })
            .delay(0.5)
            .call(() => {
                let e = () => {
                    if (this.Progress.progress <= newnumber) {
                        this.Progress.progress = this.Progress.progress + lerp;
                    } else {
                        this.unschedule(e);
                        this.Progress.progress = newnumber;
                        if (after_adding == total) {
                            this.TaskTip.addChild(cc.instantiate(this.prefab));
                            cc.tween(this.masklight)
                                .to(0.75, { opacity: 255 })
                                .to(0.75, { opacity: 1 })
                                .start()
                        }
                        this.taskProgressLabel.string = after_adding + "/" + total;
                        cc.tween(this.TaskTip)
                            .delay(1.5)
                            .to(1, { position: cc.v3(750, 0, 0) }, { easing: 'expoIn' })
                            .call(() => {
                                this.TaskArr.splice(0, 1);
                                this.TaskTip.x = -750;
                                this.isPlaying = false;
                                MyEvent.I.emit(this.ShowTaskTipEvent);
                            })
                            .start();
                    }
                }
                this.schedule(e, 0.01);
            }).start();
    }

    /** 点击成就框打点 */
    addLogOnTouchTip() {
        NDB.run('openDeepLink', { link: this.deeplink });

        let obj = {
            eventName: "click_game_task_tips",
            pos_name: '',
            tab: '',
            type_name: '',
        }
        
        NDB.sendAutoJoinEvent(obj);
    }

    TestFunc() {
        let data = {
            "id": "58cc8674-8aac-42ea-9f8a-e41509be4fc6",
            "app": "funshare",
            "type": "custom",
            "method": "task_complete",
            "sender": 41151493,
            "channel": {
                "id": "60e5733e7c916003cde5afad",
                "type": "dominoe"
            },
            "data": {
                "desc": {
                    "country": "Selesaikan 4 Domino",
                    "en": "Complete 4 Domino"
                },
                "icon": "https://static.funshareapp.com/atlas_op_common_file/1601102968422206.png",
                "total": 4,
                "after_adding": 4,
                "before_adding": 2,
                "deeplink": "yoyo://home_page/home?tab=gaming\u0026ctab=dominoes"
            }
        }
        this.AddTaskArr({ data: data });
    }
}
