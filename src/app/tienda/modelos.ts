export interface Pedido {
  
  codigo: string;
  montoTotal: number;
  direccion: string;
  fechaEntregaSolicitada: string;
}

export interface Perfil {
  nombre: string;
  correo: string;
}
