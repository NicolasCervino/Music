import { Album } from './Album';
import { Artist } from './Artist';

export type Track = {
   id: string;
   url?: string;
   title: string;
   album: Album;
   artist: Artist;
   duration: string;
   genre: string;
   artwork: string | undefined;
   audioUrl: string;
   artworkColor?: string;
   lastModified?: number;
   fileSize?: number;
};
