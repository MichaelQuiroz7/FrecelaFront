export interface IngresarVentaRequest {
    cedulaCliente: string;
  cedulaEmpleado: string;
  fecha: string;
  hora: string;
  idProducto: number;
  precioUnitario: number;
  cantidad: number;
  precioTotal: number;
  estado: string;
  descuento: number;
}
