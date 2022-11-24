import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { NextRouter } from 'next/router';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useRouter } from 'next/router';
import React from 'react';

const Home: React.FC = () => {
	const router: NextRouter = useRouter();

	return (
		<div className={styles.container}>
			<Head>
				<title>Newark Medical Associates</title>
				<meta name='description' content='Generated by create next app' />
			</Head>
			<h3 style={{ textAlign: 'center' }}>Welcome to Newark Medical Associates</h3>

			{/* <main className={styles.main}></main> */}

			<div className='grid mt-8'>
				<div className='col-4'>
					<Card>
						<h3>Patient Management</h3>
						<Button label='view' onClick={() => router.push({ pathname: '/patient/dashboard' })} />
					</Card>
				</div>
				<div className='col-4'>
					<Card>
						<h3>In-Patient Management</h3>
						<Button label='view' onClick={() => alert('jjj')} />
					</Card>
				</div>

				<div className='col-4'>
					<Card>
						<h3>Clinic Staff Management</h3>
						<Button label='view' onClick={() => router.push({ pathname: '/staff/dashboard' })} />
					</Card>
				</div>
			</div>

			<footer className={styles.footer}>
				{/* <a href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app' target='_blank' rel='noopener noreferrer'>
					Powered by{' '}
					<span className={styles.logo}>
						<Image src='/vercel.svg' alt='Vercel Logo' width={72} height={16} />
					</span>
				</a> */}
			</footer>
		</div>
	);
};

export default Home;
