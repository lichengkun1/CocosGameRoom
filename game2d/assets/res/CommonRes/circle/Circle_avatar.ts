const { ccclass, property } = cc._decorator;

@ccclass
export default class CircleAvatar extends cc.Component {

  start() {
    this.node.getComponent(cc.Sprite).getMaterial(0).setProperty('wh_ratio', this.node.width / this.node.height);
  }
}
