import { ServiceReply } from '../../interface/ServiceReply.interface';
import { UserDto } from './User.dto';

export interface UserServiceReply extends ServiceReply {
	data: Array<UserDto> | null;
}
