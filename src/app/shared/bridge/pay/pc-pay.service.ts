import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {PayBridge} from "../pay.interface";
import {Headers, Http} from "@angular/http";
import {PayPopupService} from "../../pay-popup/pay-popup.service";
import {LiveService} from "../../api/live/live.service";
import {Subscription} from "rxjs";

@Injectable()
export class PcPayService implements PayBridge {
  private payPopupSub: Subscription;

  constructor(private http: Http, private payPopupService: PayPopupService, private liveService: LiveService) {
  }

  _pay(liveId: string): Promise<string> {
    const payUrl = `${environment.config.host.io}/api/live/streams/${liveId}/pay`;
    let headers = new Headers({'Content-Type': 'application/json'});

    return new Promise((resolve, reject) => {
      this.http.post(payUrl, JSON.stringify({"platform": 2}), {headers: headers}).toPromise().then(res => {
        let data = res.json();
        this.payPopupService.setPayUrl(data.wxPay.codeUrl);
        this.payPopupSub = this.payPopupService.close$.subscribe(() => {
          reject('cancel');
          this.payPopupSub.unsubscribe();
        });
      });

      let count = 0;
      let timer = setInterval(() => {
        this.liveService.getLiveInfo(liveId, true).then(liveInfo => {
          if (liveInfo.paid) {
            clearInterval(timer);
            resolve('');
            this.payPopupService.switch(false);
            return;
          }

          if (count > 100) {
            clearInterval(timer);
            reject();
            if (this.payPopupSub) this.payPopupSub.unsubscribe();
            return;
          }

          count++;
        });
      }, 1500);
    });

  }


  pay(liveId: string): Promise<string> {
    this.payPopupService.switch(true);

    return this._pay(liveId);
  }
}