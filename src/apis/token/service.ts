import ms from "ms";
import jwt from "jsonwebtoken";
import Messages from "./message";
import createHttpError from "http-errors";
import { JWT } from "../../configs/settings";
import { UserDocument } from "../users/models";
import redisClient from "../../configs/redis-config";

interface Payload {
  [key: string]: any;
}

// toke class inherit to make other token provider class
class Token {
  declare lifeTime: string; // required, it's life of token
  declare secretKey: string; // required, it's secrete-key of token

  protected payload: Payload = {}; // payload of jwt optional

  // get of data a particular key from payload
  public get<T = any>(key: string, defaultValue?: T): T | undefined {
    return this.payload[key] || defaultValue;
  }

  // set data in payload
  public set(key: string, value: any): void {
    this.payload[key] = value;
  }

  // delete key and value from payload
  public delete(key: string): void {
    delete this.payload[key];
  }

  // static method, you can verify of given token
  static async verifyToken(token: string) {
    const instance = new this();

    if (token) {
      try {
        instance.payload = jwt.verify(token, instance.secretKey) as {
          [key: string]: any;
        };
      } catch (err: any) {
        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        throw createHttpError.Unauthorized(message);
      }
    }

    return instance;
  }

  // this method auto invoke, you instance inside String class
  toString() {
    return this.getToken();
  }

  // you can get new token
  getToken() {
    if (!this.lifeTime || !this.secretKey) {
      throw new Error("Cannot create token with no type or lifetime");
    }
    return jwt.sign(this.payload, this.secretKey, {
      expiresIn: this.lifeTime,
      issuer: JWT.issuer,
    });
  }

  // static method for user
  static forUser(user: UserDocument) {
    const token = new this();

    token.set("user_id", user.id);
    token.set("username", user.username);

    return token;
  }

  // reset some payload properties
  resetToken() {
    this.delete("iat");
    this.delete("exp");
    this.delete("iss");
  }
}

// AccessToken class
export class AccessToken extends Token {
  lifeTime = JWT.access_token_lifetime;
  secretKey = JWT.access_secret_key;
}

// RefreshToken class
export class RefreshToken extends Token {
  lifeTime = JWT.refresh_token_lifetime;
  secretKey = JWT.refresh_secret_key;

  no_copy_claims = ["iat", "exp"]; // no copy claim of refresh token on make access token

  static forUser(user: UserDocument) {
    return super.forUser.call(this, user) as RefreshToken;
  }

  // overwrite verifyToken static method
  static async verifyToken(token: string) {
    const refToken = (await super.verifyToken.call(
      this,
      token
    )) as RefreshToken;

    const userId = refToken.get("user_id");

    if (!userId) throw createHttpError.Unauthorized(Messages.INVALID_EXP_TOKEN);

    // check token exist in redis data base or not
    const result = await redisClient.GET(userId);

    // data not same throw error
    if (result !== token)
      throw createHttpError.Unauthorized(Messages.INVALID_EXP_TOKEN);

    return refToken;
  }

  getToken() {
    const token = super.getToken();

    redisClient.SETEX(this.payload.user_id, ms(this.lifeTime) / 1000, token);

    return token;
  }

  // custom method of RefreshToken class
  async blackList() {
    const userId = this.get("user_id");
    if (!userId) throw createHttpError.Unauthorized(Messages.INVALID_EXP_TOKEN);

    const result = await redisClient.DEL(userId);

    console.log(result);

    return { message: Messages.BLACK_LISTED };
  }

  // you can get access-token using accessToken property
  get accessToken() {
    const token = new AccessToken();

    Object.entries(this.payload).forEach(([claim, value]) => {
      if (this.no_copy_claims.includes(claim)) return;
      token.set(claim, value);
    });

    return token;
  }
}
