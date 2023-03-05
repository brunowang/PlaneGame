import {_decorator, Component, Node, Material, MeshRenderer} from 'cc';

const {ccclass, property, menu, requireComponent} = _decorator;

@ccclass('GameMgr')
@requireComponent(MeshRenderer)
@menu('自定义脚本/manager/GameMgr')
export class GameMgr extends Component {
    @property(Material)
    public bar: Material = null;

    private _init = false;

    onLoad() {
        console.log('onLoad');
    }

    onEnable() {
        console.log('onEnable');
    }

    start() {
        console.log('start');
    }

    update(deltaTime: number) {
        if (this._init === false)
            console.log('update');
    }

    lateUpdate(deltaTime: number) {
        if (this._init == false) {
            console.log('lateUpdate');
            this._init = true;
        }
    }

    onDisable() {
        console.log("onDisable");
        this._init = false;
    }

    onDestroy() {
        console.log("onDestroy");
    }
}

