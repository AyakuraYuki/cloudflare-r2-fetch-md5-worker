# cloudflare-r2-fetch-md5-worker

A Cloudflare Worker that returns MD5 in response headers.

## Detail

This is a worker that responses to `Head` request, presents `X-Object-MD5` in Base16 string, and `Content-MD5` in Base64 string.

MD5 comes from the Checksums of accessed object, which for example `https://worker-workload.example.com/path/to/object` points to
object `path/to/object` in R2 Bucket.
