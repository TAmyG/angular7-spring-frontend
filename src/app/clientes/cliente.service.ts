import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';

import { Cliente } from './cliente';
import { CLIENTES } from './clientes.json';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable()
export class ClienteService {
  private urlEndpPoint = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router) {}

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
        headers: this.httpHeaders
      })
      .pipe(
        map((response: any) => response.cliente as Cliente),
        catchError(e => {
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
    return this.http.get<Cliente>(`${this.urlEndpPoint}/${id}`).pipe(
      catchError(e => {
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
        headers: this.httpHeaders
      })
      .pipe(
        map((response: any) => response.cliente as Cliente),
        catchError(e => {
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
        headers: this.httpHeaders
      })
      .pipe(
        catchError(e => {
          console.log(e.error.mensaje);
          swal(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
        })
      );
  }

  subirFoto(archivo: File, id): Observable<Cliente> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id', id);
    return this.http.post(`${this.urlEndpPoint}/upload`, formData).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {
        console.log(e.error.mensaje);
        swal(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
}
