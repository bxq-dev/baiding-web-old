import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class HistoryApiService {
  constructor (private http: Http) {}

  // getHistory(id: string): Promise<HistoryCommentModel[]> {
  //   return this.http.get(this.url).toPromise()
  //     .then(response => response.json().result as HistoryCommentModel[]);
  //     // .catch(this.handleError);
  // }
}
