import type { NextPage } from 'next';
import { NextRouter, useRouter } from 'next/router';

import React from 'react';
import PatientInfo from 'componenets/patient/patient_info.componenet';

const PatientPage: NextPage = () => {
	const router: NextRouter = useRouter();
	const { patientId } = router.query;

	return <PatientInfo patientId={patientId ? Number(patientId) : null}></PatientInfo>;
};

export default PatientPage;
