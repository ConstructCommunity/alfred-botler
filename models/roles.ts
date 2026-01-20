export default interface Role {
	id: string;
	displayName: string;
	shortName?: string;
	requireApplication: boolean;
	hideInList?: boolean;
	description?: string;
	pingable?: boolean;
	prefix?: string;
}
