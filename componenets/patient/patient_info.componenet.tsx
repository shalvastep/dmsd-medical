import axios, { AxiosResponse } from 'axios';
import { Allergy } from 'models/allergy.model';
import { Illness } from 'models/illness.model';
import { Patient } from 'models/patient.model';
import moment from 'moment';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import React, { useState, useRef, useEffect } from 'react';
import config from 'utils/config';

type Props = {
	patientId: number;
};

const PatientInfo: React.FC<Props> = ({ patientId }) => {
	const toast: React.MutableRefObject<any> = useRef(this);
	// const menu: React.MutableRefObject<any> = useRef(this);
	const [patient, setPatient] = useState<Patient>(null);
	const [illness, setIllness] = useState<Illness[]>([]);
	const [allIllness, setAllIllness] = useState<Illness[]>([]);
	const [allAllergies, setAllAllergies] = useState<Allergy[]>([]);
	const [allergy, setAllergy] = useState<Allergy[]>([]);
	const [showScheduleModal, setShowScheduleModal] = useState(false);
	const [showDiagnoseModal, setShowDiagnoseModal] = useState(false);
	const [selectedIllness, setSelectedIllness] = useState(null);
	const [selectedAllergy, setSelectedAllergy] = useState(null);
	const [actionMenu, setActionMenu] = useState([]);
	const [loading, setLoading] = useState(false);
	const [appointmentDate, setAppointmentDate] = useState(null);
	const [appointmentTime, setAppointmentTime] = useState(null);
	const [doctors, setDoctors] = useState(null);

	let today = new Date();
	let invalidDates = [today];

	const header: JSX.Element = <h4 style={{ textAlign: 'center' }}>Patient Information</h4>;

	const loadPatientIllness: (patient: Patient) => Promise<any> = async (patient: Patient) => {
		try {
			const endpoint: string = `${config.serverHost}/${config.serverApiPath}/illness/ids`;

			const dataIn: Illness[] = patient.illness.map((patientIllness: Illness) => {
				return {
					illnessId: patientIllness.illnessId
				};
			});

			const response: AxiosResponse<any> = await axios.post(endpoint, dataIn);

			console.log('Ilness ^^^', response);

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

	const loadEmployees: () => Promise<any> = async () => {
		setLoading(true);
		try {
			// const endpoint: string = `${config.serverHost}/${config.serverApiPath}/clinic-employee`;
			const endpoint: string = `${config.serverHost}/${config.serverApiPath}/clinic-employee/occupation/2`;
			const response: AxiosResponse<any> = await axios.get(endpoint);

			console.log('doctors', response);

			// if (response.data.data.length) {
			// 	setDoctors(response.data.data);
			// } else {
			// 	toast.current.show({ severity: 'error', summary: '', detail: "Something went wrong while loading doctor's details" });
			// }
		} catch (e) {
			setLoading(false);
			toast.current.show({ severity: 'error', summary: '', detail: "Something went wrong while loading doctor's details" });
		}
		setLoading(false);
	};

	const loadPatient: (patientiD: number) => Promise<any> = async (patientId: number) => {
		(async () => {
			try {
				(async () => {
					const endpoint: string = `${config.serverHost}/${config.serverApiPath}/patient/${patientId}`;

					const response: AxiosResponse<any> = await axios.post(endpoint, {});

					console.log('Patient data loaded', response);

					if (response.data.data) {
						setPatient(response.data.data);
						toast.current.show({ severity: 'success', summary: '', detail: 'Patient information loaded' });

						if (response.data.data.illness) {
							setIllness(response.data.data.illness);
						}

						if (response.data.data.allergy) {
							setAllergy(response.data.data.allergy);
						}
					} else {
						toast.current.show({ severity: 'error', summary: '', detail: 'Something went wrong while loading patient data' });
					}
				})();
			} catch (e) {
				toast.current.show({ severity: 'error', summary: '', detail: 'Something went wrong while laoding patient information' });
			}
		})();
	};

	useEffect(() => {
		if (patientId) {
			(async () => {
				await loadPatient(patientId);
			})();
		}
	}, [patientId]);

	const loadAllIlnesses: () => Promise<void> = async () => {
		try {
			(async () => {
				const endpoint: string = `${config.serverHost}/${config.serverApiPath}/illness`;

				const response: AxiosResponse<any> = await axios.get(endpoint);

				console.log('->>>>>', response);

				if (response.data.data.length) {
					setAllIllness(
						response.data.data.map((illness: Illness) => {
							return { label: `${illness.code}-${illness.desc}`, value: illness.illnessId };
						})
					);
				} else {
					toast.current.show({ severity: 'error', summary: '', detail: 'Something went wrong while loading illness data' });
				}
			})();
		} catch (e) {
			toast.current.show({ severity: 'error', summary: '', detail: 'Something went wrong while laoding illness information' });
		}
	};

	const loadAllAllergies: () => Promise<void> = async () => {
		try {
			(async () => {
				const endpoint: string = `${config.serverHost}/${config.serverApiPath}/allergy`;

				const response: AxiosResponse<any> = await axios.get(endpoint);

				console.log('->>>>> Allergies', response);

				if (response.data.data.length) {
					setAllAllergies(
						response.data.data.map((allergy: Allergy) => {
							return { label: `${allergy.code}-${allergy.name}`, value: allergy.allergyId };
						})
					);
				} else {
					toast.current.show({ severity: 'error', summary: '', detail: 'Something went wrong while loading allergy data' });
				}
			})();
		} catch (e) {
			toast.current.show({ severity: 'error', summary: '', detail: 'Something went wrong while laoding allergy information' });
		}
	};

	const savePatientIllness: (patientId: number, illnessId: string) => Promise<void> = async (patientId, illnessId) => {
		try {
			(async () => {
				const endpoint: string = `${config.serverHost}/${config.serverApiPath}/patient/illness/save?patientId=${patientId}&illnessId=${illnessId}`;

				const response: AxiosResponse<any> = await axios.post(endpoint);

				if (response.data.data === 1) {
					toast.current.show({ severity: 'success', summary: '', detail: 'Patient illness saved' });
				} else {
					toast.current.show({ severity: 'error', summary: '', detail: 'Something went wrong while saving illness info for patient' });
				}
			})();
		} catch (e) {
			toast.current.show({ severity: 'error', summary: '', detail: 'Something went wrong while saving illness info for patient' });
		}
	};

	const savePatientAllergy: (patientId: number, allergyId: string) => Promise<void> = async (patientId, allergyId) => {
		try {
			(async () => {
				const endpoint: string = `${config.serverHost}/${config.serverApiPath}/patient/allergy/save?patientId=${patientId}&allergyId=${allergyId}`;

				const response: AxiosResponse<any> = await axios.post(endpoint);

				console.log('Added allergy', response);

				if (response.data.data === 1) {
					toast.current.show({ severity: 'success', summary: '', detail: 'Patient allergy saved' });
				} else {
					toast.current.show({ severity: 'error', summary: '', detail: 'Something went wrong while saving illness info for patient' });
				}
			})();
		} catch (e) {
			toast.current.show({ severity: 'error', summary: '', detail: 'Something went wrong while saving illness info for patient' });
		}
	};

	const deletePatientIllness: (patientId: number, illnessId: string) => Promise<void> = async (patientId, illnessId) => {
		try {
			(async () => {
				const endpoint: string = `${config.serverHost}/${config.serverApiPath}/patient/illness/delete?patientId=${patientId}&illnessId=${illnessId}`;

				const response: AxiosResponse<any> = await axios.post(endpoint);

				if (response.data.data === 1) {
					toast.current.show({ severity: 'success', summary: '', detail: "Patient's illness removed" });
				} else {
					toast.current.show({ severity: 'error', summary: '', detail: "Something went wrong while deleting patient's illness" });
				}
			})();
		} catch (e) {
			toast.current.show({ severity: 'error', summary: '', detail: "Something went wrong while deleting patient's illness" });
		}
	};

	const deletePatientAllergy: (patientId: number, allergyId: string) => Promise<void> = async (patientId, allergyId) => {
		try {
			(async () => {
				const endpoint: string = `${config.serverHost}/${config.serverApiPath}/patient/allergy/delete?patientId=${patientId}&allergyId=${allergyId}`;

				const response: AxiosResponse<any> = await axios.post(endpoint);

				if (response.data.data === 1) {
					toast.current.show({ severity: 'success', summary: '', detail: "Patient's allergy removed" });
				} else {
					toast.current.show({ severity: 'error', summary: '', detail: "Something went wrong while deleting patient's allergy" });
				}
			})();
		} catch (e) {
			toast.current.show({ severity: 'error', summary: '', detail: "Something went wrong while deleting patient's allergy" });
		}
	};

	const handleDiagnoseModal: () => void = async () => {
		setShowDiagnoseModal(true);

		await loadAllIlnesses();
		await loadAllAllergies();
	};

	const handleScheduleModal: () => void = async () => {
		setShowScheduleModal(true);

		await loadEmployees();
	};

	const statusBodyTemplate: (rowData: Illness) => JSX.Element = (rowData: Illness) => {
		return rowData.reqHospitalization ? (
			<Tag className='mr-2' severity='warning' value='Yes' style={{ width: '50%' }}></Tag>
		) : (
			<Tag className='mr-2' severity='success' value='No' style={{ width: '50%' }}></Tag>
		);
	};

	const footer: JSX.Element = (
		<div className='grid'>
			<div className='col-8'>
				<span>
					<Button label='Schedule an Appointment' icon='pi pi-calendar-plus' style={{ marginLeft: '0em' }} onClick={() => handleScheduleModal()} />
				</span>
			</div>

			<div className='col-4'>
				<span>
					<Button label='Enter Diagnose' style={{ marginLeft: '0em' }} onClick={() => handleDiagnoseModal()} />
				</span>
			</div>
		</div>
	);

	const clearAlergyIllnessModal = () => {
		setSelectedAllergy(null);
		setSelectedIllness(null);
	};

	const clearSchedule = () => {};

	const saveDiagnose = async () => {
		clearAlergyIllnessModal();
		setShowDiagnoseModal(false);
		if (selectedIllness) {
			await savePatientIllness(patientId, selectedIllness);
		}
		if (selectedAllergy) {
			await savePatientAllergy(patientId, selectedAllergy);
		}

		await loadPatient(patientId);
	};

	const renderScheduleFooter = () => {
		return (
			<div>
				<Button label='No' icon='pi pi-times' onClick={() => onHideSchedule()} className='p-button-text' />
				<Button label='Yes' icon='pi pi-check' onClick={() => onHideSchedule()} autoFocus />
			</div>
		);
	};

	const renderDiagnoseFooter = () => {
		return (
			<div>
				<Button label='Save' icon='pi pi-check' onClick={() => saveDiagnose()} autoFocus />
			</div>
		);
	};

	const onHideSchedule = () => {
		setShowScheduleModal(false);
	};

	const onHideDiagnose = async () => {
		clearAlergyIllnessModal();
		setShowDiagnoseModal(false);
	};

	const onIllnessChange = (e) => {
		setSelectedIllness(e.value);
	};

	const onAllergyChange = (e) => {
		console.log('Allergy change', e);
		setSelectedAllergy(e.value);
	};

	const handleIllnessMenuClick: (rawData: any) => void = async (rawData: any) => {
		const menuItems: MenuItem[] = [];
		const scheduleAppointment: MenuItem = {
			label: 'Remove',
			icon: 'pi pi-fw pi-minus',
			command: async () => {
				await deletePatientIllness(patientId, rawData.illnessId);
				await loadPatient(patientId);
			}
		};

		menuItems.push(scheduleAppointment);

		setActionMenu(menuItems);
	};

	const handleAllergyMenuClick: (rawData: any) => void = async (rawData: any) => {
		const menuItems: MenuItem[] = [];
		const scheduleAppointment: MenuItem = {
			label: 'Remove',
			icon: 'pi pi-fw pi-minus',
			command: async () => {
				await deletePatientAllergy(patientId, rawData.allergyId);
				await loadPatient(patientId);
			}
		};

		menuItems.push(scheduleAppointment);

		setActionMenu(menuItems);
	};

	const actionBodyTemplateIllness: (rowData: any) => JSX.Element = (rowData: any) => {
		let tempRef: Menu = null;

		return (
			<React.Fragment>
				<Menu
					model={actionMenu}
					popup
					ref={(el) => {
						tempRef = el;
					}}
				/>
				<Button
					label=''
					icon='pi pi-bars'
					onClick={(event) => {
						tempRef.toggle(event);
						handleIllnessMenuClick(rowData);
					}}
				/>
			</React.Fragment>
		);
	};

	const actionBodyTemplateAllergy: (rowData: any) => JSX.Element = (rowData: any) => {
		let tempRef: Menu = null;

		return (
			<React.Fragment>
				<Menu
					model={actionMenu}
					popup
					ref={(el) => {
						tempRef = el;
					}}
				/>
				<Button
					label=''
					icon='pi pi-bars'
					onClick={(event) => {
						tempRef.toggle(event);
						handleAllergyMenuClick(rowData);
					}}
				/>
			</React.Fragment>
		);
	};

	return (
		<div>
			<ProgressSpinner
				animationDuration='1s'
				style={loading ? { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' } : { display: 'none' }}
			/>
			<Dialog header='Schedule Doctor Appointment' visible={showScheduleModal} style={{ width: '50vw' }} footer={renderScheduleFooter()} onHide={() => onHideSchedule()}>
				<div className='grid'>
					<div className='col-4'>
						<label htmlFor='calendar'>Select Date</label>
						<Calendar
							id='calendar'
							value={appointmentDate}
							onChange={(e) => setAppointmentDate(e.value)}
							minDate={moment().toDate()}
							yearRange='2022-2024'
							readOnlyInput
							disabledDates={invalidDates}
							// showTime
							// showWeek
						/>
					</div>
					<div className='col-4'>
						<label htmlFor='time12'>Time / 12h</label>
						<Calendar id='time12' value={appointmentTime} onChange={(e) => setAppointmentTime(e.value)} timeOnly hourFormat='12' />
					</div>
				</div>
			</Dialog>
			<Dialog header='Enter Patient Diagnose' visible={showDiagnoseModal} style={{ width: '50vw' }} footer={renderDiagnoseFooter()} onHide={() => onHideDiagnose()}>
				<div className='grid'>
					<div className='col-4'>
						<p>Illness:</p>
						<Dropdown value={selectedIllness} options={allIllness} onChange={onIllnessChange} optionLabel='label' placeholder='Select Illness' />
					</div>
					<div className='col-4'>
						<p>Allergy:</p>
						<Dropdown value={selectedAllergy} options={allAllergies} onChange={onAllergyChange} optionLabel='label' placeholder='Select Allergy' />
					</div>
				</div>
			</Dialog>
			<Toast ref={toast} />
			<div className='grid'>
				<div className='col-4'>
					{/* <Card className='mt-5' header={header} footer={illness.length || allergy.length ? null : footer}> */}
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
									<Avatar icon='pi pi-angle-right' style={{ width: '70px' }} label='Patient #:' />
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
										<Column header='Action' body={(dt) => actionBodyTemplateIllness(dt)} exportable={false} style={{ minWidth: '0rem' }}></Column>
									</DataTable>
								</div>
							</Card>
						</div>

						<div className='col-12'>
							<Card className=''>
								<div className='card'>
									<DataTable value={allergy} header='Patient Allergy Information' size='small' responsiveLayout='scroll'>
										<Column field='allergyId' header='Allergy ID'></Column>
										<Column field='code' header='Code'></Column>
										<Column field='name' header='Name'></Column>
										<Column header='Action' body={(dt) => actionBodyTemplateAllergy(dt)} exportable={false} style={{ minWidth: '0rem' }}></Column>
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
