const app = require('./app.js');

const { PORT = 9090 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));

// const appPort = 9090;

// app.listen(appPort, () => {
//   console.log(`server is listening on port ${appPort}`);
// })