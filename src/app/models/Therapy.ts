import {Patient} from "./Patient";
import {Psychologist} from "./Psychologist";

export type Therapy = {
  patient: Patient;
  psychologist: Psychologist;
  status: string;
  dateTime: string;
  createAt: string;
  createAtView?: Date
  dateTimeView?: Date;
};
