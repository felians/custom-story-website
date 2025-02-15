// --------------------
// Index Page: Load story list from library.json
// --------------------
document.addEventListener("DOMContentLoaded", function() {
  // Check if we're on the index page (storyList element exists)
  if(document.getElementById("storyList")) {
    fetch("library.json")
      .then(response => response.json())
      .then(data => {
        let storyList = document.getElementById("storyList");
        data.stories.forEach(story => {
          let li = document.createElement("li");
          let a = document.createElement("a");
          a.href = `story.html?story=${story.id}`;
          a.innerText = story.title;
          li.appendChild(a);
          storyList.appendChild(li);
        });
      })
      .catch(error => {
        console.error("Error loading library.json:", error);
        document.getElementById("storyList").innerText = "Error loading stories.";
      });
  }
});

// --------------------
// Customize Page: Save user's customization settings
// --------------------
function saveCustomization() {
  let userName = document.getElementById("userName").value;
  let eyeColor = document.getElementById("eyeColor").value;
  localStorage.setItem("userName", userName);
  localStorage.setItem("eyeColor", eyeColor);
  alert("Customization Saved!");
}

// --------------------
// Story Page: Load selected story and chapters
// --------------------
if (window.location.pathname.includes("story.html")) {
  let urlParams = new URLSearchParams(window.location.search);
  let storyId = urlParams.get("story");
  // Get current chapter from local storage or default to 0 (first chapter)
  let currentChapter = parseInt(localStorage.getItem(storyId + "_chapter")) || 0;

  fetch("library.json")
    .then(response => response.json())
    .then(data => {
      let story = data.stories.find(s => s.id === storyId);
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

// Function to load chapter content, replacing placeholders with user data
function loadChapter(story, chapterIndex) {
  let chapter = story.chapters[chapterIndex];
  if (!chapter) {
    document.getElementById("storyContent").innerText = "Chapter not found.";
    return;
  }
  
  // Get customization details
  let userName = localStorage.getItem("userName") || "[Your Name]";
  let eyeColor = localStorage.getItem("eyeColor") || "[Eye Color]";
  
  // Replace all occurrences of placeholders (using regex with global flag)
  let content = chapter.content
    .replace(/\[Your Name\]/g, userName)
    .replace(/\[Eye Color\]/g, eyeColor);
  
  document.getElementById("storyContent").innerHTML = content;

  // Update navigation buttons based on current chapter
  document.getElementById("prevChapter").style.display = chapterIndex > 0 ? "inline-block" : "none";
  document.getElementById("nextChapter").style.display = chapterIndex < story.chapters.length - 1 ? "inline-block" : "none";
}
