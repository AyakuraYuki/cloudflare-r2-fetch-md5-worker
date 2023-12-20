/**
 * worker main
 */

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		const key = url.pathname.slice(1);

		switch (request.method) {
			case 'HEAD': {
				const object = await env.WORKLOAD_BUCKET.get(key);
				if (!object) {
					return new Response('Object Not Found', { status: 404 });
				}

				const headers = new Headers();
				object.writeHttpMetadata(headers);
				headers.set('etag', object.httpEtag);

				let md5 = object.checksums.toJSON().md5;
				if (!md5) {
					md5 = '';
				}
				headers.set('X-Object-MD5', md5);

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
