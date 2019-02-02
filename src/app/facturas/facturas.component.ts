import { Component, OnInit } from '@angular/core';
import { Factura } from './models/factura';
import { ClienteService } from '../clientes/cliente.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, flatMap } from 'rxjs/operators';
import { FacturaService } from './services/factura.service';
import { Producto } from './models/producto';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { ItemFactura } from './models/item-factura';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {
  titulo = 'Nueva Factura';
  factura: Factura = new Factura();
  autocompleteControl = new FormControl();
  productosFiltrados: Observable<Producto[]>;

  constructor(
    private clienteService: ClienteService,
    private activaredRoute: ActivatedRoute,
    private facturaService: FacturaService
  ) {}

  ngOnInit() {
    this.activaredRoute.paramMap.subscribe(params => {
      const clienteId = +params.get('clienteId');
      this.clienteService.getCliente(clienteId).subscribe(cliente => {
        this.factura.cliente = cliente;
      });
    });

    this.productosFiltrados = this.autocompleteControl.valueChanges.pipe(
      map(value => (typeof value === 'string' ? value : value.nombre)),
      flatMap(value => (value ? this._filter(value) : []))
    );
  }

  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();

    return this.facturaService.filtrarProductos(filterValue);
  }

  mostrarNombre(producto?: Producto): string | undefined {
    return producto ? producto.nombre : undefined;
  }

  seleccionarProducto(event: MatAutocompleteSelectedEvent): void {
    const producto = event.option.value as Producto;
    console.log(producto);

    if (this.existeitem(producto.id)) {
      this.incrementaCantidad(producto.id);
    } else {
      const nuevoItem = new ItemFactura();
      nuevoItem.producto = producto;
      this.factura.items.push(nuevoItem);
    }

    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }

  actualizarCantidad(id: number, event: any): void {
    const cantidad: number = event.target.value as number;

    if (cantidad < 1) {
      this.eliminarItemFactura(id);
    }
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if (id === item.producto.id) {
        item.cantidad = cantidad;
      }
      return item;
    });
  }

  existeitem(id: number): boolean {
    let existe = false;
    this.factura.items.forEach((item: ItemFactura) => {
      if (id === item.producto.id) {
        existe = true;
      }
    });
    return existe;
  }

  incrementaCantidad(id: number): void {
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if (id === item.producto.id) {
        ++item.cantidad;
      }
      return item;
    });
  }

  eliminarItemFactura(id: number): void {
    this.factura.items = this.factura.items.filter(
      (item: ItemFactura) => id !== item.producto.id
    );
  }
}
