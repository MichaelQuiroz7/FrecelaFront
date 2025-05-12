import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../Model/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private myAppUrl = environment.endpoint;
  private myApiUrl = 'api/Producto';
  private myApiUrlImage = 'api/Imagen'

  constructor(private http: HttpClient) { }

  getProductos(): Observable<any> {
      return this.http.get(`${this.myAppUrl}${this.myApiUrl}`);
  }

  agregarProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(`${this.myAppUrl}${this.myApiUrl}`, producto);
  }

  getImagenes(): Observable<any> {
      return this.http.get(`${this.myAppUrl}${this.myApiUrlImage}`);
  }

}
