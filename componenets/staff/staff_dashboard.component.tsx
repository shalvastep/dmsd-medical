import axios, { AxiosResponse } from 'axios';
import { FormatMoney } from 'format-money-js';
import generateUniqueId from 'generate-unique-id';
import { Employee } from 'models/employee.model';
import { EmployeeSpecialty } from 'models/employee.specialty.model';
import { NurseGrade } from 'models/nure.grade.mode';
import { Occupation } from 'models/occupation.model';
import { SurgeonContract } from 'models/surgeon.contract.model';
import { NextRouter, useRouter } from 'next/router';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputMask } from 'primereact/inputmask';
import { InputText } from 'primereact/inputtext';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import { MultiSelect } from 'primereact/multiselect';
import { ProgressSpinner } from 'primereact/progressspinner';
import { RadioButton } from 'primereact/radiobutton';
import { Slider } from 'primereact/slider';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Tooltip } from 'primereact/tooltip';
import React, { useState, useRef, useEffect } from 'react';
import config from 'utils/config';

const StafftDash: React.FC = () => {
	const router: NextRouter = useRouter();
	const menu: React.MutableRefObject<Menu> = useRef(null);
	const toast: React.MutableRefObject<any> = useRef(this);
	const [loading, setLoading] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [firstName, setFirstName] = useState<string>('');
	const [lastName, setLastName] = useState<string>('');
	const [gender, setGender] = useState<string>('');
	const [occupation, setOccupation] = useState<string>('');
	const [emplNo, setEmplNo] = useState<string>(null);
	const [dob, setDOB] = useState<string>('');
	const [ssn, setSSN] = useState<string>('');
	const [address, setAddress] = useState<string>('');
	const [tel, setTel] = useState<string>('');
	const [specialty, setSpecialty] = useState<EmployeeSpecialty>(null);
	const [surgeonContract, setSuregonContract] = useState<SurgeonContract>(null);
	const [nurseGrade, setNurseGrade] = useState<NurseGrade>(null);
	const [nurseExpYears, setNurseExpYears] = useState<string>('');
	const [salary, setSalary] = useState(null);
	const [employeeSpecialtyData, setEmployeeSpecialtyData] = useState<EmployeeSpecialty[]>([]);
	const [surgeonContractsData, setSurgeonContractsData] = useState<SurgeonContract[]>([]);
	const [nurseGradesData, setNurseGradesData] = useState<SurgeonContract[]>([]);
	const [clinicEmployeesData, setClinicEmployeesData] = useState<Employee[]>([]);
	const [actionMenu, setActionMenu] = useState([]);

	const [filters2, setFilters2] = useState({
		occupation: { value: null, matchMode: FilterMatchMode.IN }
	});

	useEffect(() => {
		(async () => {
			const endpoint: string = `${config.serverHost}/${config.serverApiPath}/clinic-employee/specialty`;

			const response: AxiosResponse<any> = await axios.get(endpoint);

			if (response.data.data.length) {
				setEmployeeSpecialtyData(response.data.data);
			}
		})();

		(async () => {
			const endpoint: string = `${config.serverHost}/${config.serverApiPath}/clinic-employee/surgeon-contract`;

			const response: AxiosResponse<any> = await axios.get(endpoint);

			if (response.data.data.length) {
				response.data.data.forEach((contract: any) => {
					contract.typeYear = `${contract.contractType} - ${contract.contractLength}(Years)`;
				});
				setSurgeonContractsData(response.data.data);
			}
		})();

		(async () => {
			const endpoint: string = `${config.serverHost}/${config.serverApiPath}/clinic-employee/nurse-grades`;

			const response: AxiosResponse<any> = await axios.get(endpoint);

			if (response.data.data.length) {
				setNurseGradesData(response.data.data);
			}
		})();

		(async () => {
			await loadEmployees();
		})();
		console.log('useffect');
	}, []);

	const loadEmployees: () => Promise<any> = async () => {
		setLoading(true);
		try {
			const endpoint: string = `${config.serverHost}/${config.serverApiPath}/clinic-employee`;
			const response: AxiosResponse<any> = await axios.get(endpoint);

			if (response.data.data.length) {
				setClinicEmployeesData(response.data.data);
			} else {
				toast.current.show({ severity: 'error', summary: '', detail: 'Something went wrong while loading employee details' });
			}
		} catch (e) {
			setLoading(false);
			toast.current.show({ severity: 'error', summary: '', detail: 'Something went wrong while loading employee details' });
		}
		setLoading(false);
	};

	useEffect(() => {
		setEmplNo(generateEmplNo());
	}, [modalOpen]);

	useEffect(() => {
		setSpecialty(null);
		setNurseGrade(null);
		setSalary(null);
		setSuregonContract(null);
		setNurseExpYears('');
	}, [occupation]);

	const clearForm: () => void = () => {
		setFirstName('');
		setLastName('');
		setGender('');
		setAddress('');
		setTel('');
		setEmplNo(null);
		setSSN('');
		setDOB('');
		setOccupation('');
		setNurseExpYears('');
		setSuregonContract(null);
		setSpecialty(null);
		setNurseGrade(null);
		setSalary(null);
		setEmployeeSpecialtyData([]);
		setSurgeonContractsData([]);
		setNurseGradesData([]);
	};

	const generateEmplNo: () => string = () => {
		return generateUniqueId({
			length: 15,
			useLetters: false
		});
	};

	const evaluateOccupationId: () => number = () => {
		return occupation === 'P' ? 2 : occupation === 'S' ? 1 : occupation === 'N' ? 3 : null;
	};

	const handleAddEmployee: () => void = async () => {
		setModalOpen(false);
		// setLoading(true);
		const endpoint: string = `${config.serverHost}/${config.serverApiPath}/clinic-employee`;

		const occupationInfo: Occupation = { occupationId: evaluateOccupationId() };
		const surgeonContractInfo: SurgeonContract = surgeonContract ? { contractTypeId: occupation === 'S' ? surgeonContract.contractTypeId : null } : null;
		const nurseGradeInfo: NurseGrade = nurseGrade ? { gradeId: occupation === 'N' ? nurseGrade.gradeId : null } : null;
		const employeeSpecialtyInfo: EmployeeSpecialty = specialty ? { specialtyId: occupation !== 'N' ? specialty.specialtyId || null : null } : null;

		const employee: Employee = {
			firstName: firstName.length === 0 ? null : firstName,
			lastName: lastName.length === 0 ? null : lastName,
			phoneNumber: tel.length === 0 ? null : tel,
			gender: gender.length === 0 ? null : gender,
			ssn: ssn.length === 0 ? null : ssn,
			dob: dob.length === 0 ? null : dob,
			specialty: employeeSpecialtyInfo,
			salary: salary === null ? null : Number(salary),
			employeeNumber: emplNo,
			yearsExperience: nurseExpYears !== '' ? Number(nurseExpYears) : null,
			address: address.length === 0 ? null : address,
			occupation: occupationInfo,
			contract: surgeonContractInfo,
			nurseGrade: nurseGradeInfo,
			isOwner: false,
			isActive: true, // by default its active when doctor is registered
			shiftId: null,
			maxAllocatedPatient: 0,
			minAllocatedPatient: 0,
			employeeShift: null
		};

		try {
			setLoading(true);
			const response: AxiosResponse<any> = await axios.post(endpoint, employee);

			if (response.data.data.clinicEmployeeId) {
				toast.current.show({ severity: 'success', summary: '', detail: 'Employee has been successfully registered.' });
				clearForm();
			} else {
				toast.current.show({ severity: 'error', summary: '', detail: 'Something went wrong while registering new employee' });
			}
			setLoading(false);

			(async () => {
				await loadEmployees();
			})();
		} catch (e) {
			setLoading(false);
			toast.current.show({ severity: 'error', summary: '', detail: 'Something went wrong while registering new employee' });
		}
	};

	const removeEmployee: (employeeId: number) => void = async (employeeId: number) => {
		const endpoint: string = `${config.serverHost}/${config.serverApiPath}/clinic-employee/remove/${employeeId}`;

		try {
			setLoading(true);
			const response: AxiosResponse<any> = await axios.post(endpoint);

			if (response.data.data.clinicEmployeeId) {
				toast.current.show({ severity: 'success', summary: '', detail: 'Employee has been successfully removed.' });
			} else {
				toast.current.show({ severity: 'error', summary: '', detail: 'Something went wrong while removing an employee' });
			}
			setLoading(false);

			(async () => {
				await loadEmployees();
			})();
		} catch (e) {
			setLoading(false);
			toast.current.show({ severity: 'error', summary: '', detail: 'Something went wrong while removing an employee' });
		}
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
			<Button label='Save' icon='pi pi-check' onClick={() => handleAddEmployee()} />
			<Button label='Cancel' icon='pi pi-times' onClick={onHide} />
		</div>
	);

	const paginatorLeft = <Button type='button' icon='pi pi-refresh' className='p-button-text' onClick={loadEmployees} />;

	const handleNoValue: (d: any, key: string) => string = (rowData, key) => {
		return rowData[key] || 'N/A';
	};

	const processNurseGrade: (data: any) => string = (data) => {
		return data.nurseGrade?.grade || 'N/A';
	};

	const processOccupation: (data: any) => string = (data) => {
		return data.occupation?.occupation || 'N/A';
	};

	const processSpecialty: (data: any) => string = (data) => {
		return data.specialty?.specialty || 'N/A';
	};

	const processContract: (data: any) => string = (data) => {
		return data.contract?.contractType || 'N/A';
	};

	const handleMenuClick: (employee: Employee) => void = (employee: Employee) => {
		const menuItems: MenuItem[] = [];
		const removeEmpl: MenuItem = {
			label: 'Remove',
			icon: 'pi pi-fw pi-minus',
			command: async () => {
				await removeEmployee(employee.clinicEmployeeId);
			}
		};

		const viewEmpl: MenuItem = {
			label: 'View',
			icon: 'pi pi-fw pi-eye',
			command: async () => {
				router.push({ pathname: `/staff/info/${employee.clinicEmployeeId}` });
			}
		};

		if (employee.isActive) {
			menuItems.push(removeEmpl);
		}

		menuItems.push(viewEmpl);

		console.log('menuItems', menuItems);

		setActionMenu(menuItems);
	};

	const actionBodyTemplate: (employee: Employee) => JSX.Element = (employee: Employee) => {
		let tempRef: Menu = null;
		return (
			<React.Fragment>
				<Menu
					model={actionMenu}
					popup
					// ref={menu}
					ref={(el) => {
						tempRef = el;
					}}
				/>
				<Button
					label=''
					icon='pi pi-bars'
					onClick={(event) => {
						// menu.current.toggle(event);
						tempRef.toggle(event);

						handleMenuClick(employee);
					}}
				/>
			</React.Fragment>
		);
	};

	const statusBodyTemplate: (rowData: Employee) => JSX.Element = (rowData: Employee) => {
		return rowData.isActive ? (
			<Tag className='mr-2' severity='success' value='Active' style={{ width: '60%' }}></Tag>
		) : (
			<Tag className='mr-2' severity='warning' value='InActive' style={{ width: '60%' }}></Tag>
		);
	};

	const employeeTypes = [
		{ name: 'Surgeon', value: { occupationId: 1, occupation: 'Surgeon' } },
		{ name: 'Nurse', value: { occupationId: 3, occupation: 'Nurse' } },
		{ name: 'Physician', value: { occupationId: 2, occupation: 'Physician' } }
	];

	const employeeTypeFilterTemplate = (options: any) => {
		return (
			<MultiSelect
				value={options.value}
				options={employeeTypes}
				// itemTemplate={representativesItemTemplate}

				onChange={(e) => {
					console.log(e.value);
					options.filterCallback(e.value);
				}}
				optionLabel='name'
				placeholder='Any'
				className='p-column-filter'
			/>
		);
	};

	return (
		<>
			<ProgressSpinner
				animationDuration='1s'
				style={loading ? { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' } : { display: 'none' }}
			/>
			<Toast ref={toast} />
			<div>
				<div className='card' style={{ height: 'calc(100vh - 145px)' }}>
					<DataTable
						value={clinicEmployeesData}
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
						filters={filters2}
						// filterDisplay='row'
						filterDisplay='menu'
					>
						<Column field='clinicEmployeeId' header='ID' body={(dt) => handleNoValue(dt, 'clinicEmployeeId')}></Column>
						<Column field='employeeNumber' header='Employee #' body={(dt) => handleNoValue(dt, 'employeeNumber')}></Column>
						<Column field='dob' header='DOB' body={(dt) => handleNoValue(dt, 'dob')}></Column>
						<Column field='firstName' header='First Name' body={(dt) => handleNoValue(dt, 'firstName')}></Column>
						<Column field='lastName' header='Last Name' body={(dt) => handleNoValue(dt, 'lastName')}></Column>
						<Column field='ssn' header='SSN' body={(dt) => handleNoValue(dt, 'ssn')}></Column>
						<Column field='salary' header='Salary' body={(dt) => handleNoValue(dt, 'salary')}></Column>
						<Column field='nurseGrade' header='Nurse Grade' body={(dt) => processNurseGrade(dt)}></Column>
						<Column
							header='Occupation'
							filterField='occupation'
							showFilterMatchModes={false}
							filterMenuStyle={{ width: '14rem' }}
							body={(dt) => processOccupation(dt)}
							filter
							style={{ minWidth: '14rem' }}
							filterElement={employeeTypeFilterTemplate}
						></Column>

						<Column field='specialty' header='Specialty' body={(dt) => processSpecialty(dt)}></Column>
						<Column field='contract' header='Contract' body={(dt) => processContract(dt)}></Column>
						<Column field='specialty' header='Status' body={statusBodyTemplate}></Column>
						<Column header='Action' body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
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
							<span className='p-float-label mt-5' style={{ width: '93%' }}>
								<InputText id='ln' style={{ width: '100%' }} value={address} onChange={(e) => setAddress(e.target.value)} />
								<label htmlFor='ln'>Address</label>
							</span>
						</div>
					</div>

					<div className='grid'>
						<div className='col-8'>
							<div className='mt-5'>
								<span className='mt-3' style={{ display: 'inline-block' }}>
									Occupation Type:{' '}
								</span>
								<span className=''>
									<span className='ml-1'>
										<span className='p-1'>Physician</span>
										<RadioButton value='P' name='occupation' onChange={(e) => setOccupation(e.value)} checked={occupation === 'P'} />
									</span>
									<span className='ml-3'>
										<span className='p-1'>Surgeon</span>
										<RadioButton value='S' name='occupation' onChange={(e) => setOccupation(e.value)} checked={occupation === 'S'} />
									</span>

									<span className='ml-3'>
										<span className='p-1'>Nurse</span>
										<RadioButton value='N' name='occupation' onChange={(e) => setOccupation(e.value)} checked={occupation === 'N'} />
									</span>
								</span>
							</div>
						</div>
						<div className='col-4'>
							<div className='mt-5'>
								<label htmlFor='emnplNo'>Employment Number:</label>
								<InputText id='emnplNo' disabled value={emplNo} />
								<Tooltip target='.info'>Auto generated</Tooltip>
								<i className='pi pi-info-circle info pl-1'></i>
							</div>
						</div>
					</div>

					{occupation === 'S' || occupation === 'P' ? (
						<div className='grid mt-5'>
							<div className='col-6'>
								<label htmlFor='spec' className='pr-1' style={{ display: 'inherit' }}>
									Speciality:
								</label>
								{/* <InputTextarea className='mt-1' id='spec' rows={5} cols={40} value={speciality} onChange={(e) => setSpeciality(e.target.value)} autoResize /> */}
								<Dropdown
									optionLabel='specialty'
									value={specialty}
									options={employeeSpecialtyData}
									onChange={(e) => setSpecialty(e.value)}
									placeholder='Select a Speciality'
								/>
							</div>
							{occupation === 'S' ? (
								<div className='col-6 mt-2'>
									<label htmlFor='spec' className='pr-1' style={{ display: 'inherit' }}>
										Contract:
									</label>
									<Dropdown
										optionLabel='typeYear'
										value={surgeonContract}
										options={surgeonContractsData}
										onChange={(e) => setSuregonContract(e.value)}
										placeholder='Select a Contract'
									/>
								</div>
							) : (
								<div className='col-6'>
									<h5 className='mb-2'>
										Salary:
										{new FormatMoney({
											decimals: 2
										})
											.from(Number(salary), { symbol: '$' })
											?.toString()}
									</h5>
									<Slider value={Number(salary)} onChange={(e) => setSalary(e.value.toString())} min={250000} max={300000} />
								</div>
							)}
						</div>
					) : occupation === 'N' ? (
						<div className='grid mt-3'>
							<div className='col-4 mt-0'>
								<label htmlFor='spec' className='pr-1' style={{ display: 'inherit' }}>
									Select a Grade:
								</label>
								<Dropdown optionLabel='grade' value={nurseGrade} options={nurseGradesData} onChange={(e) => setNurseGrade(e.value)} placeholder='' />
							</div>
							<div className='col-4 mt-3'>
								<span className='p-float-label'>
									<InputText id='nexp' value={nurseExpYears} onChange={(e) => setNurseExpYears(e.target.value)} keyfilter='int' />
									<label htmlFor='nexp'>Years of experience</label>
								</span>
							</div>
							<div className='col-4'>
								<h5 className='mb-2'>
									Salary:
									{new FormatMoney({
										decimals: 2
									})
										.from(Number(salary), { symbol: '$' })
										?.toString()}
								</h5>
								<Slider value={Number(salary)} onChange={(e) => setSalary(e.value.toString())} min={250000} max={300000} />
							</div>
						</div>
					) : null}
				</div>
			</Dialog>
		</>
	);
};

export default StafftDash;
