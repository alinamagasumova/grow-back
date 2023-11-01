require('dotenv').config();
const express = require('express');
const db = require('./src/models');
const helmet = require('helmet');
const cors = require('cors');
const api_routes = require('./src/routes');
const auth_routes = require('./src/routes/auth.routes');
const client_routes = require('./src/routes/client.routes');
const master_routes = require('./src/routes/master.routes');
const support_routes = require('./src/routes/support.routes');
const { support_init } = require('./dbConfigs/support_db');
const { init, drop } = require('./dbConfigs/db');

const app = express();

// for security
app.use(helmet());
app.use(cors());

app.use(express.json());

// routes
app.use('/auth', auth_routes);
app.use('/api', api_routes)
app.use('/api/client', client_routes);
app.use('/api/master', master_routes);
// app.use('/support', support_routes);

// db inits
init(db);
// support_init();
// notification_init();
 
app.listen(process.env.PORT, ()=>console.log('server is running'));