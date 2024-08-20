document.addEventListener("DOMContentLoaded", () => {
  const newsContainer = document.getElementById("news-container");
  const loadMoreBtn = document.getElementById("load-more-btn");
  let currentIndex = 0; // Current index for pagination
  const storiesPerPage = 10; // Number of stories to load per page
  let storyIds = []; // Array to store story IDs

  // Function to format Unix timestamp to human-readable date
  function formatDate(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
    return date.toLocaleDateString("it-IT", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Function to create and append a news item to the container
  function appendNewsItem(title, url, date) {
    const newsItem = document.createElement("div");
    newsItem.className = "news-item";

    const newsTitle = document.createElement("a");
    newsTitle.href = url;
    newsTitle.target = "_blank"; // Open link in new tab
    newsTitle.textContent = title;

    const newsDate = document.createElement("div");
    newsDate.className = "date";
    newsDate.textContent = `Pubblicato il: ${date}`;

    newsItem.appendChild(newsTitle);
    newsItem.appendChild(newsDate);
    newsContainer.appendChild(newsItem);
  }

  // Function to fetch and display stories
  async function fetchAndDisplayStories() {
    try {
      // Get the story IDs if not already fetched
      if (storyIds.length === 0) {
        const response = await fetch(
          "https://hacker-news.firebaseio.com/v0/newstories.json"
        );
        if (!response.ok) {
          throw new Error("Errore nel recupero degli ID delle storie");
        }
        storyIds = await response.json();
      }

      // Get the stories for the current page
      const storiesToFetch = storyIds.slice(
        currentIndex,
        currentIndex + storiesPerPage
      );
      const storyPromises = storiesToFetch.map(async (id) => {
        const response = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`
        );
        if (!response.ok) {
          throw new Error(`Errore nel recupero della storia con ID ${id}`);
        }
        return response.json();
      });

      // Wait for all promises to resolve
      const stories = await Promise.all(storyPromises);

      // Append each story to the container
      stories.forEach((story) => {
        if (story && story.title && story.url && story.time) {
          appendNewsItem(story.title, story.url, formatDate(story.time));
        }
      });

      // Update the current index for pagination
      currentIndex += storiesPerPage;

      // Hide the load more button if there are no more stories
      if (currentIndex >= storyIds.length) {
        loadMoreBtn.style.display = "none";
      }
    } catch (error) {
      console.error("Errore:", error);
      const errorMessage = document.createElement("div");
      errorMessage.className = "error-message";
      errorMessage.textContent =
        "Si è verificato un errore nel caricamento delle notizie. Riprova più tardi.";
      newsContainer.appendChild(errorMessage);
    }
  }

  // Initial fetch of stories
  fetchAndDisplayStories();

  // Event listener for the load more button
  loadMoreBtn.addEventListener("click", fetchAndDisplayStories);
});
