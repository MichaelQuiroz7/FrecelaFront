export class Comprobante {
  idVenta: number;
  imagen: File | null;
  fecha: Date;
  hora: string; 

  constructor() {
    this.idVenta = 0;
    this.imagen = null;
    this.fecha = new Date();
    this.hora = new Date().toLocaleTimeString('en-US', { hour12: false }); // Formato HH:MM:SS
  }
}