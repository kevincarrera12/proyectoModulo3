import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule, provideNativeScriptHttpClient } from '@nativescript/angular';
import { NativeScriptUISideDrawerModule } from 'nativescript-ui-sidedrawer/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  bootstrap: [AppComponent],
  imports: [NativeScriptModule, AppRoutingModule, NativeScriptUISideDrawerModule],
  declarations: [AppComponent],
  providers: [provideNativeScriptHttpClient()],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
