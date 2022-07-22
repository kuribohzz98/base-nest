import { AuthModule } from './auth/auth.module';
import { FileUploadModule } from './file/file.module';
import { MailModule } from './mail/mail.module';

export const MODULES = [MailModule, AuthModule, FileUploadModule];
