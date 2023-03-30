import { strict } from "assert";

// class of env, it's help to get env variable from env file
export default class Env {
  // main method
  get<T>(key: string, defaultValue: any = null, required: boolean = false) {
    const value = (process.env[key] || defaultValue) as T;
    if (required) {
      strict.ok(key, `The ${key} environment variable is required`);
    }
    return value;
  }

  // get with callback, you can customize variable
  get_cb<T>(key: string, callback: (value?: string) => T) {
    const value = process.env[key];
    return callback(value);
  }

  // you can get string type of variable
  str(key: string, defaultValue: any = null, required: boolean = false) {
    return this.get<string>(key, defaultValue, required);
  }

  // you can get boolean type of variable
  bool(key: string, defaultValue: any = null, required: boolean = false) {
    let strValue = this.get<string>(key, defaultValue, required).toLowerCase();

    strValue =
      !isNaN(strValue as never) &&
      strValue !== "0" &&
      strValue !== "" &&
      strValue !== "null" &&
      strValue !== "undefined"
        ? "1"
        : strValue;
    return strValue === "true" || strValue === "1" ? true : false;
  }

  // you can get number type variable
  num(key: string, defaultValue: any = null, required: boolean = false) {
    let strValue = this.get<string>(key, defaultValue, required);
    const n = Number(strValue);

    if (isNaN(n)) {
      strict.ok(strValue, `The ${strValue} you cannot convert number`);
    }

    return n;
  }

  // you can get array type variable
  array(
    key: string,
    defaultValue: any = null,
    delimiter = ",",
    required: boolean = false
  ) {
    let strValue = this.get<string>(key, defaultValue, required);

    if (typeof strValue === "string") {
      return strValue.split(delimiter);
    }
    return strValue;
  }
}
