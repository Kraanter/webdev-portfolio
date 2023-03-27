"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-empty-function
const emptyFunction = async () => { };
class PuppeteerScreenRecorder {
    constructor(userId, page, socket) {
        this.userId = userId;
        this.page = page;
        this.socket = socket;
    }
    async init(options = {}) {
        const runOptions = {
            beforeWritingImageFile: emptyFunction,
            // afterWritingImageFile: defaultAfterWritingNewFile,
            beforeAck: emptyFunction,
            afterAck: emptyFunction,
            ...options,
        };
        this.client = await this.page.target().createCDPSession();
        this.client.on('Page.screencastFrame', async (frameObject) => {
            var _a;
            await runOptions.beforeWritingImageFile();
            try {
                await this.writeImageFilename(frameObject.data);
                // await runOptions.afterWritingImageFile(frameObject.data);
            }
            catch (e) {
                console.log('Cant write filename');
            }
            try {
                await runOptions.beforeAck();
                await ((_a = this.client) === null || _a === void 0 ? void 0 : _a.send('Page.screencastFrameAck', {
                    sessionId: frameObject.sessionId,
                }));
                await runOptions.afterAck();
            }
            catch (e) {
                console.log('Cant ack');
            }
        });
        // when a link is clicked in the browser, the page will reload and the scroll position will be reset
        // this will send the current scroll position to the client so it can be restored
        this.client.on('Page.frameNavigated', async () => {
            const scrollY = await this.page.evaluate(() => window.scrollY);
            this.socket.to(this.userId).emit('scroll', scrollY);
        });
    }
    async writeImageFilename(data) {
        const fullHeight = await this.page.evaluate(() => {
            return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
        });
        // return this.socket.to(this.userId).emit('image', { img: data, fullHeight });
        return this.socket.to(this.userId).emit('image', { img: data, fullHeight });
    }
    async start(options = {}) {
        var _a;
        const startOptions = {
            format: 'jpeg',
            quality: 30,
            everyNthFrame: 1,
            ...options,
        };
        try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            await ((_a = this.client) === null || _a === void 0 ? void 0 : _a.send('Page.startScreencast', startOptions));
        }
        catch (err) {
            console.log('start', err);
        }
    }
    async stop() {
        var _a;
        try {
            await ((_a = this.client) === null || _a === void 0 ? void 0 : _a.send('Page.stopScreencast'));
        }
        catch (err) {
            console.log('stop', err);
        }
    }
}
exports.default = PuppeteerScreenRecorder;
//# sourceMappingURL=screen-recorder.js.map