import Koa from 'koa';
import speechRecognition from './vosk.js';

const app = new Koa();
app.use(async (ctx) => {
  if(ctx.path === '/vosk'){
    const result = await speechRecognition();
    ctx.body = result;
    return;
  }

  ctx.body = 'Hello World';
});

app.listen(3000);
console.log('Server is running on port 3000.');