
cc.Class({
    extends: cc.Component,
    start () {
        var particle = this.node.getComponent(cc.ParticleSystem);
        particle.custom = true;
        particle.positionType = cc.ParticleSystem.PositionType.FREE;
    }
});
