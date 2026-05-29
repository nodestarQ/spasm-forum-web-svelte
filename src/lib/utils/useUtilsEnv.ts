import type { SpasmEventV2 } from '$lib/types/interfaces';
import { marked } from 'marked';
import { spasm } from '$lib/spasm';
import { useAppConfigStore } from '$lib/stores/useAppConfigStore.svelte';

export const useUtilsEnv = () => {
  const standardizeTextForDisplay = (
    original: string,
    type: 'post' | 'reply'
  ): string => {
    const env = useAppConfigStore()?.getAppConfig;
    if (!original || typeof original !== 'string') return '';
    if (!type) return '';
    if (type !== 'post' && type !== 'reply') return '';

    // Replace &gt; with '>' to make sure that blockquote is
    // properly displayed, but don't replace '<' because it can
    // start a potentially malicious HTML tag.
    // const text = original.replace(/\n&gt; /g, '> ')
    let text = original.replace(/&gt; /g, '> ');

    const enableMarkdownInPosts = env?.enableMarkdownInPosts;
    const enableMarkdownInComments = env?.enableMarkdownInComments;

    // Images
    const enableEmbedImageTagsForAllUsers =
      env?.enableEmbedImageTagsForAllUsers;
    const enableEmbedImageTagsForFullLineImageLinks =
      env?.enableEmbedImageTagsForFullLineImageLinks;
    const enableEmbedImageTagsInPosts =
      env?.enableEmbedImageTagsInPosts;
    const enableEmbedImageTagsInComments =
      env?.enableEmbedImageTagsInComments;

    if (
      enableEmbedImageTagsForAllUsers &&
      enableEmbedImageTagsForFullLineImageLinks
    ) {
      // Also checking whether markdown is enabled before
      // adding img tags, because otherwise text is displayed
      // without properly rendering HTML tags.
      if (
        enableEmbedImageTagsInPosts && type === 'post' &&
        enableMarkdownInPosts
      ) {
        text = wrapFullLineImageLinksWithImgTags(text);
      }
      if (
        enableEmbedImageTagsInComments && type === 'reply' &&
        enableMarkdownInComments
      ) {
        text = wrapFullLineImageLinksWithImgTags(text);
      }
    }

    // Videos
    const enableEmbedVideoTagsForAllUsers =
      env?.enableEmbedVideoTagsForAllUsers;
    const enableEmbedVideoTagsForFullLineVideoLinks =
      env?.enableEmbedVideoTagsForFullLineVideoLinks;
    const enableEmbedVideoTagsInPosts =
      env?.enableEmbedVideoTagsInPosts;
    const enableEmbedVideoTagsInComments =
      env?.enableEmbedVideoTagsInComments;

    if (
      enableEmbedVideoTagsForAllUsers &&
      enableEmbedVideoTagsForFullLineVideoLinks
    ) {
      // Also checking whether markdown is enabled before
      // adding video tags, because otherwise text is displayed
      // without properly rendering HTML tags.
      if (
        enableEmbedVideoTagsInPosts && type === 'post' &&
        enableMarkdownInPosts
      ) {
        text = wrapFullLineVideoLinksWithVideoTags(text);
      }
      if (
        enableEmbedVideoTagsInComments && type === 'reply' &&
        enableMarkdownInComments
      ) {
        text = wrapFullLineVideoLinksWithVideoTags(text);
      }
    }

    // Audio
    const enableEmbedAudioTagsForAllUsers =
      env?.enableEmbedAudioTagsForAllUsers;
    const enableEmbedAudioTagsForFullLineAudioLinks =
      env?.enableEmbedAudioTagsForFullLineAudioLinks;
    const enableEmbedAudioTagsInPosts =
      env?.enableEmbedAudioTagsInPosts;
    const enableEmbedAudioTagsInComments =
      env?.enableEmbedAudioTagsInComments;

    if (
      enableEmbedAudioTagsForAllUsers &&
      enableEmbedAudioTagsForFullLineAudioLinks
    ) {
      // Also checking whether markdown is enabled before
      // adding audio tags, because otherwise text is displayed
      // without properly rendering HTML tags.
      if (
        enableEmbedAudioTagsInPosts && type === 'post' &&
        enableMarkdownInPosts
      ) {
        text = wrapFullLineAudioLinksWithAudioTags(text);
      }
      if (
        enableEmbedAudioTagsInComments && type === 'reply' &&
        enableMarkdownInComments
      ) {
        text = wrapFullLineAudioLinksWithAudioTags(text);
      }
    }

    if (type === 'post' && enableMarkdownInPosts) {
      text = marked(text, { breaks: true }) as string;
    }

    if (type === 'reply' && enableMarkdownInComments) {
      text = marked(text, { breaks: true }) as string;
    }

    return text;
  };

  const wrapFullLineImageLinksWithImgTags = (text: string) => {
    if (typeof text !== 'string') return '';
    const allowedProtocols = ['http', 'https'];
    const allowedExtensions = ['jpeg', 'jpg', 'png', 'bmp', 'webp', 'ico'];

    const lines = text.split('\n');

    const processedLines = lines.map((line) => {
      const startsWithAllowedProtocol = allowedProtocols.some((protocol) =>
        line.startsWith(protocol)
      );
      const endsWithAllowedExtension = allowedExtensions.some((format) =>
        line.endsWith(`.${format}`)
      );
      const containsWhitespace = Array.from(line).some(
        (char) =>
          char === ' ' || char === '\t' || char === '\n' || char === '\r'
      );

      if (
        startsWithAllowedProtocol &&
        endsWithAllowedExtension &&
        !containsWhitespace
      ) {
        return `<img src="${line}" alt="Image">`;
      }
      return line;
    });

    return processedLines.join('\n');
  };

  const wrapFullLineVideoLinksWithVideoTags = (text: string) => {
    if (typeof text !== 'string') return '';
    const allowedProtocols = ['http', 'https'];
    const allowedExtensions = ['mp4', 'avi', 'mov', 'mkv', 'flv', 'webm'];

    const lines = text.split('\n');

    const processedLines = lines.map((line) => {
      const startsWithAllowedProtocol = allowedProtocols.some((protocol) =>
        line.startsWith(protocol)
      );
      const endsWithAllowedExtension = allowedExtensions.some((format) =>
        line.endsWith(`.${format}`)
      );
      const containsWhitespace = Array.from(line).some(
        (char) =>
          char === ' ' || char === '\t' || char === '\n' || char === '\r'
      );

      if (
        startsWithAllowedProtocol &&
        endsWithAllowedExtension &&
        !containsWhitespace
      ) {
        const extension = line.split('.').pop();
        if (extension && typeof extension === 'string') {
          let type: string | undefined;
          switch (extension.toLowerCase()) {
            case 'webm': type = 'video/webm'; break;
            case 'ogg': type = 'video/ogg'; break;
            case 'avi': type = 'video/x-msvideo'; break;
            case 'mov': type = 'video/quicktime'; break;
            case 'mkv': type = 'video/x-matroska'; break;
            case 'flv': type = 'video/x-flv'; break;
            default: type = 'video/mp4'; // Default type
          }

          return `<video width="920" height="517" loop controls><source src="${line}" type="${type}">Your browser does not support the video tag.</video>`;
        }
      }
      return line;
    });

    return processedLines.join('\n');
  };

  const wrapFullLineAudioLinksWithAudioTags = (text: string) => {
    if (typeof text !== 'string') return '';
    const allowedProtocols = ['http', 'https'];
    const allowedExtensions = ['mp3', 'wav', 'flac', 'aac', 'opus'];

    const lines = text.split('\n');

    const processedLines = lines.map((line) => {
      const startsWithAllowedProtocol = allowedProtocols.some((protocol) =>
        line.startsWith(protocol)
      );
      const endsWithAllowedExtension = allowedExtensions.some((format) =>
        line.endsWith(`.${format}`)
      );
      const containsWhitespace = Array.from(line).some(
        (char) =>
          char === ' ' || char === '\t' || char === '\n' || char === '\r'
      );

      if (
        startsWithAllowedProtocol &&
        endsWithAllowedExtension &&
        !containsWhitespace
      ) {
        const extension = line.split('.').pop();
        if (extension && typeof extension === 'string') {
          let type: string | undefined;
          switch (extension.toLowerCase()) {
            case 'wav': type = 'audio/wav'; break;
            case 'flac': type = 'audio/flac'; break;
            case 'aac': type = 'audio/aac'; break;
            case 'opus': type = 'audio/opus'; break;
            default: type = 'audio/mpeg'; // Default type
          }

          return `<audio loop controls><source src="${line}" type="${type}">Your browser does not support the audio tag.</audio>`;
        }
      }
      return line;
    });

    return processedLines.join('\n');
  };

  const extractTextForDisplay = (event: SpasmEventV2) => {
    const spasmEvent = spasm.toBeSpasmEventV2(event);
    if (!spasmEvent) return '';

    let content: string = '';
    if (
      'content' in spasmEvent && spasmEvent.content &&
      typeof spasmEvent.content === 'string'
    ) {
      content = spasmEvent.content;
    }

    let action: 'post' | 'reply' = 'post';
    if (
      'action' in spasmEvent && spasmEvent.action &&
      typeof spasmEvent.action === 'string'
    ) {
      if (spasmEvent.action === 'post' || spasmEvent.action === 'reply') {
        action = spasmEvent.action;
      }
    }

    return standardizeTextForDisplay(content, action);
  };

  return {
    standardizeTextForDisplay,
    extractTextForDisplay
  };
};
