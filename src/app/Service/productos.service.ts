import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../Model/producto';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private myAppUrl = environment.endpoint;
  private myApiUrl = 'api/Producto';
  private myApiUrlImage = 'api/Imagen';
  private myApiUrl2 = 'stock';
  private myApiUrl3 = 'api/Imagen/SubirImagenes';
  private myApiUrl4 = 'api/Producto/ProductosBajoStock';
  private myApiUrl5 = 'api/Imagen/SubirImagenEmpleado';

  constructor(private http: HttpClient) {}

  getProductos(): Observable<any> {
    return this.http.get(`${this.myAppUrl}${this.myApiUrl}`);
  }

  agregarProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(
      `${this.myAppUrl}${this.myApiUrl}`,
      producto
    );
  }

  getImagenes(): Observable<any> {
    return this.http.get(`${this.myAppUrl}${this.myApiUrlImage}`);
  }

  actualizarProducto(producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(
      `${this.myAppUrl}${this.myApiUrl}/${producto.idProducto}`,
      producto
    );
  }

  eliminarProducto(idProducto: number, idrol: number): Observable<any> {
    return this.http.delete<any>(
      `${this.myAppUrl}${this.myApiUrl}/${idProducto}?idrol=${idrol}`
    );
  }

  actualizarStock(
    idProducto: number,
    aumentar: boolean,
    cantidad: number
  ): Observable<any> {
    const body = {
      IdProducto: idProducto,
      aumentar: aumentar,
      cantidad: cantidad,
    };
    return this.http.put<any>(`${this.myAppUrl}${this.myApiUrl2}`, body);
  }

  crearProducto(producto: Producto): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}`, producto);
  }

  uploadImage(formData: FormData): Observable<any> {
    return this.http.post(
      `${this.myAppUrl}${this.myApiUrlImage}/SubirImagen`,
      formData
    );
  }

  //   uploadImages(formData: FormData): Observable<any> {
  // return this.http.post(`${this.myAppUrl}${this.myApiUrlImage}/SubirImagenes`, formData);
  //   }

  uploadImages(formData: FormData): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.myApiUrl3}`, formData);
  }

  //https://localhost:7077/api/Imagen/23
  eliminarImagen(idImagen: number): Observable<any> {
    console.log('Eliminando imagen con ruta:', `${this.myAppUrl}${this.myApiUrlImage}/${idImagen}`);
    return this.http.delete(`${this.myAppUrl}${this.myApiUrlImage}/${idImagen}`);
  }

  getProductosBajoStock(): Observable<any> {
    return this.http.get(`${this.myAppUrl}${this.myApiUrl4}`);
  }

  uploadImageEmpleado(formData: FormData): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.myApiUrl5}`, formData);
  }
}
