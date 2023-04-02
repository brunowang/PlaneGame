import {_decorator, Collider, Component, ITriggerEvent} from 'cc';
import {PoolMgr} from "db://assets/script/framework/PoolMgr";

const {ccclass, property} = _decorator;

const BULLET_MAX_BOUNCE = 50;

@ccclass('Bullet')
export class Bullet extends Component {
    private _bulletSpeed = 0;

    private _isEnemyBullet = false;

    private _tanAngle = 0;

    onEnable() {
        const collider = this.getComponent(Collider);
        collider.on('onTriggerEnter', this._onTriggerEnter, this);
    }

    onDisable() {
        const collider = this.getComponent(Collider);
        collider.off('onTriggerEnter', this._onTriggerEnter, this);
    }

    update(deltaTime: number) {
        const pos = this.node.position;
        let movedZ;
        if (this._isEnemyBullet) {
            movedZ = pos.z + this._bulletSpeed;
        } else {
            movedZ = pos.z - this._bulletSpeed;
        }
        this.node.setPosition(pos.x + this._tanAngle * this._bulletSpeed, pos.y, movedZ);

        if ((this._isEnemyBullet && movedZ > BULLET_MAX_BOUNCE) ||
            (!this._isEnemyBullet && movedZ < -BULLET_MAX_BOUNCE)) {
            // console.log('bullet destroy', this._isEnemyBullet);
            PoolMgr.instance().putNode(this.node);
        }
    }

    show(speed: number, isEnemyBullet: boolean, tanAngle = 0) {
        this._bulletSpeed = speed;
        this._isEnemyBullet = isEnemyBullet;
        this._tanAngle = tanAngle;
    }

    private _onTriggerEnter(event: ITriggerEvent) {
        // console.log('trigger bullet destroy');
        PoolMgr.instance().putNode(this.node);
    }
}

