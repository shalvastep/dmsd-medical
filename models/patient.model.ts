import { Allergy } from 'models/allergy.model';
import { Illness } from 'models/illness.model';

export type Patient = {
	patientId: number;
	firstName: string;
	lastName: string;
	gender: string;
	dob: Date;
	ssn: string;
	address: string;
	telephone: string;
	illness?: Illness[];
	allergy?: Allergy[];
};
