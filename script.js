document.addEventListener("DOMContentLoaded", function() {
    const themeToggle = document.getElementById("themeToggle");
    const sortSelect = document.getElementById("sortArticles");
    const categorySelect = document.getElementById("categorySelect");
    const articlesContainer = document.getElementById("articles");
    const popularArticleContainer = document.getElementById("popularArticle");
  
    // Load articles from JSON
    fetch('articles.json') // Replace this with your articles JSON or API endpoint
        .then(response => response.json())
        .then(data => {
            const articlesData = data.articles;
            renderArticles(articlesData); // Render articles initially
            renderMostPopular(articlesData); // Render most popular article
        });
  
    // Load theme from localStorage on page load
    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }
  
    // Theme toggle functionality
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
  
        const isDarkMode = document.body.classList.contains("dark-mode");
        localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    });
  
    // Sort articles based on selection
    sortSelect.addEventListener("change", () => {
        filterAndSortArticles(); // Trigger sort and filter when sort option changes
    });
  
    // Filter articles by category
    categorySelect.addEventListener("change", () => {
        filterAndSortArticles(); // Trigger sort and filter when category changes
    });
  
    // Function to filter and sort articles
    function filterAndSortArticles() {
        const selectedCategory = categorySelect.value;
        const sortBy = sortSelect.value;
  
        fetch('articles.json') // Load data again after filter and sort changes
            .then(response => response.json())
            .then(data => {
                let filteredArticles = data.articles.filter(article => {
                    return selectedCategory ? article.category === selectedCategory : true;
                });
  
                const sortedArticles = filteredArticles.sort((a, b) => {
                    if (sortBy === "views") {
                        return b.views - a.views; // Sort by views (descending)
                    } else if (sortBy === "date") {
                        return new Date(b.date) - new Date(a.date); // Sort by date (descending)
                    }
                    return 0; // Default to no sorting if no valid sort option
                });
  
                renderArticles(sortedArticles);
            });
    }
  
    // Function to render articles
    function renderArticles(articles) {
        articlesContainer.innerHTML = ""; // Clear the current articles
        articles.forEach(article => {
            const articleCard = document.createElement("div");
            articleCard.classList.add("col-md-4", "card");
            articleCard.setAttribute("id", `article-${article.id}`);
  
            articleCard.addEventListener("click", () => openArticleModal(article));
  
            articleCard.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${article.title}</h5>
                    <p class="card-text">${article.content.slice(0, 100)}...</p>
                    <small class="text-muted">
                        ${formatDate(article.date)} • ${article.views} views • ${calculateReadingTime(article.wordCount)} min read
                    </small>
                </div>
            `;
            articlesContainer.appendChild(articleCard);
        });
    }
  
    // Function to render the most popular article
    function renderMostPopular(articles) {
        const mostPopularArticle = articles.reduce((prev, current) => (prev.views > current.views) ? prev : current);
        popularArticleContainer.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${mostPopularArticle.title}</h5>
                <p class="card-text">${mostPopularArticle.content.slice(0, 100)}...</p>
            </div>
        `;
    }
  
    // Function to open the modal for the full article
    function openArticleModal(article) {
        const modalTitle = document.getElementById("articleModalLabel");
        const modalContent = document.getElementById("articleContent");
        
        modalTitle.textContent = article.title;
        modalContent.textContent = article.content;
        
        const modal = new bootstrap.Modal(document.getElementById("articleModal"));
        modal.show();
    }
  
    // Helper function to format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }
  
    // Helper function to calculate reading time
    function calculateReadingTime(wordCount) {
        const wordsPerMinute = 200;
        return Math.ceil(wordCount / wordsPerMinute);
    }
  });
  