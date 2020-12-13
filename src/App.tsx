import React from 'react';
import * as Models from './models'
import { MembersList } from './components/members.list';
import { MemberDetails } from './components/member.details';

const App: React.FC = () => {
	const [view, setView] = React.useState<Models.View>(Models.View.MembersList);
	const [member, setMember] = React.useState<Models.Member>(null);

	const onAddMember = () => {
		setView(Models.View.MemberDetails);
	}

	const onEdit = (nextMember: Models.Member) => {
		setMember(nextMember);
		setView(Models.View.MemberDetails)
	}

	const onBack = () => {
		setMember(null);
		setView(Models.View.MembersList);
	}

	return (
		<div className='federation-membership container-fluid'>
			{view === Models.View.MembersList && <MembersList onAddMember={onAddMember} onEditMember={onEdit} />}
			{view === Models.View.MemberDetails && <MemberDetails member={member} onBack={onBack} />}
		</div>
	);
}

export default App;
