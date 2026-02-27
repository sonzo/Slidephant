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
(function () {
    var currentSlide = 0;
    var slideContainer = null;
    var scriptPath = (function () {
        var scripts = document.getElementsByTagName('script');
        for (var i = scripts.length - 1; i >= 0; i--) {
            if (scripts[i].src && scripts[i].src.indexOf('Slidephant.js') !== -1) {
                var src = scripts[i].src;
                return src.substring(0, src.lastIndexOf('/') + 1);
            }
        }
        return '';
    })();

    function attachCSS() {
        if (!document.getElementById('slidephant-css')) {
            var link = document.createElement('link');
            link.id = 'slidephant-css';
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = scriptPath + 'Slidephant.css';
            document.head.appendChild(link);
        }
    }

    function updateURL() {
        var slideCount = slideContainer ? slideContainer.querySelectorAll('section').length : 0;
        var hash = '#' + (currentSlide + 1) + '/' + slideCount;
        if (window.location.hash !== hash) {
            window.location.hash = hash;
        }
    }

    function getSlideFromURL() {
        var hash = window.location.hash.replace('#', '');
        var n = parseInt(hash.split('/')[0], 10);
        var slideCount = slideContainer ? slideContainer.querySelectorAll('section').length : 0;
        if (!isNaN(n) && n > 0 && n <= slideCount) {
            return n - 1;
        }
        return 0;
    }

    function renderSlide() {
        if (!slideContainer) return;

        var sections = slideContainer.querySelectorAll('section');
        sections.forEach(function (section, index) {
            if (index === currentSlide) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });

        if (!document.getElementById('slidephant-logo')) {
            var logo = document.createElement('img');
            logo.id = 'slidephant-logo';
            logo.src = scriptPath + 'Slidephant.png';
            logo.alt = 'Slidephant Logo';
            logo.title = 'Slidephant - MIT License';
            document.body.appendChild(logo);
        }

        updateSlideButtonStates();
        updateURL();
    }

    function updateSlideButtonStates() {
        var slideCount = slideContainer ? slideContainer.querySelectorAll('section').length : 0;
        var prevBtn = document.getElementById('slidephant-prev-btn');
        var nextBtn = document.getElementById('slidephant-next-btn');

        if (prevBtn) {
            prevBtn.disabled = currentSlide === 0;
        }
        if (nextBtn) {
            nextBtn.disabled = currentSlide >= slideCount - 1;
        }
    }

    function nextSlide() {
        var slideCount = slideContainer ? slideContainer.querySelectorAll('section').length : 0;
        if (currentSlide < slideCount - 1) {
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

        var sections = document.querySelectorAll('body > section');
        sections.forEach(function (section) {
            slideContainer.appendChild(section);
        });

        // Create navigation buttons
        if (!document.getElementById('slidephant-prev-btn')) {
            var prevBtn = document.createElement('button');
            prevBtn.id = 'slidephant-prev-btn';
            prevBtn.className = 'slidephant-nav-btn';
            prevBtn.innerHTML = '&#10094;';
            prevBtn.title = 'Previous slide (Left arrow key)';
            prevBtn.addEventListener('click', prevSlide);
            document.body.appendChild(prevBtn);
        }

        if (!document.getElementById('slidephant-next-btn')) {
            var nextBtn = document.createElement('button');
            nextBtn.id = 'slidephant-next-btn';
            nextBtn.className = 'slidephant-nav-btn';
            nextBtn.innerHTML = '&#10095;';
            nextBtn.title = 'Next slide (Right arrow key)';
            nextBtn.addEventListener('click', nextSlide);
            document.body.appendChild(nextBtn);
        }

        currentSlide = getSlideFromURL();
        renderSlide();
        document.addEventListener('keydown', handleKey);

        window.addEventListener('hashchange', function () {
            var idx = getSlideFromURL();
            var slideCount = slideContainer.querySelectorAll('section').length;
            if (idx !== currentSlide && idx >= 0 && idx < slideCount) {
                currentSlide = idx;
                renderSlide();
            }
        });
    }

    window.SlidephantInit = initSlidephant;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSlidephant);
    } else {
        initSlidephant();
    }
})();
