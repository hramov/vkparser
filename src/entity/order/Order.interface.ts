import { ServiceReply } from '../../interface/ServiceReply.interface';
import { OrderDto } from './Order.dto';

export interface OrderServiceReply extends ServiceReply {
	data: any;
}
