window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// 在注入的JS中添加：仅允许特定域名在App内打开
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
