import { ApplicationSettings } from '@nativescript/core';


export const localStorage = {

  getItem(clave: string): string | null {

    return ApplicationSettings.hasKey(clave) ? ApplicationSettings.getString(clave) : null;

  },

  setItem(clave: string, valor: string): void {

    ApplicationSettings.setString(clave, valor);
    
  },

};
