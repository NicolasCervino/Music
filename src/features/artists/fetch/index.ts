import { MusicService } from '@/services/music-metadata/MusicMetadataService';

export const fetchArtists = {
   get: async () => {
      return await MusicService.getArtists();
   },

   getPopular: async (limit: number = 3) => {
      return await MusicService.getPopularArtists(limit);
   },

   getById: async (artistId: string) => {
      return await MusicService.getArtistById(artistId);
   },

   getSongs: async (artistId: string) => {
      return await MusicService.getTracksByArtistId(artistId);
   },
};
