// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0', // Specify the OpenAPI version
    info: {
      title: 'Your API Documentation', // Specify your API title
      version: '1.0.0', // Specify your API version
      description: 'API documentation for your project', // Specify your API description
    },
    components: {
      schemas: {
        Vendor: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            services: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            price: { type: 'number' },
            notes: { type: 'string' },
            rating: { type: 'number' },
          },
        },
      },
    }
  },
  apis: ['./routes/*.js'], 
};

const specs = swaggerJsdoc(options);

module.exports = specs;
