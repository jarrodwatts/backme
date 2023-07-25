import {
  ImageType,
  VideoType,
  AudioType,
  SupportedPublicationMediaType,
} from "@lens-protocol/react-web";

/**
 * Convert file type to one of the supported publication media types.
 */
export default function fileToMimeType(
  file: File
): SupportedPublicationMediaType {
  const { type } = file;

  // Png
  if (type === "image/png") {
    return ImageType.PNG;
  }

  // Jpeg
  if (type === "image/jpeg") {
    return ImageType.JPEG;
  }

  // Gif
  if (type === "image/gif") {
    return ImageType.GIF;
  }

  // Webp
  if (type === "image/webp") {
    return ImageType.WEBP;
  }

  // Mp4
  if (type === "video/mp4") {
    return VideoType.MP4;
  }

  // Mp3
  if (type === "audio/mp3") {
    return AudioType.MP3;
  }

  // Ogg
  if (type === "audio/ogg") {
    return AudioType.OGG;
  }

  // Wav
  if (type === "audio/wav") {
    return AudioType.WAV;
  }

  throw new Error(`Unsupported file type: ${type}`);
}
