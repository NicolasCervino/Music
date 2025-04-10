import { MusicService } from '@/services/music-metadata/MusicMetadataService';

export const fetchAlbums = {
   get: async () => {
      return await MusicService.getAlbums();
   },

   getPopular: async (limit: number = 3) => {
      return await MusicService.getPopularAlbums(limit);
   },

   getById: async (albumId: string) => {
      return await MusicService.getAlbumById(albumId);
   },

   getTracks: async (albumId: string) => {
      return await MusicService.getTracksByAlbumId(albumId);
   },
};
