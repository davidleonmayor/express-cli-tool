type Command = string | (() => unknown | Promise<unknown>);
export declare const runCommandWithBuilder: (command: Command) => Promise<void>;
export {};
