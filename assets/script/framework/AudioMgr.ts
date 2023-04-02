import {_decorator, AudioClip, AudioSource, Component} from 'cc';

const {ccclass, property} = _decorator;

interface IAudioMap {
    [name: string]: AudioClip;
}

@ccclass('AudioMgr')
export class AudioMgr extends Component {
    @property([AudioClip])
    public audioList: AudioClip[] = [];

    private _dict: IAudioMap = {};
    private _audioSource: AudioSource = null;

    start() {
        for (let i = 0; i < this.audioList.length; i++) {
            const audio = this.audioList[i];
            this._dict[audio.name] = audio;
        }
        this._audioSource = this.getComponent(AudioSource);
    }

    public play(name: string) {
        const audioClip = this._dict[name];
        if (audioClip !== undefined) {
            this._audioSource.playOneShot(audioClip);
        }
    }

    update(deltaTime: number) {

    }
}

