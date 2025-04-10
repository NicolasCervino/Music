export type Playlist = {
   id: string;
   name: string;
   description?: string;
   createdAt: number;
   updatedAt: number;
   coverArt?: string;
   trackIds: string[];
};
