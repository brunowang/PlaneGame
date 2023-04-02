import {_decorator, AudioSource, Collider, Component, ITriggerEvent} from 'cc';
import {Constant} from "db://assets/script/framework/Constant";

const {ccclass, property} = _decorator;

@ccclass('SelfPlane')
export class SelfPlane extends Component {
    public lifeValue = 5;
    public isDead = false;

    private _currLife = 0;
    private _audioSrc: AudioSource = null;

    start() {
        this._audioSrc = this.getComponent(AudioSource);
    }

    onEnable() {
        const collider = this.getComponent(Collider);
        collider.on('onTriggerEnter', this._onTriggerEnter, this);
    }

    onDisable() {
        const collider = this.getComponent(Collider);
        collider.off('onTriggerEnter', this._onTriggerEnter, this);
    }

    public init() {
        this._currLife = this.lifeValue;
        this.isDead = false;
    }

    private _onTriggerEnter(event: ITriggerEvent) {
        const collisionGroup = event.otherCollider.getGroup();
        if (collisionGroup === Constant.CollisionType.ENEMY_PLANE ||
            collisionGroup === Constant.CollisionType.ENEMY_BULLET) {
            // console.log('reduce blood');
            this._currLife--;
            if (this._currLife <= 0) {
                this.isDead = true;
                this._audioSrc.play();
                console.log('self plane is dead');
            }
        }
    }
}

