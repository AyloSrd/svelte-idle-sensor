export declare function onTabActivity(channelKey: string, handleTabActivity: (evt: CustomEvent<{
    isMainTab: boolean;
}>) => void): () => void;
