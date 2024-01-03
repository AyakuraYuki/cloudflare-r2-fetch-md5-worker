/**
 * worker main
 */

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// get object key from url, the `path` part without prefix `/` is the actual object key
		const url = new URL(request.url);
		const key = url.pathname.slice(1);

		// only support `HEAD` request
		switch (request.method) {
			case 'HEAD': {
				const object = await env.WORKLOAD_BUCKET.head(key);
				if (!object) {
					return new Response('Object Not Found', { status: 404 });
				}

				const headers = assembleHeaders(object);

				// try get md5 from checksums
				let md5 = object.checksums.toJSON().md5;
				if (md5) {
					headers.set('X-Object-MD5', md5);
					headers.set('Content-MD5', base16StringToBase64String(md5));
				}

				return new Response(null, {
					status: 200,
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

function assembleHeaders(object: R2Object): Headers {
	const headers = new Headers();
	object.writeHttpMetadata(headers);
	headers.set('etag', object.httpEtag);
	headers.set('Content-Length', object.size.toString());
	if (object.customMetadata) {
		for (let k in object.customMetadata) {
			headers.set(k, object.customMetadata[k]);
		}
	}
	return headers;
}

function base16StringToBase64String(raw: string): string {
	const bytes = new Uint8Array(raw.length / 2);
	for (let i = 0; i < raw.length; i += 2) {
		bytes[i / 2] = parseInt(raw.substring(i, i + 2), 16);
	}
	return btoa(String.fromCharCode.apply(null, bytes as unknown as number[]));
}
