/* ==========================================================================
   WEBMINT // CREATIVE ENGINE (JS)
   Lenis Smooth Scroll, Three.js 3D Spatial Canvas, GSAP ScrollTrigger,
   Magnetic Blob Cursor & Procedural Canvas Shaders
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // 1. LENIS SMOOTH SCROLL & GSAP SETUP
    // =========================================================================
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
        duration: 1.3,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);


    // =========================================================================
    // 2. MAGNETIC BLOB CURSOR
    // =========================================================================
    const cursorBlob = document.getElementById('cursor-blob');
    const cursorDot = document.getElementById('cursor-dot');

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let blob = { x: mouse.x, y: mouse.y };
    let dot = { x: mouse.x, y: mouse.y };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // Render loop for smooth cursor physics
    function updateCursor() {
        // Lerp blob for fluid delay
        blob.x += (mouse.x - blob.x) * 0.15;
        blob.y += (mouse.y - blob.y) * 0.15;

        // Fast lerp dot
        dot.x += (mouse.x - dot.x) * 0.45;
        dot.y += (mouse.y - dot.y) * 0.45;

        cursorBlob.style.transform = `translate3d(${blob.x}px, ${blob.y}px, 0) translate(-50%, -50%)`;
        cursorDot.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0) translate(-50%, -50%)`;

        requestAnimationFrame(updateCursor);
    }
    requestAnimationFrame(updateCursor);

    // Interactive cursor state listeners
    const magneticElements = document.querySelectorAll('[data-cursor="magnetic"]');
    const expandElements = document.querySelectorAll('[data-cursor="expand"]');

    magneticElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorBlob.classList.add('is-magnetic'));
        el.addEventListener('mouseleave', () => {
            cursorBlob.classList.remove('is-magnetic');
            el.style.transform = 'translate3d(0, 0, 0)';
        });

        // Magnetic Pull effect
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const deltaX = (e.clientX - centerX) * 0.3;
            const deltaY = (e.clientY - centerY) * 0.3;

            gsap.to(el, {
                x: deltaX,
                y: deltaY,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });

    expandElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorBlob.classList.add('is-expanded'));
        el.addEventListener('mouseleave', () => cursorBlob.classList.remove('is-expanded'));
    });


    // =========================================================================
    // 3. PRELOADER & HERO REVEAL ANIMAION
    // =========================================================================
    const loaderCounter = document.getElementById('loader-counter');
    const loaderBar = document.getElementById('loader-bar');
    const loaderLeft = document.querySelector('.loader-left');
    const loaderRight = document.querySelector('.loader-right');
    const loaderContent = document.querySelector('.loader-content');
    const preloader = document.getElementById('preloader');

    let count = 0;
    const countInterval = setInterval(() => {
        count += Math.floor(Math.random() * 8) + 2;
        if (count > 100) count = 100;

        loaderCounter.textContent = String(count).padStart(3, '0');
        loaderBar.style.width = `${count}%`;

        if (count === 100) {
            clearInterval(countInterval);
            setTimeout(completePreloader, 400);
        }
    }, 30);

    function completePreloader() {
        gsap.to(loaderContent, {
            opacity: 0,
            y: -30,
            duration: 0.6,
            ease: "power2.inOut",
            onComplete: () => {
                // Split curtain out animation
                loaderLeft.style.transform = 'translateX(-100%)';
                loaderRight.style.transform = 'translateX(100%)';

                setTimeout(() => {
                    preloader.style.pointerEvents = 'none';
                    animateHeroEntrance();
                }, 600);
            }
        });
    }

    function animateHeroEntrance() {
        const titleLines = document.querySelectorAll('.hero-title');
        const heroDesc = document.querySelector('.hero-subtext');
        const scrollInd = document.querySelector('.hero-scroll-indicator');

        const tl = gsap.timeline({ defaults: { ease: "cubic-bezier(0.87, 0, 0.13, 1)" } });

        tl.to(titleLines, {
            y: "0%",
            duration: 1.2,
            stagger: 0.15
        })
        .from([heroDesc, scrollInd], {
            opacity: 0,
            y: 20,
            duration: 0.8,
            stagger: 0.1
        }, "-=0.6");
    }


    // =========================================================================
    // 4. THREE.JS 3D CANVAS (PHOTOREALISTIC 3D BLACK HOLE ENGINE)
    // =========================================================================
    const canvas = document.getElementById('hero-canvas');
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 4.8;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Master Black Hole Container Group
    const blackHoleGroup = new THREE.Group();
    scene.add(blackHoleGroup);

    // -------------------------------------------------------------------------
    // A. EVENT HORIZON (SINGULARITY CORE SPHERE)
    // -------------------------------------------------------------------------
    const eventHorizonGeo = new THREE.SphereGeometry(1.2, 64, 64);
    const eventHorizonMat = new THREE.MeshBasicMaterial({
        color: 0x000000
    });
    const eventHorizonCore = new THREE.Mesh(eventHorizonGeo, eventHorizonMat);
    blackHoleGroup.add(eventHorizonCore);

    // -------------------------------------------------------------------------
    // B. PHOTON RING (HIGH-INTENSITY SCHWARZSCHILD GLOW EDGE)
    // -------------------------------------------------------------------------
    const photonRingGeo = new THREE.TorusGeometry(1.23, 0.035, 32, 128);
    const photonRingMat = new THREE.MeshBasicMaterial({
        color: 0x00FF9D,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending
    });
    const photonRing = new THREE.Mesh(photonRingGeo, photonRingMat);
    blackHoleGroup.add(photonRing);

    // -------------------------------------------------------------------------
    // C. ACCRETION DISK (PROCEDURAL PLASMA RING)
    // -------------------------------------------------------------------------
    // Generate high-resolution procedural accretion plasma texture on offscreen canvas
    const diskCanvas = document.createElement('canvas');
    diskCanvas.width = 512;
    diskCanvas.height = 512;
    const diskCtx = diskCanvas.getContext('2d');

    const grad = diskCtx.createRadialGradient(256, 256, 40, 256, 256, 256);
    grad.addColorStop(0.0, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(0.18, 'rgba(0, 255, 157, 0.95)');
    grad.addColorStop(0.4, 'rgba(37, 91, 179, 0.85)');
    grad.addColorStop(0.65, 'rgba(255, 191, 0, 0.7)');
    grad.addColorStop(0.9, 'rgba(37, 91, 179, 0.25)');
    grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

    diskCtx.fillStyle = grad;
    diskCtx.fillRect(0, 0, 512, 512);

    // Draw spiral noise lines into disk texture
    diskCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    diskCtx.lineWidth = 2;
    for (let r = 50; r < 240; r += 12) {
        diskCtx.beginPath();
        diskCtx.arc(256, 256, r, 0, Math.PI * 2);
        diskCtx.stroke();
    }

    const diskTexture = new THREE.CanvasTexture(diskCanvas);
    const accretionDiskGeo = new THREE.RingGeometry(1.3, 4.2, 128, 64);
    
    // Remap UV coordinates for radial ring sampling
    const pos = accretionDiskGeo.attributes.position;
    const uvs = accretionDiskGeo.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
        const vx = pos.getX(i);
        const vy = pos.getY(i);
        const distance = Math.sqrt(vx * vx + vy * vy);
        const normDist = (distance - 1.3) / (4.2 - 1.3);
        uvs.setXY(i, normDist, 0.5);
    }

    const accretionDiskMat = new THREE.MeshBasicMaterial({
        map: diskTexture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.88,
        blending: THREE.AdditiveBlending
    });

    const accretionDisk = new THREE.Mesh(accretionDiskGeo, accretionDiskMat);
    accretionDisk.rotation.x = Math.PI / 2.3;
    blackHoleGroup.add(accretionDisk);

    // -------------------------------------------------------------------------
    // D. GRAVITATIONAL LENSING HALO ARCS (INTERSTELLAR WARPED LIGHT HALOS)
    // -------------------------------------------------------------------------
    // Upper Lensing Arc (Curved over the top of the event horizon)
    const upperLensingGeo = new THREE.TorusGeometry(1.48, 0.38, 32, 128, Math.PI);
    const upperLensingMat = new THREE.MeshBasicMaterial({
        color: 0x00FF9D,
        transparent: true,
        opacity: 0.45,
        wireframe: true,
        blending: THREE.AdditiveBlending
    });
    const upperLensingArc = new THREE.Mesh(upperLensingGeo, upperLensingMat);
    upperLensingArc.rotation.x = Math.PI * 0.42;
    upperLensingArc.position.y = 0.2;
    blackHoleGroup.add(upperLensingArc);

    // Lower Lensing Arc (Curved under the bottom of the event horizon)
    const lowerLensingGeo = new THREE.TorusGeometry(1.48, 0.38, 32, 128, Math.PI);
    const lowerLensingMat = new THREE.MeshBasicMaterial({
        color: 0x255BB3,
        transparent: true,
        opacity: 0.45,
        wireframe: true,
        blending: THREE.AdditiveBlending
    });
    const lowerLensingArc = new THREE.Mesh(lowerLensingGeo, lowerLensingMat);
    lowerLensingArc.rotation.x = -Math.PI * 0.42;
    lowerLensingArc.rotation.z = Math.PI;
    lowerLensingArc.position.y = -0.2;
    blackHoleGroup.add(lowerLensingArc);

    // -------------------------------------------------------------------------
    // E. ACCRETION PARTICLE INFALL & COSMIC DUST JETS
    // -------------------------------------------------------------------------
    const particleCount = 3500;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleRadii = new Float32Array(particleCount);
    const particleAngles = new Float32Array(particleCount);
    const particleSpeeds = new Float32Array(particleCount);

    const cyanColor = new THREE.Color(0x00FF9D);
    const blueColor = new THREE.Color(0x255BB3);

    for (let i = 0; i < particleCount; i++) {
        const radius = 1.35 + Math.random() * 6.5;
        const angle = Math.random() * Math.PI * 2;
        const speed = (0.005 + Math.random() * 0.015) * (3.0 / Math.sqrt(radius));

        particleRadii[i] = radius;
        particleAngles[i] = angle;
        particleSpeeds[i] = speed;

        particlePositions[i * 3] = Math.cos(angle) * radius;
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * (0.35 + radius * 0.1);
        particlePositions[i * 3 + 2] = Math.sin(angle) * radius;

        // Color interpolation based on distance to event horizon
        const mixRatio = Math.min(1, (radius - 1.35) / 5.0);
        const pColor = cyanColor.clone().lerp(blueColor, mixRatio);
        particleColors[i * 3] = pColor.r;
        particleColors[i * 3 + 1] = pColor.g;
        particleColors[i * 3 + 2] = pColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
        size: 0.032,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    particleSystem.rotation.x = Math.PI / 2.3;
    blackHoleGroup.add(particleSystem);


    // -------------------------------------------------------------------------
    // F. MOUSE PARALLAX TRACKING & SCROLL TRAJECTORY
    // -------------------------------------------------------------------------
    let mouseTargetX = 0;
    let mouseTargetY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseTargetX = (e.clientX / window.innerWidth - 0.5) * 1.2;
        mouseTargetY = (e.clientY / window.innerHeight - 0.5) * 1.2;
    });

    // -------------------------------------------------------------------------
    // G. RENDER LOOP
    // -------------------------------------------------------------------------
    const clock = new THREE.Clock();
    let scrollRotationMultiplier = 1.0;

    function render3D() {
        const elapsedTime = clock.getElapsedTime();

        // 1. Accretion Disk Rotation
        accretionDisk.rotation.z = elapsedTime * 0.15 * scrollRotationMultiplier;
        photonRing.rotation.z = -elapsedTime * 0.25;

        // 2. Gravitational Lensing Halos Counter Oscillations
        upperLensingArc.rotation.z = Math.sin(elapsedTime * 0.4) * 0.1;
        lowerLensingArc.rotation.z = Math.PI + Math.cos(elapsedTime * 0.4) * 0.1;

        // 3. Orbital Accretion Particles Simulation
        const positions = particleGeo.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            particleAngles[i] += particleSpeeds[i] * scrollRotationMultiplier;
            positions[i * 3] = Math.cos(particleAngles[i]) * particleRadii[i];
            positions[i * 3 + 2] = Math.sin(particleAngles[i]) * particleRadii[i];
        }
        particleGeo.attributes.position.needsUpdate = true;

        // 4. Smooth Camera & Black Hole Mouse Parallax Lerp
        camera.position.x += (mouseTargetX - camera.position.x) * 0.05;
        camera.position.y += (-mouseTargetY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
        requestAnimationFrame(render3D);
    }
    render3D();

    // Handle Window Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });


    // =========================================================================
    // 4B. SCROLL-DRIVEN 3D BLACK HOLE TRAJECTORY & ORBITAL CAMERA TIMELINE
    // =========================================================================
    // Dynamic GSAP ScrollTrigger timeline moving the 3D Black Hole through space as user scrolls
    const heroSection = document.getElementById('hero');
    const aboutSection = document.getElementById('about');
    const worksSection = document.getElementById('works');
    const skillsSection = document.getElementById('skills');
    const testimonialsSection = document.getElementById('testimonials');

    if (aboutSection) {
        // Hero -> About Transition: Zoom closer, tilt disk to 45 degrees
        gsap.timeline({
            scrollTrigger: {
                trigger: aboutSection,
                start: "top bottom",
                end: "top top",
                scrub: 1
            }
        })
        .to(blackHoleGroup.rotation, {
            x: 0.55,
            y: 0.35,
            z: -0.2,
            ease: "none"
        })
        .to(camera.position, {
            z: 3.7,
            ease: "none"
        }, 0);
    }

    if (worksSection) {
        // About -> Selected Works Horizontal Track: Orbit around Y-axis & accelerate plasma disk
        gsap.timeline({
            scrollTrigger: {
                trigger: worksSection,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
                onUpdate: (self) => {
                    scrollRotationMultiplier = 1.0 + self.getVelocity() * 0.0025;
                }
            }
        })
        .to(blackHoleGroup.rotation, {
            y: Math.PI * 1.2,
            x: 0.25,
            ease: "none"
        })
        .to(blackHoleGroup.position, {
            x: 0.8,
            ease: "none"
        }, 0);
    }

    if (skillsSection) {
        // Selected Works -> Capabilities: Pull camera back for high-energy spatial perspective
        gsap.timeline({
            scrollTrigger: {
                trigger: skillsSection,
                start: "top bottom",
                end: "top top",
                scrub: 1
            }
        })
        .to(blackHoleGroup.rotation, {
            x: 0.85,
            z: -0.45,
            ease: "none"
        })
        .to(blackHoleGroup.position, {
            x: -0.6,
            y: 0.3,
            ease: "none"
        }, 0)
        .to(camera.position, {
            z: 5.2,
            ease: "none"
        }, 0);
    }

    if (testimonialsSection) {
        // Endorsements Section: Final deep gravitational alignment
        gsap.timeline({
            scrollTrigger: {
                trigger: testimonialsSection,
                start: "top bottom",
                end: "bottom bottom",
                scrub: 1
            }
        })
        .to(blackHoleGroup.rotation, {
            x: 0.3,
            y: Math.PI * 2,
            z: 0,
            ease: "none"
        })
        .to(blackHoleGroup.position, {
            x: 0,
            y: 0,
            ease: "none"
        }, 0)
        .to(camera.position, {
            z: 4.2,
            ease: "none"
        }, 0);
    }


    // =========================================================================
    // 5. HERO 3D TYPOGRAPHY TILT & LAYERED DEPTH PARALLAX
    // =========================================================================
    const heroTitleContainer = document.getElementById('hero-title-container');
    if (heroTitleContainer) {
        const titleLines = heroTitleContainer.querySelectorAll('.hero-title');

        window.addEventListener('mousemove', (e) => {
            const xPct = (e.clientX / window.innerWidth - 0.5);
            const yPct = (e.clientY / window.innerHeight - 0.5);

            gsap.to(heroTitleContainer, {
                rotateY: xPct * 22,
                rotateX: -yPct * 22,
                duration: 0.8,
                ease: "power2.out"
            });

            titleLines.forEach(line => {
                const depth = parseFloat(line.getAttribute('data-depth')) || 30;
                gsap.to(line, {
                    z: xPct * depth,
                    duration: 0.8,
                    ease: "power2.out"
                });
            });
        });
    }


    // =========================================================================
    // 6. ABOUT SECTION WORD-BY-WORD SCROLL REVEAL
    // =========================================================================
    const revealTextEl = document.getElementById('about-reveal-text');
    if (revealTextEl) {
        const words = revealTextEl.textContent.trim().split(/\s+/);
        revealTextEl.innerHTML = words.map(w => `<span class="reveal-word">${w}</span>`).join(' ');

        const wordSpans = revealTextEl.querySelectorAll('.reveal-word');

        gsap.to(wordSpans, {
            scrollTrigger: {
                trigger: revealTextEl,
                start: "top 80%",
                end: "bottom 30%",
                scrub: 0.8,
            },
            opacity: 1,
            color: "#F4F4F4",
            stagger: 0.1,
            ease: "none"
        });
    }

    // Stat Cards Counter Animation
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        const statNumber = card.querySelector('.stat-number');
        const targetVal = parseInt(statNumber.getAttribute('data-target'), 10);

        if (!isNaN(targetVal)) {
            ScrollTrigger.create({
                trigger: card,
                start: "top 85%",
                onEnter: () => {
                    gsap.fromTo(statNumber, 
                        { textContent: 0 },
                        {
                            textContent: targetVal,
                            duration: 2,
                            ease: "power2.out",
                            snap: { textContent: 1 },
                            onUpdate: function() {
                                const val = Math.floor(this.targets()[0].textContent);
                                if (targetVal === 99) {
                                    statNumber.textContent = val + '%';
                                } else if (targetVal === 8 || targetVal === 42) {
                                    statNumber.textContent = (val < 10 ? '0' + val : val) + '+';
                                } else {
                                    statNumber.textContent = val;
                                }
                            }
                        }
                    );
                }
            });
        }
    });


    // =========================================================================
    // 7. SELECTED WORKS HORIZONTAL PIN SCROLL
    // =========================================================================
    const worksTrack = document.getElementById('works-track');
    const worksPinWrapper = document.querySelector('.works-pin-wrapper');

    if (worksTrack && worksPinWrapper) {
        function getScrollAmount() {
            return worksTrack.scrollWidth - window.innerWidth;
        }

        const tween = gsap.to(worksTrack, {
            x: () => -getScrollAmount(),
            ease: "none",
            scrollTrigger: {
                trigger: worksPinWrapper,
                start: "top top",
                end: () => "+=" + getScrollAmount(),
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
                anticipatePin: 1
            }
        });

        // Parallax image shift inside project cards during horizontal scroll
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            const canvasShader = card.querySelector('.card-canvas-shader');

            gsap.to(canvasShader, {
                x: -40,
                ease: "none",
                scrollTrigger: {
                    trigger: card,
                    containerAnimation: tween,
                    start: "left right",
                    end: "right left",
                    scrub: true
                }
            });
        });
    }


    // =========================================================================
    // 8. PROJECT CARDS PROCEDURAL CANVAS SHADER ANIMATION
    // =========================================================================
    const cardCanvases = document.querySelectorAll('.card-canvas-shader');

    cardCanvases.forEach((cCanvas, index) => {
        const ctx = cCanvas.getContext('2d');
        let width = cCanvas.width = cCanvas.parentElement.clientWidth;
        let height = cCanvas.height = cCanvas.parentElement.clientHeight;

        let time = index * 100;
        let isHovered = false;
        let waveSpeed = 0.02;

        cCanvas.parentElement.addEventListener('mouseenter', () => {
            isHovered = true;
        });

        cCanvas.parentElement.addEventListener('mouseleave', () => {
            isHovered = false;
        });

        function renderCardShader() {
            time += isHovered ? 0.05 : 0.015;

            ctx.clearRect(0, 0, width, height);

            // Create procedural generative liquid gradient pattern
            const grad = ctx.createLinearGradient(0, 0, width, height);
            if (index % 2 === 0) {
                grad.addColorStop(0, '#060911');
                grad.addColorStop(0.5, '#255BB3');
                grad.addColorStop(1, '#00FF9D');
            } else {
                grad.addColorStop(0, '#04070d');
                grad.addColorStop(0.5, '#00FF9D');
                grad.addColorStop(1, '#255BB3');
            }

            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);

            // Draw animated liquid wave mesh overlay
            ctx.fillStyle = 'rgba(5, 5, 8, 0.4)';
            ctx.beginPath();
            for (let x = 0; x < width; x += 15) {
                const y = Math.sin(x * 0.01 + time) * 35 + Math.cos(x * 0.02 + time * 0.8) * 20 + height * 0.5;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.closePath();
            ctx.fill();

            // Draw glowing node points
            for (let i = 0; i < 8; i++) {
                const nodeX = (Math.sin(time + i * 2) * 0.4 + 0.5) * width;
                const nodeY = (Math.cos(time * 0.8 + i * 1.5) * 0.4 + 0.5) * height;

                ctx.beginPath();
                ctx.arc(nodeX, nodeY, isHovered ? 6 : 3, 0, Math.PI * 2);
                ctx.fillStyle = i % 2 === 0 ? '#00FF9D' : '#255BB3';
                ctx.shadowColor = '#00FF9D';
                ctx.shadowBlur = isHovered ? 25 : 10;
                ctx.fill();
            }

            requestAnimationFrame(renderCardShader);
        }

        renderCardShader();

        window.addEventListener('resize', () => {
            width = cCanvas.width = cCanvas.parentElement.clientWidth;
            height = cCanvas.height = cCanvas.parentElement.clientHeight;
        });
    });


    // =========================================================================
    // 9. MAGNETIC CTA BUTTON WITH ELASTIC PHYSICS
    // =========================================================================
    const magneticBtn = document.getElementById('magnetic-btn');

    if (magneticBtn) {
        magneticBtn.addEventListener('mousemove', (e) => {
            const rect = magneticBtn.getBoundingClientRect();
            const btnX = e.clientX - rect.left - rect.width / 2;
            const btnY = e.clientY - rect.top - rect.height / 2;

            gsap.to(magneticBtn, {
                x: btnX * 0.4,
                y: btnY * 0.4,
                duration: 0.4,
                ease: "power2.out"
            });
        });

        magneticBtn.addEventListener('mouseleave', () => {
            gsap.to(magneticBtn, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: "elastic.out(1, 0.3)"
            });
        });
    }

});
