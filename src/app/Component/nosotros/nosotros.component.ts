import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.css'
})
export class NosotrosComponent {

constructor(private router: Router) {}

   email: string = '';

  subscribe() {
    console.log('Subscribing with email:', this.email);
  }

  navigateToProductos() {
    this.router.navigate(['productos']);
  }

  isActive(route: string): boolean {
    return this.router.url === `/${route}`;
  }

}
