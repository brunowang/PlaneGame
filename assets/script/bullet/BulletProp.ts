import {_decorator, Component, Node, Vec2, Collider, ITriggerEvent} from 'cc';
import {GameMgr} from "db://assets/script/framework/GameMgr";
import {Constant} from "db://assets/script/framework/Constant";

const {ccclass, property} = _decorator;

@ccclass('BulletProp')
export class BulletProp extends Component {
    private _gameMgr: GameMgr = null;
    private _speed: Vec2 = null;

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
        if ((pos.x >= 15 && this._speed.x > 0) ||
            (pos.x <= -15 && this._speed.x < 0)) {
            this._speed.x = -this._speed.x
        }
        this.node.setPosition(pos.x + this._speed.x, pos.y, pos.z + this._speed.y);

        if (this.node.position.z > 50) {
            this.node.destroy();
        }
    }

    show(gameMgr: GameMgr, speed: Vec2) {
        this._gameMgr = gameMgr;
        this._speed = speed;
    }

    private _onTriggerEnter(event: ITriggerEvent) {
        const name = event.selfCollider.name;
        switch (name) {
            case 'bulletM':
                this._gameMgr.changeBulletType(Constant.BulletPropType.BULLET_M);
                break;
            case 'bulletH':
                this._gameMgr.changeBulletType(Constant.BulletPropType.BULLET_H);
                break;
            case 'bulletS':
                this._gameMgr.changeBulletType(Constant.BulletPropType.BULLET_S);
                break;
        }
        this.node.destroy();
    }
}

