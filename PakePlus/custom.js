window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});{
  "name": "video-web-app",
  "version": "1.0.0",
  "description": "PakePlus打包视频网页，支持视频跳转播放",
  "main": "index.js",
  "scripts": {
    "build:android": "pake build android",
    "build:ios": "pake build ios"
  },
  "pake": {
    "url": "https://avhole2.xyz/zh", // 替换为你的视频主页地址
    "title": "AVHOLE", // 你的App名称
    "icon": "./icon.png", // 图标路径，无图标可删除该行
    "platforms": ["android", "ios"], // 打包平台，按需保留
    "webview": {
      // 核心：视频网页专属WebView配置，缺一不可
      "javascriptEnabled": true, // 开启JS（视频跳转依赖JS）
      "domStorageEnabled": true, // 保存页面状态，避免跳转后丢失上下文
      "javascriptCanOpenWindowsAutomatically": true, // 允许JS打开新窗口（视频播放页常用）
      "supportMultipleWindows": true, // 支持多窗口，适配新窗口播放
      "mediaPlaybackRequiresUserAction": false, // 关闭播放需手动触发限制
      "mixedContentMode": "always_allow", // 允许http/https混合资源（视频资源常见）
      "allowFileAccess": true,
      "allowFileAccessFromFileURLs": true,
      "allowUniversalAccessFromFileURLs": true, // 放开本地文件访问，适配流媒体
      "cacheMode": "LOAD_DEFAULT", // 缓存策略，避免视频资源加载异常
      "userAgent": "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36", // 模拟手机浏览器UA，避免网页适配异常
      "loadsImagesAutomatically": true // 自动加载视频封面图
    },
    // 禁用默认的外部浏览器插件，改用自定义拦截
    "plugins": {
      "inappbrowser": false
    },
    // 申请必要权限，视频网页核心仅需网络权限
    "permissions": {
      "network": true,
      "storage": true,
      "media": true // 媒体权限，适配视频播放
    }
  },
  "devDependencies": {
    "pake-plus": "^latest"
  }
}
// pake.config.js 核心拦截逻辑，PakePlus会自动加载该配置
module.exports = {
  // Android端视频跳转拦截配置（解决90%的Android跳转问题）
  android: {
    webViewClient: {
      /**
       * 拦截所有URL跳转，强制在当前WebView打开
       * 适配a标签直接跳转、JS location.href跳转的视频链接
       */
      shouldOverrideUrlLoading: function (view, request) {
        const url = request.getUrl().toString();
        // 过滤无效链接，仅处理http/https开头的视频链接
        if (url.startsWith("http://") || url.startsWith("https://")) {
          view.loadUrl(url);
          return true; // 拦截系统默认行为
        }
        return false; // 放行非网页链接（如原生协议）
      }
    },
    webChromeClient: {
      /**
       * 拦截JS window.open 新窗口请求（视频播放页最常用）
       * 解决点击视频后无响应的核心逻辑
       */
      onCreateWindow: function (webView, isDialog, isUserGesture, resultMsg) {
        // 创建新的WebView实例承载视频播放页
        const context = webView.getContext();
        const newWebView = new android.webkit.WebView(context);
        // 给新WebView同步原配置，保证视频播放环境一致
        const settings = newWebView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setMediaPlaybackRequiresUserAction(false);
        settings.setMixedContentMode(android.webkit.WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        // 将新WebView加入容器，替代系统浏览器打开
        webView.addView(newWebView);
        // 传递新窗口请求，完成跳转
        const transport = resultMsg.getResult();
        transport.setWebView(newWebView);
        resultMsg.sendToTarget();
        return true;
      }
    }
  },

  // iOS端视频跳转拦截配置（适配WKWebView）
  ios: {
    wkNavigationDelegate: {
      /**
       * 拦截iOS端所有链接激活和新窗口跳转
       * 适配target="_blank"和window.open
       */
      decidePolicyForNavigationAction: function (webView, action, decisionHandler) {
        // 识别新窗口跳转（target="_blank"）和链接点击
        if (action.navigationType === "linkActivated" || action.targetFrame === null) {
          const request = action.request;
          // 强制在当前WebView加载视频链接
          webView.loadRequest(request);
          decisionHandler("cancel"); // 取消系统默认跳转
          return;
        }
        decisionHandler("allow"); // 放行正常内部路由
      }
    },
    /**
     * 拦截iOS的window.open新窗口创建
     */
    wkUIDelegate: {
      createWebViewWithConfiguration: function (webView, config, action, features) {
        // 用当前WebView承载新窗口，避免跳系统浏览器
        webView.loadRequest(action.request);
        return null;
      }
    }
  }
};
