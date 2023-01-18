let express = require('express');
let app = express();
var morgan = require('morgan');
var cors = require('cors');

const PORT = 3000;

// middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// routes
app.use('/api/companies',require('./routes/companies'));
app.use('/api/contacts',require('./routes/contacts'));

app.listen(3000, ()=>{
    console.log("El servidor está escuchando en el puerto: "+PORT);
});