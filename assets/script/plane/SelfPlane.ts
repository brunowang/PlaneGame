import {_decorator, Component, Node, Collider, ITriggerEvent} from 'cc';
import {Constant} from "db://assets/script/framework/Constant";

const {ccclass, property} = _decorator;

@ccclass('SelfPlane')
export class SelfPlane extends Component {
    onEnable() {
        const collider = this.getComponent(Collider);
        collider.on('onTriggerEnter', this._onTriggerEnter, this);
    }

    onDisable() {
        const collider = this.getComponent(Collider);
        collider.off('onTriggerEnter', this._onTriggerEnter, this);
    }

    private _onTriggerEnter(event: ITriggerEvent) {
        const collisionGroup = event.otherCollider.getGroup();
        if (collisionGroup === Constant.CollisionType.ENEMY_PLANE ||
            collisionGroup === Constant.CollisionType.ENEMY_BULLET) {
            console.log('reduce blood');
        }
    }
}

