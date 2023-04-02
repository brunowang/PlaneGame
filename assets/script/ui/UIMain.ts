import {_decorator, Component, EventTouch, Input, Node} from 'cc';
import {GameMgr} from "db://assets/script/framework/GameMgr";

const {ccclass, property} = _decorator;

@ccclass('UIMain')
export class UIMain extends Component {
    @property
    public planeSpeed = 5;

    @property(Node)
    public playerPlane: Node = null;

    @property(GameMgr)
    public gameMgr: GameMgr = null;

    @property(Node)
    public gameStart: Node = null;
    @property(Node)
    public gaming: Node = null;
    @property(Node)
    public gameOver: Node = null;

    onLoad() {
        this.planeSpeed *= 0.01
    }

    onEnable() {
        this.node.on(Input.EventType.TOUCH_START, this._touchStart, this);
        this.node.on(Input.EventType.TOUCH_MOVE, this._touchMove, this);
        this.node.on(Input.EventType.TOUCH_END, this._touchEnd, this);

        this.gameStart.active = true;
    }

    onDisable() {
        this.node.off(Input.EventType.TOUCH_MOVE);
    }

    public restart() {
        this.gameOver.active = false;
        this.gaming.active = true;
        this.gameMgr.playAudioEffect('button');
        this.gameMgr.gameRestart();
    }

    public returnMain() {
        this.gameOver.active = false;
        this.gameStart.active = true;
        this.gameMgr.playAudioEffect('button');
        this.gameMgr.returnMain();
    }

    _touchStart(event: EventTouch) {
        if (this.gameMgr.isGameStart) {
            this.gameMgr.isShooting(true)
        } else {
            this.gameStart.active = false;
            this.gaming.active = true;
            this.gameMgr.playAudioEffect('button');
            this.gameMgr.gameStart();
        }
    }

    _touchMove(event: EventTouch) {
        if (!this.gameMgr.isGameStart) {
            return;
        }
        const delta = event.getUIDelta();
        let pos = this.playerPlane.position;
        this.playerPlane.setPosition(pos.x + this.planeSpeed * delta.x, pos.y, pos.z - this.planeSpeed * delta.y);
    }

    _touchEnd(event: EventTouch) {
        if (!this.gameMgr.isGameStart) {
            return;
        }
        this.gameMgr.isShooting(false)
    }
}

