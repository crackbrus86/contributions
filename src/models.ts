export enum View {
	MembersList,
	MemberDetails
}

export interface Member {
	fullName: string,
	dateOfBirth: Date,
	citizenship: string,
	id?: number,
	passport: string,
	address: string,
	phone: number,
	email: string,
	job: string,
	position: string,
	jobAddress: string,
	otherFederationMembership: boolean,
	fpuDate: Date,
	area: string,
	areaId: number,
	isContributed: boolean
}

export interface ServerCredentials {
	app_type: string,
	uid: number
}

export interface AppCredentials {
	appType: string,
	uid: number
}