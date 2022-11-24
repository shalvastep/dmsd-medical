import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';
import { InputMask } from 'primereact/inputmask';
import { Patient } from 'models/patient.model';
import axios, { AxiosResponse } from 'axios';
import config from 'utils/config';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Menu } from 'primereact/menu';
import { Toast } from 'primereact/toast';
import { MenuItem } from 'primereact/menuitem';
import { NextRouter, useRouter } from 'next/router';

const PatientDash: React.FC = () => {
	const router: NextRouter = useRouter();
	const toast: React.MutableRefObject<any> = useRef(this);
	const menu: React.MutableRefObject<any> = useRef(this);
	const [actionMenu, setActionMenu] = useState([]);
	const [modalOpen, setModalOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [firstName, setFirstName] = useState<string>('');
	const [lastName, setLastName] = useState<string>('');
	const [dob, setDOB] = useState<string>('');
	const [tel, setTel] = useState<string>('');
	const [ssn, setSSN] = useState<string>('');
	const [address, setAddress] = useState<string>('');
	const [gender, setGender] = useState<string>('');
	const [patients, setPatients] = useState<Patient[]>([]);

	const handleAddPatient: () => void = async () => {
		setModalOpen(false);
		setLoading(true);
		const endpoint: string = `${config.serverHost}/${config.serverApiPath}/patient/create`;

		try {
			const response: AxiosResponse<any> = await axios.post(endpoint, {
				firstName: firstName,
				lastName: lastName,
				telephone: tel,
				ssn: ssn,
				gender: gender,
				address: address,
				dob: dob
			});

			if (response.data.data.patientId) {
				toast.current.show({ severity: 'success', summary: '', detail: 'Patient has been successfully registered.' });
				clearForm();
			} else {
				toast.current.show({ severity: 'error', summary: '', detail: 'Something went wrong while registering new patient' });
			}
		} catch (e) {
			setLoading(false);
			toast.current.show({ severity: 'error', summary: '', detail: 'Something went wrong while registering new patient' });
		}
		setLoading(false);
	};

	const loadPatients: () => Promise<any> = async () => {
		setLoading(true);
		try {
			const endpoint: string = `${config.serverHost}/${config.serverApiPath}/patient/all`;
			const response: AxiosResponse<any> = await axios.get(endpoint);

			// response.data.data.forEach((elem) => console.log(elem.patientId, elem.patientIllness));

			if (response.data.data.length) {
				setPatients(response.data.data);
			} else {
				toast.current.show({ severity: 'error', summary: '', detail: 'Something went wrong while loading patients' });
			}
		} catch (e) {
			setLoading(false);
			toast.current.show({ severity: 'error', summary: '', detail: 'Something went wrong while loading patients' });
		}
		setLoading(false);
	};

	useEffect(() => {
		(async () => {
			await loadPatients();
		})();
	}, []);

	const clearForm: () => void = () => {
		setFirstName('');
		setLastName('');
		setTel('');
		setDOB('');
		setSSN('');
		setGender('');
		setAddress('');
	};

	const onHide: () => void = () => {
		setModalOpen(false);
		clearForm();
	};

	const handleNoValue: (d: any, key: string) => string = (rowData, key) => {
		return rowData[key] || 'N/A';
	};

	const paginatorLeft = <Button type='button' icon='pi pi-refresh' className='p-button-text' onClick={loadPatients} />;

	const header: JSX.Element = (
		<div className='table-header-container'>
			<Button icon='pi pi-plus' label='Add Patient' onClick={() => setModalOpen(true)} className='mr-2' />
		</div>
	);

	const handleMenuClick: (rawData: any) => void = (rawData: any) => {
		const menuItems: MenuItem[] = [];
		const scheduleAppointment: MenuItem = {
			label: 'Schedule an appointment',
			icon: 'pi pi-fw pi-plus',
			command: () => {
				// router.push({ pathname: '/patient/info', query: { patientId: rawData.patientId } });
				router.push({ pathname: `/patient/info/${rawData.patientId}` });
			}
		};

		menuItems.push(scheduleAppointment);

		setActionMenu(menuItems);
	};

	const actionBodyTemplate: (rowData: any) => JSX.Element = (rowData: any) => {
		return (
			<React.Fragment>
				{/* <Button icon='pi' className='pi-bars' onClick={() => confirmDeleteProduct(rowData)} /> */}
				<Menu model={actionMenu} popup ref={menu} />
				<Button
					label=''
					icon='pi pi-bars'
					onClick={(event) => {
						menu.current.toggle(event);
						handleMenuClick(rowData);
					}}
				/>
			</React.Fragment>
		);
	};

	const footer: any = (
		<div>
			<Button label='Save' icon='pi pi-check' onClick={handleAddPatient} />
			<Button label='Cancel' icon='pi pi-times' onClick={onHide} />
		</div>
	);

	return (
		<div>
			<Toast ref={toast} />
			<div className='card' style={{ height: 'calc(100vh - 145px)' }}>
				<DataTable
					value={patients}
					responsiveLayout='scroll'
					header={header}
					scrollable
					scrollHeight='flex'
					paginator
					paginatorTemplate='CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown'
					currentPageReportTemplate='Showing {first} to {last} of {totalRecords}'
					rows={10}
					rowsPerPageOptions={[5, 10, 20, 50]}
					paginatorLeft={paginatorLeft}
				>
					<Column field='firstName' header='First Name' body={(dt) => handleNoValue(dt, 'firstName')}></Column>
					<Column field='lastName' header='Last Name' body={(dt) => handleNoValue(dt, 'lastName')}></Column>
					<Column field='gender' header='Gender' body={(dt) => handleNoValue(dt, 'gender')}></Column>
					<Column field='telephone' header='Telephone' body={(dt) => handleNoValue(dt, 'telephone')}></Column>
					<Column field='address' header='address' body={(dt) => handleNoValue(dt, 'address')}></Column>
					<Column field='ssn' header='SSN' body={(dt) => handleNoValue(dt, 'ssn')}></Column>
					<Column header='Action' body={(dt) => actionBodyTemplate(dt)} exportable={false} style={{ minWidth: '8rem' }}></Column>
				</DataTable>
			</div>
			<ProgressSpinner
				animationDuration='1s'
				style={loading ? { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' } : { display: 'none' }}
			/>
			<Dialog
				header='Enter Patient Information'
				footer={footer}
				// icons={myIcon}
				visible={modalOpen}
				style={{ width: '50vw' }}
				modal
				onHide={onHide}
			>
				<div className='mt-5'>
					<div className='grid'>
						<div className='col-4'>
							<span className='p-float-label mt-5'>
								<InputText id='fn' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
								<label htmlFor='fn'>First Name</label>
							</span>
						</div>
						<div className='col-4'>
							<span className='p-float-label mt-5'>
								<InputText id='ln' value={lastName} onChange={(e) => setLastName(e.target.value)} />
								<label htmlFor='ln'>Last Name</label>
							</span>
						</div>
						<div className='col-4'>
							<div className='mt-5'>
								<span className='mt-3' style={{ display: 'inline-block' }}>
									Gender:{' '}
								</span>
								<span className=''>
									<span className='p-1'>M</span>
									<RadioButton value='M' name='city' onChange={(e) => setGender(e.value)} checked={gender === 'M'} />
									<span className='p-1'>F</span>
									<RadioButton value='F' name='city' onChange={(e) => setGender(e.value)} checked={gender === 'F'} />
								</span>
							</div>
						</div>
					</div>

					<div className='grid'>
						<div className='col-4'>
							<span className='p-float-label mt-5'>
								<InputMask id='dob' mask='99/99/9999' slotChar='mm/dd/yyyy' value={dob} onChange={(e) => setDOB(e.value)}></InputMask>
								<label htmlFor='dob' className='pr-1'>
									DOB
								</label>
							</span>
						</div>
						<div className='col-4'>
							<span className='p-float-label mt-5'>
								<InputMask mask='(999) 999-9999' value={tel} onChange={(e) => setTel(e.value)}></InputMask>
								<label htmlFor='tel' className='pr-1'>
									Tel
								</label>
							</span>
						</div>
						<div className='col-4'>
							<span className='p-float-label mt-5'>
								<InputMask id='ssn' mask='999-99-9999' value={ssn} onChange={(e) => setSSN(e.value)}></InputMask>
								<label htmlFor='ssn' className='pr-1'>
									SSN
								</label>
							</span>
						</div>
					</div>

					<div className='grid'>
						<div className='col-12'>
							<span className='p-float-label mt-5' style={{ width: '100%' }}>
								<InputText id='ln' style={{ width: '100%' }} value={address} onChange={(e) => setAddress(e.target.value)} />
								<label htmlFor='ln'>Address</label>
							</span>
						</div>
					</div>
				</div>
			</Dialog>
		</div>
	);
};

export default PatientDash;
