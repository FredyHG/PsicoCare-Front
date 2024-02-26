export class PatientPutRequest {
  name: string;
  lastName: string;
  birthDate: Date;
  cpf: string;
  phone: string;
  email: string;

  constructor(name: string, lastName: string, birthDate: Date, cpf: string, phone: string, email: string){
    this.name = name;
    this.lastName = lastName;
    this.birthDate = birthDate;
    this.cpf = cpf;
    this.phone = phone;
    this.email = email;
  }

}
