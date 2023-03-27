"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentRoutes = void 0;
const database_1 = require("../database");
async function studentRoutes(fastify) {
    const client = fastify.pg;
    client.connect();
    fastify.post('/student/login', async (request, reply) => {
        try {
            const body = request.body;
            const data = await (0, database_1.registerStudent)(body, client);
            console.log('data', data);
            const token = fastify.jwt.sign(data);
            // create a cookie with studen token
            reply.setCookie('student_token', token, {
                path: '/',
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 1,
            });
            reply.send({ token });
        }
        catch (err) {
            console.log(err);
            reply.status(500).send({ message: 'Internal Server Error' });
        }
    });
    fastify.post('/student/session', async (request, reply) => {
        var _a;
        try {
            // get token from cookie
            const token = (_a = request.cookies['student_token']) !== null && _a !== void 0 ? _a : '';
            // Get student from token
            const session = (await fastify.jwt.verify(token));
            // Create a new session
            const newSession = await (0, database_1.createSession)({ token, student_id: session.id }, client);
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