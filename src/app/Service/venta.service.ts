import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DetalleVentaRequest, LatexRequest, Venta } from '../Model/venta';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  

  private myAppUrl = environment.endpoint;
  private myApiUrl = 'api/Venta/RegistrarPedido';
  private myApiUrl2 = 'api/Venta/detallePedido';
  private myApiUrl3 = 'api/Venta/convert-to-pdf';
  private myApiUrl4 = 'api/Venta/registrarPago';
  private myApiUrl5 = 'api/Venta/estadisticasMes'

  constructor(private http: HttpClient) {}

  registrarPedido(venta: Venta): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}`, venta);
  }

  getDetalleVenta(request: DetalleVentaRequest): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.myApiUrl2}`, request);
  }

  generarFacturaPdf(request: LatexRequest): Observable<Blob> {
    return this.http.post(`${this.myAppUrl}${this.myApiUrl3}`, request, { responseType: 'blob' });
  }

  subirComprobante(formData: FormData) {
    return this.http.post(`${this.myAppUrl}${this.myApiUrl4}`, formData);
  }
  
  getEstadisticasVentasPorMes(): Observable<any> {
    return this.http.get(`${this.myAppUrl}${this.myApiUrl5}`);
  }

}
