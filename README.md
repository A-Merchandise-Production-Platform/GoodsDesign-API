# GoodsDesign API

A NestJS-based REST API for the GoodsDesign platform.

## Description

This API serves as the backend for the GoodsDesign platform, providing endpoints for managing goods, designs, and related resources. Built with NestJS, it follows modern architectural patterns and best practices.

## Features

- GraphQL API endpoints
- Prisma ORM for database operations
- Docker containerization
- TypeScript support
- Automated testing setup

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Docker and Docker Compose (for containerized development)
- PostgreSQL database

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/goodsdesign-api.git
cd goodsdesign-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit the `.env` file with your configuration.

4. Start the development database:
```bash
docker-compose up -d
```

5. Run database migrations:
```bash
npx prisma migrate dev
```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Docker Deployment

The application can be deployed using Docker:

```bash
# Using Docker Compose (recommended for development)
docker compose up -d

# Or using individual Docker commands
# Build the image
docker build -t goodsdesign-api .

# Run the container
docker run -p 3000:3000 goodsdesign-api
```

## API Documentation

API documentation is available at `/api` when running the application in development mode.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
