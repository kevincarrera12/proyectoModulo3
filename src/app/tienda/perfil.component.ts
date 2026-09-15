import { Component } from '@angular/core';
import { AlmacenamientoService } from './almacenamiento.service';

@Component({ selector: 'ns-perfil', templateUrl: './perfil.component.html', standalone: false })
export class PerfilComponent {
  nombre = '';
  correo = '';
  mensaje = '';
  constructor(private almacenamiento: AlmacenamientoService) {}

  cargar(): void {
    const perfil = this.almacenamiento.obtenerPerfil();
    this.nombre = perfil.nombre;
    this.correo = perfil.correo;
    this.mensaje = '';
  }

  guardar(): void {
    const nombre = this.nombre.trim();
    const correo = this.correo.trim();
    if (!nombre || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      this.mensaje = 'debe ser un correo valido.';
      return;
    }
    
    this.almacenamiento.guardarPerfil({ nombre, correo });

    this.nombre = nombre;
    this.correo = correo;
    this.mensaje = 'Guardado.';
  }
}
