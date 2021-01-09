import React from 'react';
import * as Models from './models';
import { unmaskPhone } from './utils';

export const useApp = () => {
	const [view, setView] = React.useState<Models.View>(Models.View.MembersList);
	const [member, setMember] = React.useState<Models.Member>(null);
	const [members, setMembers] = React.useState<Models.Member[]>([]);
	const [credentials, setCredentials] = React.useState<Models.AppCredentials>(null);
	const [regions, setRegions] = React.useState<Models.Region[]>([]);
	const [memberToRemove, setMemberToRemove] = React.useState<Models.Member>(null);
	const [membershipData, setMembershipData] = React.useState<Models.Membership[]>([]);

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
		return await fetch(`../wp-content/plugins/contributions/api/AddMember.php`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				...nextMember, 
				phone: unmaskPhone(nextMember.phone?.toString())
			})
		}).then(response => response.ok);
	}

	const onUpdateMember = async (nextMember: Models.Member): Promise<boolean> => {
		return await fetch(`../wp-content/plugins/contributions/api/UpdateMember.php`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				...nextMember, 
				phone: unmaskPhone(nextMember.phone?.toString())
			})
		}).then(response => response.ok);
	}

	const onLoadMembersAdm = async () => {
		let url: string;
		switch(credentials.appType) {
			case 'admin': {
				url = `../wp-content/plugins/contributions/api/GetAllMembersAdm.php`;
				break;
			}
			case 'region': {
				url = `../wp-content/plugins/contributions/api/GetMembersByRegion.php`;
				break;
			}
			default: {
				url = '';
			}
		}
		await fetch(url)
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

	const onChangeContributionStatus = async (member: Models.Member) => {
		await fetch(`../wp-content/plugins/contributions/api/ChangeContributionStatus.php`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				memberId: member.memberId,
				isContributed: !member.isContributed
			} as Models.ChangeContributionStatusModel)
		});
		await onLoadMembersAdm();
	}

	const onDeleteMember = async (model: Models.DeleteMemberModel) => {
		await fetch(`../wp-content/plugins/contributions/api/DeleteMember`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(model)
		});
		await onLoadMembersAdm();
	}

	const onShowConfirm = (member: Models.Member) => {
		setMemberToRemove(member);
	}

	const onHideConfirm = () => {
		setMemberToRemove(null);
	}

	const showMembersList = React.useMemo<boolean>(() => {
		return view === Models.View.MembersList && !!credentials && credentials.appType !== "common";
	}, [view, credentials]);

	const showMemberDetails = React.useMemo<boolean>(() => {
		return view === Models.View.MemberDetails && !!credentials && credentials.appType !== "common";
	}, [view, credentials]);

	const showMembership = React.useMemo<boolean>(() => {
		return !!credentials && credentials.appType === "common";
	}, [credentials]);

	const onLoadMembership = async () => {
		await fetch(`../wp-content/plugins/contributions/api/GetMembership.php`)
			.then(response => response.json())
			.then((data: Models.Membership[]) => {
				const memberships: Models.Membership[] = data.map(x => ({
					...x,
					dateOfBirth: new Date(x.dateOfBirth),
					fpuDate: new Date(x.fpuDate)
				}));
				setMembershipData(memberships);
			});
	}

	const membershipRegions = React.useMemo(() => {
		return regions.filter(region => membershipData.find(x => x.areaId == region.id));
	}, [regions, membershipData])

	return {
		view,
		member,
		credentials,
		members,
		regions,
		memberToRemove,
		showMembersList,
		showMemberDetails,
		showMembership,
		membershipRegions,
		onLoadCredentials,
		onAddMember,
		onEdit,
		onBack,
		onCreateMember,
		onLoadMembersAdm,
		onLoadRegions,
		onUpdateMember,
		onChangeContributionStatus,
		onShowConfirm,
		onHideConfirm,
		onDeleteMember,
		onLoadMembership,
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