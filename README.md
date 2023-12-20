# cloudflare-r2-fetch-md5-worker

A Cloudflare Worker that returns MD5 in response headers.

## Detail

This is a worker that responds to `HEAD` request and presents `X-Object-MD5` in the Base16 string, and `Content-MD5` in the Base64 string.

MD5 comes from the Checksums of accessed objects, which for example `https://worker-workload.example.com/path/to/object` points to
object `path/to/object` in R2 Bucket.

## Usage

To deploy this worker, I don't have any idea how to make this job easy to do step-by-step.
But you can follow the following steps to deploy in your Cloudflare Workers.

1. Install `wrangler`, and log in with your Cloudflare account.
2. Clone this repository.
3. By reading [3. Bind your bucket to a Worker](https://developers.cloudflare.com/r2/api/workers/workers-api-usage/#3-bind-your-bucket-to-a-worker), edit `wrangler.toml` file with changing `account_id` and `bucket_name` to your values.
4. Deploy workers by typing `npx wrangler deploy` in the terminal in `root dir` of this repository.
5. Test your worker with for example typing `curl -X HEAD -v "https://your-worker-endpoint.example.com/path/to/object"` to get the response detail.

Do NOT change the value of `binding` in `wrangler.toml`, `WORKLOAD_BUCKET` has been declared in `worker-configuration.d.ts`.
