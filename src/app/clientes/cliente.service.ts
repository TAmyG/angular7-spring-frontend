import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';

import { Cliente } from './cliente';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpRequest,
  HttpEvent
} from '@angular/common/http';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Region } from './region';
import { AuthService } from '../usuarios/auth.service';

@Injectable()
export class ClienteService {
  private urlEndpPoint = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  private agregarAuthorizationHeader(): HttpHeaders {
    const token = this.authService.token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', `Bearer ${token}`);
    }
    return this.httpHeaders;
  }

  private isNoAutorizado(e): boolean {
    if (e.status === 401) {
      if (this.authService.isAuthenticated()) {
        this.authService.logout();
      }

      this.router.navigate(['/login']);
      return true;
    }

    if (e.status === 403) {
      swal(
        'Acceso denegado',
        `${this.authService.usuario.username}, no tienes acceso a este recurso`,
        'warning'
      );
      this.router.navigate(['/clientes']);
      return true;
    }
    return false;
  }

  getRegiones(): Observable<Region[]> {
    return this.http
      .get<Region[]>(`${this.urlEndpPoint}/regiones`, {
        headers: this.agregarAuthorizationHeader()
      })
      .pipe(
        catchError(e => {
          this.isNoAutorizado(e);
          return throwError(e);
        })
      );
  }

  getClientes(page: number): Observable<any> {
    // Se convierte en un observable
    // return of(CLIENTES);
    // return this.http.get<Cliente[]>(this.urlEndpPoint);
    return this.http.get(`${this.urlEndpPoint}/page/${page}`).pipe(
      tap((response: any) => {
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente);
        });
      }),
      map((response: any) => {
        (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          // cliente.createAt = formatDate(cliente.createAt, 'fullDate', 'es');
          return cliente;
        });
        // Se retorna el response ya que contiene toda la informacion de la paginacion
        // y solo se modifica el contenido del atributo content
        return response;
      })
    );
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http
      .post(this.urlEndpPoint, cliente, {
        headers: this.agregarAuthorizationHeader()
      })
      .pipe(
        map((response: any) => response.cliente as Cliente),
        catchError(e => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }

          if (e.status === 400) {
            return throwError(e);
          }
          console.log(e.error.mensaje);
          swal(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
        })
      );
  }

  getCliente(id: number): Observable<Cliente> {
    return this.http
      .get<Cliente>(`${this.urlEndpPoint}/${id}`, {
        headers: this.agregarAuthorizationHeader()
      })
      .pipe(
        catchError(e => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }

          this.router.navigate(['/clientes']);
          console.log(e.error.mensaje);
          swal('Error', e.error.mensaje, 'error');
          return throwError(e);
        })
      );
  }

  update(cliente: Cliente): Observable<Cliente> {
    return this.http
      .put(`${this.urlEndpPoint}/${cliente.id}`, cliente, {
        headers: this.agregarAuthorizationHeader()
      })
      .pipe(
        map((response: any) => response.cliente as Cliente),
        catchError(e => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }

          if (e.status === 400) {
            return throwError(e);
          }
          console.log(e.error.mensaje);
          swal(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
        })
      );
  }

  delete(id: number): Observable<Cliente> {
    return this.http
      .delete<Cliente>(`${this.urlEndpPoint}/${id}`, {
        headers: this.agregarAuthorizationHeader()
      })
      .pipe(
        catchError(e => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }

          console.log(e.error.mensaje);
          swal(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
        })
      );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id', id);

    let httpHeaders: HttpHeaders = new HttpHeaders();
    const token = this.authService.token;
    if (token != null) {
      httpHeaders = httpHeaders.append('Authorization', `Bearer ${token}`);
    }

    const req = new HttpRequest(
      'POST',
      `${this.urlEndpPoint}/upload`,
      formData,
      {
        reportProgress: true,
        headers: httpHeaders
      }
    );

    return this.http.request(req).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }
}
