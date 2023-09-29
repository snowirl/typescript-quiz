export interface Flashcard {
  front: string;
  back: string;
  cardId: string;
  frontImage?: string;
  backImage?: string;
  [key: string]: any; // This allows any string key to be used to access values
}
