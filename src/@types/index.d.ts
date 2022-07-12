import { IJwtPayload } from '@shared/interfaces/authentication.interface';

declare global {
	namespace Express {
		// eslint-disable-next-line @typescript-eslint/no-empty-interface
		interface User extends IJwtPayload {}
	}
}
