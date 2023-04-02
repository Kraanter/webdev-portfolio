"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_1 = __importDefault(require("@fastify/cookie"));
const postgres_1 = __importDefault(require("@fastify/postgres"));
const dotenv_1 = require("dotenv");
const fastify_1 = __importDefault(require("fastify"));
const fastify_socket_io_1 = __importDefault(require("fastify-socket.io"));
const jwt_token_1 = require("./plugins/jwt-token");
const auth_1 = __importDefault(require("./routes/auth"));
const group_1 = require("./routes/group");
const socket_1 = require("./routes/socket/socket");
const student_1 = require("./routes/student");
(0, dotenv_1.config)();
const fastify = (0, fastify_1.default)({
    // only log info
    // logger: {
    //   level: 'info',
    // },
    // logger: {
    //   serializers: {
    //     req: (req) => ({
    //       method: req.method,
    //       url: req.url,
    //       headers: req.headers,
    //     }),
    //     res: (res) => ({
    //       statusCode: res.statusCode,
    //     }),
    //   },
    // },
    logger: true,
});
function socketOptions() {
    const opts = {
        path: '/browser-streamer',
    };
    opts.cors = {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
    };
    return opts;
}
fastify.register(fastify_socket_io_1.default, socketOptions());
fastify.register(cookie_1.default, {
    secret: process.env.COOKIE_SECRET_KEY,
    hook: 'onRequest',
});
// initialize fastifyPostgres
fastify.register(postgres_1.default, {
    connectionString: process.env.CONNECTION_STRING,
});
(0, jwt_token_1.addJWT)(fastify);
fastify.register(auth_1.default);
fastify.register(group_1.groupRoutes);
fastify.register(student_1.studentRoutes);
const JWTTOKENTIME = 60 * 60 * 2;
fastify.addHook('onRequest', async (request, response) => {
    var _a, _b;
    // add user data to request
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { token: docent_token, student_token } = request.cookies;
    if (!docent_token && !student_token) {
        request.user = {};
    }
    else {
        try {
            const isStudent = request.url.toLowerCase().indexOf('/student') !== -1;
            const token = (_a = (isStudent ? student_token : docent_token)) !== null && _a !== void 0 ? _a : '';
            if (token) {
                const decoded = (await fastify.jwt.verify(token));
                if (((_b = decoded.iat) !== null && _b !== void 0 ? _b : 0) < Date.now() / 1000 - JWTTOKENTIME) {
                    console.log('Token expired');
                    request.user = {};
                    response.clearCookie(isStudent ? 'student_token' : 'token');
                }
                else {
                    request.user = decoded;
                }
            }
        }
        catch (err) {
            // do nothing
            console.log('err', err);
            response.clearCookie('token');
            request.user = {};
        }
    }
});
fastify.ready().then(() => {
    (0, socket_1.socketRoutes)(fastify);
});
const PORT = parseInt((_a = process.env.PORT) !== null && _a !== void 0 ? _a : '3000');
const start = async () => {
    try {
        await fastify.listen({ port: PORT });
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=index.js.map