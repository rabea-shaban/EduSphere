import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EduSphere API',
      version: '1.0.0',
      description: 'EduSphere Educational Management Platform API Documentation',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
        },
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            count: { type: 'integer' },
            total: { type: 'integer' },
            page: { type: 'integer' },
            pages: { type: 'integer' },
            data: { type: 'array', items: {} },
          },
        },
      },
    },
    security: [{ cookieAuth: [] }],
  },
  apis: ['./src/modules/**/*.routes.ts', './src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
