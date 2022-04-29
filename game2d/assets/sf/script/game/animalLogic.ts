
import MessageSoundManager from '../../../Script/CommonScripts/Utils/MessageSoundManager';
import MyEvent from '../../../Script/CommonScripts/Utils/MyEvent';
import GlobalGameData from '../Global/GlobalGameData';

const {ccclass, property} = cc._decorator;

@ccclass
export default class animalLogic extends cc.Component {

    @property({type:cc.AudioClip})
    ridiculeAudio:cc.AudioClip = null;

    @property({type:cc.AudioClip})
    ImpactAudio:cc.AudioClip = null;

    private isActive:boolean = true;               //是否是激活状态;
    private isCollider:boolean = false;             //是否碰撞过了；
    private weight:number = 0;                      //重量 在Global 有使用;
    private track:number = 0;                       //第几条跑道;
    private speed = 0;                              //速度;
    private type:number =  GlobalGameData.SHEEPTYPE.NONE;   //当前羊的类型;
    private isUpdate:boolean = false;               //是否开启update;
    private isRunType:boolean = false;              //现在是否是run的状态;
    private isColliderNode:boolean = false;         //是否有碰到东西，用于预定的创建，如果有，则不能创建;
    private isReadType:boolean = false;             //是否为准备好的状态;
    private nowColliderArrIsClear:boolean = false;  //当前碰撞的数组是否已经清除;
    private _arrForIndex:number = -1;               //在数组中下标值;
    private _createTime:string = '';                //节点的创建时间;
    private _nodePos:number = -1;                   //设置坐标;
    private isNeedShowIcon:boolean = false;         //是否需要显示嘲讽Icon;
    private ridiculeIcon:cc.Node = null;            //嘲讽的Icon;
    private nodeType:number = -1;                   //节点类型;
    public nodePosY:number = -1;                    //节点应该在的位置;
    private isPlayerAnimation:boolean = false;      //是否已经在播放撞击动画;
    private initUpdate:boolean = false;             //获取的update值;
    private initPos:number = -1;
    

    start () {
        this.ridiculeIcon = this.node.getChildByName('ridiculeIcon');
        this.isUpdate = this.initUpdate;
    }   

    /*
        设置当前节点的属性：
        @param  sizeType        节点类型    0 小  1 中  2 大  3 最大
        @param  type            节点类型    是top  or  boom
        @param  track           赛道        是第几条赛道
        @param  createTime      创建时间
        @param  isStartUpdate   是否开启update
        @param  speed           速度
        @param  pos             坐标
    */
    
    setNodeType(sizeType:number,type,track,createTime,isStartUpdate,speed,pos){
        this.track = track;
        this.type = type;
        this.nodeType = sizeType;
        switch(sizeType)
        {
            case 0:
                this.weight = 10;
                break;
            case 1:
                this.weight = 30;
                break;
            case 2:
                this.weight = 60; 
                break;
            case 3:
                this.weight = 80;
                break;
        }
        let drag = this.node.getComponent(dragonBones.ArmatureDisplay);
        if(type == GlobalGameData.SHEEPTYPE.TOP){
            drag.playAnimation('run_zheng',0);
        }else if(type == GlobalGameData.SHEEPTYPE.BOOM){
            drag.playAnimation('run_fan',0);
        }
        this.speed = speed;
        this.createTime = createTime;
        if(isStartUpdate){
            this.setMoveSpeed(this.speed,true);
            this.nodePos = pos;
        }
        this.initUpdate = isStartUpdate;
        // this.initPos = pos;
    }
    
    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter(other, self){
        this.isColliderNode = true;
        if(this.isCollider){
            return;
        }
        let otherNode = other.node;
        //通过获取是否update;
        let otherUpdate =  otherNode.getComponent('animalLogic').nodeIsUpdate;
        //如果自己和碰撞的节点都是update状态，则为正常的碰撞;
        if(otherUpdate &&  this.isUpdate){ 
            // this.isCollider = true;
            // this.node.color = cc.color(255,0,0);
            let type = this.type;
            if(!this.isPlayerAnimation){
                this.setPlayAnimation();
            }
            let otherGroup = other.node.group;              //对方的分组;
            let selfGroup = self.node.group;                //自己的分组；
            if(selfGroup == otherGroup){
                if(otherNode.getComponent('animalLogic').isCollider){
                    this.isCollider = true;
                    //说明自己是捧在了别人的屁股后面;
                    GlobalGameData.colliderCallback(this.track,type,this.node);
                }else{
                    // this.node.color = cc.color(255,0,0);
                    // otherNode.color = cc.color(255,0,0);
                    if(this.nodePosY >= 0){
                        this.node.getComponent('animalLogic').nodePos = this.nodePosY;
                    }
                    let otherPosY = otherNode.getComponent('animalLogic').nodePosY;
                    if(otherPosY >= 0){
                        otherNode.getComponent('animalLogic').nodePos = otherPosY;
                        otherNode.getComponent('animalLogic').speed = this.speed;
                    }
                    return;
                }
            }else{
                this.isCollider = true;
                this.isNeedShowIcon = true;
                if(type == GlobalGameData.SHEEPTYPE.TOP){
                    GlobalGameData.colliderSituation[this.track] = {};
                    GlobalGameData.colliderSituation[this.track][GlobalGameData.SHEEPTYPE.TOP] = [this.node];
                    GlobalGameData.colliderSituation[this.track][GlobalGameData.SHEEPTYPE.BOOM] = [otherNode];
                    GlobalGameData.setTrackColliderMove(this.track);
                    // cc.audioEngine.playEffect(this.ImpactAudio,false);
                    MessageSoundManager.playLoadEffect(this.ImpactAudio);
                }
            }
            let selfY = this.node.y;
            let otherY = other.node.y;
            let selfHeight = 56 + 14 * this.nodeType;
            let showNodeY = 0;
            if(selfY > otherY){
                showNodeY = selfY - selfHeight/2;
            }else{
                showNodeY = selfY + selfHeight/2;
            }
            let showPos = [this.node.x,showNodeY];
            MyEvent.I.emit('collider',{showPos:showPos});
        }
    }

