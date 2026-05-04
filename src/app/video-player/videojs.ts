declare const videojs: any;

export const videoJs = videojs;

declare global {
    interface Window {
        videoPlayer?: any;
    }
  }