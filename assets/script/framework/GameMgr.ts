import {_decorator, Animation, BoxCollider, Component, Label, macro, math, Node, Prefab, Vec2, Vec3} from 'cc';
import {Bullet} from "db://assets/script/bullet/Bullet";
import {Constant} from "db://assets/script/framework/Constant";
import {EnemyPlane} from "db://assets/script/plane/EnemyPlane";
import {BulletProp} from "db://assets/script/bullet/BulletProp";
import {SelfPlane} from "db://assets/script/plane/SelfPlane";
import {AudioMgr} from "db://assets/script/framework/AudioMgr";
import {PoolMgr} from "db://assets/script/framework/PoolMgr";

const {ccclass, property} = _decorator;

@ccclass('GameMgr')
export class GameMgr extends Component {
    @property(SelfPlane)
    public playerPlane: SelfPlane = null;
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
    // bullet props
    @property([Prefab])
    public bulletProps: Prefab[] = Array<Prefab>();
    @property
    public bulletPropSpeed: Vec2 = new Vec2(0.3, 0.3);

    @property(Node)
    public gamePage: Node = null;
    @property(Node)
    public gameOverPage: Node = null;
    @property(Label)
    public gameScore: Label = null;
    @property(Label)
    public gameOverScore: Label = null;
    @property(Animation)
    public overAnim: Animation = null;

    // audio
    @property(AudioMgr)
    public audioEffect: AudioMgr = null;

    public isGameStart = false;

    private _currShootTIme = 0;
    private _isShooting = false;
    private _currCreateEnemyTime = 0;
    private _combinationInterval = Constant.Combination.PLAN1;
    private _bulletType = Constant.BulletPropType.BULLET_M;
    private _score = 0;

    start() {
        this._init();
    }

