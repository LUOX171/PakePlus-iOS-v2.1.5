window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// **************************
// 仅需修改这一行：填写你的网页主域名（不要加http/https）
const MAIN_DOMAIN = "xxx.com"; 
// 例：网页是https://video.abc.com，就填 video.abc.com
// **************************

module.exports = {
  // Android端拦截规则
  android: {
    webViewClient: {
      // 拦截所有URL跳转，处理后缀链接
      shouldOverrideUrlLoading: function (view, request) {
        const targetUrl = request.getUrl().toString();
        // 核心：只要包含主域名，就是站内后缀链接，强制内加载
        if (targetUrl.includes(MAIN_DOMAIN)) {
          view.loadUrl(targetUrl);
          return true; // 拦截系统默认行为，不跳浏览器
        }
        // 非站内链接：放行跳系统浏览器（可改为return true完全拦截）
        return false;
      }
    }
  },

  // iOS端拦截规则（适配WKWebView）
  ios: {
    wkNavigationDelegate: {
      decidePolicyForNavigationAction: function (webView, action, decisionHandler) {
        const targetUrl = action.request.URL.absoluteString;
        // 站内后缀链接，强制内加载
        if (targetUrl.includes(MAIN_DOMAIN)) {
          webView.loadRequest(action.request);
          decisionHandler("cancel");
          return;
        }
        // 非站内链接放行
        decisionHandler("allow");
      }
    }
  }
};
