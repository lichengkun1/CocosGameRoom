

const {ccclass, property} = cc._decorator;

@ccclass
export default class Dominoe_paiLayerLogic extends cc.Component {

    @property(cc.Node)
    selectNodes:cc.Node[] = [];

    start () {

    }

    //获取第一个选择框;
    getIndexSelectNode(index:number){
        return this.selectNodes[index];
    }

    //隐藏所有的选择框;
    hideAllSelectNode(){
        this.selectNodes[0].active = false;
        this.selectNodes[1].active = false;
    }

}
