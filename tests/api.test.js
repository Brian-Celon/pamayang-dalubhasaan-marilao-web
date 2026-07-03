// tests/api.test.js
const request = require('supertest');
const app = require('../server/app');

describe('API Endpoints', () => {
    
    // 1. Test Static Page Routing
    describe('GET /', () => {
        it('should return 200 OK for the home page', async () => {
            const res = await request(app).get('/');
            expect(res.statusCode).toEqual(200);
            expect(res.headers['content-type']).toContain('text/html');
        });
    });

    describe('GET /courses', () => {
        it('should return 200 OK for the courses page', async () => {
            const res = await request(app).get('/courses');
            expect(res.statusCode).toEqual(200);
            expect(res.headers['content-type']).toContain('text/html');
        });
    });

    // 2. Test Dynamic Courses API
    describe('GET /api/courses', () => {
        it('should return a JSON array of courses', async () => {
            const res = await request(app).get('/api/courses');
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBeGreaterThan(0);
            
            // Check shape of course object
            const firstCourse = res.body[0];
            expect(firstCourse).toHaveProperty('title');
            expect(firstCourse).toHaveProperty('abbreviation');
            expect(firstCourse).toHaveProperty('description');
        });
    });

    // 3. Test Contact Form Logic
    describe('POST /api/contact', () => {
        it('should return 400 Bad Request for incomplete data', async () => {
            const res = await request(app)
                .post('/api/contact')
                .send({
                    name: 'Test User'
                    // Missing email, subject, message
                });
            
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('errors');
            expect(Array.isArray(res.body.errors)).toBeTruthy();
        });

        it('should return 400 Bad Request for invalid email', async () => {
            const res = await request(app)
                .post('/api/contact')
                .send({
                    name: 'Test User',
                    email: 'not-an-email',
                    subject: 'Test Subject',
                    message: 'Hello'
                });
            
            expect(res.statusCode).toEqual(400);
            expect(res.body.errors.some(err => err.path === 'email')).toBeTruthy();
        });

        it('should return 200 OK and success message for valid data', async () => {
            const res = await request(app)
                .post('/api/contact')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    subject: 'API Test',
                    message: 'This is a test message from Supertest.'
                });
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toEqual(true);
            expect(res.body).toHaveProperty('message');
        });
    });

    // 4. Test Error Handler Middleware
    describe('GET /nonexistent-route', () => {
        it('should return 404 and the home page fallback', async () => {
            const res = await request(app).get('/nonexistent-route');
            expect(res.statusCode).toEqual(404);
            expect(res.headers['content-type']).toContain('text/html');
        });
    });
});
