
/**
 * 
 * 服务器返回的数据接口汇总
 * 废弃
 * 
 */

/** 商品数据 */
export type GoodsData =  {
    /** 商品id */
    goods_id: number,
    /** 商品类型 */
    gtype: string,
}

export type UserTools = {
    user_tools: GoodsData[];
}

// 道具接口： 包含骰子点数，类型，皮肤等数据
export type ToolsData = {
    users_tools: {
        [key: string]: UserTools;
    }
}
