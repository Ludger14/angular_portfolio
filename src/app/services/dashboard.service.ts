import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  //public API = 'http://localhost:8080';
  //public API = 'https://api-portfoli-2478bc1714ca.herokuapp.com/';
  public API = 'https://deploy-render-djf6.onrender.com';
  public CONTROLLER = this.API + '/portfolio';

  constructor(private http: HttpClient) { }

    saveMessage(item: any): Observable<any> {
      const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

      return this.http.post(this.CONTROLLER + '/saveMessage', item, { headers: headers, observe: 'response' });
    }

    downloadCurriculo(idioma: string, cacheBuster: string): Observable<any> {
      const headers = new HttpHeaders().set('Cache-Buster', cacheBuster)
                                        .set('Accept', 'application/pdf');
    
      return this.http.get(this.CONTROLLER + '/downloadCurriculo/' + idioma, { headers, responseType: 'arraybuffer' as 'json' });
    }
    
}
