declare module '@geolonia/normalize-japanese-addresses' {
    interface NormalizeResult {
      pref: string;
      city: string;
      town: string;
      addr: string;
      other: string;
      level: number;
      point: {
        lat: number;
        lng: number;
        level: number;
      }
    }
  
    export function normalize(
      address: string
    ): Promise<NormalizeResult>;
  }
  