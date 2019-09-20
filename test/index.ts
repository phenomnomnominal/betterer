import { mute } from '../src/logger';

mute();
console.log = () => {};
