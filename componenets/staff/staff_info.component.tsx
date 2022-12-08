import axios, { AxiosResponse } from 'axios';
import { Employee } from 'models/employee.model';
import { EmployeeShift } from 'models/employee.shift.model';
import { EmployeeShiftType } from 'models/employee.shift.type.model';
import CliniConstants from 'models/shared/client.constants';
import moment from 'moment';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import config from 'utils/config';

type Props = {
	employeeId: number;
};

const StaffInfo: React.FC<Props> = ({ employeeId }) => {
	let today = new Date();
	let invalidDates = [today];

	const toast: React.MutableRefObject<any> = useRef(this);
	const [employee, setEmployee] = useState<Employee>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [employeeShifts, setEmployeeShifts] = useState<EmployeeShift[]>([]);
	const [date, setDate] = useState(null);
	const [shift, setShift] = useState(null);
	const [shiftTypes, setShiftTypes] = useState<EmployeeShiftType[]>([]);

	const infoHeader: JSX.Element = <h4 style={{ textAlign: 'center' }}>Employee Information</h4>;
	const scheduleHeader: JSX.Element = <h4 style={{ textAlign: 'center' }}>Employee Shift Management</h4>;
	const shiftScheduleHeader: JSX.Element = <h4 style={{ textAlign: 'center' }}>Employee Shift Schedule</h4>;

	useEffect(() => {
		if (employeeId) {
			try {
				(async () => {
					const endpoint: string = `${config.serverHost}/${config.serverApiPath}/clinic-employee/${employeeId}`;

					const response: AxiosResponse<any> = await axios.post(endpoint, {});

					console.log(response);

					if (response.data.data.employeeNumber) {
						setEmployee(response.data.data);
						setEmployeeShifts(response.data.data.employeeShift);
						toast.current.show({ severity: 'success', summary: '', detail: 'Employee information loaded' });

						if (response.data.data.clinicEmployeeId) {
							await loadAllShifts();
						}
					} else {
						toast.current.show({ severity: 'error', summary: '', detail: 'Something went wrong while loading employee data' });
					}
				})();
			} catch (e) {
				toast.current.show({ severity: 'error', summary: '', detail: 'Something went wrong while laoding employee information' });
			}
		}
	}, [employeeId]);

	const loadAllShifts: () => Promise<any> = async () => {
		try {
			const endpoint: string = `${config.serverHost}/${config.serverApiPath}/clinic-employee/shift/type/all`;

			const response: AxiosResponse<any> = await axios.get(endpoint);

			console.log('&&&&', response);

			if (response.data.data.length) {
				setShiftTypes(response.data.data);
			} else {
				toast.current.show({ severity: 'error', summary: '', detail: 'Something went wrong while loading shift types' });
			}
		} catch (e) {
			toast.current.show({ severity: 'error', summary: '', detail: 'Something went wrong while loading shift types' });
		}
	};

	const dateBodyTemplate: (emplShift: EmployeeShift) => String = (emplShift: EmployeeShift) => {
		return moment(emplShift.shiftDate, [CliniConstants.DATE_FORMAT_MMDDYYYY, CliniConstants.DATE_FORMAT_YYYY_MM_DDTHH_MM_SS_SSSZ]).format('MM/DD/YYYY');
	};

	const loadShiftsByEmployeeId: (employeeId: number) => void = async (employeeId: number) => {
		try {
			const endpoint: string = `${config.serverHost}/${config.serverApiPath}/clinic-employee/${employeeId}/shift`;

			const response: AxiosResponse<any> = await axios.get(endpoint);

			console.log(`shifts for ${employeeId}`, response.data.data);

			if (response.data.data.length) {
				toast.current.show({ severity: 'success', summary: '', detail: 'Employee shifts loaded' });
				setEmployeeShifts(response.data.data);
			} else {
				toast.current.show({ severity: 'error', summary: '', detail: 'Something went wrong while loading employee shift' });
			}
		} catch (e) {
			toast.current.show({ severity: 'error', summary: '', detail: 'Something went wrong while loading employee shift' });
		}
	};

	const saveShift: () => void = async () => {
		try {
			const endpoint: string = `${config.serverHost}/${config.serverApiPath}/clinic-employee/shift/save?shiftDate=${moment(date).format(
				'MM/DD/YYYY'
			)}&emplId=${employeeId}&shiftTypeId=${shift}`;

			console.log(endpoint);

			const response: AxiosResponse<any> = await axios.post(endpoint);

			if (response.data.data === 1) {
				toast.current.show({ severity: 'success', summary: '', detail: 'Employee shift saved' });

				setDate(null);
				setShift(null);
				setModalOpen(false);

				await loadShiftsByEmployeeId(employeeId);
			} else {
				toast.current.show({ severity: 'error', summary: '', detail: 'Something went wrong while loading shift types' });
			}
		} catch (e) {
			toast.current.show({ severity: 'error', summary: '', detail: 'Something went wrong while loading shift types' });
		}
	};

	const onHide: () => void = () => {
		setModalOpen(false);
		// clearForm();
	};
	const openModal: () => void = async () => {
		setModalOpen(true);
	};

	const renderFooter: () => JSX.Element = () => {
		return (
			<div>
				<Button label='Submit' icon='pi pi-check' onClick={() => saveShift()} autoFocus />
			</div>
		);
	};

	return (
		<div>
			<Toast ref={toast} />
			<Dialog header='Schedule Shift' visible={modalOpen} style={{ width: '50vw' }} footer={renderFooter()} onHide={() => onHide()}>
				<div className='field col-12'>
					<label htmlFor='calendar'>Select Day for Work Shift</label>
					<div className='grid'>
						<div className='col-6'>
							<Calendar
								id='calendar'
								value={date}
								onChange={(e) => {
									console.log('******', e.value);
									setDate(e.value);
								}}
								disabledDates={invalidDates}
								readOnlyInput
								yearRange='2022-2024'
								minDate={moment().toDate()}
								// dateFormat='MM/dd/yyyy'
							/>
						</div>
						<div className='col-6'>
							{shiftTypes.map((shiftInfo) => {
								return (
									<div className='field-radiobutton' key={shiftInfo.shiftId}>
										<RadioButton
											inputId={shiftInfo.shiftDesc.toLowerCase()}
											name='shift'
											value={shiftInfo.shiftId}
											onChange={(e) => setShift(e.value)}
											checked={shift === shiftInfo.shiftId}
										/>
										<label htmlFor={shiftInfo.shiftDesc.toLowerCase()}>{`${shiftInfo.shiftType} - ${shiftInfo.shiftDesc}`}</label>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</Dialog>
			<div className='grid'>
				<div className='col-4'>
					<Card className='mt-5' header={infoHeader}>
						{employee ? (
							<>
								<div style={{ padding: '.2em' }}>
									<Avatar icon='pi' style={{ width: '90px' }} label='Name:' />
									<span style={{ paddingLeft: '.2em' }}>
										{' '}
										{employee.firstName} {employee.lastName}
									</span>
								</div>

								<div style={{ padding: '.2em' }}>
									<Avatar icon='pi pi-angle-right' style={{ width: '90px' }} label='empl #:' />
									<span style={{ paddingLeft: '.2em' }}> {employeeId || 'N/A'}</span>
								</div>

								<div style={{ padding: '.2em' }}>
									<Avatar style={{ width: '90px' }} icon='pi' label='Gender:' />
									<span style={{ paddingLeft: '.2em' }}> {employee.gender || 'N/A'}</span>
								</div>

								<div style={{ padding: '.2em' }}>
									<Avatar style={{ width: '90px' }} icon='pi' label='DOB:' />
									<span style={{ paddingLeft: '.2em' }}> {employee.dob.toString() || 'N/A'}</span>
								</div>

								<div style={{ padding: '.2em' }}>
									<Avatar style={{ width: '90px' }} icon='pi' label='SSN:' />
									<span style={{ paddingLeft: '.2em' }}> {employee.ssn || 'N/A'}</span>
								</div>

								{/* <div style={{ padding: '.2em' }}>
									<Avatar style={{ width: '70px' }} icon='pi' label='Tel:' />
									<span style={{ paddingLeft: '.2em' }}> {employee.telephone || 'N/A'}</span>
								</div> */}

								<div style={{ padding: '.2em' }}>
									<Avatar style={{ width: '90px' }} icon='pi' label='Phone:' />
									<span style={{ paddingLeft: '.2em' }}> {employee.phoneNumber || 'N/A'}</span>
								</div>

								<div style={{ padding: '.2em' }}>
									<Avatar style={{ width: '90px' }} icon='pi' label='Occupation:' />
									<span style={{ paddingLeft: '.2em' }}> {employee.occupation.occupation || 'N/A'}</span>
								</div>

								{employee.nurseGrade ? (
									<div style={{ padding: '.2em' }}>
										<Avatar style={{ width: '90px' }} icon='pi' label='Grade:' />
										<span style={{ paddingLeft: '.2em' }}> {employee.nurseGrade.grade || 'N/A'}</span>
									</div>
								) : null}

								{employee.specialty ? (
									<div style={{ padding: '.2em' }}>
										<Avatar style={{ width: '90px' }} icon='pi' label='Specialty:' />
										<span style={{ paddingLeft: '.2em' }}> {employee.specialty.specialty || 'N/A'}</span>
									</div>
								) : null}

								{employee.salary ? (
									<div style={{ padding: '.2em' }}>
										<Avatar style={{ width: '90px' }} icon='pi' label='Salary:' />
										<span style={{ paddingLeft: '.2em' }}> {employee.salary || 'N/A'}</span>
									</div>
								) : null}

								{employee.yearsExperience ? (
									<div style={{ padding: '.2em' }}>
										<Avatar style={{ width: '90px' }} icon='pi' label='Experience:' />
										<span style={{ paddingLeft: '.2em' }}> {employee.yearsExperience || 'N/A'}</span>
									</div>
								) : null}

								<div style={{ padding: '.2em' }}>
									<Avatar style={{ width: '90px' }} icon='pi pi-map-marker' />
									<span style={{ paddingLeft: '.2em' }}> {employee.address || 'N/A'}</span>
								</div>
							</>
						) : null}
					</Card>
				</div>
				<div className='col-8'>
					<div className='grid'>
						<div className='col-12'>
							<Card className='mt-5' header={scheduleHeader}>
								<div style={{ textAlign: 'center' }}>
									<Button label='Schedule job shift' icon='pi pi-calendar-plus' onClick={openModal} />
								</div>
							</Card>
						</div>
						<div className='col-12'>
							<Card className='' header={shiftScheduleHeader}>
								<DataTable value={employeeShifts} responsiveLayout='scroll'>
									<Column field='shiftDate' header='Shift Date' body={dateBodyTemplate}></Column>
									<Column field='shiftType' header='Shift Type'></Column>
									<Column field='shiftDesc' header='Description'></Column>
								</DataTable>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default StaffInfo;
