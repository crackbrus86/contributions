import React from 'react';
import { MembersList } from './components/members.list';
import { MemberDetails } from './components/member.details';
import { Membership } from './components/membership';
import { DeleteMemberDialog } from './components/delete.member.dialog';
import { useAppContext } from './app.context';

export const AppRouter: React.FC = () => {
    const { regions, showMembership, showMembersList, showMemberDetails, onLoadRegions, onLoadCredentials} = useAppContext();
    
    React.useEffect(() => {
        onLoadCredentials();
	}, [])
	
	React.useEffect(() => {
		if(!regions.length)
			onLoadRegions();
	}, [regions]);

	return (<>
			{showMembership && <Membership />}
			{showMembersList && <MembersList />}
			{showMemberDetails && <MemberDetails />}
			<DeleteMemberDialog />
		</>
	);
}