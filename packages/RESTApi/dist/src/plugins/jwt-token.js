"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = addJWT;
//# sourceMappingURL=jwt-token.js.map