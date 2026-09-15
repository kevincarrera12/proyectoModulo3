import { Injectable } from '@angular/core';
import { localStorage } from './local-storage';
import { Pedido, Perfil } from './modelos';

@Injectable({ providedIn: 'root' })
export class AlmacenamientoService {
  private leer(clave: string): unknown {

    try { return JSON.parse(localStorage.getItem(clave) ?? 'null'); }
    catch { return null; }

  }

  guardarPerfil(perfil: Perfil): void {
    localStorage.setItem('perfil', JSON.stringify(perfil));
  }

  obtenerPerfil(): Perfil {

    const valor = this.leer('perfil') as Perfil | null;
    if (valor && typeof valor.nombre === 'string' 
      && typeof valor.correo === 'string') return valor;
    const inicial = { nombre: 'Usuario', correo: 'usuario@example.com' };
    this.guardarPerfil(inicial);

    return inicial;

  }

  

  guardarFavorito(pedido: Pedido): void {
    const favoritos = this.obtenerFavoritos();
    if (favoritos.some(item => item.codigo === pedido.codigo)) return;
    localStorage.setItem('favoritos', JSON.stringify([...favoritos, pedido]));
  }

  obtenerFavoritos(): Pedido[] {
    const valor = this.leer('favoritos');
    if (!Array.isArray(valor)) return [];

    return valor.filter((p, indice, todos) =>
      p && typeof p.codigo === 'string' 
        && typeof p.montoTotal === 'number' &&
      typeof p.direccion === 'string' 
        && typeof p.fechaEntregaSolicitada === 'string' &&
      todos.findIndex(otro => otro?.codigo === p.codigo) === indice);
      
  }



  quitarFavorito(codigo: string): void {
    localStorage.setItem('favoritos', JSON.stringify(this.obtenerFavoritos().filter(p => p.codigo !== codigo)));
  }
}
