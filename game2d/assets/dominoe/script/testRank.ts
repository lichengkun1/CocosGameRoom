// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseComp from "./baseComp";
import { PlayerInfoModel } from "./models/gameStatusModel";
import RankComp from "./rank/rankComp";
import RankItem, { RankObj } from "./rank/rankItem";

const {ccclass, property} = cc._decorator;
// export interface RankMockData {

// }

export const mockRankData = [
    {
        id: 10001,
        avatar: 'http://static2.funshareapp.com/icon/icon_male_160.png',
        name: 'lckEaglessDemoss',
        single_score: 20,
        total_score: 60,
        poker_remain_list: [
            {
                Key: 13,
                nums: [0,5]
            },
            {
                Key: 24,
                nums: [3,4]
            },
            {
                Key: 13,
                nums: [0,5]
            },
            {
                Key: 24,
                nums: [3,4]
            },
            {
                Key: 13,
                nums: [0,5]
            },
            {
                Key: 24,
                nums: [3,4]
            },
            {
                Key: 13,
                nums: [0,5]
            },
            {
                Key: 24,
                nums: [3,4]
            },
            {
                Key: 13,
                nums: [0,5]
            },
            {
                Key: 24,
                nums: [3,4]
            }
        ],
    },
    {
        id: 10001,
        avatar: 'http://static2.funshareapp.com/icon/icon_male_160.png',
        name: 'lck',
        single_score: 20,
        total_score: 60,
        poker_remain_list: [
            {
                Key: 13,
                nums: [0,5]
            },
            {
                Key: 24,
                nums: [3,4]
            }
        ],
    },
    {
        id: 10001,
        avatar: 'http://static2.funshareapp.com/icon/icon_male_160.png',
        name: 'lck',
        single_score: 20,
        total_score: 60,
        poker_remain_list: [
            {
                Key: 13,
                nums: [0,5]
            },
            {
                Key: 24,
                nums: [3,4]
            }
        ],
    },
    {
        id: 10001,
        avatar: 'http://static2.funshareapp.com/icon/icon_male_160.png',
        name: 'lck',
        single_score: 20,
        total_score: 60,
        poker_remain_list: [
            {
                Key: 13,
                nums: [0,5]
            },
            {
                Key: 24,
                nums: [3,4]
            }
        ],
    },
]

@ccclass
export default class TestRank extends BaseComp {

    @property(cc.Prefab)
    rankItemPrefab: cc.Prefab = null;
    private mockData: PlayerInfoModel[] = [];

    onLoad () {
        this.mockData = mockRankData;

        const conNode = this.viewMap['rankNode/center'];
        const rankNode = this.viewMap['rankNode'];

        const rankComp = rankNode.getComponent(RankComp);
        
        rankComp.showRankItems(this.mockData);
    }

    start () {

    }

}
