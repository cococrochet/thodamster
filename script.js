// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // Sidebar Toggle Functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            // Determine the current window width to handle responsive behaviors
            const windowWidth = window.innerWidth;

            if (windowWidth <= 900) {
                // On mobile/tablet, toggle a class that shows/hides the sidebar overlay
                sidebar.classList.toggle('active');
            } else {
                // On desktop, toggle between full and collapsed states
                if (sidebar.style.width === '80px') {
                    sidebar.style.width = '260px';
                    mainContent.style.marginLeft = '260px';
                    // Show text spans
                    document.querySelectorAll('.sidebar span').forEach(el => el.style.display = 'inline');
                    document.querySelectorAll('.sidebar-section-title, .divider').forEach(el => el.style.display = 'block');
                } else {
                    sidebar.style.width = '80px';
                    mainContent.style.marginLeft = '80px';
                    // Hide text spans
                    document.querySelectorAll('.sidebar span, .sidebar-section-title, .divider').forEach(el => el.style.display = 'none');
                }
            }
        });
    }

    // Category Buttons Active State
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked
            btn.classList.add('active');
        });
    });

    // Optional: Add horizontal scroll via mouse drag on categories
    const categoriesScroll = document.querySelector('.categories');
    let isDown = false;
    let startX;
    let scrollLeft;

    if (categoriesScroll) {
        categoriesScroll.addEventListener('mousedown', (e) => {
            isDown = true;
            categoriesScroll.style.cursor = 'grabbing';
            startX = e.pageX - categoriesScroll.offsetLeft;
            scrollLeft = categoriesScroll.scrollLeft;
        });
        categoriesScroll.addEventListener('mouseleave', () => {
            isDown = false;
            categoriesScroll.style.cursor = 'grab';
        });
        categoriesScroll.addEventListener('mouseup', () => {
            isDown = false;
            categoriesScroll.style.cursor = 'grab';
        });
        categoriesScroll.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - categoriesScroll.offsetLeft;
            const walk = (x - startX) * 2; // Scroll speed multiplier
            categoriesScroll.scrollLeft = scrollLeft - walk;
        });
    }

    // --- Supabase Integration ---
    // Initialize Supabase
    const supabaseUrl = 'https://kufnipfpovzgvfwrmczz.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1Zm5pcGZwb3Z6Z3Zmd3JtY3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2NDI4MTIsImV4cCI6MjA4NzIxODgxMn0.1xcZawk1W2gx4pqoxIda0_ARlbGld8auz_LfaK31d9o';
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    // --- 18+ Warning Modal Logic ---
    const warningModal = document.getElementById('warning-modal');
    const warningForm = document.getElementById('warning-form');
    const passwordInput = document.getElementById('site-password');
    const errorMsg = document.getElementById('password-error');
    const exitBtn = document.getElementById('exit-site-btn');

    // Prevent scrolling while warning is active
    document.body.style.overflow = 'hidden';

    if (exitBtn) {
        exitBtn.addEventListener('click', () => {
            window.location.href = 'https://www.google.com';
        });
    }

    if (warningForm) {
        warningForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const password = passwordInput.value;

            if (password === 'thodayanhawtieaowww') {
                // Success!
                warningModal.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            } else {
                // Fail
                errorMsg.textContent = 'Incorrect password. Access denied.';
                passwordInput.value = '';
                passwordInput.focus();
            }
        });
    }

    // Modal Logic
    const uploadModal = document.getElementById('upload-modal');
    const openUploadBtn = document.getElementById('open-upload-modal');
    const closeUploadBtn = document.getElementById('close-upload-modal');
    const uploadForm = document.getElementById('upload-form');
    const submitBtn = document.getElementById('upload-submit-btn');
    const videoGrid = document.getElementById('video-grid');

    if (openUploadBtn) {
        openUploadBtn.addEventListener('click', () => {
            uploadModal.classList.add('active');
        });
    }

    if (closeUploadBtn) {
        closeUploadBtn.addEventListener('click', () => {
            uploadModal.classList.remove('active');
            uploadForm.reset();
        });
    }

    // Helper functions for random data
    const channels = ['DevHub', 'Design Masters', 'Tech Visionaries', 'Daily Vlog', 'Gaming Center', 'Auto Dynamic', 'Code Academy', 'Global Bites'];
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const getRandomChannel = () => channels[getRandomInt(0, channels.length - 1)];
    const getRandomAvatar = () => `https://i.pravatar.cc/150?u=${getRandomInt(1, 1000)}`;

    const formatDuration = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const formatViews = (views) => {
        if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
        if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
        return views.toString();
    };

    // Form Submission
    if (uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
                alert('Please enter your Supabase Anon Key in script.js to upload.');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Uploading...';

            try {
                const title = document.getElementById('video-title').value;
                const desc = document.getElementById('video-desc').value;
                const fileInput = document.getElementById('video-thumb');
                const file = fileInput.files[0];

                if (!file) throw new Error('Please select an image file');

                // 1. Upload Image
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('thumbnails')
                    .upload(fileName, file);

                if (uploadError) throw uploadError;

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('thumbnails')
                    .getPublicUrl(fileName);

                // 2. Insert Database Record
                const newVideo = {
                    title: title,
                    description: desc,
                    thumbnail_url: publicUrl,
                    duration: getRandomInt(60, 3600), // Random duration 1m to 1hr
                    views: getRandomInt(100, 5000000), // Random views 100 to 5M
                    channel_name: getRandomChannel(),
                    avatar_url: getRandomAvatar()
                };

                const { data: insertData, error: insertError } = await supabase
                    .from('videos')
                    .insert([newVideo]);

                if (insertError) throw insertError;

                // Success
                uploadModal.classList.remove('active');
                uploadForm.reset();

                // Refresh grid
                fetchVideos();

            } catch (error) {
                console.error('Upload Error:', error);
                alert('Error uploading video: ' + error.message);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Upload to Thodamster';
            }
        });
    }

    // Fetch Videos
    async function fetchVideos() {
        if (!videoGrid || supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
            if (videoGrid) {
                videoGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">Please paste your Supabase Anon Key in script.js to view videos.</div>';
            }
            return;
        }

        try {
            const { data, error } = await supabase
                .from('videos')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data.length === 0) {
                videoGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">No videos uploaded yet. Be the first to upload!</div>';
                return;
            }

            videoGrid.innerHTML = data.map(video => `
                <article class="video-card">
                    <div class="thumbnail-wrapper">
                        <img src="${video.thumbnail_url}" alt="Video Thumbnail" class="thumbnail" loading="lazy">
                        <span class="duration">${formatDuration(video.duration)}</span>
                        <div class="hover-player">
                            <i class="ri-play-fill play-icon"></i>
                        </div>
                    </div>
                    <div class="video-info">
                        <img src="${video.avatar_url}" alt="Channel Avatar" class="avatar" loading="lazy">
                        <div class="meta">
                            <h3 class="video-title">${video.title}</h3>
                            <div class="channel-name">${video.channel_name} <i class="ri-checkbox-circle-fill verified"></i></div>
                            <div class="video-stats">${formatViews(video.views)} views • Just now</div>
                        </div>
                        <button class="more-options"><i class="ri-more-2-line"></i></button>
                    </div>
                </article>
            `).join('');

        } catch (error) {
            console.error('Fetch Error:', error);
            videoGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--accent-red);">Failed to load videos.</div>';
        }
    }

    // Initial Fetch
    fetchVideos();
});
