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
import { VentaService } from '../../Service/venta.service';
import { DetalleVentaRequest, DetalleVentaResponse, Venta } from '../../Model/venta';
import { Comprobante } from '../../Model/comprobante';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css',
})
export class ProductoComponent implements OnInit {

  //#region  antes de la refactorización
  // showModal: boolean = false;
  // empleados: EmpleadoDTO[] = [];
  // cantidad: number = 1;
  // productos: Producto[] = [];
  // imagenes: Imagen[] = [];
  // TipoProducto: TipoProducto[] = [];
  // selectedTipo: { idTipoProducto: number; nombreTipo: string } | null = null;
  // TipoSubproducto: TipoSubproducto[] = [];
  // selectedSubproducto: { idTipoSubproducto: number; nombreSubtipo: string } | null = null;
  // productoSeleccionado: Producto | null = null;
  // nuevoProducto: Producto = {
  //   idProducto: 0,
  //   nombre: '',
  //   precio: 0,
  //   descripcion: '',
  //   stock: 0,
  //   idTipoProducto: 0,
  //   idTipoSubproducto: 0,
  // };
  // clienteNombre: string = '';

  // constructor(
  //   private productosService: ProductosService,
  //   private tiposProductoService: TiposProductoService,
  //   private loginService: LoginService,
  //   private ventaService: VentaService,
  //   private router: Router
  // ) {}

  // ngOnInit(): void {
  //   this.obtenerClienteDesdeLocalStorage();
  //   this.obtenerProductos();
  //   this.obtenerImagenes();
  //   this.obtenerTiposProducto();
  //   this.obtenerTiposSubproducto();
  // }

  // obtenerClienteDesdeLocalStorage(): void {
  //   const clienteData = localStorage.getItem('cliente');
  //   if (clienteData) {
  //     const cliente = JSON.parse(clienteData);
  //     this.clienteNombre = `${cliente.Nombres} ${cliente.Apellidos}`;
  //   } else {
  //     this.clienteNombre = '';
  //   }
  // }

  // obtenerProductos(): void {
  //   this.productosService.getProductos().subscribe({
  //     next: (response: any) => {
  //       this.productos = response.data.map((p: any) => ({ ...p }));
  //     },
  //     error: (error) => {
  //       console.error('Error al obtener los productos:', error);
  //     },
  //   });
  // }

  // obtenerImagenes(): void {
  //   this.productosService.getImagenes().subscribe({
  //     next: (response: any) => {
  //       this.imagenes = response.data.map((img: any) => ({
  //         idImagen: img.idImagen,
  //         idProducto: img.idProducto,
  //         imagenUrl: img.imagenUrl,
  //       }));
  //     },
  //     error: (error) => {
  //       console.error('Error al obtener las imágenes:', error);
  //     },
  //   });
  // }

  // seleccionarProducto(producto: Producto): void {
  //   this.productoSeleccionado = producto;
  // }

  // cerrarPanel(): void {
  //   this.productoSeleccionado = null;
  //   this.cantidad = 1;
  // }

  // agregarProducto(): void {
  //   this.productosService.agregarProducto(this.nuevoProducto).subscribe({
  //     next: (productoAgregado) => {
  //       this.productos.push({
  //         ...productoAgregado,
  //       });
  //       this.nuevoProducto = {
  //         idProducto: 0,
  //         nombre: '',
  //         precio: 0,
  //         descripcion: '',
  //         stock: 0,
  //         idTipoProducto: 0,
  //         idTipoSubproducto: 0,
  //       };
  //     },
  //     error: (err) => console.error('Error al agregar producto:', err),
  //   });
  // }

  // obtenerImagenDeProducto(idProducto: number): string {
  //   const img = this.imagenes.find((i) => i.idProducto === idProducto);
  //   return img ? img.imagenUrl : 'assets/no-image.jpg';
  // }

  // buscarImagen(idProducto: number): string | undefined {
  //   const imagen = this.imagenes.find((img) => img.idProducto === idProducto);
  //   return imagen?.imagenUrl;
  // }

