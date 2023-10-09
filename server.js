require('dotenv').config();
const express = require('express');
const db = require('./src/models');
const cors = require('cors');
const routing = require('./src/routes');
const auth_routes = require('./src/routes/auth.routes');
const service = require('./src/models/service');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', routing);
app.use('/auth', auth_routes);

// db.sequelize.drop({force: true}).then(()=>console.log('dropped db')).catch(error => console.error('unable to sync models:', error));

db.sequelize.sync({ force: true })
    .then(()=>{console.log('dropped and resynced db');})
    .catch(error => console.error('unable to sync models:', error));

app.listen(process.env.PORT, ()=>console.log('server is running'));