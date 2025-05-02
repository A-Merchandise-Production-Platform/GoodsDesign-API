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

Environment variables format:
```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"

# JWT Configuration
JWT_ACCESS_TOKEN_SECRET="your_access_token_secret"
JWT_ACCESS_TOKEN_EXPIRES_IN="15m"
JWT_REFRESH_TOKEN_SECRET="your_refresh_token_secret"
JWT_REFRESH_TOKEN_EXPIRES_IN="7d"

# Redis Configuration
REDIS_URL="redis://localhost:6379"
REDIS_TTL="604800"

# GHN (Giao Hàng Nhanh) Configuration
GHN_TOKEN="your_ghn_token"
GHN_SHOP_ID="your_shop_id"
GHN_BASE_URL="https://dev-online-gateway.ghn.vn"

# Payment Configuration
PAYMENT_PAYOS_CLIENT_ID="your_payos_client_id"
PAYMENT_PAYOS_API_KEY="your_payos_api_key"
PAYMENT_PAYOS_CHECKSUM_KEY="your_payos_checksum_key"
PAYMENT_PAYOS_CANCEL_URL="https://your-domain.com/payment"
PAYMENT_PAYOS_RETURN_URL="https://your-domain.com/payment"
PAYMENT_VNPAY_RETURN_URL="https://your-domain.com/payment"
PAYMENT_VNPAY_VNP_URL="https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
PAYMENT_VNPAY_TMN_CODE="your_tmn_code"
PAYMENT_VNPAY_HASH_SECRET="your_hash_secret"
PAYMENT_VNPAY_VERSION="2.1.0"

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# File Upload Configuration
UPLOAD_MAX_FILE_SIZE=50000000
UPLOAD_MAX_FILES=1

# Email Configuration
RESEND_API_KEY="your_resend_api_key"

# Frontend Configuration
APP_FRONTEND_URL="http://localhost:3000"
```

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
