import { Elysia } from 'elysia';
import { html } from '@elysiajs/html';

const app = new Elysia()
  .use(html())
  .get('/', () => {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Adaptive Survey</title>
          <script src="/public/htmx.min.js"></script>
          <script src="/public/bundle.js" defer></script>
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>
    `;
  })
  .listen(process.env.PORT || 3000);

console.log(
  `🦊 Server is running at ${app.server?.hostname}:${app.server?.port}`
);