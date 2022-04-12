// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { lstat } from "fs";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {


        // let l1 = this.getList(1000000000000000000000000000001);
        // let l2 = this.getList(564);
        // let l3 = this.addTwoNumbers(l1, l2);
        // console.log(l3);

    }
    // getList(num3) {
    //     let l3 = new ListNode(num3 % 10);
    //     this.getListNode(l3, Math.floor(num3 / 10));
    //     return l3;
    // }
    // addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
    //     const num1: number = this.getNumber(l1, l1.val);
    //     const num2: number = this.getNumber(l2, l2.val);
    //     let num3: number = num1 + num2;
    //     let l3 = new ListNode(num3 % 10);
    //     this.getListNode(l3, Math.floor(num3 / 10));
    //     return l3;
    // };

    // getNumber(l: ListNode, num: number = 0, i = 1): number {
    //     if (l.next) {
    //         let num2 = num + l.next.val * Math.pow(10, i);
    //         i++;
    //         return this.getNumber(l.next, num2, i);
    //     } else {
    //         return num;
    //     }
    // }

    // getListNode(l: ListNode | null, num: number): ListNode | null {
    //     let l3: ListNode = new ListNode();
    //     l.next = l3;
    //     if (num > 10) {
    //         l3.val = num % 10;
    //         l3.next = this.getListNode(l3, Math.floor(num / 10));
    //     } else {
    //         l3.val = num;
    //     }
    //     return l3;
    // }
    // update (dt) {}
}
class ListNode {
    val: number
    next: ListNode | null
    constructor(val?: number, next?: ListNode | null) {
        this.val = (val === undefined ? 0 : val)
        this.next = (next === undefined ? null : next)
    }
}