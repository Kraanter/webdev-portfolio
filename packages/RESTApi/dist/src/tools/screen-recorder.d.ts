import { CDPSession, Page } from 'puppeteer';
import { Server } from 'socket.io';
declare class PuppeteerScreenRecorder {
    socket: Server;
    page: Page;
    client: CDPSession | undefined;
    userId: string;
    constructor(userId: string, page: Page, socket: Server);
    init(options?: {}): Promise<void>;
    writeImageFilename(data: any): Promise<boolean>;
    start(options?: {}): Promise<void>;
    stop(): Promise<void>;
}
export default PuppeteerScreenRecorder;
//# sourceMappingURL=screen-recorder.d.ts.map