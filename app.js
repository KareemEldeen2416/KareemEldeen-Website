AOS.init({
    once: false,
    mirror: true
});

function changeSlide(containerId, direction) {
    const container = document.getElementById(containerId);
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

// سكريبت معالجة الفورم وإرسال البيانات عبر عارض الـ EmailJS
document.getElementById('bookingForm').addEventListener('submit', function(event) {
    event.preventDefault(); // منع الصفحة من إعادة التحميل

    // الإشارة إلى زر الإرسال لتبديل الحالة وتفعيل تأثير جاري المعالجة
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin text-lg"></i> جاري إرسال طلبك...';
    submitBtn.disabled = true;

    // إرسال البيانات مباشرة
    // ملاحظة: تذكر استبدال قيم المَعلمات بالمعرفات الخاصة بك من موقع EmailJS
    emailjs.sendForm('service_wczh6om', 'template_xsl0oef', this)
        .then(function() {
            alert('تم تأكيد حجز جلستك الاستشارية بنجاح! سنتواصل معك في أقرب وقت ممكن.');
            document.getElementById('bookingForm').reset(); // إفراغ الخانات بعد نجاح الإرسال
        }, function(error) {
            alert('عذراً، حدث خطأ أثناء إرسال البيانات. يرجى التحقق وإعادة المحاولة: ' + JSON.stringify(error));
        })
        .finally(function() {
            // إعادة الزر إلى حالته الأساسية
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        });
});