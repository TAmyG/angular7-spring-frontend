import { Producto } from './producto';

export class ItemFactura {
  producto: Producto;
  cantidad = 1;
  importe: number;

  calcularImporte(): number {
    return this.cantidad * this.producto.precio;
  }
}
