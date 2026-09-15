import { Component } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { Application } from '@nativescript/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';

@Component({ selector: 'ns-app', templateUrl: './app.component.html', standalone: false })
export class AppComponent {
  constructor(private router: RouterExtensions) {}
  navegar(ruta: string): void {
    this.router.navigate([ruta]);
    (Application.getRootView() as RadSideDrawer).closeDrawer();
  }
}
