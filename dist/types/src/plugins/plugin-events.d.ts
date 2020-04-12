import { Plugin } from '../types';
import { EventsAPI, PrivateEventsAPI } from './events/events';
export { EventsAPI };
declare const EventsPlugin: Plugin<EventsAPI & PrivateEventsAPI>;
export default EventsPlugin;
