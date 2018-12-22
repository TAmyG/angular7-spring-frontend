import { Component, OnInit, Input } from '@angular/core';
import { _appIdRandomProviderFactory } from '@angular/core/src/application_tokens';

@Component({
  selector: 'paginator-nav',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit {
  @Input()
  paginador: any;

  paginas: number[];
  constructor() {}

  ngOnInit() {
    this.paginas = new Array(this.paginador.totalPages)
      .fill(0)
      .map((_valor, indice) => indice + 1);
  }
}
