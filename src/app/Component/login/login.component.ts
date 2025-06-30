import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../Service/login.service';
import { Router } from '@angular/router';
import { LoginRequest } from '../../Model/empleado';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;
  loading: boolean = false;
  signUpMessage: string | null = null;
  showMessageModal: boolean = false;


  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router, private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      cedula: ['', Validators.required],
      contrasenia: ['', Validators.required]
    });
  }

 login() {
    console.log('Iniciando login, formulario válido:', !this.loginForm.invalid);
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.signUpMessage = 'Error: Por favor, ingrese una cédula válida (10 dígitos) y una contraseña de al menos 6 caracteres.';
      this.showMessageModal = true;
      console.log('Mensaje establecido:', this.signUpMessage);
      this.clearMessageAfterDelay();
      this.cdr.detectChanges();
      return;
    }

    const credentials = this.loginForm.value;
    this.loading = true;
    this.signUpMessage = null;
    this.showMessageModal = false;
    console.log('Enviando credenciales:', credentials);

    this.loginService.login(credentials).subscribe({
      next: (response: any) => {
        this.loading = false;
        console.log('Respuesta del backend:', response);
        if (response.data !== null) {
          localStorage.setItem('token', response.data.idRol);
          localStorage.setItem('cedula', response.data.cedula);
          localStorage.setItem('nombre', response.data.nombres);
          localStorage.setItem('apellido', response.data.apellidos);
          localStorage.setItem('direccion', response.data.direccion);
          this.signUpMessage = 'Inicio de sesión exitoso';
          this.showMessageModal = true;
          console.log('Mensaje de éxito:', this.signUpMessage);
          this.cdr.detectChanges();
          setTimeout(() => {
            this.router.navigate(['producto-empleado']);
          }, 1000);
        } else {
          this.signUpMessage = 'Error: Credenciales incorrectas, por favor intenta nuevamente.';
          this.showMessageModal = true;
          console.log('Mensaje de error (credenciales):', this.signUpMessage);
          this.clearMessageAfterDelay();
          this.cdr.detectChanges();
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        let errorMessage = 'Error: No se pudo iniciar sesión. Por favor, intenta de nuevo.';
        if (err.error && err.error.message) {
          errorMessage = `Error: ${err.error.message}`;
        }
        this.signUpMessage = errorMessage;
        this.showMessageModal = true;
        console.log('Mensaje de error (HTTP):', this.signUpMessage);
        this.clearMessageAfterDelay();
        this.cdr.detectChanges();
      }
    });
  }

  cerrarMessageModal() {
    this.signUpMessage = null;
    this.showMessageModal = false;
    this.cdr.detectChanges();
    console.log('Modal cerrado manualmente');
  }

  clearMessageAfterDelay() {
    setTimeout(() => {
      this.signUpMessage = null;
      this.showMessageModal = false;
      console.log('Limpiando mensaje y cerrando modal:', this.signUpMessage);
      this.cdr.detectChanges();
    }, 5000);
  }
 
}
