import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from '@nativescript/angular';
import { PedidosComponent } from './pedidos.component';
import { PerfilComponent } from './perfil.component';
import { FavoritosComponent } from './favoritos.component';

@NgModule({
  imports: [NativeScriptRouterModule.forChild([
    { path: '', redirectTo: '/pedidos', pathMatch: 'full' },
    { path: 'pedidos', component: PedidosComponent },
    { path: 'perfil', component: PerfilComponent },
    { path: 'favoritos', component: FavoritosComponent },
    { path: '**', redirectTo: '/pedidos' },
  ])],
  exports: [NativeScriptRouterModule],
})
export class TiendaRoutingModule {}
