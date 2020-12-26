import React from 'react';
import * as Models from './models';
import { unmaskPhone } from './utils';

export const useApp = () => {
	const [view, setView] = React.useState<Models.View>(Models.View.MembersList);
	const [member, setMember] = React.useState<Models.Member>(null);
	const [members, setMembers] = React.useState<Models.Member[]>([]);
	const [credentials, setCredentials] = React.useState<Models.AppCredentials>(null);
	const [regions, setRegions] = React.useState<Models.Region[]>([]);

	const onLoadCredentials = React.useCallback(() => {
		const userId = document.getElementById('usrInfo').dataset.info;
		fetch(`../wp-content/plugins/contributions/api/GetCurrentCredentials.php?user_id=${userId}`)
			.then(response => response.json())
			.then((data: Models.ServerCredentials) => {
				const nextCredentials: Models.AppCredentials = {
					appType: data.app_type,
					uid: data.uid
				}
				setCredentials(nextCredentials);
			});
	}, [setCredentials]);

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

	const onCreateMember = async (nextMember: Models.Member): Promise<boolean> => {
		let status: boolean;
		await fetch(`../wp-content/plugins/contributions/api/AddMember.php`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				...nextMember, 
				phone: unmaskPhone(nextMember.phone?.toString())
			})
		}).then(response => { 
			status = response.ok
		});
		return status;
	}

	const onUpdateMember = async (nextMember: Models.Member) => {
		await fetch(`../wp-content/plugins/contributions/api/UpdateMember.php`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				...nextMember, 
				phone: unmaskPhone(nextMember.phone?.toString())
			})
		});
	}

	const onLoadMembersAdm = async () => {
		await fetch(`../wp-content/plugins/contributions/api/GetAllMembersAdm.php`)
		.then(response => response.json())
		.then((data: Models.Member[]) => { 
			const nextMembers: Models.Member[] = data.map(x => ({ 
				...x,
				dateOfBirth: new Date(x.dateOfBirth),
				fpuDate: new Date(x.fpuDate),
			}));
			setMembers(nextMembers); 
		});
	}

	const onLoadRegions = async () => {
		await fetch(`../wp-content/plugins/contributions/api/GetRegionsLkp.php`)
		.then(response => response.json())
		.then((data: Models.Region[]) => {
			setRegions(data);
		});
	}

	return {
		view,
		member,
		credentials,
		members,
		regions,
		onLoadCredentials,
		onAddMember,
		onEdit,
		onBack,
		onCreateMember,
		onLoadMembersAdm,
		onLoadRegions,
		onUpdateMember,
	};
}

type AppContextType = ReturnType<typeof useApp>;

const AppContext = React.createContext<AppContextType>(null);

export const AppProvider: React.FC<AppContextType> = props => {
	return <AppContext.Provider value={props}>
		{props.children}
	</AppContext.Provider>
};

export const useAppContext = () => {
	return React.useContext(AppContext);
}