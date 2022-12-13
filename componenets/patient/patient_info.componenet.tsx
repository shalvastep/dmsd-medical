import axios, { AxiosResponse } from 'axios';
import { Allergy } from 'models/allergy.model';
import { Consultation } from 'models/consultation.model';
import { Illness } from 'models/illness.model';
import { Patient } from 'models/patient.model';
import CliniConstants from 'models/shared/client.constants';
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
	const [selectedDoctor, setSelectedDoctor] = useState(null);
	const [consultations, setConsultations] = useState(null);

	let today = new Date();
	let invalidDates = [today];

	const header: JSX.Element = <h4 style={{ textAlign: 'center' }}>Patient Information</h4>;

	const loadEmployees: () => Promise<any> = async () => {
		setLoading(true);
		try {
			// TODO occupation 2 is doctor
			const endpoint: string = `${config.serverHost}/${config.serverApiPath}/clinic-employees/occupation/2`;
			const response: AxiosResponse<any> = await axios.get(endpoint);

			if (response.data.data.length) {
				setDoctors(
					response.data.data.map((doctor: any) => {
						return { label: `DR. ${doctor.lastName} ${doctor.firstName}`, value: doctor.clinicEmployeeId };
					})
				);
			} else {
				toast.current.show({ severity: 'error', summary: '', detail: "Something went wrong while loading doctor's details" });
			}
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

					if (response.data.data) {
						setPatient(response.data.data);
						toast.current.show({ severity: 'success', summary: '', detail: 'Patient information loaded' });

						if (response.data.data.illness) {
							setIllness(response.data.data.illness);
						}

						if (response.data.data.allergy) {
							setAllergy(response.data.data.allergy);
						}

						if (response.data.data.consultation) {
							setConsultations(response.data.data.consultation);
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

	const deletePatientConsultation: (consultationId: number) => Promise<void> = async (consultationId) => {
		try {
			(async () => {
				const endpoint: string = `${config.serverHost}/${config.serverApiPath}/patient/appt/delete?consultationId=${consultationId}`;

				const response: AxiosResponse<any> = await axios.post(endpoint);

				if (response.data.metadata.success) {
					toast.current.show({ severity: 'success', summary: '', detail: "Patient's appointment removed" });
				} else {
					toast.current.show({ severity: 'error', summary: '', detail: "Something went wrong while deleting patient's appointment" });
				}
			})();
		} catch (e) {
			toast.current.show({ severity: 'error', summary: '', detail: "Something went wrong while deleting patient's appointment" });
		}
	};

	const savePatientAppointment: () => Promise<void> = async () => {
		try {
			(async () => {
				const endpoint: string = `${config.serverHost}/${config.serverApiPath}/patient/appt/add`;
				const consultation: Consultation = {
					patientId: patientId,
					physicianId: selectedDoctor,
					consultationDate: moment(
						`${moment(appointmentDate).format('YYYY-MM-DD')} ${moment(appointmentTime).format('HH:mm:ss. SSSZ')}`,
						CliniConstants.DATE_FORMAT_YYYY_MM_DDTHH_MM_SS_SSSZ
					).format()
				};
				const response: AxiosResponse<any> = await axios.post(endpoint, consultation);
				if (response.data.data) {
					toast.current.show({ severity: 'success', summary: '', detail: 'Patient appointment saved' });
				} else {
					toast.current.show({ severity: 'error', summary: '', detail: 'Something went wrong while setting appointment for patient' });
				}
			})();
		} catch (e) {
			toast.current.show({ severity: 'error', summary: '', detail: 'Something went wrong while setting appointment for patient' });
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

	const clearAppointmentFields = () => {
		setSelectedDoctor(null);
		setAppointmentDate(null);
		setAppointmentTime(null);
	};

	const saveAppointment = async () => {
		setShowScheduleModal(false);
		await savePatientAppointment();
		await loadPatient(patientId);
		clearAppointmentFields();
	};

	const renderScheduleFooter = () => {
		return (
			<div>
				<Button label='Save' icon='pi pi-check' onClick={() => saveAppointment()} autoFocus />
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

	const onHideSchedule = async () => {
		setShowScheduleModal(false);
		clearAppointmentFields();
	};

	const onHideDiagnose = async () => {
		clearAlergyIllnessModal();
		setShowDiagnoseModal(false);
	};

	const onIllnessChange = (e) => {
		setSelectedIllness(e.value);
	};

	const onAllergyChange = (e) => {
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

	const handleConsultationMenuClick: (rawData: any) => void = async (rawData: any) => {
		const menuItems: MenuItem[] = [];
		const scheduleAppointment: MenuItem = {
			label: 'Remove',
			icon: 'pi pi-fw pi-minus',
			command: async () => {
				await deletePatientConsultation(rawData.consultationId);
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

	const actionBodyTemplateConsultation: (rowData: any) => JSX.Element = (rowData: any) => {
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
						handleConsultationMenuClick(rowData);
					}}
				/>
			</React.Fragment>
		);
	};

	const handleAppointmentTime = (e) => {
		setAppointmentTime(e.value);
	};

	const onScheduleModalOpen = () => {
		setAppointmentTime(moment().add(1, 'hour').format('HH:mm'));
	};

	const dateBodyTemplate: (consultation: Consultation) => String = (consultation: Consultation) => {
		return moment(consultation.consultationDate, [CliniConstants.DATE_FORMAT_YYYY_MM_DDTHH_MM_SS_SSSZ]).format('MM/DD/YYYY hh:mm a');
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
						<label htmlFor='dr'>Choose Doctor</label>
						<Dropdown
							className='mt-1'
							id='dr'
							value={selectedDoctor}
							options={doctors}
							onChange={(e) => setSelectedDoctor(e.value)}
							optionLabel='label'
							placeholder='Select a doctor'
						/>
					</div>
					<div className='col-4'>
						<label htmlFor='calendar'>Select Date</label>
						<Calendar
							id='calendar'
							className='mt-1'
							value={appointmentDate}
							onChange={(e) => setAppointmentDate(e.value)}
							minDate={moment().toDate()}
							yearRange='2022-2024'
							readOnlyInput
							disabledDates={invalidDates}
						/>
					</div>
					<div className='col-4'>
						<label htmlFor='time12'>Time / 12h</label>
						<Calendar
							id='time12'
							className='mt-1'
							value={appointmentTime}
							onChange={(e) => handleAppointmentTime(e)}
							timeOnly
							hourFormat='12'
							stepMinute={60}
							onShow={() => onScheduleModalOpen()}
						/>
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
									<span style={{ paddingLeft: '.2em' }}>
										{' '}
										{moment(patient.dob, [CliniConstants.DATE_FORMAT_MMDDYYYY, CliniConstants.DATE_FORMAT_YYYY_MM_DDTHH_MM_SS_SSSZ]).format(
											'MM/DD/YYYY'
										) || 'N/A'}
									</span>
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

						<div className='col-12'>
							<Card className=''>
								<div className='card'>
									<DataTable value={consultations} header='Doctor Appointments' size='small' responsiveLayout='scroll'>
										<Column field='physicianName' header="Docotor's Name"></Column>
										<Column field='physicianLastname' header="Docotor's Lastname"></Column>
										<Column field='consultationDate' header='Appointment Date' body={dateBodyTemplate}></Column>
										<Column header='Action' body={(dt) => actionBodyTemplateConsultation(dt)} exportable={false} style={{ minWidth: '0rem' }}></Column>
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
