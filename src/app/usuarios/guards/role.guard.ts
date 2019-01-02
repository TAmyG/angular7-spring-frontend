import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    const role = next.data['role'] as string;
    console.log('Guard: ', next.data);

    if (this.authService.hasRole(role)) {
      return true;
    }
    swal(
      'Acceso denegado',
      `${this.authService.usuario.username}, no tienes acceso a este recurso`,
      'warning'
    );
    this.router.navigate(['/clientes']);
    return false;
  }
}
