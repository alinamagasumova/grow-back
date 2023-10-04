require('dotenv').config();
const express = require('express');
const db = require('./src/models');
const cors = require('cors');
const routing = require('./src/routes');
const authRouting = require('./src/routes/auth.routes');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', routing);
// app.use('/auth', authRouting);

// db.sequelize.authenticate()
//     .then(()=>console.log('successfully connected to the database'))
//     .catch(error => console.error('unable to connect to the database:', error));
db.sequelize.sync({ force: true })
.then(()=>console.log('dropped and resynced db'))
.catch(error => console.error('unable to sync models:', error));

app.listen(process.env.PORT, ()=>console.log('server is running'));