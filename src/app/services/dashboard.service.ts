import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  public API = 'http://localhost:8080';
  //public API = 'https://api-portfoli-2478bc1714ca.herokuapp.com/';
  //public API = 'https://deploy-render-djf6.onrender.com';
  public CONTROLLER = this.API + '/portfolio';

  constructor(private http: HttpClient) { }

    saveMessage(item: any): Observable<any> {
      const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

      return this.http.post(this.CONTROLLER + '/saveMessage', item, { headers: headers, observe: 'response' });
    }

    downloadCurriculo(item: any): Observable<any> {
      const headers = new HttpHeaders().set('Accept', 'application/pdf');

      return this.http.get(this.CONTROLLER + '/downloadCurriculo/' + item, { headers, responseType: 'arraybuffer' as 'json' });
    }

}
