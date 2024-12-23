export default interface Exercise {
  exerciseId: number;
  name: string;
  notes: string;
  dateAdded: Date;
  dateUpdated: Date | null;
}
