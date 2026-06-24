import"./modulepreload-polyfill-B5Qt9EMX.js";import"./main-doKn-3pT.js";let a=[],r=0,c=0;const m=12;document.addEventListener("DOMContentLoaded",async()=>{document.querySelector(".gallery-grid")&&(await h(),y())});async function h(){try{if(a=((await carregarDados()).galeria||[]).sort((n,i)=>n.ordem-i.ordem),a.length===0){v();return}d();const o=document.getElementById("btn-load-more");o&&o.addEventListener("click",()=>d())}catch(t){console.error("Erro ao inicializar:",t)}}function d(){const t=document.querySelector(".gallery-grid");if(!t)return;const o=a.slice(r,r+m),n=o.map((e,u)=>`
            <div class="gallery-item" onclick="openLightbox(${r+u})" style="opacity: 1; transform: none;">
                <img src="./assets/galeria/${e.filename}" 
                     alt="${e.titulo||"Evento Lulú"}" 
                     loading="lazy"
                     onerror="this.src='https://via.placeholder.com/400?text=Erro+ao+Carregar'">
                <div class="gallery-overlay">
                    <span class="gallery-category">${e.titulo||"Ver Foto"}</span>
                </div>
            </div>
        `).join("");t.insertAdjacentHTML("beforeend",n),r+=o.length;const i=document.getElementById("load-more-container");r>=a.length&&i&&(i.style.display="none")}function y(){if(!document.getElementById("custom-lightbox")){let i=function(){n<o-50&&l(1),n>o+50&&l(-1)};const t=document.createElement("div");t.id="custom-lightbox",t.className="lightbox",t.innerHTML=`
            <div class="lightbox-counter"></div>
            <div class="lightbox-content">
                <span class="lightbox-close">&times;</span>
                <img id="lightbox-img" src="" alt="">
                <div class="lightbox-nav">
                    <div class="nav-btn" id="prev-btn">&#10094;</div>
                    <div class="nav-btn" id="next-btn">&#10095;</div>
                </div>
            </div>
            <div class="lightbox-caption"></div>
        `,document.body.appendChild(t),t.querySelector(".lightbox-close").onclick=s,t.onclick=e=>{e.target.id==="custom-lightbox"&&s()},t.querySelector("#prev-btn").onclick=e=>{e.stopPropagation(),l(-1)},t.querySelector("#next-btn").onclick=e=>{e.stopPropagation(),l(1)},document.addEventListener("keydown",e=>{t.classList.contains("active")&&(e.key==="Escape"&&s(),e.key==="ArrowLeft"&&l(-1),e.key==="ArrowRight"&&l(1))});let o=0,n=0;t.addEventListener("touchstart",e=>{o=e.changedTouches[0].screenX},{passive:!0}),t.addEventListener("touchend",e=>{n=e.changedTouches[0].screenX,i()},{passive:!0})}}function b(t){c=t,g(),document.getElementById("custom-lightbox").classList.add("active"),document.body.style.overflow="hidden"}function s(){const t=document.getElementById("custom-lightbox");t&&t.classList.remove("active"),document.body.style.overflow=""}function l(t){c+=t,c>=a.length&&(c=0),c<0&&(c=a.length-1),g()}function g(){const t=a[c];if(!t)return;const o=document.getElementById("lightbox-img"),n=document.querySelector(".lightbox-caption"),i=document.querySelector(".lightbox-counter");o&&(o.style.opacity="0",setTimeout(()=>{o.src=`./assets/galeria/${t.filename}`,n&&(n.textContent=t.titulo||""),i&&(i.textContent=`${c+1} / ${a.length}`),o.style.opacity="1"},150))}function v(){const t=document.querySelector(".gallery-grid");t&&(t.innerHTML='<p class="text-center" style="grid-column: 1/-1;">Nenhuma imagem encontrada.</p>')}window.openLightbox=b;window.closeLightbox=s;window.changeImage=l;
