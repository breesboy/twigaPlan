document.addEventListener("DOMContentLoaded", () => {
  const socialFeedGrid = document.querySelector(".social-feed-grid");

  async function fetchMockSocialPosts() {
    try {
      const response = await fetch("posts.json"); // Adjust path if needed
      if (!response.ok) throw new Error("Failed to fetch social posts.");
      const data = await response.json();
      displaySocialPosts(data.twitter, "twitter");
      displaySocialPosts(data.facebook, "facebook");
    } catch (err) {
      console.error(err);
      socialFeedGrid.innerHTML =
        `<p>Error loading posts. Please try again later.</p>` + err.message;
    }
  }

  function displaySocialPosts(posts, platform) {
    posts.forEach((post) => {
      const postCard = document.createElement("div");
      postCard.classList.add("social-post-card");

      let content = "";
      let timestamp = "";
      let link = "";
      let imageUrl = "";

      if (platform === "twitter") {
        content = post.text;
        timestamp = new Date(post.created_at).toLocaleString();
        link = `https://twitter.com/statuses/${post.id}`;
      } else if (platform === "facebook") {
        content = post.message;
        timestamp = new Date(post.created_time).toLocaleString();
        link = post.permalink_url;
        imageUrl = post.picture;
      }

      postCard.innerHTML = `
          <div class="post-header">
            <span><strong>${platform.toUpperCase()}</strong></span>
            <span class="timestamp">${timestamp}</span>
          </div>
          <div class="post-body">
            <p>${content}</p>
            ${imageUrl ? `<img src="${imageUrl}" alt="Post image">` : ""}
          </div>
          <div class="post-footer">
            <a href="${link}" target="_blank">View on ${platform}</a>
          </div>
        `;

      socialFeedGrid.appendChild(postCard);
    });
  }

  fetchMockSocialPosts();
});
