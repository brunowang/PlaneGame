import {_decorator, instantiate, Node, NodePool, Prefab} from 'cc';

const {ccclass, property} = _decorator;

interface IDictPool {
    [name: string]: NodePool;
}

interface IDictPrefab {
    [name: string]: Prefab;
}

@ccclass('PoolMgr')
export class PoolMgr {

    public static instance() {
        if (!this._instance) {
            this._instance = new PoolMgr();
        }
        return this._instance;
    }

    private static _instance: PoolMgr;
    private _dictPool: IDictPool = {};
    private _dictPrefab: IDictPrefab = {};

    public getNode(prefab: Prefab, parent: Node) {
        const name = prefab.data.name;
        // console.log('get node  ' + name);
        let node: Node = null;
        this._dictPrefab[name] = prefab;
        const pool = this._dictPool[name];
        if (pool) {
            if (pool.size() > 0) {
                node = pool.get();
            } else {
                node = instantiate(prefab);
            }
        } else {
            this._dictPool[name] = new NodePool();
            node = instantiate(prefab);
        }

        node.setParent(parent);
        node.active = true;
        return node;
    }

    public putNode(node: Node) {
        const name = node.name;
        // console.log('put node  ' + name);
        node.parent = null;
        if (!this._dictPool[name]) {
            this._dictPool[name] = new NodePool();
        }
        this._dictPool[name].put(node);
    }
}

