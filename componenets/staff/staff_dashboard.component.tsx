import React, { useState, useRef, useEffect } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';
import { InputMask } from 'primereact/inputmask';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Slider } from 'primereact/slider';
import { FormatMoney } from 'format-money-js';

const StafftDash: React.FC = () => {
	const [modalOpen, setModalOpen] = useState(false);
	const [firstName, setFirstName] = useState<string>('');
	const [lastName, setLastName] = useState<string>('');
	const [gender, setGender] = useState<string>('');
	const [emplType, setEmplType] = useState<string>('');
	const [emolNo, setEmplNo] = useState<string>('');
	const [dob, setDOB] = useState<string>('');
	const [ssn, setSSN] = useState<string>('');
	const [address, setAddress] = useState<string>('');
	const [tel, setTel] = useState<string>('');
	const [speciality, setSpeciality] = useState<string>('');
	const [contract, setContract] = useState<string>('');
	const [nurseGrade, setNurseGrade] = useState<string>('');
	const [nurseExpYears, setNurseExpYears] = useState<string>('');
	const [salary, setSalary] = useState(null);

	const products = [{ code: 'test', name: 'bazo' }];

	const clearForm: () => void = () => {
		setFirstName('');
		setLastName('');
		setGender('');
		setAddress('');
		setTel('');
		setEmplNo('');
		setSSN('');
		setDOB('');
		setEmplType('');
	};

	const onHide: () => void = () => {
		setModalOpen(false);
		clearForm();
	};

	const header: JSX.Element = (
		<div className='table-header-container'>
			<Button icon='pi pi-plus' label='Add Employee' onClick={() => setModalOpen(true)} className='mr-2' />
		</div>
	);

	const footer: any = (
		<div>
			<Button label='Save' icon='pi pi-check' onClick={() => alert('adding')} />
			<Button label='Cancel' icon='pi pi-times' onClick={onHide} />
		</div>
	);

	const cities = [
		{ name: 'New York', code: 'NY' },
		{ name: 'Rome', code: 'RM' },
		{ name: 'London', code: 'LDN' },
		{ name: 'Istanbul', code: 'IST' },
		{ name: 'Paris', code: 'PRS' }
	];

	return (
		<>
			<div>
				<div className='card'>
					<DataTable value={products} header={header} responsiveLayout='scroll'>
						<Column field='code' header='Code'></Column>
						<Column field='name' header='Name'></Column>
					</DataTable>
				</div>
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
								<InputText id='fn' value={firstName} onChange={(e) => setFirstName(e.target.value)} keyfilter='alpha' />
								<label htmlFor='fn'>First Name</label>
							</span>
						</div>
						<div className='col-4'>
							<span className='p-float-label mt-5'>
								<InputText id='ln' value={lastName} onChange={(e) => setLastName(e.target.value)} keyfilter='alpha' />
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

					<div className='grid'>
						<div className='col-12'>
							<div className='mt-5'>
								<span className='mt-3' style={{ display: 'inline-block' }}>
									Employemnt Type:{' '}
								</span>
								<span className=''>
									<span className='ml-1'>
										<span className='p-1'>Physician</span>
										<RadioButton value='P' name='emplType' onChange={(e) => setEmplType(e.value)} checked={emplType === 'P'} />
									</span>
									<span className='ml-3'>
										<span className='p-1'>Surgeon</span>
										<RadioButton value='S' name='emplType' onChange={(e) => setEmplType(e.value)} checked={emplType === 'S'} />
									</span>

									<span className='ml-3'>
										<span className='p-1'>Nurse</span>
										<RadioButton value='N' name='emplType' onChange={(e) => setEmplType(e.value)} checked={emplType === 'N'} />
									</span>
								</span>
							</div>
						</div>
					</div>

					{emplType === 'S' || emplType === 'P' ? (
						<div className='grid mt-5'>
							<div className='col-6'>
								<label htmlFor='spec' className='pr-1' style={{ display: 'inherit' }}>
									Speciality:
								</label>
								{/* <InputTextarea className='mt-1' id='spec' rows={5} cols={40} value={speciality} onChange={(e) => setSpeciality(e.target.value)} autoResize /> */}
								<Dropdown optionLabel='name' value={contract} options={cities} onChange={(e) => setSpeciality(e.value)} placeholder='Select a Speciality' />
							</div>
							{emplType === 'S' ? (
								<div className='col-6 mt-3'>
									<Dropdown optionLabel='name' value={contract} options={cities} onChange={(e) => setContract(e.value)} placeholder='Select a Contract' />
								</div>
							) : (
								<div className='col-6'>
									<h5 className='mb-2'>
										Salary:
										{new FormatMoney({
											decimals: 2
										})
											.from(salary, { symbol: '$' })
											?.toString()}
									</h5>
									<Slider value={salary} onChange={(e) => setSalary(e.value)} min={250000} max={300000} />
								</div>
							)}
						</div>
					) : emplType === 'N' ? (
						<div className='grid mt-3'>
							<div className='col-4 mt-3'>
								<Dropdown optionLabel='name' value={contract} options={cities} onChange={(e) => setNurseGrade(e.value)} placeholder='Select Grade' />
							</div>
							<div className='col-4 mt-3'>
								<span className='p-float-label'>
									<InputText id='nexp' value={nurseExpYears} onChange={(e) => setNurseExpYears(e.target.value)} />
									<label htmlFor='nexp'>Years of experience</label>
								</span>
							</div>
							<div className='col-4'>
								<h5 className='mb-2'>
									Salary:
									{new FormatMoney({
										decimals: 2
									})
										.from(salary, { symbol: '$' })
										?.toString()}
								</h5>
								<Slider value={salary} onChange={(e) => setSalary(e.value)} min={250000} max={300000} />
							</div>
						</div>
					) : null}
				</div>
			</Dialog>
		</>
	);
};

export default StafftDash;
