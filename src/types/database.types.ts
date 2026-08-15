/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Database {
  public: {
    Tables: {
      [key: string]: {
        Row: any;
        Insert: any;
        Update: any;
      }
    }
  }
}
