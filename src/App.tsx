import React from 'react';
import { AppProvider, useApp} from './app.context';
import {AppRouter} from './app.router';
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify';

const App: React.FC = () => {
	const appContext = useApp();

	return (<AppProvider {...appContext}>
		<div className='federation-membership container-fluid'>
			<AppRouter/>
		</div>
		<ToastContainer />
	</AppProvider>
	);
}

export default App;