  // obtenerTiposProducto(): void {
  //   this.tiposProductoService.getTiposProduct().subscribe({
  //     next: (response: any) => {
  //       this.TipoProducto = response.data;
  //     },
  //     error: (error) => {
  //       console.error('Error al obtener los tipos de producto:', error);
  //     },
  //   });
  // }

  // obtenerTiposSubproducto(): void {
  //   this.tiposProductoService.getTiposSubProduct().subscribe({
  //     next: (response: any) => {
  //       this.TipoSubproducto = response.data;
  //     },
  //     error: (error) => {
  //       console.error('Error al obtener los tipos de subproducto:', error);
  //     },
  //   });
  // }

  // filtrar(): void {
  //   this.productosService.getProductos().subscribe({
  //     next: (response: any) => {
  //       let productosFiltrados = response.data;

  //       if (this.selectedTipo) {
  //         productosFiltrados = productosFiltrados.filter(
  //           (p: Producto) => p.idTipoProducto === this.selectedTipo?.idTipoProducto
  //         );
  //       }

  //       if (this.selectedSubproducto) {
  //         productosFiltrados = productosFiltrados.filter(
  //           (p: Producto) => p.idTipoSubproducto === this.selectedSubproducto?.idTipoSubproducto
  //         );
  //       }

  //       this.productos = productosFiltrados;
  //     },
  //     error: (error) => {
  //       console.error('Error al filtrar productos:', error);
  //     },
  //   });
  // }

  // selectTipo(tipo: { idTipoProducto: number; nombreTipo: string }) {
  //   this.selectedTipo = tipo;
  //   this.filtrar();
  // }

  // selectSubproducto(subtipo: { idTipoSubproducto: number; nombreSubtipo: string }) {
  //   this.selectedSubproducto = subtipo;
  //   this.filtrar();
  // }

  // limpiarFiltros(): void {
  //   this.selectedTipo = null;
  //   this.selectedSubproducto = null;
  //   this.obtenerProductos();
  // }

  // obtenerEmpleados(): void {
  //   this.loginService.getEmpleados().subscribe({
  //     next: (response: any) => {
  //       this.empleados = response.data;
  //       console.log('Empleados response:', response.data);
  //     },
  //     error: (error) => {
  //       console.error('Error al obtener los empleados:', error);
  //     },
  //   });
  // }

  // elegirAsesor(): void {
  //   this.showModal = true;
  //   this.obtenerEmpleados();
  // }

  // cerrarModal(): void {
  //   this.showModal = false;
  //   this.empleados = [];
  // }

  // seleccionarAsesor(empleado: EmpleadoDTO): void {
  //   if (!this.productoSeleccionado) {
  //     console.error('No hay producto seleccionado');
  //     this.cerrarModal();
  //     return;
  //   }

  //   const clienteData = localStorage.getItem('cliente');
  //   if (!clienteData) {
  //     console.error('No hay datos de cliente en localStorage');
  //     this.cerrarModal();
  //     return;
  //   }

  //   const cliente = JSON.parse(clienteData);
  //   const cedulaCliente = cliente.Cedula;

  //   const venta: Venta = {
  //     CedulaCliente: cedulaCliente,
  //     CedulaEmpleado: empleado.cedula,
  //     IdProducto: this.productoSeleccionado.idProducto,
  //     Cantidad: this.cantidad,
  //     PrecioUnitario: this.productoSeleccionado.precio,
  //   };

  //   this.ventaService.registrarPedido(venta).subscribe({
  //     next: (response: any) => {
  //       if (response.code === '01') {
  //         const ventaId = response.message.split('ID de venta: ')[1] || 'Desconocido';
  //         let phone = empleado.telefono?.replace(/[\s-]/g, '') || '';
  //         if (phone && !phone.startsWith('+')) {
  //           phone = '+593' + phone;
  //         }

