"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketRoutes = void 0;
const cookie_1 = require("cookie");
const jwt_token_1 = require("../../plugins/jwt-token");
const puppeteer_1 = require("../puppeteer");
async function socketRoutes(fastify) {
    const pgClient = fastify.pg;
    pgClient.connect();
    fastify.io.on('connection', async (client) => {
        var _a;
        const cookies = (0, cookie_1.parse)((_a = client.request.headers.cookie) !== null && _a !== void 0 ? _a : '');
        if (!('x-role' in client.request.headers) && 'student_token' in cookies) {
            const token = cookies.student_token;
            const decoded = await (0, jwt_token_1.isStudentToken)(token, fastify);
            console.log('👨🏻‍🎓: Student connected', decoded);
            if (decoded === false) {
                client.disconnect();
                return;
            }
            console.log('👨🏻‍🎓: Student connected', decoded.username, 'to group', decoded.group_code);
            client.emit('connected', 'connected');
            (0, puppeteer_1.puppeteerSocketServer)(client, pgClient, decoded);
        }
        else if ('token' in cookies) {
            const token = cookies.token;
            const decoded = await (0, jwt_token_1.isDocentToken)(token, fastify);
            if (decoded === false) {
                client.disconnect();
                return;
            }
            console.log('👨🏻‍🏫: Docent connected', decoded.username);
            client.emit('connected', 'connected');
            client.on('join', async ({ token }) => {
                if (!token) {
                    return;
                }
                client.join(token);
                console.log('👨🏻‍🏫: Docent joined room', token);
            });
        }
    });
}
exports.socketRoutes = socketRoutes;
//# sourceMappingURL=socket.js.map