---
title: HTTP
description: HTTP协议和TCP协议
---

# HTTP协议和TCP协议

![image-20240819175010258](https://p.ipic.vip/sktfje.png)

#### 1. 长链接

![image-20240819175110412](https://p.ipic.vip/vb4id1.png)

![image-20240819175129217](https://p.ipic.vip/2qe07p.png)

#### 2. 管线化

![image-20240819175440916](https://p.ipic.vip/gikug1.png)

#### 3. URI和URL

- URI

> URI(Uniform Resource Identifier)是统一资源标识符,在某个规则下能把这个资源独一无二标示出来，比如人的身份证号

##### URI

URI(Uniform Resource Identifier)是统一资源标识符,在某个规则下能把这个资源独一无二标示出来，比如人的身份证号

- Uniform 不用根据上下文来识别资源指定的访问方式
- Resource 可以标识的任何东西
- Identifier 表示可标识的对象

##### URL

统一资源定位符，表示资源的地点，URL时使用浏览器访问WEB页面时需要输入的网页地址

- Uniform 不用根据上下文来识别资源指定的访问方式
- Resource 可以标识的任何东西
- Location 定位

`URL格式`

![image-20240819180059660](https://p.ipic.vip/o3zqdj.png)

- 协议类型
- 登录信息
- 服务器地址
- 服务器端口号
- 带层次的文件路径
- 查询字符串
- 片段标识符

## HTTP

- 请求的一方叫客户端，响应的一方叫服务器端
- 通过请求和响应达成通信
- HTTP是一种不保存状态的协议

#### 1. 请求报文

![image-20240819180204294](https://p.ipic.vip/4q7pa4.png)

![image-20240819180229501](https://p.ipic.vip/8tzqk6.png)

请求行

- 方法
  - GET 获取资源
  - POST 向服务器端发送数据，传输实体主体
  - PUT 传输文件
  - HEAD 获取报文首部
  - DELETE 删除文件
  - OPTIONS 询问支持的方法
  - TRACE 追踪路径
  - 协议/版本号
  - URL

![image-20240819180248061](https://p.ipic.vip/gv4geq.png)

请求头

- 通用首部(General Header)
- 请求首部(Request Header)
- 响应首部(Response Header)
- 实体首部(Entity Header Fields)

请求体

#### 2. 响应报文

![image-20240819180518497](https://p.ipic.vip/jqk3yy.png)

- 响应行
- 响应头
- 响应体

#### 4. 编码压缩

> HTTP可以在传输的过程中通过编码提升传输效率，但是会消耗更多的CPU时间。

- 发送文件时可以先压缩再发送文件
- 压缩方式
  - gzip
  - compress
  - deflate
  - identify

![image-20240819180814810](https://p.ipic.vip/i56q5y.png)

#### 5. 分割发送的分块传输编码

> 请求的实体在尚未传输完成前浏览器不能显示。所以在传输大容量数据时，通过把数据分割成多块，能让浏览器逐步显示页面。

![image-20240819181232752](https://p.ipic.vip/zq8965.png)

#### 6. 多部分对象集合

- 一份报文主体中可以包含多类型实体。
- 使用boundary字符串来划分多部分对象指明的各类实体。在各个实体起始行之前插入**--**标记,多部分对象集合最后插入**--**标记

![image-20240819181318864](https://p.ipic.vip/zv4pr9.png)

- 上传表单时使用multiparty/form-data
- 状态码(Partical Content)响应报文中包含多个范围时使用

#### 7. 获取部分内容的范围请求

> 为了实现中断恢复下载的需求，需要能下载指定下载的实体范围

- 请求头中的Range来指定 资源的byte范围
- 响应会返回状态码206响应报文
- 对于多重范围的范围请求，响应会在首部字段`Content-Type`中标明`multipart/byteranges`

![image-20240819181446424](https://p.ipic.vip/gv9qce.png)

![image-20240819181505242](https://p.ipic.vip/kmnett.png)

#### 8. 内容协商

- 首部字段
  - Accept
  - Accept-Charset
  - Accept-Encoding
  - Accept-Language
  - Content-Language
- 协商类型
  - 服务器驱动
  - 客户端驱动协商
  - 透明协商

#### 9. 状态码

> 状态码负责表示客户端请求的返回结果、标记服务器端是否正常、通知出现的错误

##### 状态码类别

| 类别 | 原因短语                       |     |
| :--- | :----------------------------- | --- |
| 1XX  | Informational(信息性状态码)    |     |
| 2XX  | Success(成功状态码)            |     |
| 3XX  | Redirection(重定向)            |     |
| 4XX  | Client Error(客户端错误状态码) |     |
| 5XX  | Server Error(服务器错误状态吗) |     |

##### 2XX 成功

- 200(OK 客户端发过来的数据被正常处理
- 204(Not Content 正常响应，没有实体
- 206(Partial Content 范围请求，返回部分数据，响应报文中由Content-Range指定实体内容

##### 3XX 重定向

- 301(Moved Permanently) 永久重定向
- 302(Found) 临时重定向，规范要求方法名不变，但是都会改变
- 303(See Other) 和302类似，但必须用GET方法
- 304(Not Modified) 状态未改变 配合(If-Match、If-Modified-Since、If-None_Match、If-Range、If-Unmodified-Since)
- 307(Temporary Redirect) 临时重定向，不该改变请求方法

##### 4XX 客户端错误

- 400(Bad Request) 请求报文语法错误
- 401 (unauthorized) 需要认证
- 403(Forbidden) 服务器拒绝访问对应的资源
- 404(Not Found) 服务器上无法找到资源

##### 5XX 服务器端错误

- 500(Internal Server Error)服务器故障
- 503(Service Unavailable) 服务器处于超负载或正在停机维护

#### 10. web服务器

- 代理：代理就是客户端和服务器的中间人

  ![image-20240819181900204](https://p.ipic.vip/f9b50a.png)

- 网关：接收从客户端发送来的数据时，会转发给其他服务器处理，再由自己返回

  ![image-20240819181920735](https://p.ipic.vip/vmu16i.png)

## 首部

#### 通用首部字段

| 首部字段名       | 说明                       |
| :--------------- | :------------------------- |
| Cache-Control    | 控制缓存行为               |
| Connection       | 链接的管理                 |
| Date             | 报文日期                   |
| Pragma           | 报文指令                   |
| Trailer          | 报文尾部的首部             |
| Trasfer-Encoding | 指定报文主体的传输编码方式 |
| Upgrade          | 升级为其他协议             |
| Via              | 代理服务器信息             |
| Warning          | 错误通知                   |

#### 请求首部字段

| 首部字段名          | 说明                                        |
| :------------------ | :------------------------------------------ |
| Accept              | 用户代理可处理的媒体类型                    |
| Accept-Charset      | 优先的字符集                                |
| Accept-Encoding     | 优先的编码                                  |
| Accept-Langulage    | 优先的语言                                  |
| Authorization       | Web认证信息                                 |
| Expect              | 期待服务器的特定行为                        |
| From                | 用户的电子邮箱地址                          |
| Host                | 请求资源所在的服务器                        |
| If-Match            | 比较实体标记                                |
| If-Modified-Since   | 比较资源的更新时间                          |
| If-None-Match       | 比较实体标记                                |
| If-Range            | 资源未更新时发送实体Byte的范围请求          |
| If-Unmodified-Since | 比较资源的更新时间(和If-Modified-Since相反) |
| Max-Forwards        | 最大传输跳数                                |
| Proxy-Authorization | 代理服务器需要客户端认证                    |
| Range               | 实体字节范围请求                            |
| Referer             | 请求中的URI的原始获取方                     |
| TE                  | 传输编码的优先级                            |
| User-Agent          | HTTP客户端程序的信息                        |

#### 响应首部字段

| 首部字段名         | 说明                         |
| :----------------- | :--------------------------- |
| Accept-Ranges      | 是否接受字节范围             |
| Age                | 资源的创建时间               |
| ETag               | 资源的匹配信息               |
| Location           | 客户端重定向至指定的URI      |
| Proxy-Authenticate | 代理服务器对客户端的认证信息 |
| Retry-After        | 再次发送请求的时机           |
| Server             | 服务器的信息                 |
| Vary               | 代理服务器缓存的管理信息     |
| www-Authenticate   | 服务器对客户端的认证         |

#### 实体首部字段

| 首部字段名       | 说明                       |
| :--------------- | :------------------------- |
| Allow            | 资源可支持的HTTP方法       |
| Content-Encoding | 实体的编码方式             |
| Content-Language | 实体的自然语言             |
| Content-Length   | 实体的内容大小(字节为单位) |
| Content-Location | 替代对应资源的URI          |
| Content-MD5      | 实体的报文摘要             |
| Content-Range    | 实体的位置范围             |
| Content-Type     | 实体主体的媒体类型         |
| Expires          | 实体过期时间               |
| Last-Modified    | 资源的最后修改时间         |

## 开发HTTP服务器

### 1. HTTP服务器

HTTP全称是超文本传输协议，构建于TCP之上，属于应用层协议。

#### 1.1 创建HTTP服务器

```javascript
let server = http.createServer([requestListener])
server.on('request', requestListener)
```

- requestListener 当服务器收到客户端的连接后执行的处理
  - http.IncomingMessage 请求对象
  - http.ServerResponse对象 服务器端响应对象

#### 1.2 启动HTTP服务器

```javascript
server.listen(port, [host], [backlog], [callback])
server.on('listening', callback)
```

- port 监听的端口号
- host 监听的地址
- backlog 指定位于等待队列中的客户端连接数

```javascript
let http = require('http')
let server = http
  .createServer(function (req, res) {})
  .listen(8080, '127.0.0.1', function () {
    console.log('服务器端开始监听!')
  })
```

#### 1.3 关闭HTTP服务器

```javascript
server.close()
server.on('close', function () {})
let http = require('http')
let server = http.createServer(function (req, res) {})
server.on('close', function () {
  console.log('服务器关闭')
})
server.listen(8080, '127.0.0.1', function () {
  console.log('服务器端开始监听!')
  server.close()
})
```

#### 1.4 监听服务器错误

```javascript
server.on('error',function(){
    if(e.code == 'EADDRINUSE'){
         console.log('端口号已经被占用!);
    }
});
```

#### 1.5 connection

```javascript
let server = http.createServer(function (req, res) {})
server.on('connection', function () {
  console.log(客户端连接已经建立)
})
```

#### 1.6 setTimeout

设置超时时间，超时后不可再复用已经建立的连接，需要发请求需要重新建立连接。默认超时时间时2分钟

```javascript
server.setTimeout(msecs, callback)
server.on('timeout', function () {
  console.log('连接已经超时')
})
```

#### 1.7 获取客户端请求信息

- request

  - method 请求的方法

  - url 请求的路径

  - headers 请求头对象

  - httpVersion 客户端的http版本

  - socket 监听客户端请求的socket对象

    ```javascript
    let http = require('http');
    let fs = require('fs');
    let server = http.createServer(function(req,res){
    if(req.url != '/favicon.ico'){
    let out = fs.createWriteStream(path.join(__dirname,'request.log'));
    out.write('method='+req.method);
    out.write('url='+req.url);
    out.write('headers='+JSON.stringify(req.headers));
    out.write('httpVersion='+req.httpVersion);
    }
    }).listen(8080,'127.0.0.1);
    ```

```javascript
let http = require('http');
let fs = require('fs');
let server = http.createServer(function(req,res){
  let body = [];
  req.on('data',function(data){
    body.push(data);
  });
  req.on('end',function(){
      let result = Buffer.concat(body);
      console.log(result.toString());
  });
}).listen(8080,'127.0.0.1);
```

#### 1.8 querystring

querystring模块用来转换URL字符串和URL中的查询字符串

#### 1.8.1 parse方法用来把字符串转换成对象

```javascript
querystring.parse(str, [sep], [eq], [options])
```

#### 1.8.2 stringify方法用来把对象转换成字符串

```javascript
querystring.stringify(obj, [sep], [eq])
```

#### 1.9 querystring

```javascript
url.parse(urlStr, [parseQueryString])
```

- href 被转换的原URL字符串
- protocal 客户端发出请求时使用的协议
- slashes 在协议与路径之间是否使用了//分隔符
- host URL字符串中的完整地址和端口号
- auth URL字符串中的认证部分
- hostname URL字符串中的完整地址
- port URL字符串中的端口号
- pathname URL字符串的路径，不包含查询字符串
- search 查询字符串，包含?
- path 路径，包含查询字符串
- query 查询字符串，不包含起始字符串`?`
- hash 散列字符串，包含`#`

#### 1.10 发送服务器响应流

http.ServerResponse对象表示响应对象

- 1.10.1 writeHead

```javascript
response.writeHead(statusCode, [reasonPhrase], [headers])
```

- content-type 内容类型
- location 将客户端重定向到另外一个URL地址
- content-disposition 指定一个被下载的文件名
- content-length 服务器响应内容的字节数
- set-cookie 在客户端创建Cookie
- content-encoding 指定服务器响应内容的编码方式
- cache-cache 开启缓存机制
- expires 用于制定缓存过期时间
- etag 指定当服务器响应内容没有变化不重新下载数据

- 1.10.2 Header

设置、获取和删除Header

```javascript
response.setHeader('Content-Type','text/html;charset=utf-8');
response.getHeader('Content-Type');
response.removeHeader('Content-Type');
response.headersSent 判断响应头是否已经发送
```

- 1.10.3 headersSent

判断响应头是否已经发送

```javascript
let http = require('http');
let server = http.createServer(function(req,res){
  console.log(resopnse.headersSent?"响应头已经发送":"响应头未发送!");
  res.writeHead(200,'ok);
  console.log(resopnse.headersSent?"响应头已经发送":"响应头未发送!");
});
```

- 1.10.4 sendDate

不发送Date

```javascript
res.sendDate = false
```

- 1.10.5 write

可以使用write方法发送响应内容

```javascript
response.write(chunk, [encoding])
response.end([chunk], [encoding])
```

- 1.10.6 timeout

可以使用setTimeout方法设置响应让超时时间，如果在指定时间内不响应，则触发timeout事件

```javascript
response.setTimeout(msecs, [callback])
response.on('timeout', callback)
```

- 1.10.7 close

在响应对象的end方法被调用之前，如果连接中断，将触发http.ServerResponse对象的close事件

```javascript
response.on('close', callback)
```

- 1.10.8 parser

```javascript
net
onconnection

_http_server.js
连接监听
connectionListenerInternal
socketOnData
onParserExecuteCommon
parserOnIncoming
```

### 2. HTTP客户端

#### 2.1 向其他网站请求数据

```javascript
let req = http.request(options, callback)
req.on('request', callback)
request.write(chunk, [encoding])
request.end([chunk], [encoding])
```

- host 指定目标域名或主机名
- hostname 指定目标域名或主机名，如果和host都指定了，优先使用hostname
- port 指定目标服务器的端口号
- localAddress 本地接口
- socketPath 指定Unix域端口
- method 指定HTTP请求的方式
- path 指定请求路径和查询字符串
- headers 指定客户端请求头对象
- auth 指定认证部分
- agent 用于指定HTTP代理，在Node.js中，使用http.Agent类代表一个HTTP代理，默认使用keep-alive连接，同时使用http.Agent对象来实现所有的HTTP客户端请求

```javascript
let http = require('http')
let options = {
  hostname: 'localhost',
  port: 8080,
  path: '/',
  method: 'GET'
}
let req = http.request(options, function (res) {
  console.log('状态吗:' + res.statusCode)
  console.log('响应头:' + JSON.stringify(res.headers))
  res.setEncoding('utf8')
  res.on('data', function (chunk) {
    console.log('响应内容', chunk)
  })
})
req.end()
```

#### 2.2 取消请求

可以使用abort方法来终止本次请求

```javascript
req.abort()
```

#### 2.3 监听error事件

如果请求过程中出错了，会触发error事件

```javascripot
request.on('error',function(err){});
```

#### 2.4 socket

建立连接过程中，为该连接分配端口时，触发`socket`事件

```javascript
req.on('socket', function (socket) {
  socket.setTimeout(1000)
  socket.on('timeout', function () {
    req.abort()
  })
})
```

#### 2.5 get

可以使用get方法向服务器发送数据

```javascript
http.get(options, callback)
```

#### 2.6 addTrailers

可以使用response对象的addTrailers方法在服务器响应尾部追加一个头信息

```javascript
let http = require('http')
let path = require('path')
let crypto = require('crypto')

let server = http
  .createServer(function (req, res) {
    res.writeHead(200, {
      'Transfer-Encoding': 'chunked',
      Trailer: 'Content-MD5'
    })
    let rs = require('fs').createReadStream(path.join(__dirname, 'msg.txt'), {
      highWaterMark: 2
    })
    let md5 = crypto.createHash('md5')
    rs.on('data', function (data) {
      console.log(data)
      res.write(data)
      md5.update(data)
    })
    rs.on('end', function () {
      res.addTrailers({
        'Content-MD5': md5.digest('hex')
      })
      res.end()
    })
  })
  .listen(8080)
let http = require('http')
let options = {
  hostname: 'localhost',
  port: 8080,
  path: '/',
  method: 'GET'
}
let req = http.request(options, function (res) {
  console.log('状态吗:' + res.statusCode)
  console.log('响应头:' + JSON.stringify(res.headers))
  res.setEncoding('utf8')
  res.on('data', function (chunk) {
    console.log('响应内容', chunk)
  })
  res.on('end', function () {
    console.log('trailer', res.trailers)
  })
})
req.end()
```

#### 2.7 制作代理服务器

```javascript
let http = require('http')
let url = require('url')
let server = http
  .createServer(function (request, response) {
    let { path } = url.parse(request.url)
    let options = {
      host: 'localhost',
      port: 9090,
      path: path,
      headers: request.headers
    }
    let req = http.get(options, function (res) {
      console.log(res)
      response.writeHead(res.statusCode, res.headers)
      res.pipe(response)
    })
    req.on('error', function (err) {
      console.log(err)
    })
    request.pipe(req)
  })
  .listen(8080)
```

## HTTPS

### 1. http通信问题

- 可能被窃听

  - HTTP 本身不具备加密的功能,HTTP 报文使用明文方式发送
  - 由于互联网是由联通世界各个地方的网络设施组成,所有发送和接收经过某些设备的数据都可能被截获或窥视。(例如大家都熟悉的抓包工具:Wireshark),即使经过加密处理,也会被窥视是通信内容,只是可能很难或者无法破解出报文的信息而已

- 认证问题

  - 无法确认你发送到的服务器就是真正的目标服务器(可能服务器是伪装的)
  - 无法确定返回的客户端是否是按照真实意图接收的客户端(可能是伪装的客户端)
  - 无法确定正在通信的对方是否具备访问权限,Web 服务器上某些重要的信息，只想发给特定用户即使是无意义的请求也会照单全收。无法阻止海量请求下的 DoS 攻击（Denial of Service，拒绝服务攻击）。

- 可能被篡改

  请求或响应在传输途中，遭攻击者拦截并篡改内容的攻击被称为中间人攻击（Man-in-the-Middle attack，MITM）。

### 2. https如何解决

> HTTPS是在通信接口部分用 TLS(Transport Layer Security)协议。

![image-20240819182836302](https://p.ipic.vip/0stgny.png)

- 2.1 SSL 和 TLS 的区别

  - 传输层安全性协议（英语：Transport Layer Security，缩写作 TLS），及其前身安全套接层（Secure Sockets Layer，缩写作 SSL）是一种安全协议，目的是为互联网通信，提供安全及数据完整性保障。
  - 网景公司（Netscape）在1994年推出首版网页浏览器，网景导航者时，推出HTTPS协议，以SSL进行加密，这是SSL的起源。
  - IETF将SSL进行标准化，1999年公布第一版TLS标准文件。随后又公布RFC 5246 （2008年8月）与 RFC 6176 （2011年3月）。以下就简称SSL
  - TLS是SSL的标准. HTTPS 就是 HTTP + SSL

  ![image-20240819185541285](https://p.ipic.vip/qsuzbz.png)

  HTTPS 协议的主要功能基本都依赖于 TLS/SSL 协议，TLS/SSL 的功能实现主要依赖于三类基本算法：散列函数 、对称加密和非对称加密，其利用非对称加密实现身份认证和密钥协商，对称加密算法采用协商的密钥对数据加密，基于散列函数验证信息的完整性。

  ![image-20240819185608022](https://p.ipic.vip/cloiyh.png)

- 对称加密

  - 常见的有 AES-CBC、DES、3DES、AES-GCM等，相同的密钥可以用于信息的加密和解密，掌握密钥才能获取信息，能够防止信息窃听，通信方式是1对1；
  - 对称加密需要共享相同的密码，密码的安全是保证信息安全的基础，服务器和多 个客户端通信，需要维持多个密码记录，且缺少修改密码的机制；
  - 优点：算法公开、计算量小、加密速度快、加密效率高。
  - 缺点：交易双方都使用同样钥匙，安全性得不到保证。

  ![image-20240819185822340](https://p.ipic.vip/gwq4pc.png)

- 非对称加密

  - 即常见的 RSA 算法，还包括 ECC、DH 等算法，算法特点是，密钥成对出现，一般称为公钥(公开)和私钥(保密)，公钥加密的信息只能私钥解开，私钥加密的信息只能公钥解开。因此掌握公钥的不同客户端之间不能互相解密信息，只能和掌握私钥的服务器进行加密通信，服务器可以实现1对多的通信，客户端也可以用来验证掌握私钥的服务器身份。
  - 非对称加密的特点是信息传输一对多，服务器只需要维持一个私钥就能够和多个客户端进行加密通信，但服务器发出的信息能够被所有的客户端解密，且该算法的计算复杂，加密速度慢。

  ![image-20240819185754790](https://p.ipic.vip/9ozkl8.png)

- 完整性验证算法

  - 常见的有 MD5、SHA1、SHA256，该类函数特点是函数单向不可逆、对输入非常敏感、输出长度固定，针对数据的任何修改都会改变散列函数的结果，用于防止信息篡改并验证数据的完整性；
  - 在信息传输过程中，散列函数不能单独实现信息防篡改，因为明文传输，中间人可以修改信息之后重新计算信息摘要，因此需要对传输的信息以及信息摘要进行加密

- 工作方式

  - 结合三类算法的特点，TLS 的基本工作方式是
    - 客户端使用非对称加密与服务器进行通信，实现身份验证并协商对称加密使用的密钥
    - 然后对称加密算法采用协商密钥对信息以及信息摘要进行加密通信，不同的节点之间采用的对称密钥不同，从而可以保证信息只能通信双方获取。

- HTTPS完整建立连接过程,如下图

  - 首先建立tcp握手连接
  - 进行ssl协议的握手密钥交换(Handshake protocal)
  - 然后通过共同约定的密钥开始通信

  ![image-20240819190004850](https://p.ipic.vip/d4vf9x.png)

- 证书：作用就是,我和服务端通信,我怎么知道这个服务端是我要真正通信的服务端呢

  ![image-20240819190121130](https://p.ipic.vip/ydmimz.png)

  ![image-20240819190146553](https://p.ipic.vip/bq3myq.png)

  申请和发放证书流程如下

  - 服务方 Server 向第三方机构CA提交公钥、组织信息、个人信息(域名)等信息并申请认证;
  - CA通过线上、线下等多种手段验证申请者提供信息的真实性，如组织是否存在、企业是否合法，是否拥有域名的所有权等;
  - 如信息审核通过，CA会向申请者签发认证文件-证书。证书包含以下信息：申请者公钥、申请者的组织信息和个人信息、签发机构 CA的信息、有效时间、证书序列号等信息的明文，同时包含一个签名; 签名的产生算法：首先，使用散列函数计算公开的明文信息的信息摘要，然后，采用 CA的私钥对信息摘要进行加密，密文即签名;
  - 客户端 Client 向服务器 Server 发出请求时，Server 返回证书文件;
  - 客户端 Client 读取证书中的相关的明文信息，采用相同的散列函数计算得到信息摘要，然后，利用对应 CA的公钥解密签名数据，对比证书的信息摘要，如果一致，则可以确认证书的合法性，即公钥合法;
  - 客户端还会验证证书相关的域名信息、有效时间等信息; 客户端会内置信任CA的证书信息(包含公钥)，如果CA不被信任，则找不到对应 CA的证书，证书也会被判定非法。
