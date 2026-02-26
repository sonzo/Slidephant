/*
Slidephant.js: JavaScript slideshow engine

MIT License

Copyright (c) 2026 Slidephant contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
(function(){
    var slides = [];
    var currentSlide = 0;
    var slideContainer = null;

    function attachCSS() {
        if (!document.getElementById('slidephant-css')) {
            var link = document.createElement('link');
            link.id = 'slidephant-css';
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = 'Slidephant.css';
            document.head.appendChild(link);
        }
    }

    function updateURL() {
        var hash = '#' + (currentSlide + 1);
        if (window.location.hash !== hash) {
            window.location.hash = hash;
        }
    }

    function getSlideFromURL() {
        var n = parseInt(window.location.hash.replace('#', ''), 10);
        if (!isNaN(n) && n > 0 && n <= slides.length) {
            return n - 1;
        }
        return 0;
    }

    window.AddSlide = function(htmlContent) {
        slides.push(htmlContent);
    };

    function renderSlide() {
        if (!slideContainer) return;
        slideContainer.innerHTML = slides[currentSlide] || '';

        if (!document.getElementById('slidephant-logo')) {
            var logo = document.createElement('img');
            logo.id = 'slidephant-logo';
            logo.src = 'Slidephant.png';
            logo.alt = 'Slidephant Logo';
            logo.title = 'Slidephant - MIT License';
            document.body.appendChild(logo);
        }
        slideContainer.style.height = '';
        updateURL();
    }

    function nextSlide() {
        if (currentSlide < slides.length - 1) {
            currentSlide++;
            renderSlide();
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            renderSlide();
        }
    }

    function handleKey(e) {
        if (e.key === 'ArrowRight' || e.key === 'Enter') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        }
    }

    function initSlidephant() {
        attachCSS();
        slideContainer = document.getElementById('slidephant-container');
        if (!slideContainer) {
            slideContainer = document.createElement('div');
            slideContainer.id = 'slidephant-container';
            document.body.appendChild(slideContainer);
        }

        currentSlide = getSlideFromURL();
        renderSlide();
        document.addEventListener('keydown', handleKey);

        window.addEventListener('hashchange', function() {
            var idx = getSlideFromURL();
            if (idx !== currentSlide && idx >= 0 && idx < slides.length) {
                currentSlide = idx;
                renderSlide();
            }
        });
    }

    window.SlidephantInit = initSlidephant;
})();
