import { resourceManager } from "../managers/resourceManager";

/**
 * 输出debug信息
 * @param  {string} tag tag
 * @param  {any[]} ...log
 */
export function debugLog(tag: string, ...log: any[]) {
    if (CC_DEBUG) {
        console.log.call(null, `[DEBUG]: ${tag}`, ...log);
    }
}
/**
 * 休眠一段时间
 * @param  {number} time 休眠时间
 */
export async function sleep(time: number) {
    return new Promise((resolve) => {
        let id = setTimeout(() => {
            clearTimeout(id);
            resolve(null);
        }, time);
    })
}

/**
 * 产生 [min,max - 1]之间的随机数
 * @param  {number} min
 * @param  {number} max
 * @returns number
 */
export function createRandom(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * 向着目标产生随机数：目标值的随机数概率很大
 * @param  {number} min
 * @param  {number} max
 * @param  {number} wantNumber 目标值
 */
export function createRandomTowardTarget(min: number, max: number, wantNumber: number) {
    const random = Math.floor(Math.random() * (max - min) * 100 + min * 100);

    if (random > (min * 100) && random < (max - 2) * 100) {
        return wantNumber;
    } else {
        return Math.floor(random / 100);
    }
}

/**
 * 等待动画播放完毕
 * @param  {cc.Node} node 想要播放动画的节点
 * @param  {string} animationName 动画名称
 * @param  {boolean} isReverse 是否倒序播放
 */
export async function waitAnimOver(
    node: cc.Node,
    animationName: string,
    isReverse: boolean = false
) {
    if (!node) {
        console.warn("node is null");
        return;
    }
    const animCom = node.getComponent(cc.Animation);
    if (animCom) {
        return new Promise((resolve) => {
            const animState = animCom.play(animationName);
            if (isReverse) {
                animState.wrapMode = cc.WrapMode.Reverse;
            }
            animCom.once("finished", resolve);
        });
    } else {
        console.warn("node's animation is null,please add animation component");
    }
}

/**
 * 循环播放一个动画
 * @param  {cc.Node} node 动画所在的节点
 * @param  {string} animationName 动画名
 */
export function loopAnimation(node: cc.Node, animationName: string) {
    if (node) {
        const animCom = node.getComponent(cc.Animation);
        if (animCom) {
            const state = animCom.play(animationName);
            state.wrapMode = cc.WrapMode.Loop;
        }
    }
}

/**
 * 停止当前节点正在播放的动画
 * @param  {cc.Node} node
 */
export function stopCurAnimation(node: cc.Node) {
    if (node) {
        const animComp = node.getComponent(cc.Animation);
        if (!animComp) return;
        animComp.stop();
    }
}

/**
 * @param  {cc.Node} node 播放动画的节点
 * @param  {number} clipIndex clip在animation中的索引
 */
export async function waitAnimOverByIndex(node: cc.Node, clipIndex: number) {
    if (!node) {
        console.warn("node is null");
        return;
    }
    const animCom = node.getComponent(cc.Animation);
    const clips = animCom.getClips();
    if (animCom) {
        return new Promise((resolve) => {
            animCom.play(clips[clipIndex].name);
            animCom.once("finished", resolve);
        });
    } else {
        console.warn("node's animation is null,please add animation component");
    }
}

/**
* @param  {sp.Skeleton} sp 骨骼动画组件
* @param  {string} fromAnimation 从哪个动画过渡到目标动画
* @param  {string} toAnimation 目标动画
* @param  {number} delay 过渡时长 默认0.2秒 过度到目标动画循环播放
*/
export function smoothTransitionSpAnimation(
    sp: sp.Skeleton,
    fromAnimation: string,
    toAnimation: string,
    delay: number = 0.5,
    isLoop: boolean = true
) {
    /** 过渡到目标动画循环播放 */
    sp.loop = isLoop;
    sp.setMix(fromAnimation, toAnimation, delay);
    sp.animation = toAnimation;

    return new Promise((resolve) => {
        sp.setCompleteListener(resolve);
    });
}

/**
 * 播放龙骨动画
 * @param  {dragonBones.ArmatureDisplay} dragonbone 龙骨组件
 * @param  {string} animationName 动画名称
 * @param  {number=1} playTime 播放次数 默认1次 0：无限循环 >0：播放指定的次数
 */
export async function playDragonBonesAnim(dragonbone: dragonBones.ArmatureDisplay, animationName: string, playTime: number = 1) {
    if (playTime === 0) {
        dragonbone.playAnimation(animationName, playTime);
    } else {
        dragonbone.playAnimation(animationName, playTime);
        return new Promise((resolve) => {
            dragonbone.addEventListener(dragonBones.EventObject.COMPLETE, () => {
                dragonbone.removeEventListener(dragonBones.EventObject.COMPLETE);
                resolve(null);
            });
        });
    }
}

/**
 * 预加载bundle里面的资源
 * @param  {string} url bundle里面的路径
 * @param  {typeofcc.Asset} type 资源类型
 * @param  {string='resources'} bundleName bundle名字
 * @returns Promise
 */
export async function preloadAssetInBundle<T extends cc.Asset>(url: string, type: typeof cc.Asset, bundleName: string = 'resources'): Promise<T> {
    if (!url) return;

    // let bundle = null;
    // bundle = await resourceManager.loadBundle(bundleName);
    // if(!bundle) return;
    const res = await resourceManager.loadAssetInBundle<T>(url, type,bundleName) as T;
    if (!res) return;
    return res;
}

/**
 * 根据传入进来的r和x计算y坐标
 * @param  {number} x 圆上的一个随机点
 * @param  {number} r 圆半径
 * @param  {number} x0 圆心坐标x
 * @param  {number} y0 圆心坐标y
 * @returns number
 */
export function getYInCircleByRandomX(x: number, r: number, x0: number = 0, y0: number = 0): number {
    // 圆方程 (x - x0)^2 + (y - y0)^2 = r^2
    let ysubY02 = Math.pow(r, 2) - Math.pow(x - x0, 2);
    if (ysubY02 < 0) ysubY02 = 0;
    return Math.sqrt(ysubY02) + y0;
}

/**
 * 围绕圆心坐标旋转指定的点和角度
 * @param  {cc.Vec2} rotatePoint 需要旋转的点
 * @param  {cc.Vec2} centerPoint 旋转中心
 * @param  {number} angle 旋转的角度 弧度值
 * @returns cc.Vec2 旋转后的点
 */
export function rotateByPoint(rotatePoint: cc.Vec2, centerPoint: cc.Vec2, angle: number): cc.Vec2 {
    const x = (rotatePoint.x - centerPoint.x) * Math.cos(angle) - (rotatePoint.y - centerPoint.y) * Math.sin(angle) + centerPoint.x;
    const y = (rotatePoint.x - centerPoint.x) * Math.sin(angle) + (rotatePoint.y - centerPoint.y) * Math.cos(angle) + centerPoint.y;
    return cc.v2(x, y);
}

/**
 * 根据name获取url中的参数
 * @param  {string} name 参数名
 */
export function getUrlParameterValue(name) {
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

/**
 * 检测一个数是否在指定的范围内
 * @param  {number} target 指定的数
 * @param  {number} min 指定的方位的最小值
 * @param  {number} max 指定的范围的最大值
 * @returns boolean
 */
export function numberIsInRange(target: number, min: number, max: number): boolean {
    return target >= min && target <= max;
}

/** 判断一个数是否是整数 */
export function isInteger(num: number): boolean {
    return typeof num === 'number' && num % 1 === 0;
}

/**
 * 洗牌简单算法
 * @param  {number[]} arr 需要洗牌的数组
 */
export function shuffle(arr: number[]) {
    const swap = (index1: number, index2: number) => {
        const temp = arr[index1];
        arr[index1] = arr[index2];
        arr[index2] = temp;
    }
    const n = arr.length;
    for (let i = 0; i < n; i++) {
        // 获得一个随机位置
        let rand = Math.floor((Math.random() * 101)) % (n - i);
        //交换两个位置的数据
        swap(i, rand);
    }
}

/**
 * 为一个字符串添加省略号
 * @param  {string} str 字符串
 * @param  {number} targetLen 多少文字长度以后添加省略号
 * @returns void
 */
export function usernameSlice(str: string, targetLen: number): string {
    if (str.length <= targetLen) return str;
    if (str.length > targetLen) return str.substr(0, targetLen) + '..';

}

/**
 * 对label中的数字进行tween变换
 * @param  {number} curVal
 * @param  {number} targetVal
 * @param  {cc.Label} label 文本组件
 * @returns Promise
 */
export async function tweenLabelString(curVal: number, targetVal: number, label: cc.Label, time: number = 1): Promise<void> {
    let obj = { value: curVal }
    return new Promise((resolve) => {
        cc.tween(obj).to(time, { value: targetVal }, {
            easing: 'cubicOut', progress: (start, end, current, ratio) => {
                const res = Math.floor(start + (end - start) * ratio);
                label.string = res.toString();
                return res;
            }
        }).call(resolve).start();
    })
}

/**
 * 对label中的数字进行tween变换
 * @param  {cc.Prefab} particle 进度粒子
 * @param  {number} targetVal 目标进度值
 * @param  {cc.ProgressBar} progressBar 进度条组件
 * @returns Promise
 */
export async function tweenProgress(particle: cc.Prefab, targetVal: number, progressBar: cc.ProgressBar): Promise<void> {
    const barNode = progressBar.barSprite.node;
    const partNode = cc.instantiate(particle);
    partNode.parent = barNode;

    cc.tween(progressBar).to(1, { progress: targetVal }, {
        easing: 'cubicOut', progress: (start, end, cur, ratio) => {
            const res = start + (end - start) * ratio;
            partNode.x = res * progressBar.node.width;
            return res;
        }
    }).start();
}

export function utcToGmt(UTCDateString) {
    if (!UTCDateString) {
        return '-';
    }
    function formatFunc(str) {    //格式化显示
        return str > 9 ? str : '0' + str
    }
    var date2 = new Date(UTCDateString);
    var year = date2.getFullYear();
    var mon = formatFunc(date2.getMonth() + 1);
    var day = formatFunc(date2.getDate());
    var hour = date2.getHours();
    var noon = hour >= 12 ? 'PM' : 'AM';
    hour = hour >= 12 ? hour - 12 : hour;
    hour = formatFunc(hour);
    var min = formatFunc(date2.getMinutes());
    var dateStr = year + '-' + mon + '-' + day + ' ' + noon + ' ' + hour + ':' + min;
    return dateStr;
}

export function abs(a: number) {
    return (a ^ (a >> 31)) - (a >> 31);
}

/**
 * 弧度转角度
 * @param  {number} rad
 */
export function randToAngle(rad: number) {
    return rad * 180 / Math.PI;
}

/**
 * 角度转弧度
 * @param  {number} angle
 */
export function angleToRand(angle: number) {
    return angle * Math.PI / 180;
}

/**
 * 是否是生产环境
 */
export function isProd() {
    return window.location.href.indexOf('staging') >= 0 ? false : true;
}

// export function getColorByRGBWithOpacity(r: number,g: number,b: number,a: number) {
//     let color = new cc.Color(r,g,b);
// }

