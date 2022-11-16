export declare class BroadcastChannelPolyfill {
    readonly name: string;
    closed: boolean;
    id: string;
    mc: MessageChannel;
    constructor(channel: string);
    private onStorage;
    postMessage: (message: any) => void;
    close: () => void;
    get onmessage(): ((this: MessagePort, ev: MessageEvent<any>) => any) | null;
    set onmessage(value: ((this: MessagePort, ev: MessageEvent<any>) => any) | null);
    addEventListener: (type: keyof MessagePortEventMap, listener: (this: MessagePort, evt: MessageEvent<any>) => void) => void;
    removeEventListener: (type: keyof MessagePortEventMap, listener: (this: MessagePort, evt: MessageEvent<any>) => void) => void;
    dispatchEvent: (evt: MessageEvent<any>) => boolean;
}