    update(deltaTime: number) {
        if (!this.isGameStart) {
            return;
        }

        if (this.playerPlane.isDead) {
            this.gameOver();
            return;
        }

        this._currShootTIme += deltaTime;
        if (this._isShooting && this._currShootTIme > this.shootTIme) {
            if (this._bulletType === Constant.BulletPropType.BULLET_H) {
                this.createPlayerBulletH();
            } else if (this._bulletType === Constant.BulletPropType.BULLET_S) {
                this.createPlayerBulletS();
            } else {
                this.createPlayerBulletM();
            }

            const name = 'bullet' + (this._bulletType % 2 + 1);
            this.playAudioEffect(name);
            this._currShootTIme = 0;
        }

        this._currCreateEnemyTime += deltaTime;
        if (this._combinationInterval === Constant.Combination.PLAN1) {
            if (this._currCreateEnemyTime > this.createEnemyTime) {
                this.createEnemyPlane();
                this._currCreateEnemyTime = 0;
            }
        } else if (this._combinationInterval === Constant.Combination.PLAN2) {
            if (this._currCreateEnemyTime > this.createEnemyTime * 3) {
                const randomCombination = math.randomRangeInt(0, 100);
                if (randomCombination < 20) {
                    this.createCombination1();
                } else {
                    this.createEnemyPlane();
                }
                this._currCreateEnemyTime = 0;
            }
        } else {
            if (this._currCreateEnemyTime > this.createEnemyTime * 2) {
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

    public returnMain() {
        this._currShootTIme = 0;
        this._currCreateEnemyTime = 0;
        this._combinationInterval = Constant.Combination.PLAN1;
        this._bulletType = Constant.BulletPropType.BULLET_M;
        this.playerPlane.node.setPosition(0, 0, 15);
        this._score = 0;
    }

    public gameStart() {
        this.isGameStart = true;
        this._changePlaneMode();
    }

    public gameRestart() {
        this.isGameStart = true;
        this._currShootTIme = 0;
        this._currCreateEnemyTime = 0;
        this._changePlaneMode();
        this._combinationInterval = Constant.Combination.PLAN1;
        this._bulletType = Constant.BulletPropType.BULLET_M;
        this.playerPlane.node.setPosition(0, 0, 15);
        this._score = 0;
    }

    public gameOver() {
        this.isGameStart = false;
        this.gamePage.active = false;
        this.gameOverPage.active = true;
        this.gameOverScore.string = this._score.toString();
        this._score = 0;
        this.gameScore.string = this._score.toString();
        this.overAnim.play();
        this._isShooting = false;
        this.playerPlane.init();
        this.unschedule(this._modeChanged);
        this._destroyAll();
    }

    public addScore() {
        this._score++;
        this.gameScore.string = this._score.toString();
    }

    private _createPlayerBullet(pos: Vec3, bulletPrefab: Prefab, tanAngle = 0) {
        const bullet = PoolMgr.instance().getNode(bulletPrefab, this.bulletRoot);
        bullet.setPosition(pos.x, pos.y, pos.z - 7);
        const bulletComp = bullet.getComponent(Bullet);
        bulletComp.show(this.bulletSpeed, false, tanAngle);

        const colliderComp = bullet.getComponent(BoxCollider);
        colliderComp.setGroup(Constant.CollisionType.SELF_BULLET);
        colliderComp.setMask(Constant.CollisionType.ENEMY_PLANE);
    }

    public createPlayerBulletM() {
        const pos = this.playerPlane.node.position;
        this._createPlayerBullet(pos, this.bullets[0]);
    }

    public createPlayerBulletH() {
        const p = this.playerPlane.node.position;
        let pos = new Vec3(p.x - 2.5, p.y, p.z);
        this._createPlayerBullet(pos, this.bullets[2]);
        pos = new Vec3(p.x + 2.5, p.y, p.z);
        this._createPlayerBullet(pos, this.bullets[2]);
    }

    public createPlayerBulletS() {
        const p = this.playerPlane.node.position;
        this._createPlayerBullet(p, this.bullets[4]);
        let pos = new Vec3(p.x - 4, p.y, p.z);
        this._createPlayerBullet(pos, this.bullets[4], -0.2);
        pos = new Vec3(p.x + 4, p.y, p.z);
        this._createPlayerBullet(pos, this.bullets[4], 0.2);
    }

    public createEnemyBullet(targetPos: Vec3) {
        const bullet = PoolMgr.instance().getNode(this.bullets[0], this.bulletRoot);
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
        const enemy = PoolMgr.instance().getNode(this.enemies[whichEnemy], this.node);
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
            enemyArray[i] = PoolMgr.instance().getNode(this.enemies[0], this.node);
            const enemy = enemyArray[i];
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
            enemyArray[i] = PoolMgr.instance().getNode(this.enemies[1], this.node);
            const enemy = enemyArray[i];
            const posIndex = i * 3;
            enemy.setPosition(combinationPos[posIndex], combinationPos[posIndex + 1], combinationPos[posIndex + 2]);
            const enemyComp = enemy.getComponent(EnemyPlane);
            const enemySpeed = 0.8;
            enemyComp.show(this, enemySpeed, false);
        }
    }

    public createBulletProp() {
        const randomProp = math.randomRangeInt(
            Constant.BulletPropType.BULLET_M, Constant.BulletPropType.BULLET_S + 1);
        let prefab: Prefab = null;
        switch (randomProp) {
            case Constant.BulletPropType.BULLET_M:
                prefab = this.bulletProps[0];
                break;
            case Constant.BulletPropType.BULLET_H:
                prefab = this.bulletProps[1];
                break;
            case Constant.BulletPropType.BULLET_S:
                prefab = this.bulletProps[2];
                break;
        }
        const prop = PoolMgr.instance().getNode(prefab, this.node);
        prop.setPosition(15, 0, -50);
        const propComp = prop.getComponent(BulletProp);
        propComp.show(this, this.bulletPropSpeed);
    }

    public isShooting(value: boolean) {
        this._isShooting = value;
    }

    public changeBulletType(type: number) {
        this._bulletType = type;
    }

    public playAudioEffect(name: string) {
        this.audioEffect.play(name);
    }

    private _init() {
        this._currShootTIme = this.shootTIme;
        this.playerPlane.init();
    }

    private _changePlaneMode() {
        this.schedule(this._modeChanged, 10, macro.REPEAT_FOREVER);
    }

    private _modeChanged() {
        this._combinationInterval++;
        this.createBulletProp();
    }

    private _destroyAll() {
        let children = this.node.children;
        let length = children.length;
        let i = 0;
        for (i = length - 1; i >= 0; i--) {
            const child = children[i];
            PoolMgr.instance().putNode(child);
        }

        children = this.bulletRoot.children;
        length = children.length;
        for (i = length - 1; i >= 0; i--) {
            const child = children[i];
            PoolMgr.instance().putNode(child);
        }
    }
}

