export type CharacterResults = {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
};

export type CharacterInfo = {
  count: number;
  pages: number;
  next: string;
  prev: string;
};

export type Character = {
  info: CharacterInfo;
  results: CharacterResults[];
};
