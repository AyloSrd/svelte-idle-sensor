const channels = {};
export class BroadcastChannelPolyfill {
    name;
    closed = false;
    id;
    mc;
    constructor(channel) {
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
    onStorage = (evt) => {
        if (evt.storageArea !== window.localStorage)
            return;
        if (evt.newValue === null)
            return;
        if (evt.key?.substring(0, this.id.length) !== this.id)
            return;
        const data = JSON.parse(evt.newValue);
        this.mc.port2.postMessage(data);
    };
    // BroadcastChannel API
    postMessage = (message) => {
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
        channels[this.id].forEach((bc) => {
            if (bc === this)
                return;
            bc.mc.port2.postMessage(JSON.parse(value));
        });
    };
    close = () => {
        if (this.closed)
            return;
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
    addEventListener = (type, listener /*, useCapture*/) => {
        return this.mc.port1.addEventListener(type, listener);
    };
    removeEventListener = (type, listener /*, useCapture*/) => {
        return this.mc.port1.removeEventListener(type, listener);
    };
    dispatchEvent = (evt) => {
        return this.mc.port1.dispatchEvent(evt);
    };
}
