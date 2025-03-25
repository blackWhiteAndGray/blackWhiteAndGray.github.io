import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler'

/**
 * 在网站根路径下的资源文件列表
 * @param {string} pathname
 */
const fileExtensionRegexp = /\.([a-zA-Z0-9]+)$/

/**
 * 处理网站请求的主函数
 */
async function handleEvent(event) {
  const { request } = event

  // 获取请求的URL
  const url = new URL(request.url)
  let options = {}

  try {
    // 尝试从KV存储获取资源
    const page = await getAssetFromKV(event, options)

    // 允许资源被浏览器缓存30天
    const cacheControl = 'public, max-age=2592000'
    
    // 为响应添加缓存控制头
    let response = new Response(page.body, page)
    response.headers.set('Cache-Control', cacheControl)
    
    return response
  } catch (e) {
    // 如果资源不存在，返回自定义404页面
    try {
      let notFoundResponse = await getAssetFromKV(event, {
        mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/404.html`, req),
      })

      return new Response(notFoundResponse.body, {
        ...notFoundResponse,
        status: 404,
      })
    } catch (e) {
      // 如果404页面也不存在，返回纯文本404消息
      return new Response('404 - 页面未找到', { status: 404 })
    }
  }
}

// 监听fetch事件，处理所有请求
addEventListener('fetch', event => {
  try {
    event.respondWith(handleEvent(event))
  } catch (e) {
    // 如果发生错误，返回500错误
    event.respondWith(new Response('发生内部错误', { status: 500 }))
  }
})
