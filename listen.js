const app = require('./app.js');

const appPort = 9090;

app.listen(appPort, () => {
  console.log(`server is listening on port ${appPort}`);
})