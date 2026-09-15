const express = require('express');
const app = express();

const pedidosPorTienda = {
  '1': [
    { codigo: 'T1-001', montoTotal: 100, direccion: 'Zona 1, avenida 1', fechaEntregaSolicitada: '2026-10-01' },

    { codigo: 'T1-002', montoTotal: 200, direccion: 'Zona 2, avenida 2', fechaEntregaSolicitada: '2026-10-02' },

    { codigo: 'T1-003', montoTotal: 300, direccion: 'Zona 3, avenida 3', fechaEntregaSolicitada: '2026-10-03' },
  ],
  '2': [
    { codigo: 'T2-001', montoTotal: 150, direccion: 'Zona 4, calle 1', fechaEntregaSolicitada: '2026-10-04' },

    { codigo: 'T2-002', montoTotal: 250, direccion: 'Zona 5, calle 2', fechaEntregaSolicitada: '2026-10-05' },
  ],
  '3': [
    { codigo: 'T3-001', montoTotal: 175, direccion: 'Zona 6, avenida 1', fechaEntregaSolicitada: '2026-10-06' },

    { codigo: 'T3-002', montoTotal: 275, direccion: 'Zona 7, avenida 2', fechaEntregaSolicitada: '2026-10-07' },

    { codigo: 'T3-003', montoTotal: 375, direccion: 'Zona 8, avenida 3', fechaEntregaSolicitada: '2026-10-08' },

    { codigo: 'T3-004', montoTotal: 475, direccion: 'Zona 9, avenida 4', fechaEntregaSolicitada: '2026-10-09' },
  ],
};

app.get('/pedidos', (req, res) => {

  const codigoTienda = req.query.codigoTienda;
  if (typeof codigoTienda !== 'string' 
      || !['1', '2', '3'].includes(codigoTienda)
    ) {
    return res.status(400).json({ mensaje: 'El codigo de tienda debe ser 1, 2 o 3.' });
  }
  res.json(pedidosPorTienda[codigoTienda]);

});

module.exports = app;
