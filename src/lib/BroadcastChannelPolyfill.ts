const channels: { [id: string]: BroadcastChannelPolyfill[] } = {};

export class BroadcastChannelPolyfill {
	public readonly name: string;

	closed = false;
	id: string;
	mc: MessageChannel;

	constructor(channel: string) {
		const id = '$BroadcastChannel$' + channel + '$';

		channels[id] = channels[id] || [];
		channels[id].push(this);

		this.name = channel;
		this.id = '$BroadcastChannel$' + channel + '$';
		this.closed = false;
		this.mc = new MessageChannel();
		this.mc.port1.start();
		this.mc.port2.start();

		window.addEventListener('storage', this.onStorage);
	}

	private onStorage = (evt: StorageEvent) => {
		if (evt.storageArea !== window.localStorage) return;
		if (evt.newValue === null) return;
		if (evt.key?.substring(0, this.id.length) !== this.id) return;
		const data = JSON.parse(evt.newValue);
		this.mc.port2.postMessage(data);
	};

	// BroadcastChannel API
	public postMessage = (message: any) => {
		if (this.closed) {
			const err = new Error();
			err.name = 'InvalidStateError';
			throw err;
		}
		const value = JSON.stringify(message);

		// Broadcast to other contexts via storage events...
		const key = this.id + String(Date.now()) + '$' + String(Math.random());
		window.localStorage.setItem(key, value);
		setTimeout(() => {
			window.localStorage.removeItem(key);
		}, 500);

		// Broadcast to current context via ports
		channels[this.id].forEach((bc: BroadcastChannelPolyfill) => {
			if (bc === this) return;
			bc.mc.port2.postMessage(JSON.parse(value));
		});
	};

	close = () => {
		if (this.closed) return;
		this.closed = true;
		this.mc.port1.close();
		this.mc.port2.close();

		window.removeEventListener('storage', this.onStorage);

		const index = channels[this.id].indexOf(this);
		channels[this.id].splice(index, 1);
	};

	// EventTarget API
	get onmessage() {
		return this.mc.port1.onmessage;
	}
	set onmessage(value) {
		this.mc.port1.onmessage = value;
	}

	public addEventListener = (
		type: keyof MessagePortEventMap,
		listener: (this: MessagePort, evt: MessageEvent<any>) => void /*, useCapture*/
	) => {
		return this.mc.port1.addEventListener(type, listener);
	};

	public removeEventListener = (
		type: keyof MessagePortEventMap,
		listener: (this: MessagePort, evt: MessageEvent<any>) => void /*, useCapture*/
	) => {
		return this.mc.port1.removeEventListener(type, listener);
	};

	public dispatchEvent = (evt: MessageEvent<any>) => {
		return this.mc.port1.dispatchEvent(evt);
	};
}
