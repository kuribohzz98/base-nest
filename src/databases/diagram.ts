import { EOL } from 'os';
import { Colors, Direction, Flags, Format, TypeormUml } from 'typeorm-uml';

import datasource from './data-source';

(async () => {
	const flags: Flags = {
		direction: Direction.TB,
		format: Format.SVG,
		handwritten: false,
		colors: new Map<keyof Colors, string>([
			['column', '#000000'],
			['class.BackgroundColor', '#e8f9fc'],
			['class.ArrowColor', '#0d4d59'],
			['class.BorderColor', '#000000'],
		]),
	};

	const typeormUml = new TypeormUml();
	const url = await typeormUml.build(datasource, flags);

	process.stdout.write('Diagram URL: ' + url + EOL);
})();
