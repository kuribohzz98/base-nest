import { registerAs } from '@nestjs/config';

export default registerAs('third-party', () => ({
	fb: {
		apiUrl: 'https://graph.facebook.com/v10.0/me',
	},
	google: {
		apiUrl: 'https://oauth2.googleapis.com/tokeninfo',
	},
	twitter: {
		apiUrl: 'https://api.twitter.com/2/users',
	},
}));