  //         const productoNombre = this.productoSeleccionado!.nombre;
  //         const precioUnitario = this.productoSeleccionado!.precio.toFixed(2);
  //         const cantidad = this.cantidad;
  //         const total = (this.productoSeleccionado!.precio * this.cantidad).toFixed(2);

  //         const mensaje = `ID del Pedido: ${ventaId}\n` +
  //                         `Hola ${empleado.nombres}, estoy interesado en comprar:\n` +
  //                         `Producto: ${productoNombre}\n` +
  //                         `Precio unitario: $${precioUnitario}\n` +
  //                         `Cantidad: ${cantidad}\n` +
  //                         `Total: $${total}\n` +
  //                         `quisiera conocer sobre los descuentos`;

  //         const mensajeEncoded = encodeURIComponent(mensaje);
  //         const whatsappUrl = `https://wa.me/${phone}?text=${mensajeEncoded}`;
  //         window.open(whatsappUrl, '_blank');
  //         console.log('Venta registrada y WhatsApp abierto:', response);
  //       } else {
  //         console.error('Error en la venta:', response.message);
  //       }
  //       this.cerrarModal();
  //     },
  //     error: (error) => {
  //       console.error('Error al registrar la venta:', error);
  //       this.cerrarModal();
  //     },
  //   });
  // }

  // consultarPedidos(): void {
  //   console.log('Consultar pedidos clicked');
  // }

  // cerrarSesion(): void {
  //   localStorage.removeItem('cliente');
  //   this.router.navigate(['/InicioSesion']);
  // }

  //#endregion


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
  showSaleDetailsModal: boolean = false;
  saleCode: string = '';
  saleDetails: DetalleVentaResponse | null = null;
  saleDetailsError: string | null = null;
  selectedDescuento: number = 5; // Descuento fijo del 5%
  isGeneratingPDF: boolean = false; // Para el estado de carga 
  showPaymentModal: boolean = false; // Modal para subir comprobante
  comprobante: Comprobante = new Comprobante();
  selectedFile: File | null = null;

  // Nuevas propiedades para búsqueda por ID
  showIdVentaModal: boolean = false;
  idVenta: number | null = null;
  idVentaDetails: DetalleVentaResponse | null = null;
  idVentaError: string | null = null;
  showIdVentaPaymentModal: boolean = false;
  idVentaSelectedFile: File | null = null;
  idVentaComprobanteFecha: Date | null = null;
  idVentaComprobanteHora: string | null = null;
  idVentaComprobanteError: string | null = null;

  constructor(
    private productosService: ProductosService,
    private tiposProductoService: TiposProductoService,
    private loginService: LoginService,
    private ventaService: VentaService,
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

    const clienteData = localStorage.getItem('cliente');
    if (!clienteData) {
      console.error('No hay datos de cliente en localStorage');
      this.cerrarModal();
      return;
    }

    const cliente = JSON.parse(clienteData);
    const cedulaCliente = cliente.Cedula;

    const venta: Venta = {
      CedulaCliente: cedulaCliente,
      CedulaEmpleado: empleado.cedula,
      IdProducto: this.productoSeleccionado.idProducto,
      Cantidad: this.cantidad,
      PrecioUnitario: this.productoSeleccionado.precio,
    };

    this.ventaService.registrarPedido(venta).subscribe({
      next: (response: any) => {
        if (response.code === '01') {
          const ventaId = response.message.split('ID de venta: ')[1] || 'Desconocido';
          let phone = empleado.telefono?.replace(/[\s-]/g, '') || '';
          if (phone && !phone.startsWith('+')) {
            phone = '+593' + phone;
          }

          const productoNombre = this.productoSeleccionado!.nombre;
          const precioUnitario = this.productoSeleccionado!.precio.toFixed(2);
          const cantidad = this.cantidad;
          const total = (this.productoSeleccionado!.precio * this.cantidad).toFixed(2);

          const mensaje = `ID del Pedido: ${ventaId}\n` +
                          `Hola ${empleado.nombres}, estoy interesado en comprar:\n` +
                          `Producto: ${productoNombre}\n` +
                          `Precio unitario: $${precioUnitario}\n` +
                          `Cantidad: ${cantidad}\n` +
                          `Total: $${total}\n` +
                          `quisiera conocer sobre los descuentos`;

          const mensajeEncoded = encodeURIComponent(mensaje);
          const whatsappUrl = `https://wa.me/${phone}?text=${mensajeEncoded}`;
          window.open(whatsappUrl, '_blank');
          console.log('Venta registrada y WhatsApp abierto:', response);
        } else {
          console.error('Error en la venta:', response.message);
        }
        this.cerrarModal();
      },
      error: (error) => {
        console.error('Error al registrar la venta:', error);
        this.cerrarModal();
      },
    });
  }

