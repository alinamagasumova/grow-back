require('dotenv').config();
const express = require('express');
const db = require('./src/database');
const cors = require('cors');
const routing = require('./src/routes');

db.authenticate()
    .then(()=>console.log('successfully connected to the database'))
    .catch(error => console.error('unable to connect to the database:', error));

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', routing);

app.listen(process.env.PORT, ()=>console.log('server is running'));