type LinkData = {
    xuid: string,
    generatedAt: number
}

class LinkManager {
    private static pendingCodes: Map<string, LinkData> = new Map();

    public static generateCode(xuid: string): string {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase().replace(/O/g, '0').replace(/I/g, '1').replace(/B/g, '2').replace(/S/g, '5');
        this.pendingCodes.set(code, { xuid, generatedAt: Date.now() });
        return code;
    }

    public static hasCode(xuid: string): boolean {
        for (const data of this.pendingCodes.values()) {
            if (data.xuid === xuid) {
                if (Date.now() - data.generatedAt > 120000) {
                    this.pendingCodes.delete(data.xuid);
                    return false;
                }
                return true;
            }
        }
        return false;
    }

    public static checkCode(code: string): string | null {
        const data = this.pendingCodes.get(code);
        if (data) {
            this.pendingCodes.delete(code);
            if (Date.now() - data.generatedAt < 120000) return data.xuid;
        }
        return null;
    }

    public static removeCode(code: string): void {
        this.pendingCodes.delete(code);
    }
}

export { LinkManager }