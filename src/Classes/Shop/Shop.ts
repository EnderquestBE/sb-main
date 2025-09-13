import { Logger, LoggerColors } from "@serenityjs/logger";

class Shop {
  public static readonly logger = new Logger(
    "Shop",
    LoggerColors.MaterialDiamond
  );
}

export { Shop };
