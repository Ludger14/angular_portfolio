import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  public API = 'http://localhost:8080';
  //public API = 'https://api-fatto-f0fedcf2976d.herokuapp.com';
  public CONTROLLER = this.API + '/portfolio';

  constructor(private http: HttpClient) { }

    saveMessage(item: any): Observable<any> {
      const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

      return this.http.post(this.CONTROLLER + '/saveMessage', item, { headers: headers, observe: 'response' });
    }

    getAllTask(){
      const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

      return this.http.get(this.CONTROLLER + '/getAllTask', { headers: headers, observe: 'response' });
    }

    editTask(name: string, item: any): Observable<any> {
      const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

      return this.http.put(this.CONTROLLER + '/editTask/' + name, item, { headers: headers, observe: 'response' });
    }

    deleteTask(item: any): Observable<any> {
      const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

      return this.http.delete(this.CONTROLLER + '/deleteTask/' + item, { headers: headers, observe: 'response' });
    }

}
