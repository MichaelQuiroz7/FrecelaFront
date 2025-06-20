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
  precio: any;
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

export interface LatexRequest {
  Cliente: string;
  Cedula: string;
  Fecha: string;
  Productos: ProductoRequest[];
  SubtotalSinDescuento: number;
  Descuento: number;
  SubtotalConDescuento: number;
  Iva: number;
  Total: number;
}

export interface ProductoRequest {
  Codigo: string;
  Descripcion: string;
  Cantidad: number;
  PrecioUnitario: number;
  Total: number;
}