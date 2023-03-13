'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
var _a;
Object.defineProperty(exports, '__esModule', { value: true });
const fastify_1 = __importDefault(require('fastify'));
const postgres_1 = __importDefault(require('@fastify/postgres'));
const dotenv = __importStar(require('dotenv'));
const auth_1 = __importDefault(require('./routes/auth'));
const jwt_token_1 = __importDefault(require('./plugins/jwt-token'));
const cookie_1 = __importDefault(require('@fastify/cookie'));
dotenv.config();
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
