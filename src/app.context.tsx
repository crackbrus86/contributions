import React from 'react';
import * as Models from './models';

export const useApp = () => {
	const [view, setView] = React.useState<Models.View>(Models.View.MembersList);
	const [member, setMember] = React.useState<Models.Member>(null);
	const [credentials, setCredentials] = React.useState<Models.AppCredentials>(null);

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

	const onCreateMember = async (nextMemeber: Models.Member) => {
		await fetch(`../wp-content/plugins/contributions/api/AddMember.php`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(nextMemeber)
		})
	}

	const onLoadMembersAdm = async () => {
		await fetch(`../wp-content/plugins/contributions/api/GetAllMembersAdm.php`)
		.then(response => response.json())
		.then(data => console.log(data));
	}

	return {
		view,
		member,
		credentials,
		onLoadCredentials,
		onAddMember,
		onEdit,
		onBack,
		onCreateMember,
		onLoadMembersAdm,
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