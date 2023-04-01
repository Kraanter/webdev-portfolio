/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PostgresDb } from '@fastify/postgres';
import puppeteer, { KeyInput, Viewport } from 'puppeteer';
import { Socket } from 'socket.io';
import { StudentData } from '../../types';
import { createSession, removeSession } from '../database';
import PuppeteerScreenRecorder from '../tools/screen-recorder';

export interface MouseLocation {
  x: number;
  y: number;
}

export async function puppeteerSocketServer(
  client: Socket,
  pgClient: PostgresDb,
  { id: userId, username, group_code }: StudentData
) {
  let timeout: NodeJS.Timeout | null = null;
  client.on('stream_connect', async () => {
    console.log('📝: Client connected to stream_connect');
    // If the client reconnects, clear the timeout
    if (timeout) clearTimeout(timeout);

    // const roomId = nanoid(10);
    const roomId = 'cvoWoKTPFK';

    // Create a new browser instance
    const browser = await puppeteer.launch({
      headless: true,
    });

    await createSession({ token: roomId, student_id: userId }, pgClient);

    // Make sure the client only joins the room once
    if (client.rooms.has(roomId)) return;
    await client.join(roomId);

    console.log(`📝: Room ${roomId} is for user ${userId} ${username} just connected!`);
    console.log(client.rooms);
    client.emit('stream', 'connected');
    client.to(group_code).emit('change', 'connected');

    client.on('disconnect', async () => {
      // If the client disconnects, close the browser but wait 2.5 seconds first to see if the client reconnects
      browser.close();
      timeout = setTimeout(disconnect, 2500);
    });

    const disconnect = async () => {
      console.log(`⚡: Room ${roomId} is disconnected!`);
      client.disconnect();
      await removeSession(roomId, pgClient);
      client.to(group_code).emit('change', 'disconnected');
    };

    client.on('view', async ({ viewport, url }: { viewport: Viewport; url: string }) => {
      const context = await browser.createIncognitoBrowserContext();
      const page = await context.newPage();
      await page.setViewport(viewport);
      await page.goto(url);

      const screenshots = new PuppeteerScreenRecorder(roomId, page, client);
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

          client.to(roomId).emit('cursor', cur);
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

      client.on('scroll', ({ position }: { position: number }) => {
        page.evaluate((top) => {
          // @ts-ignore
          window.scrollTo({ top });
        }, position);
      });
    });
  });
}
