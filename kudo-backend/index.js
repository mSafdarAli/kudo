const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');
const path = require('path');
const logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');
const bodyParser = require('body-parser');


const app = express();
const server = http.createServer(app)

app.use(express.json());
app.use(cors());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public/build')));
app.use('/files', express.static('files'));
app.use(bodyParser.json())
require('dotenv').config();


const dbUri = process.env.ATLAS_URI;
const port = process.env.PORT;


// Connect to MongoDB
mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB database connection established successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });



app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs)); // Serve Swagger UI


//Routes
app.use('/users', require('./routes/user'));
app.use('/admins', require('./routes/admin'));
app.use('/companies', require('./routes/company'));
app.use('/api', require('./routes/product'));
app.use('/api', require('./routes/schedule'));
app.use('/vendors', require('./routes/vendor'));
app.use(require('./routes/contracts'));
app.use(require('./routes/chatgpt'));
app.use('/api', require('./routes/sheet'));
app.use('/api/files', require('./routes/uploadFiles'));
app.use(require('./routes/retainers'));



app.get('/*', (req, res) => {
  //   res.status(200).json({message: "invalid url"});
  res.sendFile(path.resolve(__dirname, 'public', 'build', 'index.html'));
});


module.exports = app;