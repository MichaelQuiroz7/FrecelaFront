import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
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
import { ComprobanteConsultados, ComprobanteConsultatres, DetalleVentaConsultatres, Producto } from '../../Model/producto';
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
  ComprobanteConsulta,
  DetalleVentaRequest,
  DetalleVentaResponse,
  LatexRequest,
} from '../../Model/venta';
import { VentaService } from '../../Service/venta.service';
import { Chart } from 'chart.js/auto';
import { FilterByMonthPipe } from '../Pipes/FilterByMonthPipe';
import { IngresarVentaRequest } from '../../Model/ingresar-venta-request';

@Component({
  selector: 'app-producto-empleado',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, ReactiveFormsModule],
  templateUrl: './producto-empleado.component.html',
  styleUrl: './producto-empleado.component.css',
})
export class ProductoEmpleadoComponent {
  isGeneratingPDF: boolean = false;
  showStatsModal: boolean = false;
  selectedMonth: number = new Date().getMonth() + 1;
  saleSearchHistory: string[] = [];
  showEditModal: boolean = false;
  showStockModal: boolean = false;
  showAddModal: boolean = false;
  showAddEmployeeModal: boolean = false;
  showConfirmDeleteImageModal: boolean = false;
  showManageEmployeesModal: boolean = false;
  showSaleDetailsModal: boolean = false;
  showSaleNavigationModal: boolean = false;
  currentSaleIndex: number = 0;
  saleStatus: { [key: string]: string } = {};
  filteredVentas: any[] = [];
  saleSearchTerm: string = '';

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
  estadisticas: any = null;
  VentasPagadasRechazadas: any = null;
  showSaleApprovalModal: boolean = false;
  approvalSearchTerm: string = '';
  approvalStatus: { [key: number]: string } = {};
  filteredApprovalVentas: ComprobanteConsultatres[] = [];
  currentApprovalIndex: number = 0;
  

  months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  @ViewChild('productsChart', { static: false }) productsChartRef!: ElementRef;
  @ViewChild('clientsChart', { static: false }) clientsChartRef!: ElementRef;
  @ViewChild('employeesChart', { static: false })
  employeesChartRef!: ElementRef;
  private productsChart: Chart | undefined;
  private clientsChart: Chart | undefined;
  private employeesChart: Chart | undefined;
  productosBajoStock: any;
  showLowStockModal: boolean = false;
  currentLowStockIndex: number = 0;
  employeeForm: FormGroup;
  imageError: string | null = null;

  constructor( private productosService: ProductosService, private tiposProductoService: TiposProductoService, private loginService: LoginService, private ventaService: VentaService,
    private router: Router, private fb: FormBuilder ) {
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
    this.selectedDescuento = 0;

    this.employeeForm = this.fb.group({
      Nombres: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      Apellidos: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      Cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      FechaNacimiento: ['', Validators.required],
      Genero: ['', Validators.required],
      Telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      contrasenia: ['', [Validators.required, Validators.minLength(6)]],
    });

  }

    isLoggedIn: boolean = false;

