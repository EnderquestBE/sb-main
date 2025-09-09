export * from "./Island/validifyName"

class Utils {
  private static readonly ROMAN_NUMERAL_MAP = new Map<number, string>([
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ]);

  public static readonly formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ].join(":");
  };

  public static readonly formatDuration = (s: number): string => {
    const d = Math.floor(s / 86400);
    const h = Math.floor((s %= 86400) / 3600);
    const m = Math.floor((s %= 3600) / 60);
    return `${d}d:${h}h:${m}m`
  };

  public static readonly formatString = (str: string) => {
    try {
      //@ts-ignore
      if (str.includes(":")) str = str.match(/:([\s\S]*)$/)[1];
      str = str
        .replace(/[\W_]/g, " ")
        .split(" ")
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      return str;
    } catch {
      return str;
    }
  }

  public static readonly formatInt = (value: number, fixed?: number) => {
    const types = ["", "k", "m", "b", "t", "qt"];
    if (value < 1e3) return value.toString();
    let logBase1000 = Math.log(value) / Math.log(1000);
    let selectType = Math.floor(logBase1000);
    let scaled = value / Math.pow(1000, selectType);
    let decimals = fixed ?? (scaled.toString().length > 6 ? 1 : 2);
    return Utils.truncateToDecimals(scaled, decimals) + types[selectType]!;
  }

  private static readonly truncateToDecimals = (number: number, decimals: number) => {
    const multiplier = Math.pow(10, decimals);
    return Math.floor(number * multiplier) / multiplier;
  }

  public static readonly intFromString = (value: string) => {
    const multipliers: { [key: string]: number } = {
      k: 1000,
      m: 1000000,
      b: 1000000000,
      t: 1000000000000,
      qt: 1000000000000000,
    };

    const match = value.toLowerCase().match(/(\d+\.?\d*)([kmbqt])?/);
    if (!match) { return NaN; }
    const numberPart = parseFloat(match[1]!);
    const suffix = match[2];

    if (isNaN(numberPart)) { return NaN; }

    if (suffix && multipliers[suffix] !== undefined) {
      return numberPart * multipliers[suffix];
    }

    return numberPart;
  }

  public static readonly randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  public static readonly toRomanNumeral = (num: number) => {
    if (isNaN(num)) return "NaN";
    if (num <= 0) return "";

    let result = "";
    for (const [value, numeral] of Utils.ROMAN_NUMERAL_MAP) {
      while (num >= value) {
        result += numeral;
        num -= value;
      }
    }
    return result;
  }

  public static stripColorCodes(text: string): string {
    return text.replace(/§./g, '');
  }
}

export { Utils }