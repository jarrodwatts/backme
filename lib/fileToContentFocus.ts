import { ContentFocus } from "@lens-protocol/react-web";

/**
 * Convert file type to one of the supported content focus types
 */
export default function fileToContentFocus(file: File): ContentFocus {
  // Image
  if (file.type.startsWith("image/")) {
    return ContentFocus.IMAGE;
  }

  // Video
  if (file.type.startsWith("video/")) {
    return ContentFocus.VIDEO;
  }

  // Audio
  if (file.type.startsWith("audio/")) {
    return ContentFocus.AUDIO;
  }

  return ContentFocus.TEXT_ONLY;
}
