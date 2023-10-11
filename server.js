require('dotenv').config();
const express = require('express');
const db = require('./src/models');
const cors = require('cors');
const routing = require('./src/routes');
const auth_routes = require('./src/routes/auth.routes');
const { init, drop } = require('./dbConfigs/db');
const { support_init } = require('./dbConfigs/support_db');
// const notification_init = require('./notification_db');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', routing);
app.use('/auth', auth_routes);

init(db);
support_init();
// notification_init();
 
app.listen(process.env.PORT, ()=>console.log('server is running'));