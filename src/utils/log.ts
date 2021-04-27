class Logger {
    public info(...args: any[]) {
        console.info(...args);
    }
    public error(...args: any[]) {
        console.error(...args);
    }
}
export const log = new Logger();
