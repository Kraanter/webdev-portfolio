/* eslint-disable @typescript-eslint/ban-ts-comment */
import { parse } from 'cookie';
import { nanoid } from 'nanoid';
import puppeteer, { KeyInput } from 'puppeteer';
import { AppServer, UserData } from '../../types';
import { createSession, removeSession } from '../database';
import PuppeteerScreenRecorder from '../tools/screen-recorder';

export interface MouseLocation {
  x: number;
  y: number;
}

export async function puppeteerSocketServer(fastify: AppServer) {
  const pgClient = fastify.pg;
  pgClient.connect();
  let timeout: NodeJS.Timeout | null = null;
  fastify.io.on('connection', async (client) => {
    // If the client reconnects, clear the timeout
    if (timeout) clearTimeout(timeout);

    const rawCookie = parse(client.request.headers.cookie ?? '');
    const cookie = rawCookie['student_token'];
    const { id: userId, username } = (await fastify.jwt.verify((cookie as string) ?? '')) as UserData;

    if (!userId) {
      console.log('❌: User is not logged in!');
      return;
    }
    const roomId = nanoid(10);

    // Create a new browser instance
    const browser = await puppeteer.launch({
      headless: true,
    });

    await createSession({ token: roomId, student_id: userId }, pgClient);

    // Make sure the client only joins the room once
    if (client.rooms.has(roomId)) return;
    client.join(roomId);
    console.log(`📝: Room ${roomId} is for user ${userId} ${username} just connected!`);
    fastify.io.to(roomId).emit('connected', 'connected');

    client.on('disconnect', async () => {
      // If the client disconnects, close the browser but wait 2.5 seconds first to see if the client reconnects
      browser.close();
      timeout = setTimeout(disconnect, 2500);
    });

    const disconnect = async () => {
      console.log(`⚡: Room ${roomId} is disconnected!`);
      client.disconnect();
      await removeSession(roomId, pgClient);
    };

    client.on('view', async ({ viewport, url }) => {
      const context = await browser.createIncognitoBrowserContext();
      const page = await context.newPage();
      await page.setViewport(viewport);
      await page.goto(url);

      const screenshots = new PuppeteerScreenRecorder(roomId, page, fastify.io);
      await screenshots.init();
      await screenshots.start();

      client.on('mouseMove', async ({ x, y }: MouseLocation) => {
        try {
          await page.mouse.move(x, y);
          const cur = await page.evaluate(
            (p) => {
              // @ts-ignore
              const elementFromPoint = document.elementFromPoint(p.x, p.y);
              if (!elementFromPoint) return 'none';
              // @ts-ignore
              return window.getComputedStyle(elementFromPoint, null).getPropertyValue('cursor');
            },
            { x, y }
          );

          fastify.io.to(roomId).emit('cursor', cur);
        } catch (err) {
          err;
        }
      });

      client.on('mouseClick', async ({ x, y }: MouseLocation) => {
        try {
          await page.mouse.click(x, y);
          await page.waitForSelector('body');
        } catch (err) {
          err;
        }
      });

      client.on('keydown', async ({ key }: { key: KeyInput }) => {
        try {
          await page.keyboard.press(key);
        } catch (err) {
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
