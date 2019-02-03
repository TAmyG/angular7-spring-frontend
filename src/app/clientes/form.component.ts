import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  public cliente: Cliente = new Cliente();
  public titulo = 'Crear cliente';
  public errores: string[];
  regiones: Region[];

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.clienteService
          .getCliente(id)
          .subscribe(cliente => (this.cliente = cliente));
      }
    });

    this.clienteService
      .getRegiones()
      .subscribe(regiones => (this.regiones = regiones));
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
    this.cliente.facturas = null;
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

  compararRegion(o1: Region, o2: Region): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 == null || o2 == null ? false : o1.id === o2.id;
  }
}
