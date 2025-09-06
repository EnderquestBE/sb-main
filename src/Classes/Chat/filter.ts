import { filteredWords } from "../../Configuration/config"

class Filter {
  private static readonly exp = new RegExp(`\\b(${filteredWords})\\b`, "gi")

  public static contains(str: string) {
    return this.exp.test(str)
  }
  public static censor(str: string) {
    return str.replace(this.exp, (word) => {
      return '*'.repeat(word.length);
    });
  }
}

export { Filter }