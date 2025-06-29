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
  direccionCliente: string;
  tipoEntrega: string;

}

export interface DetalleVentaConsulta
{
    Code : string; 
    Message : string;
    NombreProducto : string;
    DescripcionProducto : string | null;
    PrecioUnitario : number | null;
    Cantidad : number | null;
    PrecioTotal : number | null;
    NombresCliente : string;
    ApellidosCliente : string;
    CedulaCliente : string;
    DireccionCliente : string;
    TipoEntrega : string;
    EstadoEntrega : string;
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

export interface Entrega{
  IdVenta: number;
  TipoEntrega: string;
  CostoEntrega: number;
  Direccion: string;
}