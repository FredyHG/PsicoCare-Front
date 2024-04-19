export class TherapyPutRequest {
  crpPsychologist: string;
  cpfPatient: string;
  dateTime: string;

  constructor(crpPsychologist: string, cpfPatient: string, dateTime: string){
    this.crpPsychologist = crpPsychologist;
    this.cpfPatient = cpfPatient;
    this.dateTime = dateTime;
  }

}
