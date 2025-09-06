import { CustomEnum } from "@serenityjs/core";

class CreateEnum extends CustomEnum {
  public static readonly identifier = "create";
  public static readonly options = ["create"];
}

class DeleteEnum extends CustomEnum {
  public static readonly identifier = "delete";
  public static readonly options = ["delete"];
}

export { CreateEnum, DeleteEnum };