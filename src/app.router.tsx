import React from 'react';
import * as Models from './models'
import { MembersList } from './components/members.list';
import { MemberDetails } from './components/member.details';
import { useAppContext } from './app.context';

export const AppRouter: React.FC = () => {
    const {view, onLoadCredentials} = useAppContext();
    
    React.useEffect(() => {
        onLoadCredentials();
    }, [])

	return (<>
			{view === Models.View.MembersList && <MembersList />}
			{view === Models.View.MemberDetails && <MemberDetails />}
		</>
	);
}