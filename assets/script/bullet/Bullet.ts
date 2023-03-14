import {_decorator, Component, Node, Collider, ITriggerEvent} from 'cc';
import {Constant} from "db://assets/script/framework/Constant";

const {ccclass, property} = _decorator;

const BULLET_MAX_BOUNCE = 50;

@ccclass('Bullet')
export class Bullet extends Component {
    private _bulletSpeed = 0;

    private _isEnemyBullet = false;

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
        this.node.setPosition(pos.x, pos.y, movedZ);

        if ((this._isEnemyBullet && movedZ > BULLET_MAX_BOUNCE) ||
            (!this._isEnemyBullet && movedZ < -BULLET_MAX_BOUNCE)) {
            this.node.destroy();
            console.log('bullet destroy', this._isEnemyBullet);
        }
    }

    show(speed: number, isEnemyBullet: boolean) {
        this._bulletSpeed = speed;
        this._isEnemyBullet = isEnemyBullet;
    }

    private _onTriggerEnter(event: ITriggerEvent) {
        console.log('trigger bullet destroy');
        this.node.destroy();
    }
}

