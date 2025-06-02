export interface Empleado {
  idEmpleado: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  fechaNacimiento: string;
  genero: string;
  idRol: number;
  telefono: string | null;
  contrasenia: string | null;
}

export interface EmpleadoDTO {
  idEmpleado: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  edad: string;
  genero: string;
  telefono: string | null;
}

export interface EmpleadoRequest {
  Nombres: string;
  Apellidos: string;
  Cedula: string;
  FechaNacimiento: string;
  Genero: string;
  Telefono: string;
  contrasenia: string;
}

export interface LoginRequest {
  cedula: string;
  contrasenia: string;
}

export interface descuentoEmpleado {
  cedula: string;
  descuento: number;
}
