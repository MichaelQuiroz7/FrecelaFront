export interface Venta {
    CedulaCliente: string;
    CedulaEmpleado: string;
    IdProducto: number;
    Cantidad: number;
    PrecioUnitario: number;
}

export interface DetalleVentaRequest {
  IdVentaBase64: string;
}

export interface DetalleVentaResponse {
  code: string;
  message: string;
  nombreProducto: string;
  descripcionProducto: string | null;
  precioUnitario: number | null;
  cantidad: number | null;
  precioTotal: number | null;
  nombresCliente: string;
  apellidosCliente: string;
  cedulaCliente: string;
}
