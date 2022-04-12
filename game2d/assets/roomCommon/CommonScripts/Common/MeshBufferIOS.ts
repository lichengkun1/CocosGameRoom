const isIos14Or15 = /iPhone OS 14/.test(window.navigator.userAgent) ||  /iPhone OS 15/.test(window.navigator.userAgent);
console.log("是否是ios14以上的设备",isIos14Or15);

const isIOS14Device = cc.sys.os === cc.sys.OS_IOS && cc.sys.isBrowser && cc.sys.isMobile && isIos14Or15;
console.log(isIOS14Device);
if (isIOS14Device) {
    //@ts-ignore
    cc.MeshBuffer.prototype.checkAndSwitchBuffer = function (vertexCount) {
        if (this.vertexOffset + vertexCount > 65535) {
            this.uploadData();
            this._batcher._flush();
        }
    };
    //@ts-ignore
    cc.MeshBuffer.prototype.forwardIndiceStartToOffset = function () {
        this.uploadData();
        this.switchBuffer();
    };
}

/** 音频在ios端的webView切换前后台出现的暂停或者恢复音频失败 */
if (cc.sys.isBrowser && cc.sys.os === cc.sys.OS_IOS) {
    cc.game.on(cc.game.EVENT_GAME_INITED, () => {
        cc.game.on(cc.game.EVENT_SHOW, () => {
            //@ts-ignore
            cc.sys.__audioSupport.context.resume();
        });

        cc.game.on(cc.game.EVENT_HIDE, () => {
            //@ts-ignore
            cc.sys.__audioSupport.context.suspend();
        });
    })
}
