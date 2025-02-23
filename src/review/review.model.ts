export interface ReviewChanges {
  id: string;
  insert?: string;
  delete?: string;
  attributes: {
    background: string;
    color: string;
    strike?: boolean;
  };
  hasChanges: boolean;
}

export interface ChangesArrayValues {
  before: ReviewChanges;
  after: ReviewChanges;
}
