import { Routes } from '@angular/router';
import { LoginComponent } from './Component/login/login.component';
import { HomeComponent } from './Component/home/home.component';
import { ProductoComponent } from './Component/producto/producto.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'productos', component: ProductoComponent },
    {path: '', redirectTo: 'login', pathMatch: 'full'}
];