  checkAuth() {
    const requiredKeys = ['token', 'cedula', 'nombre', 'apellido', 'direccion'];
    this.isLoggedIn = requiredKeys.every(key => !!localStorage.getItem(key));

    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.checkAuth();
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
    this.cargarTodasLasEstadisticas();
    this.obtenerVentasRechazos();
    this.obtenerProductosBajoStock();
    this.buscarVentasPorAprobar();
    this.cargarHistorialBusqueda();
    this.filtrar();
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





  subtotalDescuento(): number {
  if (!this.saleDetails || !this.saleDetails.precioTotal || !this.selectedDescuento) {
    return this.saleDetails?.precioTotal || 0;
  }

  const precioTotal = Number(this.saleDetails.precioTotal);
  const descuentoPorcentaje = Number(this.selectedDescuento);
  
  // Calcular el valor del descuento
  const valorDescuento = precioTotal * (descuentoPorcentaje / 100);
  
  // Restar el descuento al precio total
  const subtotal = precioTotal - valorDescuento;
  
  return Number(subtotal.toFixed(2)); // Redondear a 2 decimales
}

calcularIva15(): number {
  const subtotal = this.subtotalDescuento();
  
  // Calcular el 15% de IVA sobre el subtotal con descuento
  const iva = subtotal * 0.15;
  
  return Number(iva.toFixed(2)); // Redondear a 2 decimales
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
        this.filtrar();
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
      formData.append('Imagenes', image);
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
        this.ngOnInit();
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
        this.ngOnInit();
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


  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      // Validar tipo de archivo (solo imágenes)
      if (!file.type.startsWith('image/')) {
        this.imageError = 'Por favor, selecciona un archivo de imagen válido.';
        this.selectedImage = null;
        return;
      }
      // Validar tamaño (por ejemplo, máximo 5MB)
      const maxSizeInMB = 5;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        this.imageError = `El tamaño de la imagen no debe superar ${maxSizeInMB}MB.`;
        this.selectedImage = null;
        return;
      }
      this.selectedImage = file;
      this.imageError = null;
    } else {
      this.selectedImage = null;
      this.imageError = null;
    }
  }
  

 guardarNuevoEmpleado(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      alert('Por favor, completa correctamente todos los campos requeridos.');
      return;
    }

    const empleadoRequest: EmpleadoRequest = {
      Nombres: this.employeeForm.value.Nombres,
      Apellidos: this.employeeForm.value.Apellidos,
      Cedula: this.employeeForm.value.Cedula,
      FechaNacimiento: this.employeeForm.value.FechaNacimiento,
      Genero: this.employeeForm.value.Genero,
      Telefono: this.employeeForm.value.Telefono,
      contrasenia: this.employeeForm.value.contrasenia,
    };


    this.loginService.registrarEmpleado(empleadoRequest).subscribe({
      next: (response: any) => {
        console.log('respuesta empleado', response);
        const newEmployeeId = response.data.id;
        console.log('Nuevo ID de empleado:', newEmployeeId);
        const newEmployee = { ...empleadoRequest, id: newEmployeeId };

        if (this.selectedImage) {
          const formData = new FormData();
          formData.append('Imagen', this.selectedImage);
          formData.append('IdProducto', newEmployeeId.toString());

          this.productosService.uploadImageEmpleado(formData).subscribe({
            next: (imageResponse: any) => {
              const imagePath = imageResponse.data.imagenUrl;
              this.imagenes.push({
                idImagen: imageResponse.data.idImagen,
                idProducto: newEmployeeId,
                imagenUrl: imagePath
              });

              this.finalizarGuardado();
            },
            error: (error) => {
              console.error('Error al subir la imagen:', error);
              alert('Empleado registrado, pero error al subir la imagen.');
              this.finalizarGuardado();
            },
          });
        } else {
          this.finalizarGuardado();
        }
        this.ngOnInit();
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

private finalizarGuardado(): void {
    this.employeeForm.reset();
    this.selectedImage = null;
    this.imageError = null;
    this.obtenerEmpleados();
    this.cerrarModalAgregarEmpleado();
  }

  cerrarModalAgregarEmpleado(): void {
    this.showAddEmployeeModal = false;
    this.employeeForm.reset();
    this.selectedImage = null;
    this.imageError = null;
  }

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


    if (this.saleCode.trim()) {
    if (!this.historialBusqueda.includes(this.saleCode)) {
      this.historialBusqueda.unshift(this.saleCode);
      this.historialBusqueda = this.historialBusqueda.slice(0, 6); 
    }
  }


    this.saleDetails = null;
    this.saleDetailsError = null;
    this.showSaleDetailsModal = false;

    const trimmedSaleCode = this.saleCode.trim();

    if (trimmedSaleCode === '') {
      return;
    }

    if (!this.isValidBase64(trimmedSaleCode)) {
      this.saleDetailsError =
        'El código de venta no es válido.';
      this.showSaleDetailsModal = true;
      return;
    }

    const request: DetalleVentaRequest = {
      IdVentaBase64: trimmedSaleCode,
    };

    this.ventaService.getDetalleVenta(request).subscribe({
      next: (response: any) => {
        this.saleDetails = response;
        console.log('Detalles de la venta:', this.saleDetails);
        this.saleDetailsError = null;
        this.showSaleDetailsModal = true;
      },
      error: (error) => {
        console.error('Error al obtener detalles de la venta:');
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
    return subtotalConDescuento * 0.15; 
  }

  calcularSubtotalSinIVA(precioTotalConIVA: number): number {
    const ivaRate = 0.14;
    return precioTotalConIVA / (1 + ivaRate);
  }

  calcularTotalIvaDescuentoEnvio(): number {
  const subtotal = this.subtotalDescuento();
  const iva = this.calcularIva15();
  
  // Validar si hay entrega a domicilio para añadir costo de envío
  if (this.saleDetails?.tipoEntrega === 'ENTREGA A DOMICILIO') {
    return Number((subtotal + iva + 5).toFixed(2)); // Añadir $5 de costo de envío
  } else {
    return Number((subtotal + iva).toFixed(2));
  }
}

  calcularIVAInicial(precioTotalConIVA: number): number {
    const subtotalSinIVA = this.calcularSubtotalSinIVA(precioTotalConIVA);
    return precioTotalConIVA - subtotalSinIVA;
  }


  calcularPrecioTotalConDescuento(): number {
    if (!this.saleDetails || !this.saleDetails.precioTotal) {
      return 0;
    }

    const subtotalSinIVA = this.calcularSubtotalSinIVA(
      this.saleDetails.precioTotal
    );

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
    const subtotalSinDescuentoSinIVA =
      this.calcularSubtotalSinIVA(precioTotalConIVA);
    const ivaInicial = this.calcularIVAInicial(precioTotalConIVA);

    const subtotalConDescuento = this.subtotalDescuento();
    const ivaRecalculado = this.calcularIva15();
    const totalFinal = this.calcularTotalIvaDescuentoEnvio();

    const descuentoMonto = this.saleDetails && this.saleDetails.precioUnitario != null && this.saleDetails.cantidad != null
      ? (this.saleDetails.precioUnitario * this.saleDetails.cantidad) - subtotalConDescuento
      : 0;

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
          Codigo: this.saleDetails.code || 'N/A',
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

    // Mensaje whatsapp
    const mensaje = `Orden de Pago\n` +
                    `Código Venta : ${request.Productos[0].Codigo}\n` +
                    `Cliente: ${request.Cliente}\n` +
                    `Cédula: ${request.Cedula}\n` +
                    `Fecha: ${request.Fecha}\n` +
                    `Producto: ${request.Productos[0].Descripcion}\n` +
                    `Cantidad: ${request.Productos[0].Cantidad}\n` +
                    `Precio Unitario: $${request.Productos[0].PrecioUnitario.toFixed(2)}\n` +
                    `Subtotal: $${request.SubtotalSinDescuento.toFixed(2)}\n` +
                    `Descuento: $${descuentoMonto.toFixed(2)}\n` +
                    `Subtotal con Descuento: $${request.SubtotalConDescuento.toFixed(2)}\n` +
                    `IVA: $${request.Iva.toFixed(2)}\n` +
                    `Total: $${request.Total.toFixed(2)}\n`;

   const telefonoLocal = this.saleDetails.cedulaCliente.startsWith('0')
  ? this.saleDetails.cedulaCliente.substring(1)
  : this.saleDetails.cedulaCliente;
const telefonocliente = '593' + telefonoLocal;
const mensajeEncoded = encodeURIComponent(mensaje);
const whatsappUrl = `https://wa.me/${telefonocliente}?text=${mensajeEncoded}`;

window.open(whatsappUrl, '_blank');
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

  // Nuevo método para obtener estadísticas
  obtenerEstadisticas(): void {
    this.ventaService.getEstadisticasVentasPorMes().subscribe({
      next: (response: any) => {
        this.estadisticas = response.data; // Asume que los datos están en response.data
        console.log('Estadísticas obtenidas:', this.estadisticas);
        this.showStatsModal = true;
      },
      error: (error) => {
        console.error('Error al obtener las estadísticas:', error);
        alert(
          'Error al obtener las estadísticas. Por favor, intenta de nuevo.'
        );
      },
    });
  }

  cerrarModalEstadisticas(): void {
    this.showStatsModal = false;
    this.estadisticas = null;
  }

  onMonthChange(event: any): void {
    this.selectedMonth = Number(event);
    this.updateCharts();
  }

  private updateCharts(): void {
    this.destroyCharts();

    if (
      !this.estadisticas ||
      !this.productsChartRef ||
      !this.clientsChartRef ||
      !this.employeesChartRef
    ) {
      console.warn('Datos o referencias de gráficos no disponibles');
      return;
    }

    const productsData = this.getChartData(
      'productos_por_mes',
      'cantidad_vendida',
      'producto'
    );
    if (productsData.labels.length > 0) {
      this.productsChart = new Chart(this.productsChartRef.nativeElement, {
        type: 'bar',
        data: productsData,
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: {
              display: true,
              text: `Productos Vendidos - ${
                this.months[this.selectedMonth - 1]
              }`,
            },
          },
        },
      });
    }

    const clientsData = this.getChartData(
      'clientes_por_mes',
      'numero_compras',
      'cliente'
    );
    if (clientsData.labels.length > 0) {
      this.clientsChart = new Chart(this.clientsChartRef.nativeElement, {
        type: 'bar',
        data: clientsData,
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: {
              display: true,
              text: `Compras por Cliente - ${
                this.months[this.selectedMonth - 1]
              }`,
            },
          },
        },
      });
    }

    const employeesData = this.getChartData(
      'empleados_por_mes',
      'numero_ventas',
      'empleado'
    );
    if (employeesData.labels.length > 0) {
      this.employeesChart = new Chart(this.employeesChartRef.nativeElement, {
        type: 'bar',
        data: employeesData,
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: {
              display: true,
              text: `Ventas por Empleado - ${
                this.months[this.selectedMonth - 1]
              }`,
            },
          },
        },
      });
    }
  }

  private getChartData(
    section: string,
    valueKey: string,
    labelKey: string
  ): any {
    if (!this.estadisticas || !this.estadisticas[section]) {
      console.warn(`No hay datos disponibles para ${section}`);
      return { labels: [], datasets: [] };
    }

    const filteredData = this.estadisticas[section].filter(
      (item: any) => item.mes === this.selectedMonth
    );
    console.log(`Datos filtrados para ${section}:`, filteredData); // Depuración

    if (filteredData.length === 0) {
      console.warn(
        `No se encontraron datos para el mes ${this.selectedMonth} en ${section}`
      );
      return { labels: [], datasets: [] };
    }

    const labels = filteredData.flatMap((item: any) =>
      item[labelKey].map((x: any) => x[labelKey])
    );
    const data = filteredData.flatMap((item: any) =>
      item[labelKey].map((x: any) => x[valueKey])
    );

    return {
      labels: labels,
      datasets: [
        {
          label: `Cantidad ${valueKey.replace('_', ' ')}`,
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  }

  private destroyCharts(): void {
    if (this.productsChart) this.productsChart.destroy();
    if (this.clientsChart) this.clientsChart.destroy();
    if (this.employeesChart) this.employeesChart.destroy();
  }

  mesesDisponibles: string[] = [];
  mesSeleccionado: string = '';
  monthsInSpanish = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  cargarTodasLasEstadisticas() {
    this.ventaService.getEstadisticasVentasPorMes().subscribe((response) => {
      this.estadisticas = response.data;
      console.log('Estadísticas obtenidas:', this.estadisticas);

      this.mesesDisponibles = this.estadisticas.estadisticas_generales.map(
        (e: any) => e.nombre_mes
      );
      this.mesesDisponibles = [...new Set(this.mesesDisponibles)];

      if (this.mesesDisponibles.length > 0) {
        this.mesSeleccionado = this.mesesDisponibles[0];
      }
    });
  }

  obtenerDatosDelMes(mes: string) {
    const productos = this.estadisticas.productos_por_mes.find(
      (p: any) => p.nombre_mes === mes
    );
    const clientes = this.estadisticas.clientes_por_mes.find(
      (c: any) => c.nombre_mes === mes
    );
    const empleados = this.estadisticas.empleados_por_mes.find(
      (e: any) => e.nombre_mes === mes
    );
    const general = this.estadisticas.estadisticas_generales.find(
      (g: any) => g.nombre_mes === mes
    );
    return { productos, clientes, empleados, general };
  }

  mostrarModal: boolean = false;

  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }



  obtenerVentasRechazos(): void {
    this.ventaService.getVentasPagadasORechazadasConDetalles().subscribe({
      next: (response: any) => {
        this.VentasPagadasRechazadas = response.data;
        this.filteredVentas = [...this.VentasPagadasRechazadas];
        console.log('Ventas Pagadas / Rechazadas:', this.VentasPagadasRechazadas);
        this.VentasPagadasRechazadas.forEach((venta: any) => {
          this.saleStatus[venta.code] = venta.estadoEntrega || 'PENDIENTE';
        });
      },
      error: (error) => {
        console.error('Error al obtener las estadísticas:', error);
        alert('Error al obtener las estadísticas. Por favor, intenta de nuevo.');
      },
    });
  }

  // Open the sale navigation modal
  abrirModalVentas(): void {
    this.showSaleNavigationModal = true;
    this.currentSaleIndex = 0;
    this.saleSearchTerm = '';
    this.filteredVentas = [...this.VentasPagadasRechazadas];
  }

  // Close the sale navigation modal
  cerrarModalVentas(): void {
    this.showSaleNavigationModal = false;
    this.currentSaleIndex = 0;
    this.saleSearchTerm = '';
    this.filteredVentas = [...this.VentasPagadasRechazadas];
  }

  // Navigate to the previous sale
  previousSale(): void {
    if (this.currentSaleIndex > 0) {
      this.currentSaleIndex--;
    }
  }

  // Navigate to the next sale
  nextSale(): void {
    if (this.currentSaleIndex < this.filteredVentas.length - 1) {
      this.currentSaleIndex++;
    }
  }

   // Filter sales by product code
  buscarVentasPorCodigo(): void {
    if (this.saleSearchTerm.trim() === '') {
      this.filteredVentas = [...this.VentasPagadasRechazadas];
    } else {
      this.filteredVentas = this.VentasPagadasRechazadas.filter((venta: any) =>
        venta.code.toLowerCase().includes(this.saleSearchTerm.toLowerCase())
      );
      this.currentSaleIndex = 0; // Reset to first sale after filtering
    }
  }

  guardarEstadoVenta(code: string): void {
    const venta = this.VentasPagadasRechazadas.find((v: any) => v.code === code);
    if (!venta) {
      alert('Error: Venta no encontrada.');
      return;
    }

    const updatedVenta = { ...venta, estadoEntrega: this.saleStatus[code] };
    this.ventaService.actualizarEstadoVenta(updatedVenta).subscribe({
      next: (response: any) => {
        alert('Estado de la venta actualizado exitosamente.');
        // Update the local arrays
        this.VentasPagadasRechazadas = this.VentasPagadasRechazadas.map((v: any) =>
          v.code === code ? { ...v, estadoEntrega: this.saleStatus[code] } : v
        );
        this.filteredVentas = this.filteredVentas.map((v: any) =>
          v.code === code ? { ...v, estadoEntrega: this.saleStatus[code] } : v
        );
        this.ngOnInit();
      },
      error: (error) => {
        console.error('Error al actualizar el estado de la venta:', error);
        alert('Error al actualizar el estado de la venta. Por favor, intenta de nuevo.');
      },
    });
  }



  obtenerProductosBajoStock(): void {
    this.productosService.getProductosBajoStock().subscribe({
      next: (response: any) => {
        this.productosBajoStock = response.data;
        console.log('Productos bajo stock:', this.productosBajoStock);
        if (this.productosBajoStock?.length > 0) {
          this.showLowStockModal = true;
          this.currentLowStockIndex = 0;
        }
      },
      error: (error) => {
        console.error('Error al obtener productos bajo stock:', error);
        alert('Error al obtener productos bajo stock. Por favor, intenta de nuevo.');
      },
    });
  }

  previousLowStock(): void {
    if (this.currentLowStockIndex > 0) {
      this.currentLowStockIndex--;
    }
  }

  nextLowStock(): void {
    if (this.currentLowStockIndex < this.productosBajoStock.length - 1) {
      this.currentLowStockIndex++;
    }
  }

  aceptarProductoBajoStock(): void {
    if (this.currentLowStockIndex < this.productosBajoStock.length - 1) {
      this.currentLowStockIndex++;
    } else {
      this.cerrarModalBajoStock();
    }
  }

  cerrarModalBajoStock(): void {
    this.showLowStockModal = false;
    this.currentLowStockIndex = 0;
  }


 
  async abrirModalVentasPorAprobar(): Promise<void> {
    this.showSaleApprovalModal = true;
    await this.buscarVentasPorAprobar();
    this.saleStatus = {};
  }

  cerrarModalVentasPorAprobar(): void {
    this.showSaleApprovalModal = false;
    this.approvalSearchTerm = '';
    this.currentApprovalIndex = 0;
  }

  buscarVentasPorAprobar(): void {
    this.ventaService.getVentasporAprobar().subscribe({
      next: (response: any) => {
        if (response.data) {
          this.filteredApprovalVentas = response.data as ComprobanteConsultatres[];
          console.log('Ventas por aprobar:', this.filteredApprovalVentas);
        } else {
          this.filteredApprovalVentas = [];
          console.warn('No se encontraron datos o la respuesta no fue exitosa:', response?.Message || 'Sin mensaje');
        }
        if (this.approvalSearchTerm) {
          this.filteredApprovalVentas = this.filteredApprovalVentas.filter(v => 
            v.idVenta.toString().includes(this.approvalSearchTerm)
          );
        }
        this.currentApprovalIndex = 0;
      },
      error: (error) => {
        console.error('Error al obtener ventas por aprobar:', error);
        this.filteredApprovalVentas = [];
        alert('Error al obtener ventas por aprobar. Por favor, intenta de nuevo.');
      },
    });
  }

  previousApproval(): void {
    if (this.currentApprovalIndex > 0) {
      this.currentApprovalIndex--;
    }
  }

  nextApproval(): void {
    if (this.currentApprovalIndex < this.filteredApprovalVentas.length - 1) {
      this.currentApprovalIndex++;
    }
  }


  guardarEstadoVentaEspera(idVenta: string): void {
    const venta = this.filteredApprovalVentas.find((v: ComprobanteConsultatres) => v.idVenta.toString() === idVenta);
    if (!venta) {
      alert('Error: Venta no encontrada.');
      return;
    }

    const updatedVenta: DetalleVentaConsultatres = {
      Code: venta.code || '',
      Message: venta.message || '',
      NombreProducto: venta.nombreProducto || '',
      DescripcionProducto: venta.descripcionProducto || null,
      PrecioUnitario: venta.precioUnitario || null,
      Cantidad: venta.cantidad || null,
      PrecioTotal: venta.precioTotal || null,
      NombresCliente: venta.nombresCliente || '',
      ApellidosCliente: venta.apellidosCliente || '',
      CedulaCliente: venta.cedulaCliente || '',
      DireccionCliente: venta.direccionCliente || '',
      TipoEntrega: venta.tipoEntrega || '',
      EstadoEntrega: this.saleStatus[parseInt(idVenta, 10)] || 'ESPERA'
    };

    this.ventaService.actualizarEstadoVenta(updatedVenta).subscribe({
      next: (response: any) => {
        if (response) {
          alert('Estado de la venta actualizado exitosamente.');
          const index = this.filteredApprovalVentas.findIndex(v => v.idVenta.toString() === idVenta);
          if (index !== -1) {
            this.filteredApprovalVentas[index].estado = updatedVenta.EstadoEntrega;
          }
        } else {
          alert('Error en la respuesta del servidor: ' + response.Message);
        }
        this.ngOnInit();
      },
      error: (error) => {
        console.error('Error al actualizar el estado de la venta:', error);
        alert('Error al actualizar el estado de la venta. Por favor, intenta de nuevo.');
      },
    });
  }
  
  
  // Calculate total without discount based on quantity and unit price
  calculateBaseTotal(quantity: number): number {
    if (this.saleDetails && this.saleDetails.precioUnitario) {
      this.saleDetails.precioTotal = quantity * this.saleDetails.precioUnitario;
      return this.saleDetails.precioTotal;
    } else if (this.saleDetails) {
      this.saleDetails.precioTotal = 0;
      return this.saleDetails.precioTotal;
    }
    return 0;
  }

  // Calculate subtotal with discount applied
  computeDiscountedSubtotal(): number {
    const baseTotal = this.saleDetails?.precioTotal || 0;
    const descuento = this.selectedDescuento ?? 0;
    const discountAmount = baseTotal * (descuento / 100);
    return baseTotal - discountAmount;
  }

  // Calculate 15% IVA on the discounted subtotal
  computeTaxAmount(): number {
    const subtotal = this.computeDiscountedSubtotal();
    return subtotal * 0.15;
  }

  // Calculate final total including discount, IVA, and shipping if applicable
  computeFinalTotal(): number {
    const subtotal = this.computeDiscountedSubtotal();
    const iva = this.computeTaxAmount();
    const shipping = this.saleDetails?.tipoEntrega === 'ENTREGA A DOMICILIO' ? 5 : 0;
    return subtotal + iva + shipping;
  }

  // Handle changes in quantity or discount
  onQuantityOrDiscountChange(newValue: number, field: string): void {
    if (field === 'quantity') {
      if (this.saleDetails) {
        this.saleDetails.cantidad = newValue;
        this.calculateBaseTotal(newValue);
      }
    } else if (field === 'discount') {
      this.selectedDescuento = newValue;
    }
    // Recalculate all dependent values
    this.computeDiscountedSubtotal();
    this.computeTaxAmount();
    this.computeFinalTotal();
  }

historialBusqueda: string[] = [];
mostrarHistorial = false;

 cargarHistorialBusqueda(): void {
  this.ventaService.getVentasIdsBase64().subscribe({
    next: (response) => {
      if (response.data) {
        this.historialBusqueda = response.data; 
        console.log('Historial de búsqueda cargado:', this.historialBusqueda);
      } else {
        this.historialBusqueda = [];
        this.saleDetailsError = response.message || 'No se pudieron cargar los códigos de venta';
      }
    },
    error: (err) => {
      this.historialBusqueda = [];
      this.saleDetailsError = 'Error al cargar los códigos de venta: ' + err.message;
    }
  });
}

 usarHistorial(item: string) {
  this.saleCode = item.split('|')[0]; 
  this.buscarVenta();
  this.mostrarHistorial = false;
}


ocultarHistorialConDelay() {
  setTimeout(() => {
    this.mostrarHistorial = false;
  }, 200); 
}


  showEnlargedImage: boolean = false;
  enlargedImageBase64: string = '';

enlargeImage(base64: string): void {
    this.enlargedImageBase64 = base64;
    this.showEnlargedImage = true;
  }

  closeEnlargedImage(): void {
    this.showEnlargedImage = false;
    this.enlargedImageBase64 = '';
  }



selectedTipo2: TipoProducto | null = null;
selectedSubproducto2: TipoSubproducto | null = null;


  selectTipo2(tipo: TipoProducto | null): void {
    this.selectedTipo2 = tipo;
    this.filtrar();
  }

  selectSubproducto2(subtipo: TipoSubproducto | null): void {
    this.selectedSubproducto2 = subtipo;
    this.filtrar();
  }

  filtrar(): void {
    let productosFiltrados = [...this.productos];

    // Filtrar por tipo si no es "Todas" (null)
    if (this.selectedTipo2) {
      productosFiltrados = productosFiltrados.filter(
        (p: Producto) => p.idTipoProducto === this.selectedTipo2!.idTipoProducto
      );
    }

    // Filtrar por subtipo si no es "Todas" (null)
    if (this.selectedSubproducto2) {
      productosFiltrados = productosFiltrados.filter(
        (p: Producto) => p.idTipoSubproducto === this.selectedSubproducto2!.idTipoSubproducto
      );
    }

    this.productosFiltrados = productosFiltrados;
  }


   menuOpen: boolean = false;
    toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }


  sales: any[] = [];
  errorMessage: string = '';
  showSalesHistoryModal: boolean = false;


  loadSalesHistory(): void {
    const clienteData = localStorage.getItem('cedula');
    if (clienteData) {
      this.ventaService.getventasxVendedor(clienteData).subscribe({
        next: (response) => {
          if (response.data) {
            this.sales = response.data;
            console.log('Historial de ventas cargado:', this.sales);
            this.errorMessage = '';
            this.showSalesHistoryModal = true; // Abrir modal al cargar datos
          } else {
            this.sales = [];
            this.errorMessage =
              response.error || 'No se encontraron ventas para este cliente';
            this.showSalesHistoryModal = true; // Abrir modal incluso si no hay datos
          }
        },
        error: (err) => {
          this.sales = [];
          this.errorMessage =
            'Error al cargar el historial de ventas: ' + err.message;
          this.showSalesHistoryModal = true; // Abrir modal para mostrar error
        },
      });
    } else {
      this.sales = [];
      this.errorMessage = 'No hay datos de venta.';
      this.showSalesHistoryModal = true; // Abrir modal para mostrar error
    }
  }

  openSalesHistoryModal(): void {
    this.showSalesHistoryModal = true;
  }

  cerrarSalesHistoryModal(): void {
    this.showSalesHistoryModal = false;
  }

  procesarVenta(idVenta: number): void {
    // Convertir idVenta a Base64
    this.cerrarSalesHistoryModal()
    this.saleCode = btoa(idVenta.toString());
    console.log('Código de venta en Base64:', this.saleCode);
    this.buscarVenta();
  }

  selectedProducto: Producto | null = null;
  sellCantidad: number = 1;
  sellErrorMessage: string | null = null;
  isProcessingSale: boolean = false;
  showSellProductModal: boolean = false;

  abrirModalVender(producto: Producto): void {
    this.selectedProducto = producto;
    this.sellCantidad = 1;
    this.selectedDescuento = 0;
    this.sellErrorMessage = null;
    this.showSellProductModal = true;
  }

  cerrarModalSellProduct(): void {
    this.showSellProductModal = false;
    this.selectedProducto = null;
    this.sellCantidad = 1;
    this.selectedDescuento = 0;
    this.sellErrorMessage = null;
  }


  onQuantityOrDiscountChange2(value: any, type: string): void {
    if (type === 'quantity') {
      this.sellCantidad = value;
    } else if (type === 'discount') {
      this.selectedDescuento = value;
    }
  }

  computeDiscountedSubtotal2(): number {
    if (!this.selectedProducto || !this.sellCantidad) return 0;
    const subtotal = this.selectedProducto.precio * this.sellCantidad;
    return subtotal * (1 - (this.selectedDescuento ?? 0) / 100);
  }

  computeTaxAmount2(): number {
    return this.computeDiscountedSubtotal2() * 0.15;
  }

  computeFinalTotal2(): number {
    return this.computeDiscountedSubtotal2() + this.computeTaxAmount2();
  }




  confirmarVenta(): void {
    if (!this.selectedProducto || this.sellCantidad < 1) {
      this.sellErrorMessage = 'Por favor, ingrese una cantidad válida.';
      return;
    }

    if (this.sellCantidad > this.selectedProducto.stock) {
      this.sellErrorMessage = 'La cantidad excede el stock disponible.';
      return;
    }

    this.isProcessingSale = true;
    const cedulaEmpleado = localStorage.getItem('cedula') || '';
    const now = new Date();
    const fecha = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const hora = now.toTimeString().slice(0, 5); // HH:MM

    const request: IngresarVentaRequest = {
      cedulaCliente: '0000000000',
      cedulaEmpleado,
      fecha,
      hora,
      idProducto: this.selectedProducto.idProducto,
      precioUnitario: this.selectedProducto.precio,
      cantidad: this.sellCantidad,
      precioTotal: this.selectedProducto.precio * this.sellCantidad,
      estado: 'COMPLETADA',
      descuento: this.selectedDescuento || 0
    };

    this.ventaService.ingresarVentaEmpleado(request).subscribe({
      next: (response) => {
        this.isProcessingSale = false;
        this.cerrarModalSellProduct();
        this.ngOnInit();
      },
      error: (error) => {
        this.isProcessingSale = false;
        this.sellErrorMessage = error.error?.message || 'Error al registrar la venta.';
      }
    });
  }






  

}
