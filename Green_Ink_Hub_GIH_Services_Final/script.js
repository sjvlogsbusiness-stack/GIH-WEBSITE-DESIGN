const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => nav.classList.remove('open'))
  );
}

/* Header motion */
const header = document.querySelector('.header');
const updateHeader = () => {
  if (header) header.classList.toggle('scrolled', window.scrollY > 35);
};
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

/* Scroll reveal */
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -40px' });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

/* Stagger service cards */
document.querySelectorAll('.service-grid .service-card').forEach((card, i) => {
  card.classList.add('reveal', `reveal-delay-${Math.min(i + 1, 3)}`);
  if ('IntersectionObserver' in window) {
    const cardObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          cardObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    cardObserver.observe(card);
  } else {
    card.classList.add('is-visible');
  }
});

/* Subtle parallax on the hero */
const hero = document.querySelector('.hero');
const heroContent = document.querySelector('.hero-content');
window.addEventListener('scroll', () => {
  if (!hero || !heroContent || window.innerWidth < 851) return;
  const y = Math.min(window.scrollY, 420);
  heroContent.style.transform = `translate3d(0, ${y * 0.10}px, 0)`;
}, { passive: true });

/* Elegant page transition for internal links */
document.querySelectorAll('a[href$=".html"]').forEach(link => {
  link.addEventListener('click', e => {
    const url = link.href;
    if (!url || url.startsWith('javascript:')) return;
    e.preventDefault();
    document.body.classList.add('page-leave');
    setTimeout(() => { window.location.href = url; }, 450);
  });
});

/* Custom cursor on desktop */
const cursor = document.querySelector('.gih-cursor');
const ring = document.querySelector('.gih-cursor-ring');
if (cursor && ring && window.matchMedia('(pointer:fine)').matches) {
  document.body.classList.add('cursor-ready');
  document.body.classList.add('gih-custom-cursor');
  let x = 0, y = 0, rx = 0, ry = 0;

  window.addEventListener('mousemove', e => {
    x = e.clientX; y = e.clientY;
    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;
  }, { passive: true });

  const animateCursor = () => {
    rx += (x - rx) * .16;
    ry += (y - ry) * .16;
    ring.style.left = `${rx}px`;
    ring.style.top = `${ry}px`;
    requestAnimationFrame(animateCursor);
  };
  animateCursor();

  document.querySelectorAll('a, button, input, textarea, select').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
}

/* Year */
document.querySelectorAll('#year').forEach(el => el.textContent = new Date().getFullYear());

/* Contact form */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const type = document.getElementById('projectType').value;
    const message = document.getElementById('message').value.trim();

    const subject = encodeURIComponent(`GIH Project Enquiry - ${type}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nProject type: ${type}\n\nProject details:\n${message}`
    );

    document.getElementById('formMessage').textContent =
      'Opening your email app to send the enquiry...';
    window.location.href =
      `mailto:greenkinkhub@gmail.com?subject=${subject}&body=${body}`;
  });
}

/* Modern scroll progress */
const progress = document.querySelector('.page-progress');
const updateProgress = () => {
  if (!progress) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
};
window.addEventListener('scroll', updateProgress, { passive:true });
updateProgress();

/* Magnetic micro-interactions */
if (false && window.matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('.button, .nav-button').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * .12;
      const y = (e.clientY - r.top - r.height / 2) * .12;
      el.style.transform = `translate(${x}px,${y}px)`;
    });
    el.addEventListener('mouseleave', () => el.style.transform = '');
  });

  /* Gentle 3D tilt for service cards */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const rx = ((e.clientY-r.top)/r.height-.5)*-4;
      const ry = ((e.clientX-r.left)/r.width-.5)*5;
      card.style.transform = `translateY(-10px) perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });
}