  consultarPedidos(): void {
    this.saleCode = ''; 
    this.showSaleDetailsModal = true;
  }

  buscarVenta(): void {
    this.saleDetails = null;
    this.saleDetailsError = null;

    const trimmedSaleCode = this.saleCode.trim();

    if (trimmedSaleCode === '') {
      this.saleDetailsError = 'Por favor, ingrese un código de pedido.';
      return;
    }

    const base64Code = btoa(trimmedSaleCode);
    const request: DetalleVentaRequest = {
      IdVentaBase64: base64Code,
    };

    this.ventaService.getDetalleVenta(request).subscribe({
      next: (response: any) => {
        this.saleDetails = response;
        this.idVentaDetails = response.code;
        console.log('Detalles id de la venta:', this.idVentaDetails);
        this.saleDetailsError = null;
      },
      error: (error) => {
        console.error('Error al obtener detalles de la venta:', error);
        let errorMessage = 'Error al buscar la venta. Por favor, verifica el código e intenta de nuevo.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.saleDetails = null;
        this.saleDetailsError = errorMessage;
      },
    });
  }

  // buscarPorIdVentaConfirm(): void {
  //   this.idVentaDetails = null;
  //   this.idVentaError = null;

  //   if (!this.idVenta || this.idVenta <= 0) {
  //     this.idVentaError = 'Por favor, ingrese un ID de pedido válido.';
  //     return;
  //   }

  //   const request: DetalleVentaRequest = {
  //     IdVentaBase64: btoa(this.idVenta.toString()),
  //   };

  //   this.ventaService.getDetalleVenta(request).subscribe({
  //     next: (response: any) => {
  //       this.idVentaDetails = response;
  //       this.idVentaError = null;
  //     },
  //     error: (error) => {
  //       console.error('Error al obtener detalles de la venta por ID:', error);
  //       let errorMessage = 'Error al buscar la venta. Por favor, verifica el ID e intenta de nuevo.';
  //       if (error.error && error.error.message) {
  //         errorMessage = error.error.message;
  //       }
  //       this.idVentaDetails = null;
  //       this.idVentaError = errorMessage;
  //     },
  //   });
  // }

  cerrarModalSaleDetails(): void {
    this.showSaleDetailsModal = false;
    this.saleCode = '';
    this.saleDetails = null;
    this.saleDetailsError = null;
  }

  cerrarModalIdVenta(): void {
    this.showIdVentaModal = false;
    this.idVenta = 0;
    this.idVentaDetails = null;
    this.idVentaError = '';
  }

  //  abrirModalPagoIdVenta(): void {
  //   if (!this.idVentaDetails) {
  //     this.idVentaError = 'No hay detalles de venta disponibles.';
  //     return;
  //   }
  //   this.idVentaComprobanteFecha = new Date();
  //   this.idVentaComprobanteHora = new Date().toTimeString().split(' ')[0];
  //   this.idVentaSelectedFile = null;
  //   this.idVentaComprobanteError = null;
  //   this.showIdVentaPaymentModal = true;
  // }

