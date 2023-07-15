export enum View {
	MembersList,
	MemberDetails
}

export interface Member {
	memberId: number,
	fullName: string,
	dateOfBirth: Date,
	citizenship: string,
	id?: string,
	passport: string,
	address: string,
	phone: string,
	email: string,
	job: string,
	position: string,
	jobAddress: string,
	otherFederationMembership: boolean,
	fpuDate: Date,
	lastAlterEventDate?: Date,
	reFpuDate?: Date,
	area: string,
	areaId: number,
	isContributed: boolean,
	class?: string,
	rank?: string,
	refereeCategory?: string
}

export interface Membership {
	memberId: number,
	fullName: string,
	dateOfBirth: Date,
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

export interface Region {
	id: number,
	name: string
}

export interface ChangeContributionStatusModel {
	memberId: number,
	isContributed: boolean,
	year: number
}

export interface DeleteMemberModel {
	memberId: number
}

export interface Filter {
	year: number,
	areaId: number,
	onlyReferees: boolean,
	yearOfBirth: number
}