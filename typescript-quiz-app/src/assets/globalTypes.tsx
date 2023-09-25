export interface Flashcard {
  front: string;
  back: string;
  cardId: string;
  isStarred: boolean;
  [key: string]: any; // This allows any string key to be used to access values
}
