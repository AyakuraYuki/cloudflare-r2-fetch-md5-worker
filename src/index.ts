/**
 * worker main
 */

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		const key = url.pathname.slice(1);

		switch (request.method) {
			case 'HEAD': {
				const object = await env.WORKLOAD_BUCKET.head(key);
				if (!object) {
					return new Response('Object Not Found', { status: 404 });
				}

				const headers = new Headers();
				object.writeHttpMetadata(headers);
				headers.set('etag', object.httpEtag);
				headers.set('Content-Length', object.size.toString());
				if (object.customMetadata) {
					for (let k in object.customMetadata) {
						headers.set(k, object.customMetadata[k]);
					}
				}

				// get md5 from object checksums
				let md5 = object.checksums.toJSON().md5;
				if (md5) {
					headers.set('X-Object-MD5', md5);

					const bytes = new Uint8Array(md5.length / 2);
					for (let i = 0; i < md5.length; i += 2) {
						bytes[i / 2] = parseInt(md5.substring(i, i + 2), 16);
					}
					const b64 = btoa(String.fromCharCode.apply(null, bytes as unknown as number[]));
					headers.set('Content-MD5', b64);
				}

				return new Response(null, {
					headers
				});
			}
			default: {
				return new Response('Method Not Allowed', {
					status: 405,
					headers: {
						Allow: 'HEAD'
					}
				});
			}
		}
	}
};
