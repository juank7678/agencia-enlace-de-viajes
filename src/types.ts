export interface Promotion {
  id: string | number;
  title: string;
  description: string;
  price: string;
  badge?: string;
  category: string;
  image: string;
  created_at?: string;
}

export interface Poster {
  id: string | number;
  title: string;
  folder: string;
  image: string;
  created_at?: string;
}

export interface ContactMessage {
  id?: string | number;
  name: string;
  email: string;
  destination: string;
  message: string;
  created_at?: string;
}

export interface Destination {
  id: number;
  title: string;
  category: 'cultural' | 'naturaleza' | 'ciudad' | 'playa' | 'evento' | 'bienestar' | 'aventura';
  tag: string;
  description: string;
  image: string;
  price: string;
  highlights?: string[];
  duration?: string;
}

export interface PosterFolder {
  name: string;
  label: string;
  icon: string;
  color: string;
}

export interface AdminState {
  isAuthenticated: boolean;
  loginError: string | null;
}
