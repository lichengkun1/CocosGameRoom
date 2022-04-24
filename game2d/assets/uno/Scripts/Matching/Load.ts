import { getUrlParameterValue } from "../../../Script/common/utils/util";
import MyEvent from "../../../Script/CommonScripts/Utils/MyEvent";
import { LanguageManager } from "../Common/Language/LanguageManager";
import { logManager } from "../Common/LogManager";
import SoundManager from "../Common/Sound/SoundManager";
import GlobalGameData, { RoomType } from "../GlobalGameData";

const { ccclass, property } = cc._decorator;

@ccclass
export class Load extends cc.Component {

    private readonly JsonDataPath = "JsonDatas/LevelData";
    private readonly MainScenePath = "MainScene";
    private readonly GameScenePath = "GameScene";

    public static readonly allloadIndex: number = 2;

    public static isFirst: boolean = true;
    onLoad() {
        let isLobby = getUrlParameterValue('is_lobby');
        if(isLobby == 'true') {
            GlobalGameData.roomType = RoomType.SINGLE;
            logManager.roomType = "Lobby";
        } else {
            GlobalGameData.roomType = RoomType.ROOM;
            logManager.roomType = "Room";
        }
        
        this.Init();
    }
    Init() {
        if (!Load.isFirst) return;
        Load.isFirst = false;
        if (Load.isLoadOver == true) {
            MyEvent.I.emit('LoadResOver');
        } else {
            this.LoadRes();
        };
    }

    /**启动加载资源 */
    private LoadRes() {
        function getUrlParameterValue(name) {
            let href = window.location.href;
            var query = href.substring(1);
            var vars = query.split("?");
            if (!vars[1]) {
              return '';
            }
            var argment = vars[1].split("&");;
            for (var i = 0; i < argment.length; i++) {
              var pair = argment[i].split("=");
              if (pair[0] == name) { return pair[1]; }
            }
            return '';
          }
      
        let ui_lang = getUrlParameterValue('ui_lang');
        // ui_lang = 'ar';
        SoundManager.LoadSound();
        cc.loader.loadResDir('lang',cc.JsonAsset,(err,res: cc.JsonAsset[]) => {
            // console.log('err is ',err);
            if(err) return;
            res.forEach(item => {
                if(item.name === ui_lang) {
                    LanguageManager.curLangJson = item.json;
                    console.log("langJson is ",LanguageManager.curLangJson);
                }
            });
        })
        // MyEvent.I.emit(EventType.LoadResStart);
        this.schedule(this.LoadSlider, 0.015);
        this.LoadScenes();
        this.LoadJson();

    }

    /**加载界面的滑动条结束事件 结束时派发EventType.LoadResOver的消息 */
    private LoadSlider(): void {
        if (this.LoadOver()) {
            Load.isLoadOver = true;
            // MyEvent.I.emit(EventType.LoadResOver);
            this.unschedule(this.LoadSlider);
        }

    }
    /**判断是否加载完毕，并改变进度条的长度 */
    private LoadOver(): boolean {
        if (Load.loadIndex >= Load.allloadIndex) {
            return true;
        } else {
            return false;
        }
    }
    /**预加载场景 */
    private LoadScenes() {
        cc.director.preloadScene(this.GameScenePath, () => {
            Load.loadIndex++;
        });
    }
    /**加载json文件 */
    private LoadJson() {
        // cc.loader.load(this.JsonDataPath, function (err: any, assets: any) {
        //     if (err) {
        //         console.error(err);
        //         return;
        //     }
        //     GameData.GameSceneData = assets.json.Level;
        //     LoadManager.loadIndex++;
        //     console.log(GameData.GameSceneData);
        // });
    }






    static isLoadOver: boolean = false;
    static loadIndex: number = 0;
    private index = 0;



}
