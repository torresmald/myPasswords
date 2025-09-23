import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SendMail } from '../interfaces/send-mail.interface';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MailService {
  private http = inject(HttpClient);

  public sendMail(config: SendMail): Observable<string> {
    return this.http.post<string>(`${environment.API_URL}/mail/send`, config);
  }
}
