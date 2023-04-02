import {_decorator, Collider, Component, ITriggerEvent} from 'cc';
import {GameMgr} from "db://assets/script/framework/GameMgr";
import {Constant} from "db://assets/script/framework/Constant";

const {ccclass, property} = _decorator;

const ENEMY_MAX_BOUNCE = 50;

@ccclass('EnemyPlane')
export class EnemyPlane extends Component {
    @property
    public createBulletTime = 0.5;

    private _enemySpeed = 0;
    private _needBullet = false;
    private _gameMgr: GameMgr = null;

    private _currCreateBulletTime = 0;

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
        this.node.setPosition(pos.x, pos.y, pos.z + this._enemySpeed);

        if (this._needBullet) {
            this._currCreateBulletTime += deltaTime;
            if (this._currCreateBulletTime > this.createBulletTime) {
                this._gameMgr.createEnemyBullet(this.node.position);
                this._currCreateBulletTime = 0;
            }
        }

        if (this.node.position.z > ENEMY_MAX_BOUNCE) {
            this.node.destroy();
            console.log('enemy destroy');
        }
    }

    show(gameMgr: GameMgr, speed: number, needBullet: boolean) {
        this._gameMgr = gameMgr;
        this._enemySpeed = speed;
        this._needBullet = needBullet;
    }

    private _onTriggerEnter(event: ITriggerEvent) {
        const collisionGroup = event.otherCollider.getGroup();
        if (collisionGroup === Constant.CollisionType.SELF_PLANE ||
            collisionGroup === Constant.CollisionType.SELF_BULLET) {
            // console.log('trigger enemy destroy');
            this._gameMgr.playAudioEffect('enemy');
            this.node.destroy();
            this._gameMgr.addScore();
        }
    }
}

