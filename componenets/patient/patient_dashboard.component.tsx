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

import { Toast } from 'primereact/toast';

const PatientDash: React.FC = () => {
	const toast: React.MutableRefObject<any> = useRef(this);
	const [modalOpen, setModalOpen] = useState(false);
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
				toast.current.show({ severity: 'success', summary: 'Success Message', detail: 'Patient has been successfully registered.' });
			} else {
				toast.current.show({ severity: 'error', summary: 'Success Message', detail: 'Something went wrong while registering new patient' });
			}
		} catch (e) {
			toast.current.show({ severity: 'error', summary: 'Success Message', detail: 'Something went wrong while registering new patient' });
		}
	};

	useEffect(() => {
		(async () => {
			try {
				const endpoint: string = `${config.serverHost}/${config.serverApiPath}/patient/all`;
				const response: AxiosResponse<any> = await axios.get(endpoint);

				if (response.data.data.length) {
					setPatients(response.data.data);
				} else {
					toast.current.show({ severity: 'error', summary: 'Success Message', detail: 'Something went wrong while registering new patient' });
				}
			} catch (e) {
				toast.current.show({ severity: 'error', summary: 'Success Message', detail: 'Something went wrong while registering new patient' });
			}
		})();
	});

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

	const header = (
		<div className='table-header-container'>
			<Button icon='pi pi-plus' label='Add Patient' onClick={() => setModalOpen(true)} className='mr-2' />
		</div>
	);

	const footer = (
		<div>
			<Button label='Save' icon='pi pi-check' onClick={handleAddPatient} />
			<Button label='Cancel' icon='pi pi-times' onClick={onHide} />
		</div>
	);

	return (
		<div>
			<Toast ref={toast} />
			<div className='card'>
				<DataTable value={patients} responsiveLayout='scroll' header={header}>
					<Column field='firstName' header='First Name' body={(dt) => handleNoValue(dt, 'address')}></Column>
					<Column field='lastName' header='Last Name' body={(dt) => handleNoValue(dt, 'lastName')}></Column>
					<Column field='gender' header='Gender' body={(dt) => handleNoValue(dt, 'gender')}></Column>
					<Column field='telephone' header='Telephone' body={(dt) => handleNoValue(dt, 'telephone')}></Column>
					<Column field='address' header='address' body={(dt) => handleNoValue(dt, 'address')}></Column>
					<Column field='ssn' header='SSN' body={(dt) => handleNoValue(dt, 'ssn')}></Column>
				</DataTable>
			</div>
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
