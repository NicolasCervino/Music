export type Track = {
  id: string;
  title: string;
  album: string;
  artist: string;
  duration: string;
  genre: string;
  artwork: string | undefined;
  audioUrl: string;
  artworkColor?: string;
};