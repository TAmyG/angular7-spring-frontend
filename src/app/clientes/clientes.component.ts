import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[];
  paginador: any;

  constructor(
    private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let page = +params.get('page');
      if (!page) {
        page = 0;
      }
      this.clienteService
        .getClientes(page)
        .pipe(
          tap((response: any) => {
            (response.content as Cliente[]).forEach(cliente => {
              console.log('Desde el component', cliente);
            });
          })
        )
        .subscribe((response: any) => {
          this.paginador = response;
          this.clientes = response.content as Cliente[];
        });
    });
  }

  delete(cliente: Cliente): void {
    swal({
      title: 'Estás seguro?',
      text: `Seguro que deseas eliminar al cliente ${cliente.nombre}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, Eliminar!',
      cancelButtonText: 'No!'
    }).then(result => {
      if (result.value) {
        this.clienteService.delete(cliente.id).subscribe(response => {
          this.clientes = this.clientes.filter(cli => cli !== cliente);
          swal(
            'Eliminado!',
            `Cliente ${cliente.nombre} eliminado con éxito`,
            'success'
          );
        });
      }
    });
  }
}
