import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NativeScriptCommonModule, NativeScriptFormsModule } from '@nativescript/angular';
import { TiendaRoutingModule } from './tienda-routing.module';
import { PedidosComponent } from './pedidos.component';
import { PerfilComponent } from './perfil.component';
import { FavoritosComponent } from './favoritos.component';

@NgModule({

  imports: [NativeScriptCommonModule, FormsModule, NativeScriptFormsModule, TiendaRoutingModule],
  declarations: [PedidosComponent, PerfilComponent, FavoritosComponent],
  schemas: [NO_ERRORS_SCHEMA],
  
})
export class TiendaModule {}
