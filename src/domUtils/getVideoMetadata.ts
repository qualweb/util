import videoElementHasAudio from './objectElementIsNonText';

function getVideoMetadata(element: typeof window.qwElement): any {
  const duration = element.getMediaDuration();
  const hasSoundTrack = videoElementHasAudio(element);
  const result = {
    puppeteer: {
      video: { duration: 0 },
      audio: { hasSoundTrack: false },
      error: false
    }
  };
  result.puppeteer.video.duration = duration ?? 0;
  result.puppeteer.audio.hasSoundTrack = hasSoundTrack;
  result.puppeteer.error = !(!duration || (duration >= 0 && hasSoundTrack));
  return result;
}

export default getVideoMetadata;
