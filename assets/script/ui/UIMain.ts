import {_decorator, Component, Node, Input, EventTouch} from 'cc';
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

    onLoad() {
        this.planeSpeed *= 0.01
    }

    onEnable() {
        this.node.on(Input.EventType.TOUCH_START, this._touchStart, this);
        this.node.on(Input.EventType.TOUCH_MOVE, this._touchMove, this);
        this.node.on(Input.EventType.TOUCH_END, this._touchEnd, this);
    }

    onDisable() {
        this.node.off(Input.EventType.TOUCH_MOVE);
    }

    _touchStart(event: EventTouch) {
        this.gameMgr.isShooting(true)
    }

    _touchMove(event: EventTouch) {
        const delta = event.getUIDelta();
        let pos = this.playerPlane.position;
        this.playerPlane.setPosition(pos.x + this.planeSpeed * delta.x, pos.y, pos.z - this.planeSpeed * delta.y);
    }

    _touchEnd(event: EventTouch) {
        this.gameMgr.isShooting(false)
    }
}

