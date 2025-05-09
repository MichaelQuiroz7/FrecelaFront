import { Component } from '@angular/core';
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

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      cedula: ['', Validators.required],
      contrasenia: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      console.log('Por favor ingrese la cédula y la contraseña');
      return;
    }

    const credentials = this.loginForm.value;

    this.loading = true;

    this.loginService.login(credentials).subscribe({
      next: (response: any) => {

        if (response) {
          //localStorage.setItem('token', response.token);
          console.log('Inicio de sesión exitoso', response);
          this.router.navigate(['home']);
        } else {
          console.log(response.data);
          console.log('Error en el inicio de sesión: ', response.message);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        console.error('Error en login:', err);
      }
    });
  }
 
}
