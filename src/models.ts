export enum View {
	MembersList,
	MemberDetails
}

export interface Member {
	fullName: string,
	dateOfBirth: Date,
	citizenship: string,
	id: number,
	passport: string,
	address: string,
	phone: string,
	email: string,
	job: string,
	position: string,
	jobAddress: string,
	otherFederationMembership: boolean,
	fpuDate: Date,
	area: string,
	isContributed: boolean
}