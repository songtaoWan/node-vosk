# node-vosk
vosk-node是一个基于nodejs的vosk语音识别模块，可以在nodejs中使用vosk的语音识别功能。  
该项目使用koa框架，搭建了一个简易http服务，通过http请求上传音频流进行语音识别，只支持识别wav格式的中文音频文件。  

## 注意事项
1. 需要下载c++桌面开发模块(Visual Studio)
2. 需要python3.8以上环境
3. 请卸载Windows-build-tools
4. 全局安装node-gyp
5. node版本不能太低，需要支持esm
6. 需要去官网下载中文模型，放在model文件夹下 [下载地址](https://alphacephei.com/vosk/models)

## Project Setup

```sh
npm install
```
