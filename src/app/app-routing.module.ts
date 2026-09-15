import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from '@nativescript/angular';

@NgModule({
  imports: [NativeScriptRouterModule.forRoot([
    { path: '', loadChildren: () => import('./tienda/tienda.module').then(m => m.TiendaModule) },
  ])],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
