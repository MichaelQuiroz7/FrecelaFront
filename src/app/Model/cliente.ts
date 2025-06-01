export interface Cliente {
    Cedula: string;
    Nombres: string;
    Apellidos: string;
    Direccion: string;
    CorreoElectronico: string;
    Clave: string;
    Telefono: string;
}

export interface ClienteDTO {
    Nombres: string;
    Apellidos: string;
    Cedula: string;
    Direccion: string;
    Telefono: string;
}

export interface LoginCliente{
    CorreoElectronico: string;
    Clave: string;
}
