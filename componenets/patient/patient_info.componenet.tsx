import React, { useState, useRef, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import config from 'utils/config';
import { Toast } from 'primereact/toast';

import { Card } from 'primereact/card';
import { Patient } from 'models/patient.model';
import { Illness } from 'models/illness.nodel';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Allergy } from 'models/allergy.model';
import { Avatar } from 'primereact/avatar';

type Props = {
	patientId: number;
};

const PatientInfo: React.FC<Props> = ({ patientId }) => {
	const toast: React.MutableRefObject<any> = useRef(this);
	const [patient, setPatient] = useState<Patient>(null);
	const [illness, setIllness] = useState<Illness[]>([]);
	const [allergys, setAllergy] = useState<Allergy[]>([]);

	const loadPatientIllness: (patient: Patient) => Promise<any> = async (patient: Patient) => {
		try {
			const endpoint: string = `${config.serverHost}/${config.serverApiPath}/illness/ids`;

			const dataIn: Illness[] = patient.illness.map((patientIllness: Illness) => {
				return {
					illnessId: patientIllness.illnessId
				};
			});

			const response: AxiosResponse<any> = await axios.post(endpoint, dataIn);

			if (response.data.data.length) {
				setIllness(response.data.data);
			} else {
				toast.current.show({ severity: 'error', summary: '', detail: "Something went wrong while loading patient's illness information" });
			}
		} catch (e) {
			toast.current.show({ severity: 'error', summary: '', detail: "Something went wrong while loading patient's illness information" });
		}
	};

	const loadPatientAllergies: (patient: Patient) => Promise<any> = async (patient: Patient) => {
		try {
			const endpoint: string = `${config.serverHost}/${config.serverApiPath}/allergy/ids`;

			const dataIn: Allergy[] = patient.allergy.map((patientAllergy: Allergy) => {
				return {
					allergyId: patientAllergy.allergyId
				};
			});

			const response: AxiosResponse<any> = await axios.post(endpoint, dataIn);

			if (response.data.data.length) {
				setAllergy(response.data.data);
			} else {
				toast.current.show({ severity: 'error', summary: '', detail: "Something went wrong while loading patient's allergy information" });
			}
		} catch (e) {
			toast.current.show({ severity: 'error', summary: '', detail: "Something went wrong while loading patient's allergy information" });
		}
	};

	useEffect(() => {
		if (patientId) {
			try {
				(async () => {
					const endpoint: string = `${config.serverHost}/${config.serverApiPath}/patient/id`;

					const response: AxiosResponse<any> = await axios.post(endpoint, {
						patientId: patientId
					});

					if (response.data.data) {
						setPatient(response.data.data);
						toast.current.show({ severity: 'success', summary: '', detail: 'Patient information loaded' });

						if (response.data.data.illness?.length) {
							await loadPatientIllness(response.data.data);
							await loadPatientAllergies(response.data.data);
						}
					} else {
						toast.current.show({ severity: 'error', summary: '', detail: 'Something went wrong while loading patient data' });
					}
				})();
			} catch (e) {
				toast.current.show({ severity: 'error', summary: '', detail: 'Something went wrong while laoding patient information' });
			}
		}
	}, [patientId]);

	const statusBodyTemplate: (rowData: Illness) => JSX.Element = (rowData: Illness) => {
		return rowData.reqHospitalization ? (
			<Tag className='mr-2' severity='warning' value='Yes' style={{ width: '50%' }}></Tag>
		) : (
			<Tag className='mr-2' severity='success' value='No' style={{ width: '50%' }}></Tag>
		);
	};

	const header: JSX.Element = <h4 style={{ textAlign: 'center' }}>Patient Information</h4>;

	const footer: JSX.Element = (
		<span>
			<Button label='Schedule an Appointment' icon='pi pi-calendar-plus' style={{ marginLeft: '16em' }} />
		</span>
	);

	return (
		<div>
			<Toast ref={toast} />
			<div className='grid'>
				<div className='col-4'>
					<Card className='mt-5' header={header} footer={footer}>
						{patient ? (
							<>
								<div style={{ padding: '.2em' }}>
									<Avatar icon='pi' style={{ width: '70px' }} label='Name:' />
									<span style={{ paddingLeft: '.2em' }}>
										{' '}
										{patient.firstName} {patient.lastName}
									</span>
								</div>

								<div style={{ padding: '.2em' }}>
									<Avatar icon='pi pi-angle-right' style={{ width: '70px' }} label='ID:' />
									<span style={{ paddingLeft: '.2em' }}> {patientId || 'N/A'}</span>
								</div>

								<div style={{ padding: '.2em' }}>
									<Avatar style={{ width: '70px' }} icon='pi' label='Gender:' />
									<span style={{ paddingLeft: '.2em' }}> {patient.gender || 'N/A'}</span>
								</div>

								<div style={{ padding: '.2em' }}>
									<Avatar style={{ width: '70px' }} icon='pi' label='DOB:' />
									<span style={{ paddingLeft: '.2em' }}> {patient.dob.toString() || 'N/A'}</span>
								</div>

								<div style={{ padding: '.2em' }}>
									<Avatar style={{ width: '70px' }} icon='pi' label='SSN:' />
									<span style={{ paddingLeft: '.2em' }}> {patient.ssn || 'N/A'}</span>
								</div>

								<div style={{ padding: '.2em' }}>
									<Avatar style={{ width: '70px' }} icon='pi' label='Tel:' />
									<span style={{ paddingLeft: '.2em' }}> {patient.telephone || 'N/A'}</span>
								</div>

								<div style={{ padding: '.2em' }}>
									<Avatar style={{ width: '70px' }} icon='pi pi-map-marker' />
									<span style={{ paddingLeft: '.2em' }}> {patient.address || 'N/A'}</span>
								</div>
							</>
						) : null}
					</Card>
				</div>
				<div className='col-8'>
					<div className='grid'>
						<div className='col-12'>
							<Card className='mt-5'>
								<div className='card'>
									<DataTable value={illness} header='Patient Illness Information' size='small' responsiveLayout='scroll'>
										<Column field='illnessId' header='Illness ID'></Column>
										<Column field='code' header='Code'></Column>
										<Column field='desc' header='Description'></Column>
										<Column field='reqHospitalization' header='Hospitalization Required' body={statusBodyTemplate}></Column>
									</DataTable>
								</div>
							</Card>
						</div>

						<div className='col-12'>
							<Card className=''>
								<div className='card'>
									<DataTable value={allergys} header='Patient Allergy Information' size='small' responsiveLayout='scroll'>
										<Column field='allergyId' header='Allergy ID'></Column>
										<Column field='code' header='Code'></Column>
										<Column field='name' header='Name'></Column>
									</DataTable>
								</div>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PatientInfo;
