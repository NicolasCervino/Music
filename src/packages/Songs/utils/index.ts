// Simple hash function for generating unique keys
function hashString(str: string): string {
   let hash = 0;
   for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
   }
   return hash.toString(36);
}

export const utils = { hashString };
