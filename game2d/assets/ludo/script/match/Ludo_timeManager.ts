
const {ccclass, property} = cc._decorator;

@ccclass
export default class Ludo_timeManger extends cc.Component {
    private currTime:number = 0;
    private nowTime:number = 0;
    private isUpdate:boolean = false;
    
    start () {  
    }

    startUpdate(){
        this.currTime = 0;
        this.nowTime = 0;
        this.isUpdate = true;
    }

    public getNowTime(){
        return this.nowTime;
    }

    update(dt){
        if(this.isUpdate){
            this.currTime += dt;
            if(this.currTime >= 1){
                this.currTime = 0;
                this.nowTime++;
            }
        }
    }

}
