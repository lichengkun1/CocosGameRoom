/**
 * 
 * 弹窗管理器
 * 
 */

 import BasePanel, { PanelType } from "../ui/basePanel";
 import ToastPanel from "../ui/toastPanel";
 import { debugLog } from "../utils/util";
 import { resourceManager } from "./resourceManager";
 
 /** 游戏层级 */
 export enum Layers {
     /** 游戏界面层 */
     GAMELAYER       = 1,
     /** 弹窗层 */
     TOASTLAYERONE   = 10,
     /** 二级弹窗层 */
     TOASTLAYERTWO   = 15,
     /** 三级弹窗 */
     TOASTLAYERTHREE = 18,
     /** 视频层 */
     VIDEOLAYER      = 20,
 
 }
 
 export enum ToastBtnType {
     /** 弹窗层没有按钮 */
     NONE,
     /** 弹窗层有一个按钮 */
     ONE,
     /** 弹窗层有二个按钮 */
     TWO
 }
 
 export class ToastManager {
     /** 当前运行的场景 弹窗是在该节点进行添加 */
     private _canvas: cc.Node = null;
 
     private _toastRoot: cc.Node = null;
 
     public set toastRoot(node: cc.Node) {
         this._toastRoot = node;
     }
 
     public get toastRoot() {
         return this._toastRoot;
     }
 
     private _init() {
         this._canvas = cc.director.getScene().getChildByName('Canvas');
     }
 
     /**
      * 添加弹窗
      * @param  {string} toastUrl 弹窗资源的url
      * @param  {string} bundleName bundle名字
      * @param  {Layers} toastLayer 弹窗层级
      * @param  {PanelType} panelType 面板类型
      * @param  {ToastBtnType=ToastBtnType.TWO} tostBtnType 弹窗按钮类型 默认两个按钮
      * @param  {boolean=true} removeChild 是否移除弹窗根节点的所有子节点 默认true
      * @returns Promise
      */
     public async addToast<T extends BasePanel>(toastUrl: string,bundleName: string,toastLayer: Layers,panelType: PanelType,toastBtnType: ToastBtnType = ToastBtnType.TWO,removeChild: boolean = true): Promise<BasePanel> {
         this._init();
         if(!this._canvas) {
             console.warn('添加的弹窗父节点不存在');
             return null;
         }
 
         let toastPrefab = await resourceManager.loadAseetByBundleName(toastUrl,cc.Prefab,bundleName) as cc.Prefab;
         if(!toastPrefab) {
             console.warn('弹窗预制体为null');
             return null;
         }
 
         const toastRoot = this._checkToastRoot();
         if(removeChild) toastRoot.removeAllChildren();
         let toast = cc.instantiate(toastPrefab);
         const toastComp = toast.addComponent(panelType === PanelType.TOAST_WITHBTN ? ToastPanel : BasePanel);
         if(toastComp instanceof ToastPanel) {
             toastComp.toastBtnType = toastBtnType;
         }
 
         toast.active = true;
         toast.setPosition(cc.v2(0));
         // 根节点下添加弹窗预制体
         toastRoot.addChild(toast);
         toast.zIndex = toastLayer;
         
         debugLog('添加弹窗完毕',this._canvas);
         return toast.getComponent(BasePanel);
     }
 
 
     /**
      * 
      * 检查Canvas节点下是否存在toast节点 不存在添加一个弹窗的根节点
      * @returns cc
      * 
      */
     private _checkToastRoot(): cc.Node {
         let canvasLen = this._canvas.childrenCount;
         if(!this._canvas.getChildByName('toast')) {
             let toastRoot = new cc.Node();
             toastRoot.name = 'toast';
             
             this._canvas.addChild(toastRoot);
         }
         // 将toastroot设置最高层级
         const toastRoot = this._canvas.getChildByName('toast');
         toastRoot.setSiblingIndex(canvasLen - 1);
         this.toastRoot = toastRoot;
         return toastRoot;
     }
 }
 
 export const toastManager = new ToastManager();