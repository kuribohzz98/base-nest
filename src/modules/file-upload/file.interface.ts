export interface IFileUploadData {
	fieldname: string;
	originalname: string; // ex: '1486.jpg'
	encoding: string; // ex: '7bit'
	mimetype: string; // ex: 'image/jpg'
	buffer: Buffer;
	size: number;
}
