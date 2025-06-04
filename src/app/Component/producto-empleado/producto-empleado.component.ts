import { Component } from '@angular/core';
import { ProductosService } from '../../Service/productos.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Producto } from '../../Model/producto';
import { Imagen } from '../../Model/imagen';
import { TipoProducto } from '../../Model/tipo-producto';
import { TipoSubproducto } from '../../Model/tipo-sub-producto';
import { TiposProductoService } from '../../Service/tipos-producto.service';
import { LoginService } from '../../Service/login.service';
import { Router } from '@angular/router';
import {
  descuentoEmpleado,
  EmpleadoDTO,
  EmpleadoRequest,
} from '../../Model/empleado';
import {
  DetalleVentaRequest,
  DetalleVentaResponse,
  LatexRequest,
} from '../../Model/venta';
import { VentaService } from '../../Service/venta.service';

@Component({
  selector: 'app-producto-empleado',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, ReactiveFormsModule],
  templateUrl: './producto-empleado.component.html',
  styleUrl: './producto-empleado.component.css',
})
export class ProductoEmpleadoComponent {

  isGeneratingPDF: boolean = false;

  showEditModal: boolean = false;
  showStockModal: boolean = false;
  showAddModal: boolean = false;
  showAddEmployeeModal: boolean = false;
  showConfirmDeleteImageModal: boolean = false;
  showManageEmployeesModal: boolean = false;
  showSaleDetailsModal: boolean = false;

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
  empleadoForm: FormGroup;
  selectedImage: File | null = null;
  selectedImages: File[] = [];
  imagenIdToDelete: number | null = null;
  cantidadStock: number = 1;
  aumentarStock: boolean = true;
  searchTerm: string = '';
  saleCode: string = '';
  userRole: string | null = null;
  nombre: string = '';
  apellido: string = '';
  ceduladesc: string = '';

  productos: Producto[] = [];
  imagenes: Imagen[] = [];
  TipoProducto: TipoProducto[] = [];
  TipoSubproducto: TipoSubproducto[] = [];
  empleados: EmpleadoDTO[] = [];
  selectedTipo: { idTipoProducto: number; nombreTipo: string } | null = null;
  selectedSubproducto: {
    idTipoSubproducto: number;
    nombreSubtipo: string;
  } | null = null;
  productoSeleccionado: Producto | null = null;
  cantidad: number = 1;
  productosFiltrados: Producto[] = [];
  saleDetails: DetalleVentaResponse | null = null;
  saleDetailsError: string | null = null;
  descuentos: number[] = [];
  selectedDescuento: number | null = null;
  showAddDiscountModal: boolean = false;
  empleadoSeleccionado: EmpleadoDTO | null = null;
  nuevoDescuento: number | null = null;
  subtotalIVA: number;
  porcentajeDescuento: number;

