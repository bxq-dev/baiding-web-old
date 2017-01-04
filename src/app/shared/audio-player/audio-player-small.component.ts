import {Component, Input, Output, EventEmitter, OnInit, OnDestroy} from '@angular/core';

import {AudioPlayerService} from './audio-player.service';
import {MessageModel} from '../api/message/message.model';
import {UtilsService} from "../utils/utils";
import {Subscription} from "rxjs";
import {AudioListPlayerEventType} from "./audio-list-player.model";

@Component({
  selector: 'audio-player-small',
  templateUrl: './audio-player-small.component.html',
  styleUrls: ['./audio-player-small.component.scss'],
})

export class AudioPlayerSmallComponent implements OnInit, OnDestroy {
  @Input() message: MessageModel;
  @Output() playEnded = new EventEmitter();
  played: boolean;
  isLoaded = true;
  totalDuration = moment.duration(0);
  currentDuration = moment.duration(0);
  currentDurationTimer: any;
  playbackRate = 1;
  audioSub: Subscription;

  constructor(private audioPlayerService: AudioPlayerService) {
  }

  ngOnInit() {
    this.totalDuration = moment.duration(this.message.audio.duration);
    this.played = !!UtilsService.getStorage('audioPlayed')[this.message.id];

    this.audioSub = this.audioPlayerService.globalAudio$.subscribe((e) => {

      if (e.type === AudioListPlayerEventType.Play && e.data.message === this.message) {
        if (!this.played) {
          this.played = true;
          this.setPlayed(this.message.id);
        }
      }
    });
  }

  playOrStopVoice() {
    if (this._isPlaying()) {
      this.audioPlayerService.stop(this.message)
    } else {
      this.play();
      this.setCurrentDuration();
    }
  }

  setPlayed(id: string) {
    let audioPlayed = UtilsService.getStorage('audioPlayed');
    audioPlayed[id] = true;
    UtilsService.setStorage('audioPlayed', audioPlayed);
  }

  play() {
    this.isLoaded = false;

    this.audioPlayerService.userActivated = true;
    this.audioPlayerService.play(this.message).subscribe(value => {
      if (value === 'loaded') {
        this.isLoaded = true;
      }
    }, () => {
    }, () => {
      this.playEnded.emit(this.message);
    });
  }

  private _isPlaying() {
    return this.audioPlayerService.isPlaying(this.message);
  }

  get isPlaying(): boolean {
    let playing = this._isPlaying();

    if (playing) {
      if (!this.currentDurationTimer || this.playbackRate != this.audioPlayerService.playbackRate) {
        this.setPlaybackTimer();
        this.playbackRate = this.audioPlayerService.playbackRate;
      }
    } else {
      if (this.currentDurationTimer) {
        clearInterval(this.currentDurationTimer);
        this.currentDurationTimer = null;
      }
    }

    return playing;
  }

  get isPlayed(): boolean {
    return this.played;
  }

  setCurrentDuration() {
    this.currentDuration = moment.duration(this.audioPlayerService.currentTime * 1000);
  }

  setPlaybackTimer() {
    if (this.currentDurationTimer) clearInterval(this.currentDurationTimer);

    this.currentDurationTimer = setInterval(() => {
      this.setCurrentDuration();
    }, 1000 / this.audioPlayerService.playbackRate);
  }

  ngOnDestroy() {
    if (this.isPlaying) this.audioPlayerService.stop(this.message);
    if (this.audioSub) this.audioSub.unsubscribe();
  }
}