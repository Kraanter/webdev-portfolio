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
const jwt_token_1 = __importDefault(require("./plugins/jwt-token"));
const auth_1 = __importDefault(require("./routes/auth"));
const group_1 = require("./routes/group");
const socket_1 = require("./routes/socket");
const student_1 = require("./routes/student");
const puppeteer_1 = require("./utils/puppeteer");
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
    opts.cookie = {
        name: 'student_token',
        domain: '/',
        httpOnly: true,
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
(0, jwt_token_1.default)(fastify);
fastify.register(auth_1.default);
fastify.register(group_1.groupRoutes);
fastify.register(student_1.studentRoutes);
fastify.register(socket_1.socketRoutes);
fastify.addHook('preHandler', async (request) => {
    var _a;
    // add user data to request
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { token, student_token } = request.cookies;
    try {
        const decoded = (await fastify.jwt.verify((_a = student_token !== null && student_token !== void 0 ? student_token : token) !== null && _a !== void 0 ? _a : ''));
        console.log('decoded', decoded);
        decoded.token = token !== null && token !== void 0 ? token : '';
        request.user = decoded;
    }
    catch (err) {
        // do nothing
    }
});
fastify.ready().then(() => {
    (0, puppeteer_1.puppeteerSocketServer)(fastify);
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