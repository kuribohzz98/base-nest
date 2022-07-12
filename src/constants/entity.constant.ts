export enum ETableName {
	USER = 'users',
	USER_INFO = 'user_info',
	ADMIN = 'admins',
	ADMIN_ROLE = 'admin_roles',
	ADMIN_FUNCTION = 'admin_functions',
	ADMIN_PERMISSION = 'admin_permissions',
}

export enum EUserType {
	USER = 1,
	BUSINESSMAN,
}

export enum EGender {
	FEMALE = 1,
	MALE,
	OTHER,
}

export enum EAdminType {
	ADMIN = 1,
	SUB_ADMIN,
}

export enum EPermission {
	NONE,
	VIEW,
	UPDATE,
}
