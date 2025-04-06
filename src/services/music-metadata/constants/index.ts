export const PAGE_SIZE = 100;
export const MAX_PAGES = 50;
export const BATCH_SIZE = 100;

// Folders to explicitly include
export const MUSIC_DIRECTORIES = [
   '/storage/emulated/0/Music',
   '/storage/emulated/0/Download',
   '/sdcard/Music',
   '/storage/sdcard0/Music',
   '/storage/sdcard1/Music',
];

// Patterns and paths to exclude from music scanning
export const EXCLUDED_PATTERNS = [
   // Paths
   '/storage/emulated/0/WhatsApp',
   '/storage/emulated/0/Android/media/com.whatsapp',
   '/storage/emulated/0/PowerDirector',
   '/storage/emulated/0/bluetooth',
   '/storage/emulated/0/zedge',
   '/storage/emulated/0/Telegram',
   '/storage/emulated/0/Android/data/com.whatsapp',

   // Keywords
   'whatsapp',
   'telegram',
   'voice message',
   'ptt',
   'status',
   'notification',
   'ringtone',
];

// WhatsApp audio pattern regex
export const WHATSAPP_AUDIO_PATTERN = /aud-\d{8}-wa\d{4}/i;
