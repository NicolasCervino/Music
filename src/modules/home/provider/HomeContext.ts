import { useModal } from '@/src/components/layout';
import { Track } from '@/src/entities';
import { createContext } from 'react';

export interface HomeContextType {
   selectedTrack: Track | null;
   onAddToPlaylist: (track: Track) => void;
   playlistData: {
      name: string;
      description: string;
      trackId?: string;
   } | null;
   setPlaylistData: (data: { name: string; description: string; trackId?: string } | null) => void;
   onPlaylistDataSubmit: (data: { name: string; description: string; trackId?: string }) => void;
   onPlaylistCreated: () => void;
   onAddToPlaylistSuccess: (playlistName: string) => void;
   modals: {
      playlistSelection: ReturnType<typeof useModal> | null;
      createPlaylist: ReturnType<typeof useModal> | null;
      selectSongs: ReturnType<typeof useModal> | null;
   };
}

export const HomeContext = createContext<HomeContextType>({
   selectedTrack: null,
   onAddToPlaylist: () => {},
   playlistData: null,
   setPlaylistData: () => {},
   onPlaylistDataSubmit: () => {},
   onPlaylistCreated: () => {},
   onAddToPlaylistSuccess: () => {},
   modals: {
      playlistSelection: null,
      createPlaylist: null,
      selectSongs: null,
   },
});
