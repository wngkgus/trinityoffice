requestAnimationFrame(()=>document.body.classList.add('intro-ready'));

const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('on')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(x=>io.observe(x));
document.querySelectorAll('[data-count]').forEach(el=>{let done=false;const ob=new IntersectionObserver(es=>{if(es[0].isIntersecting&&!done){done=true;let target=+el.dataset.count,n=0;let t=setInterval(()=>{n+=Math.max(1,Math.ceil(target/35));if(n>=target){n=target;clearInterval(t)}el.textContent=n+(el.dataset.suffix||'')},30)}},{threshold:.5});ob.observe(el)});

window.addEventListener('scroll',()=>{document.documentElement.style.setProperty('--scrollY',window.scrollY+'px')},{passive:true});

// subtle pointer parallax for premium cards (desktop only)
if (window.matchMedia('(min-width: 900px) and (pointer:fine)').matches) {
  document.querySelectorAll('.card,.branch,.step').forEach(el=>{
    el.addEventListener('mousemove',e=>{
      const r=el.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      el.style.transform=`translateY(-7px) perspective(800px) rotateX(${(-y*2.2).toFixed(2)}deg) rotateY(${(x*2.2).toFixed(2)}deg)`;
    });
    el.addEventListener('mouseleave',()=>{el.style.transform='';});
  });
}

// Click any gallery photo to enlarge
const galleryImages=document.querySelectorAll('.photo-card img');
if(galleryImages.length){
  const lb=document.createElement('div');
  lb.className='image-lightbox';
  lb.innerHTML='<button class="image-lightbox-close" aria-label="닫기">×</button><img alt="확대 이미지">';
  document.body.appendChild(lb);
  const big=lb.querySelector('img');
  galleryImages.forEach(img=>{
    img.closest('.photo-card').setAttribute('role','button');
    img.closest('.photo-card').setAttribute('tabindex','0');
    const open=()=>{big.src=img.src;big.alt=img.alt||'트리니티 공유오피스 확대 이미지';lb.classList.add('open');document.body.style.overflow='hidden'};
    img.closest('.photo-card').addEventListener('click',open);
    img.closest('.photo-card').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')open()});
  });
  const close=()=>{lb.classList.remove('open');document.body.style.overflow=''};
  lb.addEventListener('click',e=>{if(e.target===lb||e.target.classList.contains('image-lightbox-close'))close()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
}

// v28: animate essentially every major block as it enters the viewport
const motionSelectors=['.hero-ref > *','.stat','.center-head','.left-head','.compare-card','.compare-arrow','.rec','.tax-tip','.reason','.stepx','.faq-item','.cta-footer > *','.footer-grid > *','.card','.branch','.photo-card','.content > *'];
const motionEls=[...new Set(motionSelectors.flatMap(s=>[...document.querySelectorAll(s)]))];
motionEls.forEach((el,i)=>{if(el.classList.contains('motion-in'))return;el.classList.add('motion-in');const group=[...el.parentElement.children].indexOf(el);el.classList.add('motion-d'+((Math.max(0,group)%5)+1));if(el.matches('.hero-ref > :first-child,.left-head,.compare-card:first-child'))el.classList.add('motion-left');else if(el.matches('.price-card,.reason-box,.compare-card:last-child'))el.classList.add('motion-right');else if(el.matches('.stat,.rec,.stepx,.photo-card'))el.classList.add('motion-pop');});
const motionIO=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('motion-show');motionIO.unobserve(e.target)}}),{threshold:.09,rootMargin:'0px 0px -35px'});
motionEls.forEach(el=>motionIO.observe(el));

// FAQ interaction like the reference site
for(const item of document.querySelectorAll('.faq-item')){item.addEventListener('click',()=>{item.classList.toggle('open');const a=item.querySelector('.faq-a');if(a){a.style.maxHeight=item.classList.contains('open')?a.scrollHeight+'px':'0px';a.style.opacity=item.classList.contains('open')?'1':'0'}})}
