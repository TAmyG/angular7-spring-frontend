import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Factura } from '../models/factura';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private urlEndPoint = 'http://localhost:8080/api/facturas';

  constructor(private http: HttpClient) {}

  getFactura(id: number): Observable<Factura> {
    return this.http.get<Factura>(`${this.urlEndPoint}/${id}`);
  }
}
