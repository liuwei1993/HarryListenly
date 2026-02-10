export interface Category {
  id: string;
  name: string;
  cover?: string | null;
  parentId?: string | null;
  children?: Category[];
}

export interface Album {
  id: string;
  title: string;
  cover: string;
  description: string;
  author: string;
  categoryId: string;
  category?: { id: string; name: string };
  playCount: number;
  subscribeCount: number;
  episodeCount: number;
  updatedAt: string;
}

export interface Episode {
  id: string;
  albumId: string;
  title: string;
  duration: number;
  audioUrl: string;
  order: number;
  createdAt: string;
}
