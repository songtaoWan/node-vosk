import { existsSync } from 'node:fs';
import vosk from 'vosk';
import { Readable } from 'node:stream';
import wav from 'wav';

const MODEL_PATH = './model/vosk-model-small-cn';

if (!existsSync(MODEL_PATH)) {
  console.log('模型不存在，请确认路径是否正确');
  process.exit();
}

/**
 * 语音识别
 * @param {stream} audioStream
 */
const speechRecognition = async (audioStream) => {
  return new Promise((resolve, reject) => {
    const wfReader = new wav.Reader();
    const wfReadable = new Readable().wrap(wfReader);

    wfReader.on('format', async ({ audioFormat, sampleRate, channels }) => {
      if (audioFormat !== 1 || channels !== 1) {
        reject('只支持单声道wav格式的音频文件');
        return;
      }

      try {
        const model = new vosk.Model(MODEL_PATH);
        const rec = new vosk.Recognizer({
          model: model,
          sampleRate: sampleRate
        });
        for await (const data of wfReadable) {
          rec.acceptWaveform(data);
        }

        const result = rec.result();
        rec.free();
        resolve(result.text);
      } catch (ex) {
        reject('语音识别失败');
      }
    });

    wfReadable.on('error', (err) => {
      reject('文件读取失败');
    });

    audioStream.pipe(wfReader);
  });
};

export default speechRecognition;
