import '../styles/globals.css';
import type { AppProps } from 'next/app';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import '/node_modules/primeflex/primeflex.css';
import { Menubar } from 'primereact/menubar';
import config from 'utils/config';

export default function App({ Component, pageProps }: AppProps) {
	const items: any[] = [
		{
			label: 'Home',
			icon: 'pi pi-fw pi-power-off',
			url: `${config.host}`
			// command: () => {
			// 	router.push({ pathname: '/index' });
			// }
		}
	];
	return (
		<>
			{' '}
			<Menubar model={items} />
			<Component {...pageProps} />
		</>
	);
}
