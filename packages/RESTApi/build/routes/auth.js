"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
function authRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = fastify.pg;
        client.connect();
        fastify.post("/auth", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { token } = request.cookies;
            try {
                const decoded = yield fastify.jwt.verify(token !== null && token !== void 0 ? token : "");
                reply.send({ decoded, authenticated: true });
            }
            catch (err) {
                reply.send({ authenticated: false, message: "Invalid token" });
            }
        }));
        fastify.get("/logout", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            reply.clearCookie("token");
            reply.send();
        }));
        fastify.post("/login", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { username, password } = request.body;
            const query = yield client.query("SELECT password_hash FROM users WHERE username = $1", [username.toLowerCase()]);
            // compare password with hashed password
            const isMatch = yield (0, bcrypt_1.compare)(password, query.rows[0].password_hash);
            if (isMatch) {
                const token = fastify.jwt.sign({ username });
                // add token to cookie
                reply.setCookie("token", token, {
                    secure: true,
                    path: "/",
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
                });
                reply.send({ token });
            }
            else {
                reply.code(401).send({ message: "Invalid username or password" });
            }
        }));
        fastify.post("/register", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { username, password } = request.body;
            // hash password using bcrypt
            const hashedPassword = yield (0, bcrypt_1.hash)(password, 10);
            const { rows } = yield client.query("INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *", [username.toLowerCase(), hashedPassword]);
            if (rows.length === 0) {
                reply.code(401).send({ message: "Invalid username or password" });
            }
            else {
                const token = fastify.jwt.sign({ username });
                reply.send({ token });
            }
        }));
    });
}
exports.default = authRoutes;
