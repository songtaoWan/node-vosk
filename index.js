import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import busboy from 'busboy';
import speechRecognition from './vosk.js';

const app = new Koa();
const router = new Router();
app.use(bodyParser());

router.post('/transcribe', async (ctx) => {
  /**
   * 将上传的音频流转换为文本
   * @returns {Promise<{code: number, text: string, msg: string}>}
   */
  const audioStreamToText = () => {
    const bb = busboy({ headers: ctx.req.headers });

    return new Promise((resolve, reject) => {
      bb.on('file', async (fieldname, stream, fileInfo) => {
        const { mimeType } = fileInfo;
        if (mimeType !== 'audio/wave') {
          reject({ code: 400, text: '', msg: '只支持wav格式的音频文件' });
          return;
        }

        const result = await speechRecognition(stream).catch((err) => {
          reject({ code: 500, text: '', msg: err });
        });

        resolve({ code: 200, text: result, msg: 'success' });
      });

      ctx.req.pipe(bb);
    });
  };

  const result = await audioStreamToText().catch((err) => {
    return err;
  });
  ctx.body = result;
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(3000);
