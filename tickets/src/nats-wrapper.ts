import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  // Tell Typescript that this property might be undefined for some periods of time.
  private _client?: Stan;

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this._client?.on("connect", () => {
        console.log("Connected to NATS");
        resolve();
      });
      this._client?.on("error", (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
