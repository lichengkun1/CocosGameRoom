// https://xmanyou.com/cocos-creator-jie-tu-gong-neng-dai-ma/
// 截图组件 (如果没有提前添加Camera组件，则会自动添加一个默认参数的Camera)
// 语言：Typescript 
// Cocos Creator 版本： 2.0.5
// 使用方法：
//   1. 在场景里添加一个Node, 把这个组件拖进去
//   2. 在需要截图的地方，import, 然后调用：ScreenShotNode.take()

import MessageManager from "../../../Script/CommonScripts/Utils/MessageManager";
import Dominoe_settingLayerLogic from "../game/Dominoe_settingLayerLogic";

// Screenshot component
// typescript
// Tested on Cocos Creator 2.0.5
// Usage: 
//    1. add node with this component in your scene
//    2. import and call ScreenShotNode.take() 

const {ccclass, property} = cc._decorator;

@ccclass
export default class Dominoe_ScreenShotNode extends cc.Component {
    static _inst:Dominoe_ScreenShotNode;
    private isShare:boolean = false;


    // LIFE-CYCLE CALLBACKS:
    _camera:cc.Camera;
    _texture:cc.RenderTexture;
    _sprite:cc.Sprite;

    // 初始化/Initialize
    onLoad () {
        Dominoe_ScreenShotNode._inst = this;
        // 设置相机参数 Get/Add Camera Component 
        let camera = this.getComponent<cc.Camera>(cc.Camera);
        if(!camera){
            camera = this.addComponent<cc.Camera>(cc.Camera);
        }

        // this._sprite = this.node.getChildByName('shootSprite').getComponent(cc.Sprite);
        
        camera.enabled = false; // 避免自动渲染, Disable auto render
        
        // 截图的缩放比例, Zoom ratio       
        let zoom = 1;
        
        // 截图的尺寸，本例是640x640的正方形截图
        // 如果是全屏，则为 cc.winSize.width, cc.winSize.height
        // Set Screenshot size, in this case 640x640
        // For full screen, use cc.winSize
          
        let width = cc.winSize.width;  // cc.winSize.width
        let height = cc.winSize.height; // cc.winSize.height
        let size = cc.size(width*zoom, height*zoom);
        
        // 截图的中心点就是摄像机节点的位置
        // The center of screenshot
        let origin = cc.v2(0, 0);
        
        camera.zoomRatio = zoom; // 设置缩放, set zoomRatio
        
        // 设置目标渲染纹理
        // Create and set target renderTexture for our camera
        let texture = new cc.RenderTexture();
        // texture.initWithSize(size.width, size.height,32);  // 截图矩形的尺寸, Size
        texture.initWithSize(size.width, size.height,cc.gfx.RB_FMT_S8);
        this.node.setPosition(origin);                  // 截图矩形的中心点, Center Position

        camera.targetTexture = texture;
        
        // 缓存，备用
        // Save for later usage
        this._camera = camera;
        this._texture = texture;
        
        // 用于显示的sprite组件，如果要测试这个，需要添加sprite组件
        // If you want to show screenshot on this node, add a Sprite component
        // this._sprite = this.node.getChildByName('shotSprite').getComponent<cc.Sprite>(cc.Sprite);

        // var newframe = new cc.SpriteFrame(this._texture);
        // this._sprite.spriteFrame = newframe;
    }

    shot(){
        if(this.isShare){
            return;
        }
        this.isShare = true;
        this.node.getComponent(Dominoe_settingLayerLogic).shareHideButton();
        // 执行一次 render，将所渲染的内容渲染到纹理上
        // Call Camera.render(<root_node>) to take a screenshot
        this._camera.render(undefined);
        // 到这里，截图就已经完成了
        // done
        

        // 接下去，可以从 RenderTexture 中获取数据，进行深加工
        // further process with the screenshot data
          
        let texture = this._texture;
        let data = texture.readPixels();

        let width = texture.width;
        let height = texture.height;

        // Converting to base64 data
        // 转为 base64 数据
        let canvas = document.createElement('canvas'); 
        // document.body.appendChild(btn); // 没有添加到body上，不用担心内存泄漏

        let ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;

        // 1维数组转2维
        // 同时做个上下翻转
        let rowBytes = width * 4;
        for (let row = 0; row < height; row++) {
            let srow = height - 1 - row;
            let imageData = ctx.createImageData(width, 1);
            let start = srow*width*4;
            for (let i = 0; i < rowBytes; i++) {
                imageData.data[i] = data[start+i];
            }

            ctx.putImageData(imageData, 0, row);
        }

        let dataUrl = canvas.toDataURL("image/jpeg");
        // 显示/Show
        this.showTexture(dataUrl);
    }

    // 显示当前截图
    // 其实也可以直接用rendertexture来作为SpriteFrame的纹理
    showTexture(dataUrl){        
        var img = new Image();
        img.src = dataUrl;
        img.style.position = 'absolute';
        img.style.width = '100%';
        document.body.appendChild(img);
        var self = this;
        img.onload = function(){
           setTimeout(() => {
            self.node.getComponent(Dominoe_settingLayerLogic).shareShowButton();
            MessageManager.renderTextureShare((event)=>{
                document.body.removeChild(img);
            });
           }, 2000);
        }
    }
}
