import React from 'react';
import * as Models from './models'
import { MembersList } from './components/members.list';
import { MemberDetails } from './components/member.details';
import { DeleteMemberDialog } from './components/delete.member.dialog';
import { useAppContext } from './app.context';

export const AppRouter: React.FC = () => {
    const {view, credentials, regions, onLoadRegions, onLoadCredentials} = useAppContext();
    
    React.useEffect(() => {
        onLoadCredentials();
	}, [])
	
	React.useEffect(() => {
		if(!regions.length)
			onLoadRegions();
	}, [regions]);

	return (<>
			{view === Models.View.MembersList && !!credentials && <MembersList />}
			{view === Models.View.MemberDetails && !!credentials && <MemberDetails />}
			<DeleteMemberDialog />
		</>
	);
}