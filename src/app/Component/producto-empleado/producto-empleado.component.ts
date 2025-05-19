import { Component } from '@angular/core';
import { ProductosService } from '../../Service/productos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Producto } from '../../Model/producto';
import { Imagen } from '../../Model/imagen';
import { TipoProducto } from '../../Model/tipo-producto';
import { TipoSubproducto } from '../../Model/tipo-sub-producto';
import { TiposProductoService } from '../../Service/tipos-producto.service';
import { LoginService } from '../../Service/login.service';

@Component({
  selector: 'app-producto-empleado',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './producto-empleado.component.html',
  styleUrl: './producto-empleado.component.css',
})
export class ProductoEmpleadoComponent {
  
  showEditModal: boolean = false;
  showStockModal: boolean = false;
  showAddModal: boolean = false; 
  productoEditado: Producto = {
    idProducto: 0,
    nombre: '',
    precio: 0,
    descripcion: '',
    stock: 0,
    idTipoProducto: 0,
    idTipoSubproducto: 0,
  };
  nuevoProducto: Producto = {
    idProducto: 0,
    nombre: '',
    precio: 0,
    descripcion: '',
    stock: 0,
    idTipoProducto: 0,
    idTipoSubproducto: 0,
  };
  selectedImage: File | null = null; 
  cantidadStock: number = 1;
  aumentarStock: boolean = true;
  searchTerm: string = '';
  userRole: string | null = null;

  productos: Producto[] = [];
  imagenes: Imagen[] = [];
  TipoProducto: TipoProducto[] = [];
  TipoSubproducto: TipoSubproducto[] = [];
  selectedTipo: { idTipoProducto: number; nombreTipo: string } | null = null;
  selectedSubproducto: { idTipoSubproducto: number; nombreSubtipo: string } | null = null;
  productoSeleccionado: Producto | null = null;
  cantidad: number = 1;
  filtroNombre: string = '';
productosFiltrados: Producto[] = [];

  constructor(
    private productosService: ProductosService,
    private tiposProductoService: TiposProductoService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.obtenerProductos();
    this.obtenerImagenes();
    this.obtenerTiposProducto();
    this.obtenerTiposSubproducto();
    this.checkUserRole();
  }

