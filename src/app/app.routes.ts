import { Routes } from '@angular/router';
import { LoginComponent } from './Component/login/login.component';
import { HomeComponent } from './Component/home/home.component';
import { ProductoComponent } from './Component/producto/producto.component';
import { ProductoEmpleadoComponent } from './Component/producto-empleado/producto-empleado.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'productos', component: ProductoComponent },
    {path: 'producto-empleado', component: ProductoEmpleadoComponent},
    {path: '', redirectTo: 'login', pathMatch: 'full'}
];
