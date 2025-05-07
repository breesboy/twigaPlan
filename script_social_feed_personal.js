// script_social_feed_personal.js

document.addEventListener('DOMContentLoaded', () => {
    const socialFeedGrid = document.querySelector('.social-feed-grid');
    const twitterUsername = 'YOUR_TWITTER_USERNAME'; // <-- Replace with actual Twitter username
    const facebookPageId = '61575875255019'; // <-- Replace with actual Facebook Page ID
    const linkedinCompanyId = 'YOUR_LINKEDIN_COMPANY_ID'; // <-- Replace with actual LinkedIn Company ID

    // !!! SECURITY RISK !!!
    // Exposing API keys like this is HIGHLY INSECURE for production websites.
    // Use this ONLY for local personal projects and experimentation.
    const twitterApiKey = 'YOUR_TWITTER_API_KEY'; // <-- Replace with actual Twitter API Key
    const facebookAccessToken = 'YOUR_FACEBOOK_ACCESS_TOKEN'; // <-- Replace with actual Facebook Access Token
    // LinkedIn API requires more complex authentication, often not feasible client-side.
    // Consider using official LinkedIn embeds or focusing on Twitter/Facebook for this simple example.

    // Function to fetch Twitter posts (simplified example)
    async function fetchTwitterPosts(username) {
        // This is a simplified URL. Actual Twitter API v2 requires specific endpoints.
        // Authentication is also more complex than just an API key in the header now.
        // You would likely need Bearer Tokens and the v2 API.
        const url = `https://api.twitter.com/2/tweets/search/recent?query=from:${username}&max_results=10`; // Example v2 endpoint concept
        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${twitterApiKey}` // Using Bearer token is common in v2
                    // You need to generate a Bearer Token from your Twitter Developer App
                }
            });
            if (!response.ok) {
                 // Log the error response for debugging
                const errorText = await response.text();
                console.error(`Twitter API Error: ${response.status}`, errorText);
                throw new Error(`Twitter API error! status: ${response.status}`);
            }
            const data = await response.json();
            // The structure of 'data' depends on the specific API endpoint used.
            // You'll need to inspect the actual response.
            return data.data; // Assuming the tweets are in data.data array
        } catch (error) {
            console.error('Error fetching Twitter posts:', error);
            return [];
        }
    }

    // Function to fetch Facebook posts (simplified example)
    async function fetchFacebookPosts(pageId, accessToken) {
        // Facebook Graph API requires an access token.
        // Fetching posts usually uses the /{page-id}/posts endpoint.
        // You'll need a Page Access Token with appropriate permissions.
        const url = `https://graph.facebook.com/v18.0/${pageId}/posts?access_token=${accessToken}&fields=message,created_time,permalink_url,picture,full_picture`; // Example endpoint and fields
        try {
            const response = await fetch(url);
             if (!response.ok) {
                 const errorText = await response.text();
                console.error(`Facebook API Error: ${response.status}`, errorText);
                throw new Error(`Facebook API error! status: ${response.status}`);
            }
            const data = await response.json();
             // The structure of 'data' depends on the specific API endpoint used.
            // You'll need to inspect the actual response.
            return data.data; // Assuming the posts are in data.data array
        } catch (error) {
            console.error('Error fetching Facebook posts:', error);
            return [];
        }
    }

    // LinkedIn API is generally not feasible for client-side fetching of company feeds.
    // You would typically use their official Share/Embed features for individual posts
    // or a backend to access the Company Pages API securely.
    async function fetchLinkedInPosts(companyId) {
         console.warn("LinkedIn API for fetching company posts is complex and not easily done client-side.");
         return []; // Return empty array as fetching is not practical here
    }


    // Function to display posts in the HTML
    function displaySocialPosts(posts, platform) {
        if (posts.length === 0) {
            const noPosts = document.createElement('p');
            noPosts.textContent = `No recent posts found for ${platform}.`;
             socialFeedGrid.appendChild(noPosts); // Append to grid, don't replace everything
            return;
        }

        posts.forEach(post => {
            const postCard = document.createElement('div');
            postCard.classList.add('social-post-card');

            const postHeader = document.createElement('div');
            postHeader.classList.add('post-header');

            let iconClass = '';
            let userDisplay = '';
            let timestamp = '';
            let postLink = '';
            let postContentText = '';
            let imageUrl = '';

            // --- Adapt based on the platform and the structure of the API response ---
            if (platform === 'twitter') {
                iconClass = 'fab fa-twitter twitter';
                userDisplay = `@${twitterUsername}`; // API response might include username directly
                // Extract timestamp and content from the Twitter API response structure
                timestamp = new Date(post.created_at || Date.now()).toLocaleString(); // Assuming 'created_at' field
                postContentText = post.text || 'No text content'; // Assuming 'text' field
                 postLink = `https://twitter.com/${twitterUsername}/status/${post.id}`; // Construct link from ID
                 // Handle media if available in the API response (more complex)

            } else if (platform === 'facebook') {
                iconClass = 'fab fa-facebook-f facebook';
                 // You might need another API call or have page info elsewhere to get the Page Name
                userDisplay = 'Facebook Page Posts'; // Placeholder, replace with Page Name if possible
                timestamp = new Date(post.created_time || Date.now()).toLocaleString(); // Assuming 'created_time' field
                postContentText = post.message || 'No text content'; // Assuming 'message' field
                 postLink = post.permalink_url; // Assuming 'permalink_url' field
                 imageUrl = post.full_picture || post.picture; // Assuming image fields
            }
            // Add logic for LinkedIn if you find a feasible way to fetch data

            postHeader.innerHTML = `
                <i class="${iconClass} post-icon"></i> 
                <span class="post-user">${userDisplay}</span>
                <span class="post-timestamp">${timestamp}</span>
            `;
            postCard.appendChild(postHeader);

            const postContent = document.createElement('div');
            postContent.classList.add('post-content');
            postContent.innerHTML = `<p>${postContentText}</p>`; // Display the post text

             if (imageUrl) {
                const postImage = document.createElement('img');
                postImage.src = imageUrl;
                postImage.alt = `Image from ${platform} post`;
                postImage.style.cssText = 'margin-top: 10px; border-radius: 4px; max-width:100%; height:auto;'; 
                postContent.appendChild(postImage);
            }

            postCard.appendChild(postContent);


            const postFooter = document.createElement('div');
            postFooter.classList.add('post-footer');
             if (postLink) {
                 const linkElement = document.createElement('a');
                 linkElement.href = postLink;
                 linkElement.target = "_blank"; 
                 linkElement.classList.add('post-link');
                 linkElement.textContent = `View on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`;
                 postFooter.appendChild(linkElement);
             } else {
                 const noLink = document.createElement('span');
                 noLink.textContent = `View on ${platform.charAt(0).toUpperCase() + platform.platform.slice(1)}`;
                 postFooter.appendChild(noLink);
             }
            postCard.appendChild(postFooter);


            socialFeedGrid.appendChild(postCard);
        });
    }

     // Clear initial loading text
    socialFeedGrid.innerHTML = '';

    // Fetch and display posts for each platform
    fetchTwitterPosts(twitterUsername).then(posts => {
        displaySocialPosts(posts, 'twitter');
    });

    fetchFacebookPosts(facebookPageId, facebookAccessToken).then(posts => {
        displaySocialPosts(posts, 'facebook');
    });

    // If you want to attempt LinkedIn, call the function here,
    // but be prepared for it not to work easily client-side.
    // fetchLinkedInPosts(linkedinCompanyId).then(posts => {
    //     displaySocialPosts(posts, 'linkedin');
    // });
});