import { ClienteService } from './../../Service/cliente.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Cliente, ClienteDTO } from '../../Model/cliente';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-cliente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login-cliente.component.html',
  styleUrl: './login-cliente.component.css',
})
export class LoginClienteComponent {
 
   isRightPanelActive = false;
  cedula: string = '';
  nombres: string = '';
  apellidos: string = '';
  direccion: string = '';
  correoElectronico: string = '';
  clave: string = '';
  telefono: string = '';
  signUpMessage: string | null = null;
  signInMessage: string | null = null;

  constructor(private clienteServices: ClienteService, private router: Router) {}

  togglePanel() {
    this.isRightPanelActive = !this.isRightPanelActive;
  }

  login() {
    const credentials = {
      CorreoElectronico: this.correoElectronico,
      Clave: this.clave,
    };

    this.clienteServices.login(credentials).subscribe({
      next: (response: any) => {
        if (response.data !== null) {
          const cliente: ClienteDTO = {
            Nombres: response.data.nombres,
            Apellidos: response.data.apellidos,
            Cedula: response.data.cedula,
            Direccion: response.data.direccion,
            Telefono: response.data.telefono,
          };
          localStorage.setItem('cliente', JSON.stringify(cliente));
          this.router.navigate(['/productos']);
        } else {
          this.signInMessage = response.message || 'Error en el inicio de sesión';
          setTimeout(() => {
            this.signInMessage = null;
          }, 5000);
        }
      },
      error: (err) => {
        this.signInMessage = err.error?.message || 'Error en el inicio de sesión';
        setTimeout(() => {
          this.signInMessage = null;
        }, 5000);
      },
    });
  }

  registrarCliente() {
    const cliente: Cliente = {
      Cedula: this.cedula,
      Nombres: this.nombres,
      Apellidos: this.apellidos,
      Direccion: this.direccion,
      CorreoElectronico: this.correoElectronico,
      Clave: this.clave,
      Telefono: this.telefono,
    };
    this.clienteServices.agregarProducto(cliente).subscribe({
      next: (response: any) => {
        if (response.data !== null) {
          this.signUpMessage = response.message || 'Cliente registrado exitosamente';
          // Limpiar los campos del formulario
          this.cedula = '';
          this.nombres = '';
          this.apellidos = '';
          this.direccion = '';
          this.correoElectronico = '';
          this.clave = '';
          this.telefono = '';
          setTimeout(() => {
            this.signUpMessage = null;
          }, 5000);
        } else {
          this.signUpMessage = response.message || 'Error en el registro';
          setTimeout(() => {
            this.signUpMessage = null;
          }, 5000);
        }
      },
      error: (err) => {
        this.signUpMessage = err.error?.message || 'Error en el registro';
        setTimeout(() => {
          this.signUpMessage = null;
        }, 5000);
      },
    });
  }

}
