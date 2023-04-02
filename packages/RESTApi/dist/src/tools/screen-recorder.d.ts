import { CDPSession, Page } from 'puppeteer';
import { Socket } from 'socket.io';
declare class PuppeteerScreenRecorder {
    socket: Socket;
    page: Page;
    client: CDPSession | undefined;
    userId: string;
    constructor(userId: string, page: Page, socket: Socket);
    init(options?: {}): Promise<void>;
    writeImageFilename(data: any): Promise<boolean>;
    start(options?: {}): Promise<void>;
    stop(): Promise<void>;
}
export default PuppeteerScreenRecorder;
//# sourceMappingURL=screen-recorder.d.ts.map