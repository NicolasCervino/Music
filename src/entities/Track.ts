export type Track = {
  id: string;
  url?: string;
  title: string;
  album: string;
  artist: string;
  duration: string;
  genre: string;
  artwork: string | undefined;
  audioUrl: string;
  artworkColor?: string;
};