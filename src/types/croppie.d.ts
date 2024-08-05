// src/types/croppie.d.ts
declare module 'croppie' {
  interface CroppieOptions {
    showZoomer?: boolean;
    enableOrientation?: boolean;
    mouseWheelZoom?: string;
    viewport?: {
      width: number;
      height: number;
      type: 'circle' | 'square';
    };
    boundary?: {
      width: string;
      height: string;
    };
  }

  export default class Croppie {
    constructor(element: HTMLElement, options: CroppieOptions);
    bind(params: { url: string }): Promise<void>;
    result(type: 'base64' | 'blob', size?: string, quality?: number): Promise<string>;
    destroy(): void;
  }
}
