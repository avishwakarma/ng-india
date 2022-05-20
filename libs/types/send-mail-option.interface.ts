import { ISendMailOptions } from "@nestjs-modules/mailer";

export type MailAttactment = {
  filename: string;
  path: string;
  cid: string;
  [key: string]: string;
};

export interface SendMailOption extends ISendMailOptions {
  attachments: Array<MailAttactment>;
}
