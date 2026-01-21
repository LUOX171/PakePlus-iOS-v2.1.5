window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});const hookClick = (e) => {
    const origin = e.target.closest('a')
    const isBaseTargetBlank = document.querySelector(
        'head base[target="_blank"]'
    )
    console.log('origin', origin, isBaseTargetBlank)
    if (
        (origin && origin.href && origin.target === '_blank') ||
        (origin && origin.href && isBaseTargetBlank)
    ) {
        e.preventDefault()
        console.log('handle origin', origin)
        location.href = origin.href
    } else {
        console.log('not handle origin', origin)
    }
}

window.open = function (url, target, features) {
    console.log('open', url, target, features)
    location.href = url
}
 
document.addEventListener('click', hookClick, { capture: true })
// 在注入的JS中添加：仅允许特定域名在App内打开
const ALLOWED_DOMAINS = ['avhole2.xyz/zh', 'sub.avhole2.xyz/zh'];

document.addEventListener('click', function(e) {
  const target = e.target.closest('a');
  if (target && target.href) {
    const url = new URL(target.href);
    if (ALLOWED_DOMAINS.includes(url.hostname)) {
      e.preventDefault();
      window.location.href = target.href; // 内部跳转
    }
  }
}, true);
// 替换成你的网页主域名（不要加http/https，比如 video.example.com）
const MAIN_DOMAIN = "avhole2.xyz/zh";

module.exports = {
  // Android 端拦截规则
  android: {
    webViewClient: {
      shouldOverrideUrlLoading: function (view, request) {
        const targetUrl = request.getUrl().toString();
        // 只要是站内链接（含后缀），就强制在App内加载
        if (targetUrl.includes(MAIN_DOMAIN)) {
          view.loadUrl(targetUrl);
          return true;
        }
        // 非站内链接：return false 跳浏览器，return true 完全拦截
        return false;
      },
  onPageStarted: function (view, url, favicon) {
    view.getSettings().setSupportMultipleWindows(false);
  }
     }
  },
  // iOS 端拦截规则（需 Mac + Xcode）
  ios: {
    wkNavigationDelegate: {
      decidePolicyForNavigationAction: function (webView, action, decisionHandler) {
        const targetUrl = action.request.URL.absoluteString;
        if (targetUrl.includes(MAIN_DOMAIN)) {
          webView.loadRequest(action.request);
          decisionHandler("cancel");
          return;
        }
        decisionHandler("allow");
      }
    }
  }
};