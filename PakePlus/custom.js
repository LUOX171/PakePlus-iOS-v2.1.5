window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});const hookClick = (e) => {
  // ########## 新增：外部链接拦截核心配置 ##########
  const allowedHosts = ['avhole.com', 'www.avhole.space', 'avhole2.website/zh', 'avhole2.online/zh']; // 替换为你的白名单域名
  const origin = e.target.closest('a');
  // 1. 有a标签且含链接时，先校验是否为外部域名
  if (origin && origin.href) {
    try {
      const linkHost = new URL(origin.href).hostname;
      // 非白名单域名，直接拦截跳转
      if (!allowedHosts.includes(linkHost)) {
        e.preventDefault();
        alert('禁止跳转外部链接'); // 可删除/替换为自定义提示
        console.log('拦截外部a标签跳转:', origin.href);
        return; // 拦截后直接退出，不执行后续逻辑
      }
    } catch (err) {
      console.log('链接解析失败，拦截跳转:', err);
      e.preventDefault();
      return;
    }
  }
  // ########## 原有：内部_blank跳转处理逻辑 ##########
  const isBaseTargetBlank = document.querySelector('head base[target="_blank"]');
  console.log('origin', origin, isBaseTargetBlank);
  if (
    (origin && origin.href && origin.target === '_blank') ||
    (origin && origin.href && isBaseTargetBlank)
  ) {
    e.preventDefault();
    console.log('handle origin', origin);
    location.href = origin.href;
  } else {
    console.log('not handle origin', origin);
  }

  // ########## 新增：嵌入window.location/open拦截（全局生效） ##########
  const originalLocation = window.location;
  const originalOpen = window.open;
  // 拦截window.location赋值跳转
  Object.defineProperty(window, 'location', {
    set: (url) => {
      try {
        const urlHost = new URL(url).hostname;
        if (!allowedHosts.includes(urlHost)) {
          console.log('拦截非白名单location跳转:', url);
          return;
        }
        originalLocation.href = url;
      } catch (err) {
        console.log('location解析失败，拦截跳转:', err);
      }
    }
  });
  // 拦截window.open跳转
  window.open = (url) => {
    try {
      const urlHost = new URL(url).hostname;
      if (!allowedHosts.includes(urlHost)) {
        console.log('拦截非白名单window.open:', url);
        return null;
      }
      return originalOpen.call(window, url);
    } catch (err) {
      console.log('open链接解析失败，拦截跳转:', err);
      return null;
    }
  };
};

// ########## 保留：beforeunload非用户操作拦截（全局） ##########
window.addEventListener('beforeunload', (e) => {
  if (!e.isTrusted) { // 拦截脚本触发的页面跳转/刷新
    e.preventDefault();
    e.returnValue = '';
    console.log('拦截非用户触发的beforeunload跳转');
  }
});
