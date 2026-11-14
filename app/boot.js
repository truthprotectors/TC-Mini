/* runs before client.js: restore the saved theme with no flash, and derive the base path from where /app/ is
   mounted (root, /mini, any prefix). External file so the server's CSP can stay script-src 'self' with no inline. */
try{ var _t=localStorage.getItem("tc-theme"); if(_t) document.documentElement.setAttribute("data-theme",_t); }catch(e){}
window.TC_BASE=(location.pathname.replace(/\/app\/.*$/,"")||"");
/* Where the signed model releases are downloaded from. Empty = same origin (self-hosting: put release/ next to app/).
   Every file is checked against the Ed25519-signed manifest, so any mirror is safe to use. */
window.TC_WEIGHTS=window.TC_WEIGHTS||"https://huggingface.co/truthcoder/TC-Mini/resolve/main";
