'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
var _a;
Object.defineProperty(exports, '__esModule', { value: true });
const cookie_1 = __importDefault(require('@fastify/cookie'));
const postgres_1 = __importDefault(require('@fastify/postgres'));
const dotenv_1 = require('dotenv');
const fastify_1 = __importDefault(require('fastify'));
const jwt_token_1 = __importDefault(require('./plugins/jwt-token'));
const auth_1 = __importDefault(require('./routes/auth'));
const group_1 = require('./routes/group');
const student_1 = require('./routes/student');
(0, dotenv_1.config)();
const fastify = (0, fastify_1.default)({
  // only log info
  logger: {
    level: 'info',
  },
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
  // }
});
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
fastify.addHook('preHandler', async (request) => {
  // add user data to request
  const { token } = request.cookies;
  try {
    const decoded = await fastify.jwt.verify(token !== null && token !== void 0 ? token : '');
    request.user = decoded;
  } catch (err) {
    // do nothing
  }
});
const PORT = parseInt((_a = process.env.PORT) !== null && _a !== void 0 ? _a : '3000');
const start = async () => {
  try {
    await fastify.listen({ port: PORT });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
//# sourceMappingURL=index.js.map
