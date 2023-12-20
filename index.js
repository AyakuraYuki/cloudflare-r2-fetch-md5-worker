/**
 * worker main
 */

export default {
	async fetch(request, env) {
		const url = new URL(request.url)
		const key = url.pathname.slice(1)

		switch (request.method) {
			case 'HEAD':
				const object = await env.WORKLOAD_BUCKET.head(key)
				if (object === null) {
					return new Response('Object Not Found', { status: 404 })
				}

				const headers = new Headers()
				object.writeHttpMetadata(headers)
				headers.set('etag', object.httpEtag)

				return new Response(null, {
					headers
				})

			default:
				return new Response('Method Not Allowed', {
					status: 405,
					headers: {
						Allow: 'HEAD'
					}
				})
		}
	}
}
