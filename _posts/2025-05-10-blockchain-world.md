---
layout: post
title: '走进区块链的世界'
subtitle: 'Web3入门'
date: 2025-03-31
author: 'ZhuLang'
header-img: 'img/bg-little-universe.jpg'
catalog: true
tags:
  - Web3
  - 入门
  - 区块链
  - 数字货币
  - 入门指南
---

# 走进区块链的世界 | Web3入门指南

> 💡 **你是不是也有这样的困惑？**想进入Web3世界却不知从何下手？域名、部署、连接前端...这些专业术语让你望而却步？别担心，这篇保姆级教程将手把手带你入门！

## 一、域名管理：你的Web3身份证

在数字世界，域名就像你的网络身份证。选择一个好域名，是你迈向Web3的第一步。

### 1. 如何选择最适合你的域名注册商？

#### Porkbun：新手友好的经济之选

![Porkbun示意图](https://p.ipic.vip/y6m9o3.png)

**为什么选择Porkbun？**

- 💰 首年价格低至几美元，性价比极高
- 🔒 免费WHOIS隐私保护，守护你的个人信息
- 🌐 支持超过300种域名后缀，选择多样
- 💻 界面简洁现代，新手也能轻松上手

**[👉 点击访问Porkbun](https://porkbun.com/)**

#### Namesilo：追求稳定的明智之选

**Namesilo的独特优势：**

- 📉 低廉稳定的续费价格（.com域名续费约8.99美元）
- 📋 透明定价策略，无隐藏费用
- 🛡️ 终身免费的WHOIS隐私保护
- 🧰 虽然界面老旧，但功能简单直接

**[👉 点击访问Namesilo](https://www.namesilo.com/)**

> **小贴士**：预算有限？Porkbun或Namesilo是你最经济的选择，既提供低廉的价格，又有免费的隐私保护。

### 2. 域名解析：让你的网站被世界看见

接下来，我们需要将域名与Cloudflare绑定，这样才能让你的网站被全球用户访问。

#### Cloudflare设置指南（以Porkbun为例）

**第一步：添加域名到Cloudflare**

1. 登录Cloudflare，进入后台界面
2. 点击添加域名按钮

![添加域名到Cloudflare](https://p.ipic.vip/y6m9o3.png)

**第二步：输入你的域名**

1. 填入你在Porkbun购买的域名（注意：只需输入主域名，如baidu.com）
2. 直接点击"继续"进入下一步

![输入域名](https://p.ipic.vip/i261oo.jpg)

**第三步：选择免费计划**

直接选择底部的Free计划，零成本享受Cloudflare的基础服务。

![选择Free计划](https://p.ipic.vip/aap4j0.png)

**第四步：跳过DNS记录确认**

不用管DNS记录页面，直接拉到最下方，点击"继续前往激活"。

![DNS记录确认](https://p.ipic.vip/xa9966.jpg)

**第五步：获取Cloudflare名称服务器**

记下页面中显示的两个服务器地址，我们需要将它们添加到Porkbun中。

![获取Cloudflare名称服务器](https://p.ipic.vip/oys8vo.jpg)

**第六步：更新Porkbun中的名称服务器**

1. 在Porkbun中找到你的域名
2. 点击NS管理
3. 删除原有的NS记录
4. 添加从Cloudflare获取的两个服务器地址
5. 保存更改

![Porkbun更新名称服务器步骤1](https://p.ipic.vip/0qwgnw.png)

![Porkbun更新名称服务器步骤2](https://p.ipic.vip/zrf0x2.jpg)

**耐心等待生效**

完成名称服务器修改后，回到Cloudflare点击"继续"，然后点击"立即检查名称服务器"。

系统会自动验证你的修改是否生效。通常需要10-20分钟才能完全生效，Cloudflare会通过邮件通知你绑定成功。

![检查名称服务器](https://p.ipic.vip/axwjd2.png)

当Cloudflare后台显示"活动"状态时，表示域名已成功绑定。

![确认激活状态](https://p.ipic.vip/jd4mxe.jpg)

## 二、Cloudflare部署：让你的网站瞬间上线

有了域名，现在我们需要一个地方来存放网站内容。Cloudflare Pages提供了免费且强大的网站托管服务。

### 从GitHub到Cloudflare的无缝部署

**第一步：准备你的GitHub仓库**

首先确保你的项目已经推送到GitHub上。

**第二步：在Cloudflare创建Pages项目**

1. 打开Cloudflare，点击左侧dashboard
2. 找到Pages选项，点击"创建"

![Cloudflare Pages创建](https://p.ipic.vip/ivzkps.jpg)

**第三步：连接GitHub**

点击"连接到git"，登录你的GitHub账户。

![连接到GitHub](https://p.ipic.vip/xl3wge.jpg)

**第四步：选择仓库并部署**

1. 登录成功后，选择你要部署的仓库
2. 直接点击"开始部署"
3. 等待部署完成

![部署成功](https://p.ipic.vip/39vy7w.jpg)

### 绑定自定义域名

部署成功后，Cloudflare会自动分配一个域名给你。但使用我们自己的域名会更专业。

**绑定步骤：**

1. 在Pages列表中点击你的项目
2. 选择"自定义域"
3. 输入之前绑定到Cloudflare的域名
4. 点击确定，Cloudflare会自动完成DNS设置
5. 当状态显示为"active"时，绑定成功

![设置自定义域名](https://p.ipic.vip/vtu3qd.jpg)

### 配置SSL证书：保障网站安全

为了确保网站安全，我们需要正确配置SSL证书。

**第一步：进入SSL设置**

1. 回到账户主页，点击你的域名
2. 在左侧dashboard选择SSL
3. 在overview中点击configure

![SSL设置](https://p.ipic.vip/7tgsnv.png)

**第二步：选择Full加密模式**

默认是Flexible，我们需要修改为Full，然后保存。

![设置SSL为Full](https://p.ipic.vip/7bpdfk.jpg)

**第三步：启用HTTPS强制跳转**

1. 在SSL部分，点击Edge Certificates
2. 找到Always use HTTPS选项
3. 勾选启用

![开启Always use HTTPS](https://p.ipic.vip/yjo1kr.jpg)

完成以上设置后，你的网站就已经成功部署，并且拥有了自定义域名和SSL加密保护！现在，你可以自豪地把网址分享给朋友们了。

## 三、Workers连接前端：让你的网站更智能

想让网站拥有更强大的功能？Cloudflare Workers可以帮你实现前后端连接，比如接入AI聊天功能。

### 创建强大的Workers代码

下面是一个云音乐AI助手的Workers代码示例：

```js
/**
 * 云音乐AI助手 - DeepSeek-R1 API集成
 * 
 * 这个Worker有两个主要功能：
 * 1. 解决跨域问题(CORS)
 * 2. 连接DeepSeek-R1 API处理用户问题
 */

// 设置CORS头信息
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

// 处理OPTIONS请求
function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

// DeepSeek API配置
const DEEPSEEK_API_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const DEEPSEEK_API_KEY = 'sk-fuclvgmvvtgvnfqwxaguhdwrgyqfnlpwbxeyamlztgxxxx'; // 替换为自己的key
const DEEPSEEK_MODEL = 'Pro/deepseek-ai/DeepSeek-R1';

// 处理测试请求
function handleTestRequest() {
  return new Response(
    JSON.stringify({
      success: true,
      message: '你好！这是来自云音乐AI助手的测试响应。',
      timestamp: new Date().toISOString(),
      data: {
        name: '云音乐AI助手',
        version: '2.0.0',
        features: ['音乐推荐', '歌词解析', '艺术家介绍', '音乐趣闻'],
        model: DEEPSEEK_MODEL,
      },
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders(),
      },
    }
  );
}

// 处理AI聊天请求（使用DeepSeek API）
async function handleChatRequest(request) {
  try {
    // 解析用户请求
    const requestData = await request.json();
    const userPrompt = requestData.prompt || '';

    if (!userPrompt.trim()) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '请输入问题内容',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(),
          },
        }
      );
    }

    // 构建发送给DeepSeek API的请求体
    // 添加音乐相关的上下文，使AI回答更加专业
    const systemPrompt =
      '你是云音乐AI助手，一位专业的音乐顾问。你擅长回答关于音乐、歌手、歌曲、音乐历史和音乐理论的问题。请提供准确、有趣、富有洞察力的回答。如果用户的问题与音乐无关，请礼貌地引导他们询问音乐相关的问题。';

    const deepseekRequestBody = {
      model: DEEPSEEK_MODEL,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      stream: false,
      max_tokens: 1024,
      temperature: 0.7,
      top_p: 0.9,
      response_format: {
        type: 'text',
      },
    };

    // 发送请求到DeepSeek API
    console.log('发送请求到DeepSeek API...');
    const deepseekResponse = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify(deepseekRequestBody),
    });

    // 处理DeepSeek的响应
    const deepseekData = await deepseekResponse.json();
    console.log('收到DeepSeek API响应:', JSON.stringify(deepseekData));

    // 检查是否有错误
    if (!deepseekResponse.ok) {
      console.error('DeepSeek API错误:', deepseekData);
      return new Response(
        JSON.stringify({
          success: false,
          error: deepseekData.error?.message || '调用AI服务时出错',
          details: deepseekData,
        }),
        {
          status: deepseekResponse.status,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(),
          },
        }
      );
    }

    // 提取AI回答
    const aiResponse =
      deepseekData.choices?.[0]?.message?.content || '抱歉，AI无法生成回答。';

    // 构建符合前端期望的响应格式
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          choices: [
            {
              message: {
                content: aiResponse,
              },
            },
          ],
          model: DEEPSEEK_MODEL,
          usage: deepseekData.usage,
        },
        message: '请求成功',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  } catch (error) {
    console.error('处理请求时发生错误:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: `处理请求时发生错误: ${error.message}`,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  }
}

// 主处理函数
async function handleRequest(request) {
  // 获取请求URL的路径部分
  const url = new URL(request.url);
  const path = url.pathname;

  // 处理OPTIONS请求（CORS预检）
  if (request.method === 'OPTIONS') {
    return handleOptions();
  }

  // 根据路径处理不同的请求
  if (path === '/api/chat') {
    return handleChatRequest(request);
  } else if (path === '/api/test' || path === '/') {
    return handleTestRequest();
  }

  // 如果没有匹配的路径，返回404
  return new Response(JSON.stringify({ error: '找不到请求的资源' }), {
    status: 404,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(),
    },
  });
}

// 注册Worker的fetch事件处理程序
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});
```

### 部署到Cloudflare Workers

将上面的代码复制到[Cloudflare Workers编辑器](https://workers.cloudflare.com/playground)中，点击部署，即可获得一个功能强大的API端点。

### 前端集成示例

以下是将Workers API集成到前端React组件的示例代码：

```js
// 组件加载时获取测试响应
useEffect(() => {
  // 从Cloudflare Worker获取测试响应
  const fetchTestResponse = async () => {
    try {
      // 替换为你的Cloudflare Worker URL
      const workerUrl =
        'https://cloud-music-ai-assistant.ricardo-pangj.workers.dev/';
      const response = await fetch(workerUrl);
      const data = await response.json();
      setTestResponse(data);

      // 添加欢迎消息
      setMessages([
        {
          type: 'ai',
          content: `${data.message} 我是${
            data.data.name
          }，可以为你提供${data.data.features.join('、')}等服务。`,
        },
      ]);
    } catch (error) {
      console.error('获取测试响应失败:', error);
      setMessages([
        {
          type: 'ai',
          content: '欢迎使用AI助手！我可以帮你推荐音乐、解析歌词或介绍艺术家。',
        },
      ]);
    }
  };

  if (showChat && messages.length === 0) {
    fetchTestResponse();
  }
}, [showChat, messages.length]);

// 发送消息到ChatGPT API
const sendMessage = async () => {
  if (!input.trim() || loading) return;

  // 添加用户消息
  const userMessage = { type: 'user', content: input };
  setMessages((prev) => [...prev, userMessage]);
  setInput('');
  setLoading(true);

  try {
    // 替换为你的Cloudflare Worker URL
    const workerUrl =
      'https://cloud-music-ai-assistant.ricardo-pangj.workers.dev/api/chat';
    const response = await fetch(workerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: input }),
    });

    const data = await response.json();

    if (data.success && data.data.choices && data.data.choices.length > 0) {
      // 添加AI响应
      const aiMessage = {
        type: 'ai',
        content: data.data.choices[0].message.content,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } else {
      // 处理错误响应
      const errorMessage = {
        type: 'ai',
        content: '抱歉，我无法处理你的请求。请稍后再试。',
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  } catch (error) {
    console.error('发送消息失败:', error);
    // 添加错误消息
    const errorMessage = {
      type: 'ai',
      content: '抱歉，连接出现问题。请检查网络连接后再试。',
    };
    setMessages((prev) => [...prev, errorMessage]);
  } finally {
    setLoading(false);
  }
};
```

## 四、进阶学习资源 📚

想要深入学习Web3和区块链开发？这些资源将助你一臂之力：

1. [Cursor Hub](https://cursorhub.org/) - AI编程的最佳实践
2. [AI编程蓝皮书2.0](https://superhuang.feishu.cn/wiki/CBBPwvgEuicVhFkx0s7cPmhpn4e) - 系统学习AI辅助编程
3. [Cloudflare官网](https://dash.cloudflare.com/) - 全面了解Cloudflare生态
4. [Cloudflare Workers](https://workers.cloudflare.com/playground) - 边学边练，快速掌握

------

> **作者简介**：zhulang，Web3开发者，致力于简化区块链技术学习曲线，让更多人能够轻松进入Web3世界。

**关注我，掌握更多Web3实用技能！**
