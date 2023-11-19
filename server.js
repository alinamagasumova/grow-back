require('dotenv').config();
const express = require('express');
const db = require('./src/models');
const cors = require('cors');
const api_routes = require('./src/routes');
const auth_routes = require('./src/routes/auth.routes');
const client_routes = require('./src/routes/client.routes');
const master_routes = require('./src/routes/master.routes');
const { init, drop } = require('./dbConfigs/db');
// const { support_init } = require('./dbConfigs/support_db');
// const notification_init = require('./notification_db');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', api_routes)
app.use('/auth', auth_routes);
app.use('/api/client', client_routes);
app.use('/api/master', master_routes);
app.set('host', process.env.HOST || 'localhost');

init(db);
// support_init();
// notification_init();
 
app.listen(process.env.PORT, ()=>console.log('server is running', app.get('host')));