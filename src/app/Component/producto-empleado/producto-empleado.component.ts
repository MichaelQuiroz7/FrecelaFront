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
import { Router } from '@angular/router';

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
  showConfirmDeleteImageModal: boolean = false;
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
  selectedImages: File[] = [];
  imagenIdToDelete: number | null = null;
  cantidadStock: number = 1;
  aumentarStock: boolean = true;
  searchTerm: string = '';
  userRole: string | null = null;
  nombre: string = '';
  apellido: string = '';

  productos: Producto[] = [];
  imagenes: Imagen[] = [];
  TipoProducto: TipoProducto[] = [];
  TipoSubproducto: TipoSubproducto[] = [];
  selectedTipo: { idTipoProducto: number; nombreTipo: string } | null = null;
  selectedSubproducto: { idTipoSubproducto: number; nombreSubtipo: string } | null = null;
  productoSeleccionado: Producto | null = null;
  cantidad: number = 1;
  productosFiltrados: Producto[] = [];

  constructor(
    private productosService: ProductosService,
    private tiposProductoService: TiposProductoService,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.nombre = localStorage.getItem('nombre') || '';
    this.apellido = localStorage.getItem('apellido') || '';
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
        this.productosFiltrados = [...this.productos];
      },
      error: (error) => {
        console.error('Error al obtener los productos:', error);
      },
    });
  }

  buscarProductos(): void {
    if (this.searchTerm.trim() === '') {
      this.productosFiltrados = [...this.productos];
    } else {
      this.productosFiltrados = this.productos.filter((p: Producto) =>
        p.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  limpiarBusqueda(): void {
    this.searchTerm = '';
    this.productosFiltrados = [...this.productos];
  }

  cerrarSesion(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
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

  obtenerImagenesDeProducto(idProducto: number): Imagen[] {
    return this.imagenes.filter((i) => i.idProducto === idProducto);
  }

  obtenerImagenDeProducto(idProducto: number): string {
    const img = this.imagenes.find((i) => i.idProducto === idProducto);
    return img ? img.imagenUrl : 'assets/no-image.jpg';
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

  abrirModalEditar(producto: Producto): void {
    this.productoEditado = { ...producto };
    this.selectedTipo = this.TipoProducto.find((t) => t.idTipoProducto === producto.idTipoProducto) || null;
    this.selectedSubproducto = this.TipoSubproducto.find((s) => s.idTipoSubproducto === producto.idTipoSubproducto) || null;
    this.selectedImages = [];
    this.showEditModal = true;
  }

  cerrarModalEditar(): void {
    this.showEditModal = false;
    this.selectedTipo = null;
    this.selectedSubproducto = null;
    this.selectedImages = [];
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

  abrirModalConfirmarEliminarImagen(idImagen: number): void {
    this.imagenIdToDelete = idImagen;
    this.showConfirmDeleteImageModal = true;
  }

  cerrarModalConfirmarEliminarImagen(): void {
    this.showConfirmDeleteImageModal = false;
    this.imagenIdToDelete = null;
  }

  eliminarImagen(): void {
    if (this.imagenIdToDelete === null) {
      console.error('Error: No se seleccionó ninguna imagen para eliminar');
      return;
    }
    this.productosService.eliminarImagen(this.imagenIdToDelete).subscribe({
      next: () => {
        this.imagenes = this.imagenes.filter((img) => img.idImagen !== this.imagenIdToDelete);
        this.cerrarModalConfirmarEliminarImagen();
      },
      error: (error) => {
        console.error('Error al eliminar la imagen:', error);
        alert('Error al eliminar la imagen. Por favor, intenta de nuevo.');
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImages = Array.from(input.files);
    }
  }

  subirImagenes(isAddModal: boolean): void {
    if (this.selectedImages.length === 0) {
      alert('No hay imágenes seleccionadas para subir.');
      return;
    }

    const idProducto = isAddModal ? this.nuevoProducto.idProducto : this.productoEditado.idProducto;

    if (!idProducto && isAddModal) {
      alert('Por favor, guarda el producto primero antes de subir imágenes.');
      return;
    }

    const formData = new FormData();
    this.selectedImages.forEach((image) => {
      formData.append('Imagenes[]', image);
    });
    formData.append('IdProducto', idProducto.toString());

    this.productosService.uploadImages(formData).subscribe({
      next: (imageResponse: any) => {
        const newImages = imageResponse.data.map((img: any) => ({
          idImagen: img.idImagen,
          idProducto: idProducto,
          imagenUrl: img.imagenUrl,
        }));
        this.imagenes.push(...newImages);
        this.selectedImages = [];
        alert('Imágenes subidas exitosamente.');
      },
      error: (error) => {
        console.error('Error al subir las imágenes:', error);
        alert('Error al subir las imágenes. Por favor, intenta de nuevo.');
      },
    });
  }

  guardarEdicion(): void {
    this.productosService.actualizarProducto(this.productoEditado).subscribe({
      next: () => {
        this.productos = this.productos.map((p) =>
          p.idProducto === this.productoEditado.idProducto ? { ...this.productoEditado } : p
        );
        this.productosFiltrados = this.productosFiltrados.map((p) =>
          p.idProducto === this.productoEditado.idProducto ? { ...this.productoEditado } : p
        );
        this.cerrarModalEditar();
        alert('Producto actualizado exitosamente.');
      },
      error: (error) => {
        console.error('Error al actualizar producto:', error);
        alert('Error al actualizar el producto.');
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
          this.productosFiltrados = this.productosFiltrados.filter((p) => p.idProducto !== producto.idProducto);
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
    this.selectedImages = [];
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
    this.selectedImages = [];
  }

  guardarNuevoProducto(): void {
    if (!this.nuevoProducto.nombre || !this.nuevoProducto.idTipoProducto || !this.nuevoProducto.idTipoSubproducto) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }

    this.productosService.crearProducto(this.nuevoProducto).subscribe({
      next: (response: any) => {
        const newProductId = response.data.idProducto;
        const newProduct = { ...this.nuevoProducto, idProducto: newProductId };
        this.productos.push(newProduct);
        this.productosFiltrados.push(newProduct);

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
