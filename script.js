// ====================
// INDEX PAGE: Load story list from library.json
// ====================
document.addEventListener("DOMContentLoaded", function () {
  // Check if the element with id "storyList" exists (i.e., we're on index.html)
  if (document.getElementById("storyList")) {
    fetch("./library.json")
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        const storyList = document.getElementById("storyList");
        // Verify that data.stories exists and is an array
        if (data.stories && Array.isArray(data.stories)) {
          data.stories.forEach(story => {
            const li = document.createElement("li");
            li.classList.add("mb-2");
            const a = document.createElement("a");
            // Use encodeURIComponent to ensure story.id is safe in the URL
            a.href = `story.html?story=${encodeURIComponent(story.id)}`;
            a.innerText = story.title;
            a.classList.add("text-xl", "text-purple-700", "hover:underline");
            li.appendChild(a);
            storyList.appendChild(li);
          });
        } else {
          storyList.innerText = "No stories found.";
        }
      })
      .catch(error => {
        console.error("Error loading library.json:", error);
        document.getElementById("storyList").innerText = "Error loading stories.";
      });
  }
});

// ====================
// CUSTOMIZE PAGE: Save user's customization settings
// ====================
function saveCustomization() {
  const userName = document.getElementById("userName").value;
  const eyeColor = document.getElementById("eyeColor").value;
  localStorage.setItem("userName", userName);
  localStorage.setItem("eyeColor", eyeColor);
  alert("Customization Saved!");
}

// ====================
// STORY PAGE: Load selected story and chapters, with progress saving
// ====================
if (window.location.pathname.includes("story.html")) {
  const urlParams = new URLSearchParams(window.location.search);
  const storyId = urlParams.get("story");
  // Get current chapter from localStorage or default to 0 (first chapter)
  let currentChapter = parseInt(localStorage.getItem(storyId + "_chapter"), 10) || 0;

  fetch("./library.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      const story = data.stories.find(s => s.id === storyId);
      if (!story) {
        document.getElementById("storyTitle").innerText = "Story Not Found";
        document.getElementById("storyContent").innerText = "";
        return;
      }

      document.getElementById("storyTitle").innerText = story.title;
      loadChapter(story, currentChapter);

      // Next Chapter Button
      document.getElementById("nextChapter").addEventListener("click", () => {
        if (currentChapter < story.chapters.length - 1) {
          currentChapter++;
          localStorage.setItem(storyId + "_chapter", currentChapter);
          loadChapter(story, currentChapter);
        }
      });

      // Previous Chapter Button
      document.getElementById("prevChapter").addEventListener("click", () => {
        if (currentChapter > 0) {
          currentChapter--;
          localStorage.setItem(storyId + "_chapter", currentChapter);
          loadChapter(story, currentChapter);
        }
      });
    })
    .catch(error => {
      console.error("Error loading library.json:", error);
      document.getElementById("storyContent").innerText = "Error loading story.";
    });
}

// ====================
// Helper Function: Load a chapter and replace placeholders
// ====================
function loadChapter(story, chapterIndex) {
  const chapter = story.chapters[chapterIndex];
  if (!chapter) {
    document.getElementById("storyContent").innerText = "Chapter not found.";
    return;
  }
  
  // Get customization details from localStorage
  const userName = localStorage.getItem("userName") || "[Your Name]";
  const eyeColor = localStorage.getItem("eyeColor") || "[Eye Color]";
  
  // Replace placeholders in the chapter content
  let content = chapter.content;
  content = content.replace(/\[Your Name\]/g, userName).replace(/\[Eye Color\]/g, eyeColor);
  
  document.getElementById("storyContent").innerHTML = content;

  // Update navigation buttons based on current chapter
  document.getElementById("prevChapter").style.display = chapterIndex > 0 ? "inline-block" : "none";
  document.getElementById("nextChapter").style.display = chapterIndex < story.chapters.length - 1 ? "inline-block" : "none";
}