  cerrarModalPagoIdVenta(): void {
    this.showIdVentaPaymentModal = false;
    this.idVentaSelectedFile = null;
    this.idVentaComprobanteFecha = null;
    this.idVentaComprobanteHora = null;
    this.idVentaComprobanteError = null;
  }

  

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.comprobante.imagen = this.selectedFile;
    }
  }

  onIdVentaFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.idVentaSelectedFile = input.files[0];
    } else {
      this.idVentaSelectedFile = null;
    }
  }

  subirComprobanteIdVenta(): void {
    // if (!this.idVentaSelectedFile || !this.idVentaDetails || !this.idVentaComprobanteFecha || !this.idVentaComprobanteHora) {
    //   this.idVentaComprobanteError = 'Por favor, complete todos los campos (imagen, fecha y hora).';
    //   return;
    // }

    if (!this.idVentaDetails || !this.comprobante.imagen) {
      console.log('No hay detalles de venta  o imagenes .');
      console.log('No hdetalles', this.idVentaDetails);
      return;
    }

    console.log('Detalles de venta:', this.saleDetails);
    console.log('idventa seleccionado:', 'IdVenta', this.saleDetails?.code);
    const formData = new FormData();
    formData.append('IdVenta', this.saleDetails?.code || '');
    formData.append('Imagen', this.comprobante.imagen || '');
    formData.append('Fecha', new Date().toISOString().split('T')[0]);
    formData.append('Hora', new Date().toTimeString().split(' ')[0]);
    ;

    this.ventaService.subirComprobante(formData).subscribe({
      next: (response: any) => {
        alert('Comprobante subido exitosamente.');
        console.log('Comprobante subido exitosamente:', response.data);
        console.log('Comprobante subido exitosamente:', response);
        this.cerrarModalPagoIdVenta();
        this.cerrarModalIdVenta();
      },
      error: (error) => {
        console.error('Error al subir el comprobante por ID:', error);
        let errorMessage = 'Error al subir el comprobante. Por favor, intenta de nuevo.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.idVentaComprobanteError = errorMessage;
      },
      
    });
    console.log(this.idVentaComprobanteError, 'Error al subir el comprobante');
  }

//  // Nuevos métodos para búsqueda por ID
//   buscarPorIdVenta(): void {
//     this.idVenta = null;
//     this.idVentaDetails = null;
//     this.idVentaError = null;
//     this.showIdVentaModal = true;
//   }

  calcularIVA(): number {
    if (!this.saleDetails || !this.saleDetails.precioTotal) return 0;
    const subtotalSinIVA = this.saleDetails.precioTotal / 1.14; // Invertir el 14% IVA
    return subtotalSinIVA * 0.14; // Calcular IVA
  }

  calcularPrecioTotalConDescuento(): number {
    if (!this.saleDetails || !this.saleDetails.precioTotal) return 0;
    const subtotalSinIVA = this.saleDetails.precioTotal / 1.15; // Quitar IVA
    const descuento = this.selectedDescuento / 100;
    return subtotalSinIVA * (1 - descuento); // Aplicar descuento fijo del 5%
  }

  calcularPrecioTotalConDescuentoIdVenta(): number {
    if (!this.idVentaDetails || !this.idVentaDetails.precioTotal) return 0;
    const subtotalSinIVA = this.idVentaDetails.precioTotal / 1.14;
    const descuento = this.selectedDescuento / 100;
    return subtotalSinIVA * (1 - descuento);
  }

  calcularTotalConIVAIdVenta(): number {
    const subtotalConDescuento = this.calcularPrecioTotalConDescuentoIdVenta();
    return subtotalConDescuento * 1.14;
  }

  calcularTotalConIVA(): number {
    const subtotalConDescuento = this.calcularPrecioTotalConDescuento();
    return subtotalConDescuento * 1.14;
  }

  calcularIVAIdVenta(): number {
    if (!this.idVentaDetails || !this.idVentaDetails.precioTotal) return 0;
    const subtotalSinIVA = this.idVentaDetails.precioTotal / 1.14;
    return subtotalSinIVA * 0.14;
  }

   cerrarSesion(): void {
    localStorage.removeItem('cliente');
    this.router.navigate(['/InicioSesion']);
  }

}