  constructor(
    private productosService: ProductosService,
    private tiposProductoService: TiposProductoService,
    private loginService: LoginService,
    private ventaService: VentaService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.empleadoForm = this.fb.group({
      Nombres: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      Apellidos: [
        '',
        [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)],
      ],
      Cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      FechaNacimiento: ['', Validators.required],
      Genero: ['', Validators.required],
      Telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      contrasenia: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.subtotalIVA = 0;
    this.porcentajeDescuento = 0;
  }

  ngOnInit(): void {
    this.nombre = localStorage.getItem('nombre') || '';
    this.apellido = localStorage.getItem('apellido') || '';
    this.ceduladesc = localStorage.getItem('cedula') || '';
    this.obtenerProductos();
    this.obtenerImagenes();
    this.obtenerTiposProducto();
    this.obtenerTiposSubproducto();
    this.checkUserRole();
    this.obtenerEmpleados();
    this.obtenerDescuentos();
  }

  obtenerDescuentos() {
    this.loginService.getDescuentoByCedula(this.ceduladesc).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.descuentos = response.data.map((item: any) => item.descuento);
          this.selectedDescuento =
            this.descuentos.length > 0 ? this.descuentos[0] : null;
        } else {
          console.log('No se encontró descuento para la cédula proporcionada.');
          this.descuentos = [];
          this.selectedDescuento = null;
        }
      },
      error: (error) => {
        console.error('Error al obtener el descuento:', error);
        alert('Error al obtener el descuento. Por favor, intenta de nuevo.');
        this.descuentos = [];
        this.selectedDescuento = null;
      },
    });
  }

 

  onDescuentoChange(event: any): void {
    this.selectedDescuento = event ? Number(event) : null;
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
    this.saleCode = '';
    this.productosFiltrados = [...this.productos];
    this.saleDetails = null;
    this.saleDetailsError = null;
    this.showSaleDetailsModal = false;
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
    return this.imagenes.filter((img) => img.idProducto === idProducto);
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

  selectSubproducto(subtipo: {
    idTipoSubproducto: number;
    nombreSubtipo: string;
  }): void {
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
    this.selectedTipo =
      this.TipoProducto.find(
        (t) => t.idTipoProducto === producto.idTipoProducto
      ) || null;
    this.selectedSubproducto =
      this.TipoSubproducto.find(
        (s) => s.idTipoSubproducto === producto.idTipoSubproducto
      ) || null;
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
        this.imagenes = this.imagenes.filter(
          (img) => img.idImagen !== this.imagenIdToDelete
        );
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
      if (this.showAddModal && input.files.length === 1) {
        this.selectedImage = input.files[0];
      }
    }
  }

  subirImagenes(isAddModal: boolean): void {
    if (this.selectedImages.length === 0) {
      alert('No hay imágenes seleccionadas para subir.');
      return;
    }

    const idProducto = isAddModal
      ? this.nuevoProducto.idProducto
      : this.productoEditado.idProducto;

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
          p.idProducto === this.productoEditado.idProducto
            ? { ...this.productoEditado }
            : p
        );
        this.productosFiltrados = this.productosFiltrados.map((p) =>
          p.idProducto === this.productoEditado.idProducto
            ? { ...this.productoEditado }
            : p
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
    if (
      confirm(
        `¿Está seguro de que desea eliminar el producto ${producto.nombre}?`
      )
    ) {
      this.userRole = localStorage.getItem('token');
      const userRoleNumber = this.userRole ? Number(this.userRole) : null;
      if (userRoleNumber === null || isNaN(userRoleNumber)) {
        alert(
          'No se pudo obtener el rol del usuario. Verifica si tienes permisos.'
        );
        return;
      }
      this.productosService
        .eliminarProducto(producto.idProducto, userRoleNumber)
        .subscribe({
          next: () => {
            this.productos = this.productos.filter(
              (p) => p.idProducto !== producto.idProducto
            );
            this.productosFiltrados = this.productosFiltrados.filter(
              (p) => p.idProducto !== producto.idProducto
            );
          },
          error: (error) => {
            console.error('Error al eliminar producto:', error);
            alert('No se pudo eliminar el producto.');
          },
        });
    }
  }

  abrirModalStock(aumentarStock: boolean): void {
    this.aumentarStock = aumentarStock;
    this.cantidadStock = 1;
    this.showStockModal = true;
  }

  cerrarModalStock(): void {
    this.showStockModal = false;
    this.cantidadStock = 1;
  }

  confirmarStock(): void {
    if (!this.productoSeleccionado) {
      console.error('Error: productoSeleccionado es null');
      return;
    }
    console.log('Actualizando stock:', {
      idProducto: this.productoSeleccionado.idProducto,
      aumentar: this.aumentarStock,
      cantidad: this.cantidadStock,
    });
    this.productosService
      .actualizarStock(
        this.productoSeleccionado.idProducto,
        this.aumentarStock,
        this.cantidadStock
      )
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
          alert('Error al actualizar el stock. Por favor, intenta de nuevo.');
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
    if (
      !this.nuevoProducto.nombre ||
      !this.nuevoProducto.idTipoProducto ||
      !this.nuevoProducto.idTipoSubproducto
    ) {
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

  abrirModalAgregarEmpleado(): void {
    this.empleadoForm.reset();
    this.showAddEmployeeModal = true;
  }

  cerrarModalAgregarEmpleado(): void {
    this.showAddEmployeeModal = false;
    this.empleadoForm.reset();
  }

  guardarNuevoEmpleado(): void {
    if (this.empleadoForm.invalid) {
      this.empleadoForm.markAllAsTouched();
      alert('Por favor, completa correctamente todos los campos requeridos.');
      return;
    }

    const empleadoRequest: EmpleadoRequest = {
      Nombres: this.empleadoForm.value.Nombres,
      Apellidos: this.empleadoForm.value.Apellidos,
      Cedula: this.empleadoForm.value.Cedula,
      FechaNacimiento: this.empleadoForm.value.FechaNacimiento,
      Genero: this.empleadoForm.value.Genero,
      Telefono: this.empleadoForm.value.Telefono,
      contrasenia: this.empleadoForm.value.contrasenia,
    };

    console.log('Enviando empleado:', JSON.stringify(empleadoRequest, null, 2));

    this.loginService.registrarEmpleado(empleadoRequest).subscribe({
      next: (response: any) => {
        alert('Empleado registrado exitosamente.');
        this.cerrarModalAgregarEmpleado();
        this.obtenerEmpleados(); // Refresh employee list
      },
      error: (error) => {
        console.error('Error al registrar empleado:', error);
        if (error.error && error.error.errors) {
          const errorMessages = Object.values(error.error.errors)
            .flat()
            .join('\n');
          alert(`Error al registrar el empleado:\n${errorMessages}`);
        } else {
          alert('Error al registrar el empleado. Por favor, intenta de nuevo.');
        }
      },
    });
  }

  // // New methods for employee management
  // abrirModalAdministrarEmpleados(): void {
  //   this.showManageEmployeesModal = true;
  // }

  cerrarModalAdministrarEmpleados(): void {
    this.showManageEmployeesModal = false;
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

  buscarVenta(): void {
    this.saleDetails = null;
    this.saleDetailsError = null;
    this.showSaleDetailsModal = false;

    const trimmedSaleCode = this.saleCode.trim();

    if (trimmedSaleCode === '') {
      return;
    }

    if (!this.isValidBase64(trimmedSaleCode)) {
      this.saleDetailsError =
        'El código de venta no es una cadena válida en base64.';
      this.showSaleDetailsModal = true;
      return;
    }

    const request: DetalleVentaRequest = {
      IdVentaBase64: trimmedSaleCode,
    };

    this.ventaService.getDetalleVenta(request).subscribe({
      next: (response: any) => {
        this.saleDetails = response;
        this.saleDetailsError = null;
        this.showSaleDetailsModal = true;
      },
      error: (error) => {
        console.error('Error al obtener detalles de la venta:', error);
        let errorMessage =
          'Error al buscar la venta. Por favor, verifica el código e intenta de nuevo.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.saleDetails = null;
        this.saleDetailsError = errorMessage;
        this.showSaleDetailsModal = true;
      },
    });
  }

  cerrarModalSaleDetails(): void {
    this.showSaleDetailsModal = false;
    this.saleDetails = null;
    this.saleDetailsError = null;
  }

  isValidBase64(str: string): boolean {
    try {
      const base64Regex = /^[A-Za-z0-9+/=]+$/;
      if (!base64Regex.test(str)) {
        return false;
      }
      atob(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  abrirModalAdministrarEmpleados(): void {
    this.showManageEmployeesModal = true;
    this.empleadoSeleccionado = null;
    this.nuevoDescuento = null;
    this.showManageEmployeesModal = true;
    this.obtenerEmpleados();
  }

  abrirModalAgregarDescuento(empleado: EmpleadoDTO): void {
    this.empleadoSeleccionado = empleado;
    this.nuevoDescuento = null;
    this.showAddDiscountModal = true;
  }

  cerrarModalAgregarDescuento(): void {
    this.showAddDiscountModal = false;
    this.empleadoSeleccionado = null;
    this.nuevoDescuento = null;
  }

  guardarDescuento(): void {
    if (
      !this.empleadoSeleccionado ||
      this.nuevoDescuento === null ||
      this.nuevoDescuento < 0 ||
      this.nuevoDescuento > 100
    ) {
      alert('Por favor, ingrese un porcentaje de descuento válido (0-100).');
      return;
    }

    const descuento: descuentoEmpleado = {
      cedula: this.empleadoSeleccionado.cedula,
      descuento: this.nuevoDescuento,
    };

    this.loginService.registrarDescuentoEmpleado(descuento).subscribe({
      next: (response: any) => {
        alert('Descuento registrado exitosamente.');
        this.cerrarModalAgregarDescuento();
        this.obtenerDescuentos();
      },
      error: (error) => {
        console.error('Error al registrar descuento:', error);
        alert('Error al registrar el descuento. Por favor, intenta de nuevo.');
      },
    });
  }

  calcularIVA(): number {
  const subtotalConDescuento = this.calcularPrecioTotalConDescuento();
  this.subtotalIVA = subtotalConDescuento;
  return subtotalConDescuento * 0.14; // 14% IVA
}

  calcularSubtotalSinIVA(precioTotalConIVA: number): number {
  const ivaRate = 0.14; 
  return precioTotalConIVA / (1 + ivaRate);
}

calcularTotalConIVA(): number {
  const subtotal = this.calcularPrecioTotalConDescuento();
  const iva = this.calcularIVA();
  return subtotal + iva;
}

calcularIVAInicial(precioTotalConIVA: number): number {
  const subtotalSinIVA = this.calcularSubtotalSinIVA(precioTotalConIVA);
  return precioTotalConIVA - subtotalSinIVA;
}

calcularPrecioTotalConDescuento(): number {
  if (!this.saleDetails || !this.saleDetails.precioTotal) {
    return 0;
  }

  const subtotalSinIVA = this.calcularSubtotalSinIVA(this.saleDetails.precioTotal);

  if (this.selectedDescuento === null || this.selectedDescuento === 0) {
    return subtotalSinIVA;
  }

  const descuento = this.selectedDescuento / 100;
  this.porcentajeDescuento = descuento;
  return subtotalSinIVA * (1 - descuento);
}





generarOrdenPago(): void {
  if (!this.saleDetails) {
    alert('No hay detalles de venta disponibles.');
    return;
  }

  // Activar el estado de carga
    this.isGeneratingPDF = true;

  const precioTotalConIVA = this.saleDetails.precioTotal || 0;
  const subtotalSinDescuentoSinIVA = this.calcularSubtotalSinIVA(precioTotalConIVA);
  const ivaInicial = this.calcularIVAInicial(precioTotalConIVA);

  const subtotalConDescuento = this.calcularPrecioTotalConDescuento();
  const ivaRecalculado = this.calcularIVA();
  const totalFinal = this.calcularTotalConIVA();

  const descuentoMonto = subtotalSinDescuentoSinIVA - subtotalConDescuento;

  const fecha = new Date().toLocaleDateString('es-EC', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const request: LatexRequest = {
    Cliente: `${this.saleDetails.nombresCliente} ${this.saleDetails.apellidosCliente}`,
    Cedula: this.saleDetails.cedulaCliente,
    Fecha: fecha,
    Productos: [
      {
        Codigo: 'N/A',
        Descripcion: this.saleDetails.nombreProducto || 'N/A',
        Cantidad: this.saleDetails.cantidad || 0,
        PrecioUnitario: this.saleDetails.precioUnitario || 0,
        Total: this.saleDetails.precioTotal || 0,
      },
    ],
    SubtotalSinDescuento: subtotalSinDescuentoSinIVA,
    Descuento: descuentoMonto,
    SubtotalConDescuento: subtotalConDescuento,
    Iva: ivaRecalculado,
    Total: totalFinal,
  };

  this.downloadLaTeXAsPDF(
    JSON.stringify(request),
    `orden_de_venta_${this.saleDetails.cedulaCliente}_${Date.now()}.pdf`
  );
}
  


  downloadLaTeXAsPDF(requestData: string, filename: string): void {
    if (!this.saleDetails || !this.saleDetails.cedulaCliente) {
      alert(
        'No hay detalles de venta disponibles o la cédula del cliente no está definida.'
      );
      this.isGeneratingPDF = false;
      return;
    }

    const latexRequest: LatexRequest = JSON.parse(requestData);

    this.ventaService.generarFacturaPdf(latexRequest).subscribe({
      next: (blob: Blob) => {
        console.log('PDF generado exitosamente.');
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        alert('La factura se ha descargado correctamente.');
        this.isGeneratingPDF = false;
      },
      error: (error) => {
        console.error('Error al generar el PDF:', error);
        alert(
          'Error al generar la factura. Por favor, verifica con el administrador. Detalle: ' +
            (error.message || error)
        );
        this.isGeneratingPDF = false;
      },
    });
  }
}
