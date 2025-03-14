import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Full System E2E Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return "Hello World!" at the root endpoint', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('should create a new user', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ name: 'John Doe', email: 'john.doe@example.com' })
      .expect(201)
      .then(response => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe('John Doe');
        expect(response.body.email).toBe('john.doe@example.com');
      });
  });

  it('should retrieve the created user', () => {
    return request(app.getHttpServer())
      .get('/users/1')
      .expect(200)
      .then(response => {
        expect(response.body).toHaveProperty('id', 1);
        expect(response.body.name).toBe('John Doe');
        expect(response.body.email).toBe('john.doe@example.com');
      });
  });

  it('should update the user', () => {
    return request(app.getHttpServer())
      .put('/users/1')
      .send({ name: 'Jane Doe' })
      .expect(200)
      .then(response => {
        expect(response.body).toHaveProperty('id', 1);
        expect(response.body.name).toBe('Jane Doe');
      });
  });

  it('should delete the user', () => {
    return request(app.getHttpServer())
      .delete('/users/1')
      .expect(200)
      .then(response => {
        expect(response.body).toHaveProperty('id', 1);
      });
  });

  it('should return 404 for a non-existing user', () => {
    return request(app.getHttpServer())
      .get('/users/999')
      .expect(404);
  });
});
