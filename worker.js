export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let path = url.pathname;
    
    // Serve index.html for root path
    if (path === '/') {
      path = '/index.html';
    }

    // Remove leading slash
    path = path.startsWith('/') ? path.slice(1) : path;

    try {
      // First try to fetch the exact path
      let response = await env.ASSETS.fetch(new Request(new URL(path, request.url)));
      
      // If not found, try to find the hashed version
      if (response.status === 404) {
        const assets = await env.ASSETS.list();
        const matchingAsset = assets.objects.find(asset => 
          asset.key.startsWith(path.split('.')[0]) && 
          asset.key.endsWith(path.split('.').pop())
        );
        
        if (matchingAsset) {
          response = await env.ASSETS.fetch(new Request(new URL(matchingAsset.key, request.url)));
        }
      }
      
      return response;
    } catch (e) {
      return new Response(`${request.url} not found`, {
        status: 404,
        statusText: 'not found'
      });
    }
  }
}; 