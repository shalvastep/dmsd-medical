import StaffInfo from 'componenets/staff/staff_info.component';
import { NextRouter, useRouter } from 'next/router';
import React from 'react';

import type { NextPage } from 'next';
const EmployeePage: NextPage = () => {
	const router: NextRouter = useRouter();
	const { employeeId } = router.query;

	return <StaffInfo employeeId={employeeId ? Number(employeeId) : null}></StaffInfo>;
};

export default EmployeePage;
