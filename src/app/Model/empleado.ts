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

export interface LoginRequest {
  cedula: string;
  contrasenia: string;
}