    //获取自己当前是否是碰撞状态;
    getCollider(){
        return this.isColliderNode;
    }

    //是否是在行进的状态；
    setIsUpdate(flag:boolean){
        this.isUpdate = flag;
    }
    
    get nodeIsUpdate(){
        return this.isUpdate;
    }

    //是否是准备好准备走的状态;
    set readType(flag:boolean){
        this.isReadType = flag;
    }

    get readType():boolean
    {
        return this.isReadType;
    }

    //速度；
    setMoveSpeed(value,isFlag = false){
        this.speed = value / 45;
        if(value == 0){
            this.isCollider = true;
            if(isFlag){
                if(!this.isPlayerAnimation){
                    this.setPlayAnimation();
                }
                if(!GlobalGameData.colliderSituation[this.track]){
                    GlobalGameData.colliderSituation[this.track] = {};
                }
                let type = this.type;
                if(type == GlobalGameData.SHEEPTYPE.TOP){
                    if(!GlobalGameData.colliderSituation[this.track][GlobalGameData.SHEEPTYPE.TOP]){
                        GlobalGameData.colliderSituation[this.track][GlobalGameData.SHEEPTYPE.TOP] = [];
                    }
                    GlobalGameData.colliderSituation[this.track][GlobalGameData.SHEEPTYPE.TOP].push(this.node);
                }else if(type == GlobalGameData.SHEEPTYPE.BOOM){
                    if(!GlobalGameData.colliderSituation[this.track][GlobalGameData.SHEEPTYPE.BOOM]){
                        GlobalGameData.colliderSituation[this.track][GlobalGameData.SHEEPTYPE.BOOM] = [];
                    }
                    GlobalGameData.colliderSituation[this.track][GlobalGameData.SHEEPTYPE.BOOM].push(this.node);
                }
            }
        }else if(value == 45 || value == -45){
            this.isCollider = true;
        }
    }
    
    get moveSpeed():number{
        return this.speed;
    }

    setPlayAnimation(){
        this.isPlayerAnimation = true;
        let type = this.type;
        let drag = this.node.getComponent(dragonBones.ArmatureDisplay);
        if(type == GlobalGameData.SHEEPTYPE.TOP){
            drag.playAnimation('fighting_zheng',0);
        }else if(type == GlobalGameData.SHEEPTYPE.BOOM){
            drag.playAnimation('fighting_fan',0);
        }
    }

    setNodePosY(posY){
        this.nodePosY = posY;
    }

    //跑道；
    set nodeTrack(track){
        this.track = track;
    }
    
    get nodeTrack(){
        return this.track;
    }
    
    //在数组里面的下标值；
    set arrForIndex(index){
        this._arrForIndex = index;
    }

    get arrForIndex(){
        return this._arrForIndex;
    }

    //创建时间;
    set createTime(time){
        this._createTime = time;
    }

    get createTime(){
        return this._createTime;
    }

    //设置节点坐标；
    set nodePos(pos){
        this._nodePos = pos;
        //现在返回的坐标可能会是一些不再范围内的值;
        //移动的距离;
        let distance = pos / 10000 * 700;
        let type = this.type;
        let startPosY = 0;
        if(type == GlobalGameData.SHEEPTYPE.TOP){
            startPosY = 350;
            distance = -distance;
        }else if(type == GlobalGameData.SHEEPTYPE.BOOM){
            startPosY = -350;
        }
        this.node.y = startPosY + distance;
    } 

    get nodePos(){
        return this._nodePos;
    }

    onDestroy(){
    }

    showIcon(){
        this.isNeedShowIcon = false;
        setTimeout(()=>{
            this.ridiculeIcon.active = false;
        },1200);
        this.ridiculeIcon.active = true;
        MessageSoundManager.playLoadEffect(this.ridiculeAudio);

        // let aid = cc.audioEngine.playEffect(this.ridiculeAudio,false);
        // cc.audioEngine.setFinishCallback(aid,()=>{
        // });
    }

    update(dt){
        if(this.speed == 0){
            return;
        }
        if(this.isUpdate){
            let type = this.type;
            if(type == GlobalGameData.SHEEPTYPE.TOP){
                this.node.y -= this.speed;
                if(this.node.y <= -220 && this.isNeedShowIcon){
                    this.node.zIndex = 2;
                    this.showIcon();
                }
            }else if(type == GlobalGameData.SHEEPTYPE.BOOM){
                this.node.y += this.speed;
                if(this.node.y >= 220 && this.isNeedShowIcon){
                    this.node.zIndex = 2;
                    this.showIcon();
                }
            }
        }
    }
}
