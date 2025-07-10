export interface Producto {
    idProducto: number;
    nombre: string;
    precio: number;
    descripcion: string;
    stock: number;
    idTipoProducto: number;
    idTipoSubproducto: number;
}

export interface ComprobanteConsultados {
  idVenta: number;
  estado: string;
  imagenBase64: string;
  fecha: string | null;
  code: number;
  message: string;
  nombreProducto: string;
  descripcionProducto: string;
  precioUnitario: number;
  cantidad: number;
  precioTotal: number;
  nombresCliente: string;
  apellidosCliente: string;
  cedulaCliente: string;
  direccionCliente: string;
  tipoEntrega: string;
  observaciones: string;
}


export interface ComprobanteConsultatres {
  code: string;
  message: string;
  idVenta: number;
  estado: string;
  imagenBase64: string;
  fecha: Date | null;
  nombreProducto: string | null;
  descripcionProducto: string | null;
  precioUnitario: number | null;
  cantidad: number | null;
  precioTotal: number | null;
  nombresCliente: string | null;
  apellidosCliente: string | null;
  cedulaCliente: string | null;
  direccionCliente: string | null;
  tipoEntrega: string | null;
  observaciones: string | null;
}

export interface DetalleVentaConsultatres {
  Code: string;
  Message: string;
  NombreProducto: string;
  DescripcionProducto: string | null;
  PrecioUnitario: number | null;
  Cantidad: number | null;
  PrecioTotal: number | null;
  NombresCliente: string;
  ApellidosCliente: string;
  CedulaCliente: string;
  DireccionCliente: string;
  TipoEntrega: string;
  EstadoEntrega: string;
}

