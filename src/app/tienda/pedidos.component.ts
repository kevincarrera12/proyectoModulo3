import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { defer, finalize, Subscription } from 'rxjs';
import { AlmacenamientoService } from './almacenamiento.service';
import { PedidosService } from './pedidos.service';
import { Pedido } from './modelos';

@Component({ selector: 'ns-pedidos', templateUrl: './pedidos.component.html', standalone: false })
export class PedidosComponent implements OnDestroy {
  codigoTienda = '';
  tiendaActual = '';
  textoBusqueda = '';
  cargando = false;
  mensaje = '';
  pedidos: Pedido[] = [];
  resultados: Pedido[] = [];
  codigosFavoritos = new Set<string>();
  private solicitud?: Subscription;

  constructor(private servicio: PedidosService, private almacenamiento: AlmacenamientoService,
    private vista: ChangeDetectorRef) {
    this.almacenamiento.obtenerPerfil();
  }

  actualizarFavoritos(): void {
    this.codigosFavoritos = new Set(this.almacenamiento.obtenerFavoritos().map(p => p.codigo));
  }

  buscarEnTienda(): void {
    if (this.cargando) return;
    const codigo = this.codigoTienda.trim();
    if (!['1', '2', '3'].includes(codigo)) {
      this.mensaje = 'Escribe un código de tienda: 1, 2 o 3.';
      return;
    }
    this.mensaje = '';
    this.cargando = true;
    this.solicitud = defer(() => this.servicio.obtenerPorTienda(codigo)).pipe(
      finalize(() => {
        this.cargando = false;
        this.vista.markForCheck();
      }),
    ).subscribe({
      next: pedidos => {
        this.pedidos = pedidos;
        this.resultados = [...pedidos];
        this.tiendaActual = codigo;
        this.textoBusqueda = '';
        this.cargando = false;
        this.actualizarFavoritos();
        this.mensaje = pedidos.length ? '' : 'Esta tienda no tiene pedidos.';
      },
      error: error => {
        this.cargando = false;
        if (error.name === 'TimeoutError') {
          this.mensaje = 'El servidor tardó más de 10 segundos. Vuelve a intentar.';
        } else if (error.status === 0) {
          this.mensaje = 'No se pudo conectar. Revisa la conexión del dispositivo y el túnel ngrok.';
        } else if (error.status) {
          this.mensaje = 'No se pudieron obtener los pedidos (HTTP ' + error.status + '). Revisa la URL y el servidor.';
        } else {
          this.mensaje = 'No se pudieron obtener los pedidos. ' + error.message;
        }
      },
    });
  }

  buscarLocalmente(): void {
    const texto = this.textoBusqueda.trim().toLowerCase();
    this.resultados = this.pedidos.filter(p => p.codigo.toLowerCase().includes(texto));
    this.mensaje = this.resultados.length ? '' : 'No existen coincidencias.';
  }

  cambiarTienda(): void {
    this.solicitud?.unsubscribe();
    this.cargando = false;
    this.tiendaActual = '';
    this.codigoTienda = '';
    this.textoBusqueda = '';
    this.pedidos = [];
    this.resultados = [];
    this.mensaje = '';
  }

  alternarFavorito(pedido: Pedido): void {
    if (this.codigosFavoritos.has(pedido.codigo)) this.almacenamiento.quitarFavorito(pedido.codigo);
    else this.almacenamiento.guardarFavorito(pedido);
    this.actualizarFavoritos();
  }

  ngOnDestroy(): void { this.solicitud?.unsubscribe(); }
}
