import { UserDto } from './User.dto';

export function RegisterValidation(client: UserDto) {
	if (!client || !client.email || !client.password) {
		return false;
	}
	return true;
}