  checkUserRole(): void {
    this.userRole = localStorage.getItem('token');
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

  buscarProductos(): void {
    this.productosService.getProductos().subscribe({
      next: (response: any) => {
        this.productos = response.data.filter((p: Producto) =>
          p.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      },
      error: (error) => {
        console.error('Error al buscar productos:', error);
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

  selectTipo(tipo: { idTipoProducto: number; nombreTipo: string }): void {
    this.selectedTipo = tipo;
    if (this.showAddModal) {
      this.nuevoProducto.idTipoProducto = tipo.idTipoProducto;
    } else {
      this.productoEditado.idTipoProducto = tipo.idTipoProducto;
    }
  }

  selectSubproducto(subtipo: { idTipoSubproducto: number; nombreSubtipo: string }): void {
    this.selectedSubproducto = subtipo;
    if (this.showAddModal) {
      this.nuevoProducto.idTipoSubproducto = subtipo.idTipoSubproducto;
    } else {
      this.productoEditado.idTipoSubproducto = subtipo.idTipoSubproducto;
    }
  }

  seleccionarProducto(producto: Producto): void {
    this.productoSeleccionado = producto;
  }

  cerrarPanel(): void {
    this.productoSeleccionado = null;
    this.cantidad = 1;
  }

  obtenerImagenDeProducto(idProducto: number): string {
    const img = this.imagenes.find((i) => i.idProducto === idProducto);
    return img ? img.imagenUrl : 'assets/no-image.jpg';
  }

  abrirModalEditar(producto: Producto): void {
    this.productoEditado = { ...producto };
    this.selectedTipo = this.TipoProducto.find((t) => t.idTipoProducto === producto.idTipoProducto) || null;
    this.selectedSubproducto = this.TipoSubproducto.find((s) => s.idTipoSubproducto === producto.idTipoSubproducto) || null;
    this.showEditModal = true;
  }

  cerrarModalEditar(): void {
    this.showEditModal = false;
    this.selectedTipo = null;
    this.selectedSubproducto = null;
    this.productoEditado = {
      idProducto: 0,
      nombre: '',
      precio: 0,
      descripcion: '',
      stock: 0,
      idTipoProducto: 0,
      idTipoSubproducto: 0,
    };
  }

  guardarEdicion(): void {
    this.productosService.actualizarProducto(this.productoEditado).subscribe({
      next: () => {
        this.productos = this.productos.map((p) =>
          p.idProducto === this.productoEditado.idProducto ? { ...this.productoEditado } : p
        );
        this.cerrarModalEditar();
      },
      error: (error) => {
        console.error('Error al actualizar producto:', error);
      },
    });
  }

  confirmarEliminar(producto: Producto): void {
  
  if (confirm(`¿Está seguro de que desea eliminar el producto ${producto.nombre}?`)) {
    this.userRole = localStorage.getItem('token');
    const userRoleNumber = this.userRole ? Number(this.userRole) : null;
    if (userRoleNumber === null || isNaN(userRoleNumber)) {
      alert('No se pudo obtener el rol del usuario. Verifica si tienes permisos.');
      return;
    }
    this.productosService.eliminarProducto(producto.idProducto, userRoleNumber).subscribe({
      next: () => {
        this.productos = this.productos.filter((p) => p.idProducto !== producto.idProducto);
      },
      error: (error) => {
        console.error('Error al eliminar producto:', error);
        alert('No se pudo eliminar el producto. Verifica si tienes permisos.');
      },
    });
  }
}


  abrirModalStock(aumentar: boolean): void {
    this.aumentarStock = aumentar;
    this.cantidadStock = 1;
    this.showStockModal = true;
  }

  cerrarModalStock(): void {
    this.showStockModal = false;
    this.cantidadStock = 1;
  }

  confirmarStock(): void {
    if (this.productoSeleccionado == null) {
      console.error('Error: productoSeleccionado es null');
      return;
    }
    console.log('Actualizando stock:', {
      idProducto: this.productoSeleccionado.idProducto,
      aumentar: this.aumentarStock,
      cantidad: this.cantidadStock,
    });
    this.productosService
      .actualizarStock(this.productoSeleccionado.idProducto, this.aumentarStock, this.cantidadStock)
      .subscribe({
        next: (response) => {
          alert(response.message);
          this.cerrarModalStock();
          this.cerrarModalEditar();
          this.obtenerProductos();
          this.cerrarPanel();
        },
        error: (error) => {
          console.error('Error al actualizar stock:', error);
          alert('Error al actualizar el stock. Por favor, inténtelo de nuevo.');
        },
      });
  }
  
  abrirModalAgregar(): void {
    this.nuevoProducto = {
      idProducto: 0,
      nombre: '',
      precio: 0,
      descripcion: '',
      stock: 0,
      idTipoProducto: 0,
      idTipoSubproducto: 0,
    };
    this.selectedTipo = null;
    this.selectedSubproducto = null;
    this.selectedImage = null;
    this.showAddModal = true;
  }

  cerrarModalAgregar(): void {
    this.showAddModal = false;
    this.nuevoProducto = {
      idProducto: 0,
      nombre: '',
      precio: 0,
      descripcion: '',
      stock: 0,
      idTipoProducto: 0,
      idTipoSubproducto: 0,
    };
    this.selectedTipo = null;
    this.selectedSubproducto = null;
    this.selectedImage = null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
    }
  }

  guardarNuevoProducto(): void {
  if (!this.nuevoProducto.nombre || !this.nuevoProducto.idTipoProducto || !this.nuevoProducto.idTipoSubproducto) {
    alert('Por favor, completa todos los campos requeridos.');
    return;
  }

  this.productosService.crearProducto(this.nuevoProducto).subscribe({
    next: (response: any) => {
      const newProductId = response.data.idProducto;
      this.productos.push({ ...this.nuevoProducto, idProducto: newProductId });

      // Subir imagen si está seleccionada
      if (this.selectedImage) {
        const formData = new FormData();
        formData.append('Imagen', this.selectedImage); 
        formData.append('IdProducto', newProductId.toString()); 

        this.productosService.uploadImage(formData).subscribe({
          next: (imageResponse: any) => {
            const imagePath = imageResponse.data.imagenUrl;
            this.imagenes.push({
              idImagen: imageResponse.data.idImagen,
              idProducto: newProductId,
              imagenUrl: imagePath,
            });

            this.obtenerProductos();
            this.cerrarModalAgregar();
          },
          error: (error) => {
            console.error('Error al subir la imagen:', error);
            alert('Producto guardado, pero error al subir la imagen.');
            this.cerrarModalAgregar();
          },
        });
      } else {
        this.cerrarModalAgregar();
        this.obtenerProductos();
      }
    },
    error: (error) => {
      console.error('Error al crear producto:', error);
      alert('Error al guardar el producto.');
    },
  });
}


}
