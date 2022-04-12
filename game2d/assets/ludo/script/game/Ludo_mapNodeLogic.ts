
const {ccclass, property} = cc._decorator;

@ccclass
export default class Ludo_mapNodeLogic extends cc.Component {

    private indexLabel:cc.Label = null;
    private _index:string = '';

    start () {
        this.init();
    }

    init(){
        this.indexLabel = this.node.getChildByName('indexLabel').getComponent(cc.Label);
        this.indexLabel.string = this._index;

        let arr = this._index.split(',');
        let tran = Number(arr[0]);
        let por = Number(arr[1]);

        if(tran < 6 && por < 6 || por == 1 && tran < 8 || por > 0 && por < 6 && tran == 7){
            this.node.color = cc.color(41,104,246);
        }else if(tran > 8 && por < 6 || por == 7 && tran > 8 && tran < 14 || tran == 13 && por > 5 && por < 7){
            this.node.color = cc.color(224,186,63);
        }else if(tran < 6 && por > 8 || tran == 1 && por > 7 && por < 9 || por == 7 && tran >0 && tran < 6){
            this.node.color = cc.color(255,0,0);
        }else if(tran > 8 && por > 8 || tran == 7 && por > 8 && por < 14 || por == 13 && tran > 7 && tran < 9){
            this.node.color = cc.color(84,182,54);
        }else if(tran >= 6 && tran <= 8 && por >= 6 && por <= 8){
            this.node.color = cc.color(255,255,0);
        }
    }

    set index(i:string){
        this._index = i;
    }

    get index():string{
        return this._index;
    }

    

}
