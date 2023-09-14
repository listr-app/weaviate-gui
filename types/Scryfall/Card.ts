export type Card = {
  id: string;
  name: string;
  collector_number: string; // number
  image_uris?: {
    small: string;
    normal: string;
    large: string;
    png: string;
    art_crop: string;
    border_crop?: string;
  };
  base64?: string;
};
