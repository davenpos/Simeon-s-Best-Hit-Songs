export interface SongDetails {
  rank: number;
  title: string;
  artist: string;
  year: number;
  year_end_pos: number;
  hot_100_pos: number;
  album: string | null;
  albumNote: string | null;
  cover: string;
  genre: string;
  label: string | null;
}

export interface SongTableProps {
  songs: SongDetails[];
}
