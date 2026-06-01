// Negative (literal): a fully-literal algorithm name is never captured, so it must
// NOT produce a weak-crypto candidate. (This is the conservative-trade-off the
// catalogue documents: the high-signal literal `createHash("md5")` is not flagged.)
import * as crypto from "node:crypto";

export function digestStatic(data: string): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}
