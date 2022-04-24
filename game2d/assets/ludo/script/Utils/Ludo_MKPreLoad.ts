import { resolve } from 'path';
import { GameConfig } from '../../../gameConfig';
import { resourceManager } from '../../../Script/common/managers/resourceManager';
import Global from '../Global/Ludo_GlobalGameData';


const { ccclass, property } = cc._decorator;

@ccclass
export default class Ludo_MKPreLoad extends cc.Component {


    start() {
        Global.preLoadObj = {};
    }

    static preLoadRes(equipment) {
        let board = equipment.game_ludo_board;
        let dice = equipment.game_ludo_dice;
        let role = equipment.game_ludo_role;

        //棋盘;
        if (board === 585) {
            if (!Global.preLoadObj.hasOwnProperty('isLandCheckerboard')) {
                Global.preLoadObj['isLandCheckerboard'] = false;
            }
            if (!Global.preLoadObj['isLandCheckerboard']) {
                Global.preLoadObj['isLandCheckerboard'] = true;
                this.preLoadPlist('isLandCheckerboard', 'island_checkerboardPlist');
                this.preLoadTexture('isLandCheckerboard/island_bg');
            }
        } else if (board === 586) {
            if (!Global.preLoadObj.hasOwnProperty('chengbaocheckerboard')) {
                Global.preLoadObj['chengbaocheckerboard'] = false;
            }
            if (!Global.preLoadObj['chengbaocheckerboard']) {
                Global.preLoadObj['chengbaocheckerboard'] = true;
                this.preLoadDragonBones('chengbaocheckerboard/background_chengbao');
                this.preLoadTexture('chengbaocheckerboard/knightBG');
            }
        }

        //骰子；
        if (dice === 591) {
            Ludo_MKPreLoad.SetDice('knightDice', 'knight_shaizi');
        } else if (dice === 592) {
            Ludo_MKPreLoad.SetDice('isLandice', 'island_shaizi');
        } else if (dice === 593) {
            Ludo_MKPreLoad.SetDice('dice_dragon_ball', 'shaizi_long');
        } else if (dice === 594) {
            Ludo_MKPreLoad.SetDice('dice_electronic', 'shaizi_electronic');
        } else if (dice === 595) {
            Ludo_MKPreLoad.SetDice('dice_starry_sky', 'shaizi_xingxing');
        } else if (dice === 596) {
            Ludo_MKPreLoad.SetDice('dice_warrior', 'shaizi_zhanzheng');
        }

        //棋子;
        if (role === 589) {
            if (!Global.preLoadObj.hasOwnProperty('knightPiece')) {
                Global.preLoadObj['knightPiece'] = false;
            }
            if (!Global.preLoadObj['knightPiece']) {
                Global.preLoadObj['knightPiece'] = true;
                this.preLoadDragonBones('knightPiece/knight_blue');
                this.preLoadDragonBones('knightPiece/knight_green');
                this.preLoadDragonBones('knightPiece/knight_red');
                this.preLoadDragonBones('knightPiece/knight_yellow');
            }
        } else if (role === 588) {
            if (!Global.preLoadObj.hasOwnProperty('isLandWomenPiece')) {
                Global.preLoadObj['isLandWomenPiece'] = false;
            }
            if (!Global.preLoadObj['isLandWomenPiece']) {
                Global.preLoadObj['isLandWomenPiece'] = true;
                this.preLoadDragonBones('isLandWomenPiece/islandWoman_blue');
                this.preLoadDragonBones('isLandWomenPiece/islandWoman_green');
                this.preLoadDragonBones('isLandWomenPiece/islandWoman_red');
                this.preLoadDragonBones('isLandWomenPiece/islandWoman_yellow');
            }
        } else if (role === 587) {
            if (!Global.preLoadObj.hasOwnProperty('isLandManPiece')) {
                Global.preLoadObj['isLandManPiece'] = false;
            }
            if (!Global.preLoadObj['isLandManPiece']) {
                Global.preLoadObj['isLandManPiece'] = true;
                this.preLoadDragonBones('isLandManPiece/islandMan_blue');
                this.preLoadDragonBones('isLandManPiece/islandMan_green');
                this.preLoadDragonBones('isLandManPiece/islandMan_red');
                this.preLoadDragonBones('isLandManPiece/islandMan_yellow');
            }
        } else if (role === 590) {
            if (!Global.preLoadObj.hasOwnProperty('princessPiece')) {
                Global.preLoadObj['princessPiece'] = false;
            }
            if (!Global.preLoadObj['princessPiece']) {
                Global.preLoadObj['princessPiece'] = true;
                this.preLoadDragonBones('princessPiece/princess_blue');
                this.preLoadDragonBones('princessPiece/princess_green');
                this.preLoadDragonBones('princessPiece/princess_red');
                this.preLoadDragonBones('princessPiece/princess_yellow');
            }
        }

    }
    //
    private static SetDice(diceName: string, diceUrl: string) {
        if (!Global.preLoadObj.hasOwnProperty(diceName)) {
            Global.preLoadObj[diceName] = false;
        }
        if (!Global.preLoadObj[diceName]) {
            Global.preLoadObj[diceName] = true;
            this.preLoadDragonBones(diceName + "/" + diceUrl);
        }
    }

    //加载棋子资源;
    preLoadPieceRes() {

    }

    //加载骰子资源；
    preLoadDiceRes() {

    }

    //记载龙骨资源动画;
    static preLoadDragonBones(path: string) {
        this.preLoad(`${path}_ske`, dragonBones.DragonBonesAsset, 2, (res) => {
            this.preLoad(`${path}_tex`, dragonBones.DragonBonesAtlasAsset, 2, (eRes) => {
            });
        });
    }

    //加载图片；
    static preLoadTexture(path) {
        this.preLoad(path, cc.SpriteFrame);
    }

    //预加载plist;
    static preLoadPlist(path, name) {
        let urlPlist = `${path}/${name}`;
        this.preLoad(urlPlist, cc.SpriteAtlas);
    }

    static preLoad<T extends cc.Asset>(url: string, type: typeof cc.Asset, count: number = 2, cb?) {
        resourceManager.loadAssetInBundle(`resources_${GameConfig.gameName}/store/${url}`,type,GameConfig.gameName,null).then((res) => {
            cb && cb(res);
        }).catch(err => {
            if (count >= 0) {
                this.preLoad(url, type, --count);
            }
        });
        
    }
}
