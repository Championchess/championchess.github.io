(() => {
  'use strict';
  const all = [...document.querySelectorAll('.paper')];
  const list = document.querySelector('#paper-list');
  const search = document.querySelector('#paper-search');
  const filters = [...document.querySelectorAll('.filter')];
  const sort = document.querySelector('#paper-sort');
  const count = document.querySelector('#result-count');
  const empty = document.querySelector('#empty-state');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const motionButton = document.querySelector('#motion-toggle');
  let category = 'All work';
  let animations = !reduced.matches;
  let motionPreference = false;
  const images = [...document.querySelectorAll('img[data-gif]')];
  const requestedImages = new WeakMap();
  const preloads = new Map();
  function imageMotion(img, visible = true) {
    const target = animations && visible ? img.dataset.gif : img.dataset.poster;
    requestedImages.set(img, target);
    if (img.getAttribute('src') === target) return;
    if (target === img.dataset.poster) {img.src = target;return;}
    // Keep the still image visible until the GIF is decoded.
    if (!preloads.has(target)) {
      const preload = new Image();preload.src = target;
      preloads.set(target, preload.decode().catch(() => null));
    }
    preloads.get(target).then(() => {if(requestedImages.get(img) === target) img.src=target;});
  }
  const visibleImages = new Set();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) visibleImages.add(entry.target);
      else visibleImages.delete(entry.target);
      imageMotion(entry.target, entry.isIntersecting);
    });
  }, {rootMargin: '200px 0px'});
  images.forEach(img => observer.observe(img));
  function updateMotion() {
    motionButton.setAttribute('aria-pressed', String(!animations));
    motionButton.querySelector('span').textContent = animations ? 'Pause demos' : 'Play demos';
    images.forEach(img => imageMotion(img, visibleImages.has(img)));
    const current = document.querySelector('.dialog-media');
    if(current) imageMotion(current);
  }
  motionButton.addEventListener('click', () => {animations = !animations;motionPreference = true;updateMotion();});
  reduced.addEventListener('change', () => {if(!motionPreference){animations = !reduced.matches;updateMotion();}});
  updateMotion();
  function applyFilters() {
    const q = search.value.trim().toLowerCase();
    let n = 0;
    all.forEach(article => {
      const matchCategory = category === 'All work' || article.dataset.tags.split('|').includes(category);
      const searchable = [...article.querySelectorAll('h3, .authors, .summary, .venue, .award')].map(el => el.textContent).join(' ').toLowerCase() + ' ' + article.dataset.keywords.toLowerCase();
      const matchSearch = q.split(/\s+/).filter(Boolean).every(term => {
        const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp('(^|[^a-z0-9])' + escaped, 'i').test(searchable);
      });
      article.hidden = !(matchCategory && matchSearch);
      if(!article.hidden) n++;
    });
    count.textContent = `${n} / ${all.length} papers`;
    empty.hidden = n !== 0;
    const sorted = [...all].sort((a,b) => {
      const delta = Number(b.dataset.year) - Number(a.dataset.year);
      return (sort.value === 'oldest' ? -delta : delta) || Number(a.dataset.order) - Number(b.dataset.order);
    });
    sorted.forEach(article => list.append(article));
  }
  function setCategory(value) {
    category = value;
    filters.forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.filter === value)));
    applyFilters();
  }
  filters.forEach(btn => btn.addEventListener('click', () => setCategory(btn.dataset.filter)));
  search.addEventListener('input', applyFilters);
  sort.addEventListener('change', applyFilters);
  document.querySelector('#reset-filters').addEventListener('click', () => {search.value='';setCategory('All work');search.focus();});
  document.querySelectorAll('[data-research-filter]').forEach(a => a.addEventListener('click', () => {
    search.value = '';setCategory(a.dataset.researchFilter);
  }));
  applyFilters();
  const dialog = document.querySelector('#detail-dialog');
  const dialogTitle = document.querySelector('#dialog-title');
  const body = document.querySelector('#dialog-body');
  let opener = null;
  function openDialog(button, title) {
    opener=button;dialogTitle.textContent=title;dialog.showModal();document.body.classList.add('modal-open');
  }
  function closeDialog() {dialog.close();}
  document.querySelector('.dialog-close').addEventListener('click', closeDialog);
  dialog.addEventListener('click',e => {
    if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog();}
  });
  dialog.addEventListener('close', () => {document.body.classList.remove('modal-open');body.replaceChildren();opener?.focus();});
  document.querySelectorAll('.demo-button').forEach(button => button.addEventListener('click', () => {
    const article=button.closest('.paper');const source=button.querySelector('img');body.replaceChildren();
    const media=source.cloneNode();media.className='dialog-media';media.removeAttribute('loading');imageMotion(media);body.append(media);
    const links=document.createElement('div');links.className='dialog-links';
    const paper=document.createElement('a');paper.href=article.dataset.paper;paper.target='_blank';paper.rel='noopener noreferrer';paper.textContent='Read paper ↗';links.append(paper);
    const download=document.createElement('a');download.href=source.dataset.gif;download.download=`${article.id}.gif`;download.textContent='Download GIF ↓';links.append(download);body.append(links);
    openDialog(button,article.querySelector('h3').textContent);
  }));
  document.querySelectorAll('.cite-button').forEach(button => button.addEventListener('click', () => {
    const article=button.closest('.paper');body.replaceChildren();const area=document.createElement('textarea');area.className='citation-text';area.readOnly=true;area.setAttribute('aria-label','BibTeX citation');area.value=article.querySelector('template').content.textContent.trim();body.append(area);
    const copy=document.createElement('button');copy.className='copy-citation';copy.textContent='Copy BibTeX';
    copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(area.value);copy.textContent='Copied ✓';}catch{area.focus();area.select();const ok=document.execCommand('copy');copy.textContent=ok?'Copied ✓':'Selected — press ⌘C / Ctrl+C';}});body.append(copy);
    openDialog(button,'Cite this paper');
  }));
  document.querySelectorAll('a[href^="http"]').forEach(a=>{a.target='_blank';a.rel='noopener noreferrer';});
  window.addEventListener('beforeprint',()=>images.forEach(img=>imageMotion(img,false)));
  window.addEventListener('afterprint',updateMotion);
})();
