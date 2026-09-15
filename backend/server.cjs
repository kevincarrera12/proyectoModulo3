const app = require('./app.cjs');
const port = Number(process.env.PORT || 3000);
app.listen(port, '0.0.0.0', () => {
  console.log('Servidor de pedidos disponible en el puerto ' + port);
});
