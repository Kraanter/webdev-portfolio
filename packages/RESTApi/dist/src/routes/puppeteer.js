"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.puppeteerSocketServer = void 0;
const nanoid_1 = require("nanoid");
const puppeteer_1 = __importDefault(require("puppeteer"));
const database_1 = require("../database");
const screen_recorder_1 = __importDefault(require("../tools/screen-recorder"));
async function puppeteerSocketServer(client, pgClient, { id: userId, username, group_code }) {
    let timeout = null;
    client.on('stream_connect', async () => {
        // If the client reconnects, clear the timeout
        if (timeout)
            clearTimeout(timeout);
        const roomId = (0, nanoid_1.nanoid)(10);
        // Create a new browser instance
        const browser = await puppeteer_1.default.launch({
            headless: true,
        });
        await (0, database_1.createSession)({ token: roomId, student_id: userId }, pgClient);
        // Make sure the client only joins the room once
        if (client.rooms.has(roomId))
            return;
        await client.join(roomId);
        client.emit('stream', 'connected');
        client.to(group_code).emit('change', group_code);
        client.on('disconnect', async () => {
            // If the client disconnects, close the browser but wait 2.5 seconds first to see if the client reconnects
            browser.close();
            timeout = setTimeout(disconnect, 2500);
        });
        const disconnect = async () => {
            await (0, database_1.removeSession)(roomId, pgClient);
            client.disconnect();
            client.to(group_code).emit('change', group_code);
        };
        client.on('view', async ({ viewport, url }) => {
            const context = await browser.createIncognitoBrowserContext();
            const page = await context.newPage();
            try {
                await page.setViewport(viewport);
                await page.goto(url);
            }
            catch (err) {
                console.log(err);
                return;
            }
            const screenshots = new screen_recorder_1.default(roomId, page, client);
            await screenshots.init();
            await screenshots.start();
            client.on('mouseMove', async ({ x, y }) => {
                try {
                    await page.mouse.move(x, y);
                    const cur = await page.evaluate((p) => {
                        // @ts-ignore
                        const elementFromPoint = document.elementFromPoint(p.x, p.y);
                        if (!elementFromPoint)
                            return 'none';
                        // @ts-ignore
                        return window.getComputedStyle(elementFromPoint, null).getPropertyValue('cursor');
                    }, { x, y });
                    client.to(roomId).emit('cursor', cur);
                }
                catch (err) {
                    err;
                }
            });
            client.on('mouseClick', async ({ x, y }) => {
                try {
                    await page.mouse.click(x, y);
                    await page.waitForSelector('body');
                }
                catch (err) {
                    err;
                }
            });
            client.on('keydown', async ({ key }) => {
                try {
                    await page.keyboard.press(key);
                }
                catch (err) {
                    err;
                }
            });
            client.on('scroll', ({ position }) => {
                page.evaluate((top) => {
                    // @ts-ignore
                    window.scrollTo({ top });
                }, position);
            });
        });
    });
}
exports.puppeteerSocketServer = puppeteerSocketServer;
//# sourceMappingURL=puppeteer.js.map