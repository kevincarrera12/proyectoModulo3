import { Component } from '@angular/core';
import { AlmacenamientoService } from './almacenamiento.service';
import { Pedido } from './modelos';

@Component({ selector: 'ns-favoritos', templateUrl: './favoritos.component.html', standalone: false })
export class FavoritosComponent {
  favoritos: Pedido[] = [];

  constructor(private almacenamiento: AlmacenamientoService) {}

  cargar(): void { 

    this.favoritos = 
    this.almacenamiento.obtenerFavoritos(); 
    
  }
  quitar(pedido: Pedido): void {

    this.almacenamiento.quitarFavorito(pedido.codigo);
    this.cargar();

  }
}
