import React from 'react';
import { AppProvider, useApp} from './app.context';
import {AppRouter} from './app.router';

const App: React.FC = () => {
	const appContext = useApp();

	return (<AppProvider {...appContext}>
		<div className='federation-membership container-fluid'>
			<AppRouter/>
		</div>
	</AppProvider>
	);
}

export default App;
