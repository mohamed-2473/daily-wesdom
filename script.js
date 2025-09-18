// DOM Elements
const adviceElement = document.getElementById("advice");
const adviceNo = document.getElementById("advice-no");
const generateBtn = document.getElementById("generate-btn");
const adviceCard = document.querySelector(".advice-card");
const particlesContainer = document.getElementById("particles");

// Create animated background particles
function createParticles() {
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 4) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Fetch advice from API
async function getAdvice() {
    try {
        const response = await fetch("https://api.adviceslip.com/advice");
        if (!response.ok) throw new Error('Failed to fetch advice');
        const data = await response.json();
        return data.slip;
    } catch (error) {
        console.error('Error fetching advice:', error);
        return {
            id: Math.floor(Math.random() * 1000),
            advice: "The best way to predict the future is to create it."
        };
    }
}

// Render advice with animations
async function renderAdvice() {
    if (!adviceElement || !adviceNo || !generateBtn) {
        console.warn("Missing DOM elements.");
        return;
    }

    // Add loading state
    adviceCard.classList.add('loading');
    generateBtn.classList.add('spinning');

    // Add spinning animation
    generateBtn.style.pointerEvents = 'none';

    try {
        const result = await getAdvice();

        // Simulate minimum loading time for better UX
        await new Promise(resolve => setTimeout(resolve, 800));

        // Update content with fade effect
        adviceElement.style.opacity = '0';
        adviceNo.style.opacity = '0';

        setTimeout(() => {
            adviceElement.textContent = result.advice;
            adviceNo.textContent = `ADVICE #${result.id}`;

            // Fade back in
            adviceElement.style.opacity = '1';
            adviceNo.style.opacity = '1';
            adviceElement.style.transition = 'opacity 0.5s ease';
            adviceNo.style.transition = 'opacity 0.5s ease';
        }, 250);

    } catch (error) {
        console.error('Error rendering advice:', error);
    } finally {
        // Remove loading state
        setTimeout(() => {
            adviceCard.classList.remove('loading');
            generateBtn.classList.remove('spinning');
            generateBtn.style.pointerEvents = 'auto';
        }, 1000);
    }
}

// Smooth scroll to advice section
function scrollToAdvice() {
    document.getElementById('advice-section').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

// Animate stats numbers
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const targets = [224, 15, 100]; // Target numbers
    const labels = ['K+', '∞'];

    statNumbers.forEach((stat, index) => {
        if (index === 2) return; // Skip infinity symbol

        let current = 0;
        const target = targets[index];
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
                if (index === 1) stat.textContent = target + 'K+';
                else stat.textContent = Math.floor(current);
            } else {
                stat.textContent = Math.floor(current) + (index === 1 ? 'K+' : '');
            }
        }, 30);
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('stats-section')) {
                animateStats();
                observer.unobserve(entry.target);
            }
        }
    });
}, observerOptions);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    renderAdvice();
    observer.observe(document.querySelector('.stats-section'));

    // Add click event listener
    generateBtn?.addEventListener("click", renderAdvice);

    // Add keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'Enter') {
            e.preventDefault();
            renderAdvice();
        }
    });
});

// Add some extra interactivity
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.advice-card, .stat-card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        } else {
            card.style.transform = '';
        }
    });
});