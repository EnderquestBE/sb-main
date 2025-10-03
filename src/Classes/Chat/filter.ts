import { filteredWords, strictFilteredWords } from "../../Configuration/config"

class Filter {
  private static readonly strictExp = new RegExp(strictFilteredWords, "gi");

  private static readonly exp = new RegExp(`\\b(${filteredWords})\\b`, "gi")

  public static contains(str: string): boolean {
    return this.strictExp.test(str) || this.exp.test(str);
  }

  public static censor(str: string) {
    return str.replace(this.strictExp, (word) => {
      return '*'.repeat(word.length);
    }).replace(this.exp, (word) => {
      return '*'.repeat(word.length);
    })
  }
}

export { Filter }