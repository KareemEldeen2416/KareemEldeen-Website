// التهيئة الذكية لمكتبة AOS بعد انتهاء تحميل وعرض الصفحة لتفادي حظر الخيط الرئيسي (Forced Synchronous Layout)
window.addEventListener('load', function () {
    function startAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                once: true,                  // تنفيذ الحركة لمرة واحدة فقط لتفادي إعادة الحساب أثناء التمرير
                mirror: false,
                duration: 600,
                offset: 40,
                disableMutationObserver: true // منع مراقبة DOM المستمرة لتوفير أداء المعالج
            });
        }
    }
    if ('requestIdleCallback' in window) {
        requestIdleCallback(startAOS, { timeout: 1500 });
    } else {
        setTimeout(startAOS, 200);
    }
});

function changeSlide(containerId, direction) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const slides = container.getElementsByClassName('slide');
    let activeIndex = 0;

    for (let i = 0; i < slides.length; i++) {
        if (slides[i].classList.contains('active')) {
            activeIndex = i;
            slides[i].classList.remove('active');
            break;
        }
    }

    let newIndex = activeIndex + direction;
    if (newIndex >= slides.length) newIndex = 0;
    if (newIndex < 0) newIndex = slides.length - 1;

    slides[newIndex].classList.add('active');
}

// تحميل وتهيئة مكتبة EmailJS بشكل ديناميكي عند الحاجة فقط (عند التفاعل مع نموذج الحجز)
let emailjsReady = false;
let emailjsLoading = false;

function loadEmailJSSDK(callback) {
    if (emailjsReady) {
        if (callback) callback();
        return;
    }
    if (emailjsLoading) {
        const interval = setInterval(() => {
            if (emailjsReady) {
                clearInterval(interval);
                if (callback) callback();
            }
        }, 50);
        return;
    }
    emailjsLoading = true;
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.async = true;
    script.onload = () => {
        if (window.emailjs) {
            emailjs.init("eB2PubUq4ETdX8b1T");
            emailjsReady = true;
            emailjsLoading = false;
            if (callback) callback();
        }
    };
    document.head.appendChild(script);
}

// تحميل مسبق في الخلفية بمجرد اقتراب المستخدم من قسم الحجز
const bookingSection = document.getElementById('booking');
if (bookingSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            loadEmailJSSDK();
            observer.disconnect();
        }
    }, { rootMargin: '300px' });
    observer.observe(bookingSection);
}

// سكريبت معالجة الفورم وإرسال البيانات عبر عارض الـ EmailJS
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('focusin', () => loadEmailJSSDK(), { once: true });

    bookingForm.addEventListener('submit', function (event) {
        event.preventDefault(); // منع الصفحة من إعادة التحميل
        const form = this;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin text-lg"></i> جاري إرسال طلبك...';
        submitBtn.disabled = true;

        loadEmailJSSDK(() => {
            emailjs.sendForm('service_wczh6om', 'template_xsl0oef', form)
                .then(function () {
                    alert('تم تأكيد حجز جلستك الاستشارية بنجاح! سنتواصل معك في أقرب وقت ممكن.');
                    form.reset(); // إفراغ الخانات بعد نجاح الإرسال
                }, function (error) {
                    alert('عذراً، حدث خطأ أثناء إرسال البيانات. يرجى التحقق وإعادة المحاولة: ' + JSON.stringify(error));
                })
                .finally(function () {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    });
}

// كود تفعيل وإغلاق القائمة الجانبية (Burger Menu) للهواتف
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const menuIcon = document.getElementById('menu-icon');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('hidden');

        if (menuIcon.classList.contains('fa-bars')) {
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-xmark');
        } else {
            menuIcon.classList.remove('fa-xmark');
            menuIcon.classList.add('fa-bars');
        }
    });

    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                navLinks.classList.add('hidden');
                menuIcon.classList.remove('fa-xmark');
                menuIcon.classList.add('fa-bars');
            }
        });
    });
}