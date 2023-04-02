import {_decorator, Component} from 'cc';
import {PoolMgr} from "db://assets/script/framework/PoolMgr";

const {ccclass, property} = _decorator;

@ccclass('Explode')
export class Explode extends Component {
    onEnable() {
        this.scheduleOnce(this._putBack, 1);
    }

    private _putBack() {
        PoolMgr.instance().putNode(this.node);
    }
}

