import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { CLIENTES } from './clientes.json';
import { Observable, of } from 'rxjs';

@Injectable()
export class ClienteService {
  constructor() {}

  getClientes(): Observable<Cliente[]> {
    // Se convierte en un observable
    return of(CLIENTES);
  }
}
