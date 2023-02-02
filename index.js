import express from 'express';
import cors from 'cors'
import { config } from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import helmet from 'helmet';

import apiRouter from './routes/index.js';
import sequelize from './database.js';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
config();

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use('/api', apiRouter);

app.use((req, res, next) => {
  res.send('<h1>Page not found</h1>')
})
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500)
    .json({ message: error.message, data: error.data });
  next();
})

sequelize
  .sync()
  .then(() => {
  const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
  })
})
