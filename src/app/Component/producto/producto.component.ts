import { LoginService } from './../../Service/login.service';
import { TipoProducto } from './../../Model/tipo-producto';
import { TipoSubproducto } from './../../Model/tipo-sub-producto';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Producto } from '../../Model/producto';
import { ProductosService } from '../../Service/productos.service';
import { Imagen } from '../../Model/imagen';
import { FormsModule, NgSelectOption } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TiposProductoService } from '../../Service/tipos-producto.service';
import { Empleado, EmpleadoDTO } from '../../Model/empleado';
import { Router } from '@angular/router';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css',
})
export class ProductoComponent implements OnInit {
 
showModal: boolean = false;
  empleados: EmpleadoDTO[] = [];
  cantidad: number = 1;
  productos: Producto[] = [];
  imagenes: Imagen[] = [];
  TipoProducto: TipoProducto[] = [];
  selectedTipo: { idTipoProducto: number; nombreTipo: string } | null = null;
  TipoSubproducto: TipoSubproducto[] = [];
  selectedSubproducto: { idTipoSubproducto: number; nombreSubtipo: string } | null = null;
  productoSeleccionado: Producto | null = null;
  nuevoProducto: Producto = {
    idProducto: 0,
    nombre: '',
    precio: 0,
    descripcion: '',
    stock: 0,
    idTipoProducto: 0,
    idTipoSubproducto: 0,
  };
  clienteNombre: string = '';

  constructor(
    private productosService: ProductosService,
    private tiposProductoService: TiposProductoService,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerClienteDesdeLocalStorage();
    this.obtenerProductos();
    this.obtenerImagenes();
    this.obtenerTiposProducto();
    this.obtenerTiposSubproducto();
  }

  obtenerClienteDesdeLocalStorage(): void {
    const clienteData = localStorage.getItem('cliente');
    if (clienteData) {
      const cliente = JSON.parse(clienteData);
      this.clienteNombre = `${cliente.Nombres} ${cliente.Apellidos}`;
    } else {
      this.clienteNombre = '';
    }
  }

  obtenerProductos(): void {
    this.productosService.getProductos().subscribe({
      next: (response: any) => {
        this.productos = response.data.map((p: any) => ({ ...p }));
      },
      error: (error) => {
        console.error('Error al obtener los productos:', error);
      },
    });
  }

  obtenerImagenes(): void {
    this.productosService.getImagenes().subscribe({
      next: (response: any) => {
        this.imagenes = response.data.map((img: any) => ({
          idImagen: img.idImagen,
          idProducto: img.idProducto,
          imagenUrl: img.imagenUrl,
        }));
      },
      error: (error) => {
        console.error('Error al obtener las imágenes:', error);
      },
    });
  }

  seleccionarProducto(producto: Producto): void {
    this.productoSeleccionado = producto;
  }

  cerrarPanel(): void {
    this.productoSeleccionado = null;
    this.cantidad = 1;
  }

  agregarProducto(): void {
    this.productosService.agregarProducto(this.nuevoProducto).subscribe({
      next: (productoAgregado) => {
        this.productos.push({
          ...productoAgregado,
        });
        this.nuevoProducto = {
          idProducto: 0,
          nombre: '',
          precio: 0,
          descripcion: '',
          stock: 0,
          idTipoProducto: 0,
          idTipoSubproducto: 0,
        };
      },
      error: (err) => console.error('Error al agregar producto:', err),
    });
  }

  obtenerImagenDeProducto(idProducto: number): string {
    const img = this.imagenes.find((i) => i.idProducto === idProducto);
    return img ? img.imagenUrl : 'assets/no-image.jpg';
  }

  buscarImagen(idProducto: number): string | undefined {
    const imagen = this.imagenes.find((img) => img.idProducto === idProducto);
    return imagen?.imagenUrl;
  }

  obtenerTiposProducto(): void {
    this.tiposProductoService.getTiposProduct().subscribe({
      next: (response: any) => {
        this.TipoProducto = response.data;
      },
      error: (error) => {
        console.error('Error al obtener los tipos de producto:', error);
      },
    });
  }

  obtenerTiposSubproducto(): void {
    this.tiposProductoService.getTiposSubProduct().subscribe({
      next: (response: any) => {
        this.TipoSubproducto = response.data;
      },
      error: (error) => {
        console.error('Error al obtener los tipos de subproducto:', error);
      },
    });
  }

  filtrar(): void {
    this.productosService.getProductos().subscribe({
      next: (response: any) => {
        let productosFiltrados = response.data;

        if (this.selectedTipo) {
          productosFiltrados = productosFiltrados.filter(
            (p: Producto) => p.idTipoProducto === this.selectedTipo?.idTipoProducto
          );
        }

        if (this.selectedSubproducto) {
          productosFiltrados = productosFiltrados.filter(
            (p: Producto) => p.idTipoSubproducto === this.selectedSubproducto?.idTipoSubproducto
          );
        }

        this.productos = productosFiltrados;
      },
      error: (error) => {
        console.error('Error al filtrar productos:', error);
      },
    });
  }

  selectTipo(tipo: { idTipoProducto: number; nombreTipo: string }) {
    this.selectedTipo = tipo;
    this.filtrar();
  }

  selectSubproducto(subtipo: { idTipoSubproducto: number; nombreSubtipo: string }) {
    this.selectedSubproducto = subtipo;
    this.filtrar();
  }

  limpiarFiltros(): void {
    this.selectedTipo = null;
    this.selectedSubproducto = null;
    this.obtenerProductos();
  }

  obtenerEmpleados(): void {
    this.loginService.getEmpleados().subscribe({
      next: (response: any) => {
        this.empleados = response.data;
        console.log('Empleados response:', response.data);
      },
      error: (error) => {
        console.error('Error al obtener los empleados:', error);
      },
    });
  }

  elegirAsesor(): void {
    this.showModal = true;
    this.obtenerEmpleados();
  }

  cerrarModal(): void {
    this.showModal = false;
    this.empleados = [];
  }

  seleccionarAsesor(empleado: EmpleadoDTO): void {
    if (!this.productoSeleccionado) {
      console.error('No hay producto seleccionado');
      this.cerrarModal();
      return;
    }

    let phone = empleado.telefono?.replace(/[\s-]/g, '') || '';
    if (phone && !phone.startsWith('+')) {
      phone = '+593' + phone;
    }

    const productoNombre = this.productoSeleccionado.nombre;
    const precioUnitario = this.productoSeleccionado.precio.toFixed(2);
    const cantidad = this.cantidad;
    const total = (this.productoSeleccionado.precio * this.cantidad).toFixed(2);

    const mensaje = `Hola ${empleado.nombres}, estoy interesado en comprar:\n` +
                    `Producto: ${productoNombre}\n` +
                    `Precio unitario: $${precioUnitario}\n` +
                    `Cantidad: ${cantidad}\n` +
                    `Total: $${total}\n` +
                    `Por favor, contáctame para coordinar.`;

    // Codificar el mensaje para la URL
    const mensajeEncoded = encodeURIComponent(mensaje);

    // Construir la URL de WhatsApp
    const whatsappUrl = `https://wa.me/${phone}?text=${mensajeEncoded}`;

    // abrir el chat de WhatsApp en una nueva pestaña o ventana
    window.open(whatsappUrl, '_blank');

    console.log('Asesor seleccionado:', empleado);
    this.cerrarModal();
  }

  consultarPedidos(): void {
    // Placeholder for future implementation
    console.log('Consultar pedidos clicked');
  }

  cerrarSesion(): void {
    localStorage.removeItem('cliente');
    this.router.navigate(['/InicioSesion']);
  }

}
