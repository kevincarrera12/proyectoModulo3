const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const rxjs = require('rxjs');

const disco = new Map();
const cache = new Map();
const root = path.resolve(__dirname, '../src');
function cargar(archivo) {
  const ruta = path.resolve(root, archivo);
  if (cache.has(ruta)) return cache.get(ruta);
  const exports = {};
  cache.set(ruta, exports);
  const codigo = ts.transpileModule(fs.readFileSync(ruta + '.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, experimentalDecorators: true },
  }).outputText;
  vm.runInNewContext(codigo, {
    exports,
    require: id => {
      if (id.startsWith('.')) return cargar(path.resolve(path.dirname(ruta), id));
      if (id === '@angular/core') return { Injectable: () => x => x, Component: () => x => x };
      if (id === '@nativescript/core') return {
        isAndroid: true,
        ApplicationSettings: { hasKey: key => disco.has(key), getString: key => disco.get(key), setString: (key, value) => disco.set(key, value) },
      };
      if (id === 'rxjs') return rxjs;
      if (id === '@angular/common/http') return {};
      throw new Error('Dependencia no simulada: ' + id);
    },
  });
  return exports;
}

const { AlmacenamientoService } = cargar('app/tienda/almacenamiento.service');
const { PedidosService } = cargar('app/tienda/pedidos.service');
const { PedidosComponent } = cargar('app/tienda/pedidos.component');
const { PerfilComponent } = cargar('app/tienda/perfil.component');
const { FavoritosComponent } = cargar('app/tienda/favoritos.component');
const { environment } = cargar('config/environment');
let actualizaciones = 0;
const vista = { markForCheck: () => actualizaciones++ };
const datos = [
  { codigo: 'T1-001', montoTotal: 100, direccion: 'Zona 1', fechaEntregaSolicitada: '2026-10-01' },
  { codigo: 'T1-002', montoTotal: 200, direccion: 'Zona 2', fechaEntregaSolicitada: '2026-10-02' },
];
const storage = new AlmacenamientoService();
storage.obtenerPerfil();
assert.ok(disco.has('perfil'));
const perfil = new PerfilComponent(storage);
perfil.cargar();
perfil.nombre = ' Ana ';
perfil.correo = ' ana@example.com ';
perfil.guardar();
const otroStorage = new AlmacenamientoService();
assert.equal(otroStorage.obtenerPerfil().nombre, 'Ana');
assert.equal(otroStorage.obtenerPerfil().correo, 'ana@example.com');
perfil.correo = 'invalido';
perfil.guardar();
assert.equal(otroStorage.obtenerPerfil().correo, 'ana@example.com');

storage.guardarFavorito(datos[0]);
storage.guardarFavorito({ ...datos[0] });
assert.equal(otroStorage.obtenerFavoritos().length, 1);
const favoritos = new FavoritosComponent(otroStorage);
favoritos.cargar();
assert.equal(favoritos.favoritos[0].codigo, 'T1-001');

let llamadas = 0;
const http = { get: (url, opciones) => {
  llamadas++;
  assert.equal(url, environment.apiUrl + '/pedidos');
  assert.equal(opciones.params.codigoTienda, '1');
  return rxjs.of(datos);
} };
const listado = new PedidosComponent(new PedidosService(http), storage, vista);
listado.codigoTienda = '4';
listado.buscarEnTienda();
assert.equal(llamadas, 0);
listado.codigoTienda = '1';
listado.buscarEnTienda();
assert.equal(llamadas, 1);
assert.equal(listado.resultados.length, 2);
listado.textoBusqueda = 't1-002';
listado.buscarLocalmente();
assert.equal(listado.resultados.length, 1);
assert.equal(listado.resultados[0].codigo, 'T1-002');
listado.textoBusqueda = 'Zona';
listado.buscarLocalmente();
assert.equal(listado.resultados.length, 0);
listado.textoBusqueda = '';
listado.buscarLocalmente();
assert.equal(listado.resultados.length, 2);
assert.equal(llamadas, 1);
listado.alternarFavorito(datos[1]);
favoritos.cargar();
assert.equal(favoritos.favoritos.length, 2);
favoritos.quitar(datos[0]);
listado.actualizarFavoritos();
assert.equal(listado.codigosFavoritos.has(datos[0].codigo), false);
assert.equal(otroStorage.obtenerFavoritos().length, 1);
listado.cambiarTienda();
assert.equal(listado.resultados.length, 0);
assert.equal(listado.tiendaActual, '');
assert.equal(llamadas, 1);

const pendiente = new rxjs.Subject();
const cancelable = new PedidosComponent({ obtenerPorTienda: () => pendiente }, storage, vista);
cancelable.codigoTienda = '2';
cancelable.buscarEnTienda();
assert.equal(cancelable.cargando, true);
cancelable.cambiarTienda();
pendiente.next(datos);
assert.equal(cancelable.resultados.length, 0);
const error = new PedidosComponent({ obtenerPorTienda: () => rxjs.throwError(() => new Error('offline')) }, storage, vista);
error.codigoTienda = '3';
error.buscarEnTienda();
assert.equal(error.cargando, false);
assert.ok(error.mensaje.includes('No se pudieron'));

disco.set('favoritos', '{JSON roto');
assert.equal(storage.obtenerFavoritos().length, 0);
disco.set('favoritos', JSON.stringify([datos[0], datos[0], null, {}]));
assert.equal(storage.obtenerFavoritos().length, 1);
console.log('OK: perfil, persistencia, favoritos únicos, HTTP por servicio, filtro local, cambio de tienda y errores.');

assert.ok(actualizaciones > 0, 'Las respuestas deben notificar a la vista OnPush');
const baseOriginal = environment.apiUrl;
environment.apiUrl += '/pedidos?codigoTienda=1';
listado.codigoTienda = '1';
listado.buscarEnTienda();
assert.equal(listado.cargando, false);
assert.ok(listado.mensaje.includes('solo el dominio'));
environment.apiUrl = baseOriginal;
const invalido = new PedidosComponent(new PedidosService({ get: () => rxjs.of({ error: 'sin listado' }) }), storage, vista);
invalido.codigoTienda = '1';
invalido.buscarEnTienda();
assert.equal(invalido.cargando, false);
assert.ok(invalido.mensaje.includes('listado válido'));
const sinRespuesta = new PedidosComponent({ obtenerPorTienda: () => rxjs.throwError(() => new rxjs.TimeoutError()) }, storage, vista);
sinRespuesta.codigoTienda = '1';
sinRespuesta.buscarEnTienda();
assert.equal(sinRespuesta.cargando, false);
assert.ok(sinRespuesta.mensaje.includes('10 segundos'));
const notificacionesAntes = actualizaciones;
const respuestaTardia = new rxjs.Subject();
const asincrono = new PedidosComponent({ obtenerPorTienda: () => respuestaTardia }, storage, vista);
asincrono.codigoTienda = '1';
asincrono.buscarEnTienda();
respuestaTardia.next(datos);
respuestaTardia.complete();
assert.equal(asincrono.cargando, false);
assert.equal(asincrono.resultados.length, 2);
assert.ok(actualizaciones > notificacionesAntes);
console.log('OK: actualización OnPush, URL incorrecta, respuesta inválida y timeout.');
