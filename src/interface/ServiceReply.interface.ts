import { ValidationError } from 'class-validator';

export interface ServiceReply {
	status: boolean;
	error: Error | ValidationError[] | null;
}
