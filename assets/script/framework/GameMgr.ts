import {_decorator, Component, Node, Prefab, instantiate, math, Vec3, BoxCollider} from 'cc';
import {Bullet} from "db://assets/script/bullet/Bullet";
import {Constant} from "db://assets/script/framework/Constant";
import {EnemyPlane} from "db://assets/script/plane/EnemyPlane";

const {ccclass, property} = _decorator;

@ccclass('GameMgr')
export class GameMgr extends Component {
    @property(Node)
    public playerPlane: Node = null;
    // bullets
    @property([Prefab])
    public bullets: Prefab[] = Array<Prefab>();
    @property
    public shootTIme = 0.2;
    @property
    public bulletSpeed = 2;
    @property(Node)
    public bulletRoot: Node = null;
    // enemies
    @property([Prefab])
    public enemies: Prefab[] = Array<Prefab>();
    @property
    public createEnemyTime = 1;

    private _currShootTIme = 0;
    private _isShooting = false;
    private _currCreateEnemyTime = 0;
    private _combinationInterval = Constant.Combination.PLAN1;

    start() {
        this._init();
    }

    update(deltaTime: number) {
        this._currShootTIme += deltaTime;
        if (this._isShooting && this._currShootTIme > this.shootTIme) {
            this.createPlayerBullet();
            this._currShootTIme = 0;
        }

        this._currCreateEnemyTime += deltaTime;
        if (this._combinationInterval === Constant.Combination.PLAN1) {
            if (this._currCreateEnemyTime > this.createEnemyTime) {
                this.createEnemyPlane();
                this._currCreateEnemyTime = 0;
            }
        } else if (this._combinationInterval === Constant.Combination.PLAN2) {
            if (this._currCreateEnemyTime > this.createEnemyTime * 0.8) {
                const randomCombination = math.randomRangeInt(0, 100);
                if (randomCombination < 20) {
                    this.createCombination1();
                } else {
                    this.createEnemyPlane();
                }
                this._currCreateEnemyTime = 0;
            }
        } else {
            if (this._currCreateEnemyTime > this.createEnemyTime * 0.6) {
                const randomCombination = math.randomRangeInt(0, 100);
                if (randomCombination < 20) {
                    this.createCombination1();
                } else if (randomCombination < 30) {
                    this.createCombination2();
                } else {
                    this.createEnemyPlane();
                }
                this._currCreateEnemyTime = 0;
            }
        }
    }

    public addScore() {

    }

    public createPlayerBullet() {
        const bullet = instantiate(this.bullets[0]);
        bullet.setParent(this.bulletRoot);
        const pos = this.playerPlane.position;
        bullet.setPosition(pos.x, pos.y, pos.z - 7);
        const bulletComp = bullet.getComponent(Bullet);
        bulletComp.show(this.bulletSpeed, false);
    }

    public createEnemyBullet(targetPos: Vec3) {
        const bullet = instantiate(this.bullets[0]);
        bullet.setParent(this.bulletRoot);
        const pos = targetPos
        bullet.setPosition(pos.x, pos.y, pos.z + 6);
        const bulletComp = bullet.getComponent(Bullet);
        bulletComp.show(this.bulletSpeed, true);

        const colliderComp = bullet.getComponent(BoxCollider);
        colliderComp.setGroup(Constant.CollisionType.ENEMY_BULLET);
        colliderComp.setMask(Constant.CollisionType.SELF_PLANE);
    }

    public createEnemyPlane() {
        const whichEnemy = math.randomRangeInt(0, this.enemies.length);
        const enemy = instantiate(this.enemies[whichEnemy]);
        enemy.setParent(this.node);
        const enemyComp = enemy.getComponent(EnemyPlane);
        let enemySpeed = 0.5;
        if (whichEnemy != 0) {
            enemySpeed = 0.8
        }
        enemyComp.show(this, enemySpeed, true);

        const randomPosX = math.randomRangeInt(-25, 26);
        const bornPosZ = -50;
        enemy.setPosition(randomPosX, 0, bornPosZ);
    }

    public createCombination1() {
        const enemyArray = new Array<Node>(5);
        for (let i = 0; i < enemyArray.length; i++) {
            enemyArray[i] = instantiate(this.enemies[0]);
            const enemy = enemyArray[i];
            enemy.parent = this.node;
            enemy.setPosition(-20 + i * 10, 0, -50);
            const enemyComp = enemy.getComponent(EnemyPlane);
            const enemySpeed = 0.5;
            enemyComp.show(this, enemySpeed, false);
        }
    }

    public createCombination2() {
        const enemyArray = new Array<Node>(7);

        const combinationPos = [
            -21, 0, -60,
            -14, 0, -55,
            -7, 0, -50,
            0, 0, -45,
            7, 0, -50,
            14, 0, -55,
            21, 0, -60,
        ]

        for (let i = 0; i < enemyArray.length; i++) {
            enemyArray[i] = instantiate(this.enemies[1]);
            const enemy = enemyArray[i];
            enemy.parent = this.node;
            const posIndex = i * 3;
            enemy.setPosition(combinationPos[posIndex], combinationPos[posIndex + 1], combinationPos[posIndex + 2]);
            const enemyComp = enemy.getComponent(EnemyPlane);
            const enemySpeed = 0.8;
            enemyComp.show(this, enemySpeed, false);
        }
    }

    public isShooting(value: boolean) {
        this._isShooting = value;
    }

    private _init() {
        this._currShootTIme = this.shootTIme;
        this._changePlaneMode();
    }

    private _changePlaneMode() {
        this.schedule(this._modeChanged, 10, 3);
    }

    private _modeChanged() {
        this._combinationInterval++;
    }
}

