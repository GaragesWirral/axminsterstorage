export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let path = url.pathname;
    
    // Serve index.html for root path
    if (path === '/') {
      path = '/index.html';
    }

    try {
      return await env.ASSETS.fetch(new Request(new URL(path, request.url)));
    } catch (e) {
      return new Response(`${request.url} not found`, {
        status: 404,
        statusText: 'not found'
      });
    }
  }
}; 