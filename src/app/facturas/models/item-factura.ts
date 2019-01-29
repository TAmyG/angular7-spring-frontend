import { Producto } from './producto';

export class ItemFactura {
  producto: Producto;
  cantidad = 1;
  importe: number;
}
