document.addEventListener("DOMContentLoaded", function () {
   console.log("✅ Script loaded");
  const links = document.querySelectorAll(".menu a");
  const content = document.getElementById("dynamic-content");

  // Load default page on startup
  loadPage("home.html");

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Active link styling
      links.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");

      const page = this.getAttribute("data-page");
      loadPage(page);
    });
  });

  function loadPage(page) {
    content.classList.remove("loaded");

    fetch(page)
      .then((res) => res.text())
      .then((data) => {
        content.innerHTML = data;

        setTimeout(() => content.classList.add("loaded"), 50);
       
       
        // Initialize carousel if present
        setTimeout(() => {
          const carousel = document.getElementById("carousel");
          if (carousel) {
            console.log("✅ Carousel found and initialized");
            initializeCarousel(carousel);
          }
        }, 100);
      })
      .catch((err) => {
        content.innerHTML = "<p style='color: red;'>Error loading content.</p>";
        console.error(err);
      });
  }
});

// ✅ Carousel Logic
function initializeCarousel(carousel) {
  const posts = [
    {
      title: "Luxury Wedding Photography & Filmmaking",
      excerpt: "We don’t just take photos we capture emotions, moments, and memories that last a lifetime.",
      imageSrc: "assets/Banner-Image.jpg",
    },
    {
      title: "Elegant Engagement Photography",
      excerpt: "Celebrate your love story with timeless engagement portraits that reflect your unique bond and personality.",
      imageSrc: "assets/Clickerscabin-Wedding-Gallery_04.jpg",
    },
    {
      title: "Cinematic Wedding Films",
      excerpt: "Relive your special moments through beautifully crafted cinematic films that capture every emotion and detail with a storytelling touch.",
      imageSrc: "assets/Clickerscabin-Wedding-Gallery_08.jpg",
    },
    {
      title: "Maternity Moments",
      excerpt: "Cherish the beauty of motherhood with elegant maternity photography that celebrates the journey of new beginnings.",
      imageSrc: "assets/Clickerscabin-Wedding-Gallery_05.jpg",
    },
  ];

  let currentIndex = 0;
  let autoSlide;

  function createSlide(post, index) {
    const slide = document.createElement("div");
    slide.className = "slide";
    slide.style.backgroundImage = `url(${post.imageSrc})`;
    slide.innerHTML = `
      <div class="overlay"></div>
      <div class="slide-content">
        <h1>${post.title}</h1>
        <p>${post.excerpt}</p>
      </div>
    `;

    const offset = (index - currentIndex + posts.length) % posts.length;
    let position = offset;
    if (offset > posts.length / 2) position = offset - posts.length;

    slide.style.transform = `translateX(${position * 100}%)`;
    slide.style.opacity = index === currentIndex ? "1" : "0";
    slide.style.zIndex = index === currentIndex ? "1" : "0";

    return slide;
  }

  function renderSlides() {
    carousel.innerHTML = "";
    posts.forEach((post, i) => {
      const slide = createSlide(post, i);
      carousel.appendChild(slide);
    });

    const controls = document.createElement("div");
    controls.className = "controls";

    const dots = document.createElement("div");
    dots.className = "dots";
    posts.forEach((_, i) => {
      const dot = document.createElement("div");
      dot.className = `dot ${i === currentIndex ? "active" : ""}`;
      dot.addEventListener("click", () => {
        currentIndex = i;
        updateSlides();
        resetAutoSlide();
      });
      dots.appendChild(dot);
    });

    const arrows = document.createElement("div");
    arrows.className = "arrows";

    const prevBtn = document.createElement("button");
    prevBtn.className = "arrow-btn";
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.onclick = () => {
      currentIndex = (currentIndex - 1 + posts.length) % posts.length;
      updateSlides();
      resetAutoSlide();
    };

    const nextBtn = document.createElement("button");
    nextBtn.className = "arrow-btn";
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.onclick = () => {
      nextSlide();
    };

    arrows.appendChild(prevBtn);
    arrows.appendChild(nextBtn);
    controls.appendChild(dots);
    controls.appendChild(arrows);
    carousel.appendChild(controls);
  }

  function updateSlides() {
    const slides = document.querySelectorAll(".slide");

    requestAnimationFrame(() => {
      slides.forEach((slide, i) => {
        const offset = (i - currentIndex + posts.length) % posts.length;
        let position = offset;
        if (offset > posts.length / 2) position = offset - posts.length;

        slide.style.transform = `translateX(${position * 100}%)`;
        slide.style.opacity = i === currentIndex ? "1" : "0";
        slide.style.zIndex = i === currentIndex ? "1" : "0";
        slide.style.pointerEvents = i === currentIndex ? "auto" : "none";
      });

      const dots = document.querySelectorAll(".dot");
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentIndex);
      });
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % posts.length;
    updateSlides();
    resetAutoSlide();
  }

  function resetAutoSlide() {
    clearInterval(autoSlide);
    autoSlide = setInterval(nextSlide, 6000);
  }

  renderSlides();
  updateSlides();
  autoSlide = setInterval(nextSlide, 6000);
}


