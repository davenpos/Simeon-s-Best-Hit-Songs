export interface AdminSong {
  id: number;
  rank: number;
  title: string;
  artist: string;
  year: number;
  year_end_pos: number;
  hot_100_pos: number;
  album: string | null;
  albumNote: string | null;
  coverURL: string;
  coverPublicId: string;
  genre: string;
  label: string | null;
}

export interface AdminSongListProps {
  initialSongs: AdminSong[];
}

export interface SongDetails {
  rank: number;
  rankInYear: number;
  rankInDecade: number;
  title: string;
  artist: string;
  year: number;
  year_end_pos: number;
  hot_100_pos: number;
  album: string | null;
  albumNote: string | null;
  coverURL: string;
  coverPublicId: string;
  genre: string;
  label: string | null;
}

export interface SongTableProps {
  songs: SongDetails[];
  rankOffset?: number;
  getDisplayRank?: (song: SongDetails) => number;
  blockInteractions?: boolean;
  onModalActiveChange?: (isActive: boolean) => void;
}
