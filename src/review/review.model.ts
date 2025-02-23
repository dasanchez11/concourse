export interface ReviewChanges {
  id: string;
  insert?: string;
  delete?: number;
  retain?: number;
  attributes: {
    background: string;
    color: string;
    strike?: boolean;
    deletedText?: string;
    attributeChange?: string;
  };
  hasChanges: boolean;
}

export interface ChangesArrayValues {
  before: ReviewChanges;
  after: ReviewChanges;
}