//home page our flime section

let currentIndex = 0;
let autoSlideTimer;

// ✅ Wait for .gallery-filter
function waitForElement(selector, callback) {
  const el = document.querySelector(selector);
  if (el) {
    callback(el);
  } else {
    setTimeout(() => waitForElement(selector, callback), 100);
  }
}

// ✅ Auto Slide Function
function startAutoSlider() {
  const slider = document.querySelector('.gallery-slider');
  const items = document.querySelectorAll('.gallery-item.show');
  const visibleCount = 3;

  if (items.length <= visibleCount) return;

  clearInterval(autoSlideTimer);
  currentIndex = 0;

  autoSlideTimer = setInterval(() => {
    currentIndex++;
    if (currentIndex > items.length - visibleCount) currentIndex = 0;
    const offset = currentIndex * (items[0].offsetWidth + 15);
    slider.style.transform = `translateX(-${offset}px)`;
  }, 2000);
}

// ✅ Filter Logic
waitForElement(".gallery-filter", function (filterContainer) {
  const galleryItems = document.querySelectorAll(".gallery-item");
  const slider = document.querySelector('.gallery-slider');

  filterContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("filter-item")) {
      filterContainer.querySelector(".active").classList.remove("active");
      event.target.classList.add("active");

      const filterValue = event.target.getAttribute("data-filter");

      galleryItems.forEach(item => {
        if (filterValue === "all" || item.classList.contains(filterValue)) {
          item.classList.remove("hide");
          item.classList.add("show");
        } else {
          item.classList.remove("show");
          item.classList.add("hide");
        }
      });

      // Reset transform
      slider.style.transform = `translateX(0)`;
      startAutoSlider();
    }
  });
});

// ✅ Modal Logic
document.addEventListener("click", function (e) {
  const thumb = e.target.closest(".video-thumb");
  if (thumb) {
    const videoId = thumb.getAttribute("data-video-id");
    const iframe = document.getElementById("videoFrame");
    const modal = document.getElementById("videoModal");
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    modal.style.display = "flex";
  }
});

// ✅ Close Modal
function waitForModalAndBindEvents() {
  const closeBtn = document.getElementById("modalCloseBtn");
  const modal = document.getElementById("videoModal");
  const iframe = document.getElementById("videoFrame");

  if (closeBtn && modal && iframe) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
      iframe.src = "";
    });
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        modal.style.display = "none";
        iframe.src = "";
      }
    });
  } else {
    setTimeout(waitForModalAndBindEvents, 200);
  }
}

waitForModalAndBindEvents();
document.addEventListener("DOMContentLoaded", startAutoSlider);


//moble menu

document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.menu-links a');
  const content = document.getElementById("dynamic-content");

  // Load default section
  loadPage("home.html");

  // Toggle mobile menu open/close
  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    menuToggle.textContent = mobileMenu.classList.contains('open') ? 'Close' : 'Menu';
  });

  // Dynamic loading for each mobile link
  mobileLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const page = this.getAttribute("href");

      // Load the section dynamically
      loadPage(page);

      // Update active class
      mobileLinks.forEach(l => l.classList.remove("active"));
      this.classList.add("active");

      // Close menu
      mobileMenu.classList.remove("open");
      menuToggle.textContent = "Menu";
    });
  });

 function loadPage(page) {
  if (!content) return;

  content.classList.remove("loaded");

  fetch(page)
    .then(res => res.text())
    .then(data => {
      content.innerHTML = data;

      // Allow DOM to update before running scripts
      setTimeout(() => {
        content.classList.add("loaded");

        // ✅ Initialize carousel if exists
        const carousel = document.getElementById("carousel");
        if (carousel) {
          console.log("✅ Carousel found and initialized");
          initializeCarousel(carousel); // This must be a global function
        }
      }, 100);
    })
    .catch(err => {
      content.innerHTML = "<p style='color: red;'>Error loading content.</p>";
      console.error(err);
    });
}

});
caches.open('my-cache').then(cache => {
  cache.add('https://forestgreen-lyrebird-589547.hostingersite.com/');
});

  //testimonial
  document.addEventListener("DOMContentLoaded", function () {
     setTimeout(() => {
    const testimonials = document.querySelectorAll(".testimonial");
    const prev = document.getElementById("prev");
    const next = document.getElementById("next");
    let current = 0;

    function show(index) {
      testimonials.forEach((item, i) => {
        item.style.display = i === index ? "flex" : "none";
      });
    }

    console.log("prev:", prev);
    console.log("next:", next);

    if (prev && next) {
      prev.onclick = function () {
        current = (current - 1 + testimonials.length) % testimonials.length;
        show(current);
      };

      next.onclick = function () {
        current = (current + 1) % testimonials.length;
        show(current);
      };

      show(current);
    } else {
      console.error("❌ Still missing buttons in the DOM.");
    }
  }, 300);
  });

  //hai for test