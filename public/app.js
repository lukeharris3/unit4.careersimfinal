document.addEventListener("DOMContentLoaded", () => {
    fetchPosts();
});

async function fetchPosts() {
    try {
        const response = await fetch("/api/posts");
        const { posts } = await response.json();

        const postsContainer = document.getElementById("posts");
        postsContainer.innerHTML = "";

        posts.forEach(post => {
            const postElement = document.createElement("div");
            postElement.classList.add("post");
            postElement.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.content}</p>
                <p><strong>Author:</strong> ${post.author.name}</p>
                <p><strong>Tags:</strong> ${post.tags.map(tag => tag.name).join(", ")}</p>
            `;
            postsContainer.appendChild(postElement);
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}