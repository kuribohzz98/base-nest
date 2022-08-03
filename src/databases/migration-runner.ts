import { exec } from 'child_process';

import { migrationDir } from '~/ormconfig';

exec(`typeorm migration:create ${migrationDir}/${process.argv[2]}`, (error, stdout, stderr) => {
	if (error) {
		console.log(`error: ${error.message}`);
		return;
	}
	if (stderr) {
		console.log(`stderr: ${stderr}`);
		return;
	}
	console.log(`${stdout}`);
});
