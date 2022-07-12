import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SES } from 'aws-sdk';
import * as ejs from 'ejs';
import { join } from 'path';

import { EEnvKey } from '@constants/env.constant';

import { awsHelper } from '@shared/helpers/aws.helper';

import { EMailSubject } from './mail.constant';
import { IMailExample, IMailForgotPasswordVerify, IMailRegisterVerify } from './mail.interface';

@Injectable()
export class MailService {
	private readonly logger = new Logger(this.constructor.name);

	constructor(private readonly configService: ConfigService) {}

	private async sendMail(
		toAddress: string | string[],
		subject: EMailSubject,
		fileNameTemplate: string,
		data?: ejs.Data,
		bcc?: string | string[],
	) {
		try {
			const messageBody = await ejs.renderFile(
				join(__dirname, '../../../', `templates/${fileNameTemplate}.ejs`),
				data,
			);

			const ToAddresses = typeof toAddress === 'string' ? [toAddress] : toAddress;
			const BccAddresses = typeof bcc === 'string' ? [bcc] : bcc;

			const params: SES.SendEmailRequest = {
				Destination: { ToAddresses, BccAddresses },
				Message: {
					Subject: { Charset: 'UTF-8', Data: subject },
					Body: { Html: { Charset: 'UTF-8', Data: messageBody } },
				},
				Source: this.configService.get<string>(EEnvKey.AWS_SES_SEND_FROM),
			};
			await awsHelper.ses.sendEmail(params).promise();
		} catch (error) {
			this.logger.error(error?.message || error);
		}
	}

	sendExampleMail(toAddress: string, data?: IMailExample, bcc?: string | string[]) {
		return this.sendMail(toAddress, EMailSubject.Example, 'example-email', data, bcc);
	}

	sendRegisterVerify(toAddress: string, data?: IMailRegisterVerify) {
		return this.sendMail(toAddress, EMailSubject.REGISTER_VERIFY, 'register-verify', data);
	}

	sendForgotPasswordVerify(toAddress: string, data?: IMailForgotPasswordVerify) {
		return this.sendMail(toAddress, EMailSubject.FORGOT_PASSWORD_VERIFY, 'forgot-password-verify', data);
	}
}
