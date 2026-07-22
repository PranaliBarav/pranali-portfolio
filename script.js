document.addEventListener('DOMContentLoaded', () => {

  /* ============ FOOTER YEAR ============ */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ============ NAVBAR SCROLL STYLE ============ */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
    backToTop.classList.toggle('visible', window.scrollY > 500);
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ============ MOBILE NAV TOGGLE ============ */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ============ SCROLL-SPY ACTIVE NAV LINK ============ */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.classList.toggle('active-link', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(sec => spyObserver.observe(sec));

  /* ============ SCROLL REVEAL ANIMATIONS ============ */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('in-view'), i * 60);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ============ TYPEWRITER ROLE TEXT ============ */
  const roles = [
    'Computer Science Student',
    'Machine Learning Enthusiast',
    'Full-Stack Developer',
    'DSA Problem Solver'
  ];
  const typedEl = document.getElementById('typedRole');
  let roleIndex = 0, charIndex = 0, deleting = false;

  function typeLoop() {
    const current = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1400);
        return;
      }
    } else {
      charIndex--;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 40 : 80);
  }
  typeLoop();

  /* ============ PROFILE PHOTO UPLOAD ============ */
  const photoUpload = document.getElementById('photoUpload');
  const profilePhoto = document.getElementById('profilePhoto');
  const PHOTO_KEY = 'portfolio_profile_photo';

  const savedPhoto = localStorage.getItem(PHOTO_KEY);
  if (savedPhoto) profilePhoto.src = savedPhoto;

  photoUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      profilePhoto.src = reader.result;
      try { localStorage.setItem(PHOTO_KEY, reader.result); } catch (err) { /* storage full, ignore */ }
    };
    reader.readAsDataURL(file);
  });

  /* ============ RESUME UPLOAD / DOWNLOAD ============ */
  const resumeUpload = document.getElementById('resumeUpload');
  const resumeStatus = document.getElementById('resumeStatus');
  const downloadResumeBtn = document.getElementById('downloadResume');
  const downloadResumeNavBtn = document.getElementById('downloadResumeNav');
  const RESUME_KEY = 'portfolio_resume_pdf';
  const RESUME_NAME_KEY = 'portfolio_resume_name';

  function refreshResumeStatus() {
    const name = localStorage.getItem(RESUME_NAME_KEY);
    if (name) {
      resumeStatus.textContent = `Uploaded: ${name}`;
    } else {
      resumeStatus.textContent = 'No resume uploaded yet.';
    }
  }
  refreshResumeStatus();

  resumeUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        localStorage.setItem(RESUME_KEY, reader.result);
        localStorage.setItem(RESUME_NAME_KEY, file.name);
        refreshResumeStatus();
        resumeStatus.textContent = `✓ ${file.name} uploaded successfully.`;
      } catch (err) {
        alert('Could not save resume in browser storage (file may be too large).');
      }
    };
    reader.readAsDataURL(file);
  });

  function downloadResume() {
    const data = localStorage.getItem(RESUME_KEY);
    const name = localStorage.getItem(RESUME_NAME_KEY) || 'Resume.pdf';
    if (!data) {
      alert('No resume has been uploaded yet. Use "Upload Resume" first.');
      return;
    }
    const link = document.createElement('a');
    link.href = data;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  downloadResumeBtn.addEventListener('click', downloadResume);
  downloadResumeNavBtn.addEventListener('click', downloadResume);

  /* ============ CONTACT FORM (front-end only) ============ */
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formNote.textContent = 'Thanks for reaching out! This demo form doesn\u2019t send emails yet — connect it to a backend or a service like Formspree to receive messages.';
    contactForm.reset();
  });

});
