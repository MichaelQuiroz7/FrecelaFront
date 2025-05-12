import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TiposProductoService {

  private myAppUrl = environment.endpoint;
  private myApiUrl = 'api/TiposProducto';
  private myApiUrl2 = 'api/SubtipoProduct'
  
    constructor(private http: HttpClient) { }

   getTiposProduct(): Observable<any> {
        return this.http.get(`${this.myAppUrl}${this.myApiUrl}`);
    }

    getTiposSubProduct(): Observable<any> {
        return this.http.get(`${this.myAppUrl}${this.myApiUrl2}`);
    }
    
}
