import { existsSync, createReadStream } from 'node:fs';
import vosk from 'vosk';
import { Readable } from 'node:stream';
import wav from 'wav';

const MODEL_PATH = './model/vosk-model-small-cn';
const AUDIO_PATH = './assets/music/vosk.wav';

if (!existsSync(MODEL_PATH)) {
  console.log('模型不存在，请确认路径是否正确');
  process.exit();
}
const model = new vosk.Model(MODEL_PATH);

/**
 *
 * @param {Buffer} data
 * @returns
 */
// const speechRecognition = (data) => {
//   rec.acceptWaveform(data);
//   const result = rec.result();
//   return result.text;
// };

/**
 *
 * @param {string} audioPath
 */
const speechRecognition = async (audioPath = AUDIO_PATH) => {
  const wfReader = new wav.Reader();
  const wfReadable = new Readable().wrap(wfReader);

  return new Promise((resolve) => {
    wfReader.on('format', async ({ audioFormat, sampleRate, channels }) => {
      if (audioFormat != 1 || channels != 1) {
        console.error('只支持单声道的wav文件');
        process.exit(1);
      }

      const rec = new vosk.Recognizer({ model: model, sampleRate: sampleRate });
      for await (const data of wfReadable) {
        rec.acceptWaveform(data);
      }

      const result = rec.result();
      // console.log(result.text);
      rec.free();
      resolve(result.text)
    });

    createReadStream(audioPath, { highWaterMark: 4096 })
      .pipe(wfReader)
      .on('finish', function () {
        model.free();
      });
  })
};

// speechRecognition().then((res) => console.log(res, '22222222'))
export default speechRecognition;
