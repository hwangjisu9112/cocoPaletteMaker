import { writable, type Writable } from 'svelte/store';


interface Characteristics  {
  str: number;
  con: number;
  siz: number;
  dex: number;
  app: number;
  edu: number;
  int: number;
  pow: number; 
  luc: number; 
}
export interface AppState {
    currentStats: Characteristics | null;
    isConfirmed: boolean;
}

export const AppState: Writable<AppState> = writable ({
    currentStats: null,
    isConfirmed: false
});