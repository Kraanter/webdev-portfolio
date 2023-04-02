"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentRoutes = void 0;
const database_1 = require("../database");
async function studentRoutes(fastify) {
    const client = fastify.pg;
    client.connect();
    fastify.post('/student/auth', async (request, reply) => {
        const user = request.user;
        if (user && 'type' in user && user.type === 1) {
            const resp = { decoded: user, authenticated: true };
            console.log(resp);
            reply.send(resp);
            return;
        }
        reply.send({ authenticated: false, message: 'Invalid token' });
    });
    fastify.post('/student/login', async (request, reply) => {
        try {
            const body = request.body;
            const data = await (0, database_1.registerStudent)(body, client);
            const token = fastify.jwt.sign({
                ...data,
                type: 1,
                token: '',
            });
            // create a cookie with studen token
            reply.setCookie('student_token', token, {
                path: '/',
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 1,
            });
            const response = {
                authenticated: true,
                decoded: {
                    ...data,
                    type: 1,
                    token,
                },
            };
            reply.send(response);
        }
        catch (err) {
            console.log(err);
            reply.status(500).send({ message: 'Internal Server Error' });
        }
    });
    fastify.post('/student/session', async (request, reply) => {
        const token = request.cookies['student_token'];
        if (!token) {
            reply.status(401).send({ message: 'Unauthorized' });
            return;
        }
        try {
            // Get student from token
            const { id } = request.user;
            // Create a new session
            const newSession = await (0, database_1.createSession)({ token, student_id: id }, client);
            if (newSession.token !== token) {
                reply.setCookie('student_token', newSession.token, {
                    path: '/',
                    httpOnly: true,
                    maxAge: 60 * 60 * 24 * 1,
                });
            }
            reply.send(newSession);
        }
        catch (err) {
            console.log(err);
            reply.status(500).send({ message: 'Internal Server Error' });
        }
    });
    fastify.delete('/student/session', async (request, reply) => {
        try {
            const { token } = request.body;
            const session = await (0, database_1.removeSession)(token, client);
            reply.send(session);
        }
        catch (err) {
            console.log(err);
            reply.status(500).send({ message: 'Internal Server Error' });
        }
    });
}
exports.studentRoutes = studentRoutes;
//# sourceMappingURL=student.js.map