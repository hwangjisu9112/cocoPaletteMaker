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

export const initStatus : Characteristics = {str: 0, con: 0, siz: 0, dex: 0, app: 0, edu: 0, int: 0, pow: 0, luc: 0};

export const AppState: Writable<AppState> = writable ({
    currentStats: null,
    isConfirmed: false
});