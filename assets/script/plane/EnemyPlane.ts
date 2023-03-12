import {_decorator, Component, Node} from 'cc';
import {GameMgr} from "db://assets/script/framework/GameMgr";

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

    start() {

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
}

