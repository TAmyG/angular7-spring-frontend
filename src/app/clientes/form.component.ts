import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  private cliente: Cliente = new Cliente();
  private titulo = 'Crear cliente';
  private errores: string[];

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.cargarCliente();
  }

  cargarCliente(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.clienteService
          .getCliente(id)
          .subscribe(cliente => (this.cliente = cliente));
      }
    });
  }

  create(): void {
    // console.log(this.cliente);
    this.clienteService.create(this.cliente).subscribe(
      clienteRes => {
        swal(
          'Nuevo cliente',
          `Cliente ${clienteRes.nombre} creado con éxtio`,
          'success'
        );
        return this.router.navigate(['/clientes']);
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error(err.status, err.error.errors);
      }
    );
  }

  update(): void {
    this.clienteService.update(this.cliente).subscribe(
      clienteRes => {
        swal(
          'Cliente actualizado',
          `Cliente ${clienteRes.nombre} actualizado con éxtio`,
          'success'
        );
        return this.router.navigate(['/clientes']);
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error(err.status, err.error.errors);
      }
    );
  }
}
