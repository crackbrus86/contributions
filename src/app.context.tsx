import React from 'react';
import * as Models from './models';
import { phoneToMask, unmaskPhone } from './utils';

export const useApp = () => {
	const [view, setView] = React.useState<Models.View>(Models.View.MembersList);
	const [member, setMember] = React.useState<Models.Member>(null);
	const [members, setMembers] = React.useState<Models.Member[]>([]);
	const [credentials, setCredentials] = React.useState<Models.AppCredentials>(null);
	const [regions, setRegions] = React.useState<Models.Region[]>([]);
	const [memberToRemove, setMemberToRemove] = React.useState<Models.Member>(null);
	const [membershipData, setMembershipData] = React.useState<Models.Membership[]>([]);
	const [filter, setFilter] = React.useState<Models.Filter>({ year: new Date().getFullYear(), areaId: 0 });

	const onChangeYearFilter = (value: string) => {
		const nextYear = Number(value);
		const nextFilter: Models.Filter = {
			...filter,
			year: isNaN(nextYear) || nextYear === 0 || nextYear > new Date().getFullYear() ? new Date().getFullYear() : nextYear,
		};
		setFilter(nextFilter);
	}

	const onChangeAreaFilter = (value: string) => {
		const nextFilter: Models.Filter = { ...filter, areaId: Number(value) };
		setFilter(nextFilter);
	}

	const onResetFilter = () => {
		setFilter({ year: new Date().getFullYear(), areaId: 0 });
	}

	const onLoadCredentials = React.useCallback(() => {
		const userId = document.getElementById('usrInfo').dataset.info;
		const appType = document.getElementById('appType').dataset.info;
		fetch(`../wp-content/plugins/contributions/api/GetCurrentCredentials.php?user_id=${userId}&app_type=${appType}`)
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
				phone: unmaskPhone(nextMember.phone?.toString()),
				year: filter.year
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
				phone: unmaskPhone(nextMember.phone?.toString()),
				year: filter.year
			})
		}).then(response => response.ok);
	}

	const onLoadMembersAdm = async () => {
		let url: string;
		switch(credentials.appType) {
			case 'admin': {
				url = `../wp-content/plugins/contributions/api/GetAllMembersAdm.php?year=${filter.year}&areaId=${filter.areaId}`;
				break;
			}
			case 'region': {
				url = `../wp-content/plugins/contributions/api/GetMembersByRegion.php?year=${filter.year}`;
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
				lastAlterEventDate: x.lastAlterEventDate.toString() === '0000-00-00 00:00:00' ? new Date('01-01-1970') : new Date(x.lastAlterEventDate),
				reFpuDate: x.reFpuDate.toString() === '0000-00-00 00:00:00' ? new Date('01-01-1970') : new Date(x.reFpuDate),
				phone: phoneToMask(x.phone)
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
				isContributed: !member.isContributed,
				year: filter.year
			} as Models.ChangeContributionStatusModel)
		});
		await onLoadMembersAdm();
	}

	const onDeleteMember = async (model: Models.DeleteMemberModel) => {
		await fetch(`../wp-content/plugins/contributions/api/DeleteMember.php`, {
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

	const showMembersList = view === Models.View.MembersList && !!credentials && credentials.appType !== "common";

	const showMemberDetails = view === Models.View.MemberDetails && !!credentials && credentials.appType !== "common";

	const showMembership = !!credentials && credentials.appType === "common";

	const showAreaFilter = !!credentials && credentials.appType !== "region";

	const displaySmallMode = !!credentials && credentials.appType === 'region';

	const onLoadMembership = async () => {
		await fetch(`../wp-content/plugins/contributions/api/GetMembership.php?year=${filter.year}&areaId=${filter.areaId}`)
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
		membershipData,
		filter,
		showAreaFilter,
		displaySmallMode,
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
		onChangeYearFilter,
		onChangeAreaFilter,
		onResetFilter
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