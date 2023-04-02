"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDocentToken = exports.isStudentToken = exports.addJWT = void 0;
/* eslint-disable indent */
const jwt_1 = __importDefault(require("@fastify/jwt"));
async function addJWT(fastify) {
    fastify.register(jwt_1.default, {
        secret: process.env.SECRET_KEY,
    });
    fastify.decorate('authenticate', async function (request, reply) {
        try {
            await request.jwtVerify();
        }
        catch (err) {
            reply.send(err);
        }
    });
}
exports.addJWT = addJWT;
async function isTokenOfType(token, fastify, type) {
    const pgClient = fastify.pg;
    pgClient.connect();
    const decoded = (await fastify.jwt.verify(token));
    const query = (function () {
        switch (type) {
            case 0:
                return 'SELECT * FROM users WHERE id = $1';
            case 1:
                return 'SELECT * FROM students WHERE id = $1';
            default:
                throw new Error('Invalid type');
        }
    })();
    const { rows } = await pgClient.query(query, [decoded.id]);
    if (rows.length === 0 || decoded.type !== type) {
        return false;
    }
    return decoded;
}
async function isStudentToken(token, fastify) {
    const decoded = await isTokenOfType(token, fastify, 1);
    console.log(decoded);
    if (decoded === false || decoded.type !== 1) {
        return false;
    }
    return decoded;
}
exports.isStudentToken = isStudentToken;
async function isDocentToken(token, fastify) {
    const decoded = await isTokenOfType(token, fastify, 0);
    if (decoded === false || decoded.type !== 0) {
        return false;
    }
    return decoded;
}
exports.isDocentToken = isDocentToken;
//# sourceMappingURL=jwt-token.js.map