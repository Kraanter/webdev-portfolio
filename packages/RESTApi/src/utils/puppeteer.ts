import { nanoid } from 'nanoid';
import { AppServer, UserData } from '../../types';

export async function puppeteerSocketServer(app: AppServer) {
  app.io.on('connection', async (client) => {
    // Create a cookieId based on the client's IP address and user-agent
    // const cookieId = createHash('md5')
    //   .update([client.handshake.address, client.request.headers['user-agent']].join('|'))
    //   .digest('hex');
    console.log('✨️: New connection!');
    // TODO: Get user id from cookie or token
    let cookie = client.handshake.headers.student_token;
    if (typeof cookie !== 'string') {
      cookie = cookie?.join('');
    }
    const { id: userId, username } = (await app.jwt.verify(cookie ?? '')) as UserData;

    if (!userId) {
      console.log('❌: User is not logged in!');
      return;
    }
    console.log(`⚡: User ${userId} is logged in!`);
    const roomId = nanoid(48);

    // // Create a new browser instance
    // const browser = await puppeteer.launch({
    //   headless: true,
    // });

    // browser.on('disconnected', () => {
    //   console.log(`⚡: Browser ${roomId} is disconnected!`);
    //   client.emit('browser-disconnected');
    // });

    client.join(roomId);
    console.log(`ℹ️: Room ${roomId} is for user ${userId} ${username} just connected!`);
  });
}
