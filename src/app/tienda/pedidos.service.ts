import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, timeout } from 'rxjs';
import { environment } from '../../config/environment';
import { Pedido } from './modelos';

@Injectable({ providedIn: 'root' })
export class PedidosService {
  constructor(private http: HttpClient) {}
  obtenerPorTienda(codigoTienda: string): Observable<Pedido[]> {
    const base = environment.apiUrl.trim().replace(/\/+$/, '');
    if (!/^https?:\/\/[^/?#]+$/.test(base)) {
      throw new Error('apiUrl debe contener solo el dominio y puerto, sin /pedidos ni parámetros.');
    }
    return this.http.get<unknown>(base + '/pedidos', {
      params: { codigoTienda },
      headers: { Accept: 'application/json', 'ngrok-skip-browser-warning': '1' },
    }).pipe(
      timeout(10000),
      map(respuesta => {
        if (!Array.isArray(respuesta) || !respuesta.every(p => p &&
          typeof p.codigo === 'string' && typeof p.montoTotal === 'number' &&
          typeof p.direccion === 'string' && typeof p.fechaEntregaSolicitada === 'string')) {
          throw new Error('El servidor no devolvió un listado válido de pedidos.');
        }
        return respuesta as Pedido[];
      }),
    );
  }
}
