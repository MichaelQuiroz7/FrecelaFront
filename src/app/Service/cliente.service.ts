import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Cliente, LoginCliente } from '../Model/cliente';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private myAppUrl = environment.endpoint;
  private myApiUrl = 'api/Cliente/IniciarSesion';
  private myApiUrl2 = 'api/Cliente/RegistrarCliente';

  constructor(private http: HttpClient) { }

  login(credentials: LoginCliente): Observable<any> {
      return this.http.post<any>(`${this.myAppUrl}${this.myApiUrl}`, credentials);
  }

  agregarProducto(cliente: Cliente): Observable<Cliente> {
      return this.http.post<Cliente>( `${this.myAppUrl}${this.myApiUrl2}`,cliente);
    }
  
}
