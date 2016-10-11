import {Component, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {Router} from '@angular/router';

import {MessageModel} from '../../../shared/api/message.model';
import {UserInfoModel} from '../../../shared/user-info/user-info.model';
import {LiveService} from '../../../shared/live/live.service';
import {LiveInfoModel} from '../../../shared/live/live.model';
import {MessageService} from './message.service';
import {UserAnimEmoji} from '../../../shared/praised-animation/praised-animation.model';
import {AudioPlayerComponent} from '../../../shared/audio-player/audio-player.component'

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  providers: [MessageService]
})

export class MessageComponent {
  @Input() liveId: string;
  @Input() message: MessageModel;
  @Input() userInfo: UserInfoModel;
  @Input() liveInfo: LiveInfoModel;

  @Output() audioPlayEnded = new EventEmitter();
  @ViewChild('audioPlayer') audioPlayer: AudioPlayerComponent;

  isLoading: boolean;
  praisesNum: number = 0;
  timer: any = -1;
  praised: boolean;

  constructor(private messageService: MessageService, private router: Router, private liveService: LiveService) {

  }

  audioPlayEndedHandler(msg: MessageModel) {
    this.audioPlayEnded.emit(msg);
  }

  confirmPraise() {

    let userAnim = new UserAnimEmoji;
    userAnim.user = this.userInfo;
    this.message.praisedAnimations.push(userAnim);

    this.praisesNum += 1;
    if (this.praisesNum > 3) {
      return;
    }

    if (!this.message.hadPraised) {
      this.message.praisedAmount += 1;
    }
    this.message.hadPraised = true;

    if (this.isLoading) {
      return;
    }

    if (this.timer > -1) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      this.isLoading = true;
      let praisesNum = this.praisesNum
      if (praisesNum > 10) {
        praisesNum = 10;
      }
      this.praisesNum = 0;
      this.messageService.confirmPraise(this.liveInfo.id, this.message.id, this.praised, praisesNum).then(() => {
        this.praised = true;
        this.timer = -1;
        this.isLoading = false;
      });
    }, 1000);
  }

  isEditor() {
    return this.liveService.isEditor(this.liveId);
  }

  isAudience() {
    return this.liveService.isAudience(this.liveId);
  }

  setPraise() {
    this.confirmPraise();
  }

  gotoReply() {
    this.router.navigate([`/lives/${this.liveInfo.id}/post`, {'message_id': this.message.id}]);
  }

  canReply(): boolean {
    return this.message.user.uid !== this.userInfo.uid && !this.isAudience();
  }

  goToShare() {
    this.router.navigate([`/lives/${this.liveInfo.id}/share/${this.message.id}`]);
  }

  playAudio() {
    this.audioPlayer.playIfNotPlayed();
  }
}
