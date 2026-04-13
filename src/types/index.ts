// Tipos para la API de Disney
export interface Character {
  _id: number;
  name: string;
  imageUrl: string;
  shortFilms: string[];
  tvShows: string[];
  movies: string[];
  parkAttractions: string[];
  allies: number[];
  enemies: number[];
  sourceUrl: string;
  createdAt: string;
  updatedAt: string;
  url: string;
}

export interface DisneyCharacter extends Character {
  isFavorite?: boolean;
}

export interface SearchHistory {
  id: string;
  query: string;
  timestamp: number;
}

export interface UserProfile {
  username: string;
  email?: string;
  favorites: number[];
  searchHistory: SearchHistory[];
  createdAt: number;
}

export interface ApiResponse {
  data: Character[];
  info?: {
    count: number;
    totalPages: number;
    nextPage?: string;
    previousPage?: string;
  };
}
