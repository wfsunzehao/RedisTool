export interface DataModel {
    name?: string;
    region?: string;
    subscription?: string;
    group?: string;
    port?:string;
    cases?:string[];
    quantity?:string;
    numKeysPerShard?:number;
    // 添加其他字段
}