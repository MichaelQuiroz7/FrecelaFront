import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule ],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent {

  productos = [
    {
      nombre: 'Producto 1',
      imagen: 'https://via.placeholder.com/300x200?text=Producto+1',
      descripcion: 'Descripción detallada del Producto 1.'
    },
    {
      nombre: 'Producto 2',
      imagen: 'https://via.placeholder.com/300x200?text=Producto+2',
      descripcion: 'Descripción detallada del Producto 2.'
    },
    {
      nombre: 'Producto 3',
      imagen: 'https://via.placeholder.com/300x200?text=Producto+3',
      descripcion: 'Descripción detallada del Producto 3.'
    },
    {
      nombre: 'Producto 4',
      imagen: 'https://via.placeholder.com/300x200?text=Producto+4',
      descripcion: 'Descripción detallada del Producto 4.'
    }
  ];

  productoSeleccionado: any = null;

  seleccionarProducto(producto: any) {
    this.productoSeleccionado = producto;
  }

  cerrarPanel() {
    this.productoSeleccionado = null;
  }

}
