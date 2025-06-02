import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { descuentoEmpleado, Empleado, EmpleadoRequest, LoginRequest } from '../Model/empleado';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private myAppUrl = environment.endpoint;
  private myApiUrl = 'api/Empleado/login';
  private myApiUrl2 = 'api/Empleado';
  constructor(private http: HttpClient) { }

  // Obtener todos los empleados
  getEmpleados(): Observable<any> {
    return this.http.get(`${this.myAppUrl}${this.myApiUrl2}`);
  }

  // Validar credenciales de login
  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.myAppUrl}${this.myApiUrl}`, credentials);
  }

  // Registrar un nuevo empleado
  registrarEmpleado(empleado: EmpleadoRequest): Observable<any> {
    return this.http.post<any>(`${this.myAppUrl}${this.myApiUrl2}`, empleado);
  }

  //Registrar descuento de empleado
  registrarDescuentoEmpleado(descuento: descuentoEmpleado): Observable<any> {
    return this.http.post<any>(`${this.myAppUrl}${this.myApiUrl2}/descuento`, descuento);
  }

  // Obtener descuentos por cédula
  getDescuentoByCedula(cedula: string): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.myAppUrl}${this.myApiUrl2}/descuento/${cedula}`);
  }

}
