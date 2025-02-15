// --------------------
// INDEX PAGE: Load story list from library.json
// --------------------
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("storyList")) {
    fetch("./library.json")
      .then(response => response.json())
      .then(data => {
        let storyList = document.getElementById("storyList");
        data.stories.forEach(story => {
          let li = document.createElement("li");
          li.classList.add("mb-2");
          let a = document.createElement("a");
          a.href = `story.html?story=${story.id}`;
          a.innerText = story.title;
          a.classList.add("text-xl", "text-purple-700", "hover:underline");
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
// CUSTOMIZE PAGE: Save user's customization settings
// --------------------
function saveCustomization() {
  let userName = document.getElementById("userName").value;
  let eyeColor = document.getElementById("eyeColor").value;
  localStorage.setItem("userName", userName);
  localStorage.setItem("eyeColor", eyeColor);
  alert("Customization Saved!");
}

// --------------------
// STORY PAGE: Load selected story and chapters, with progress saving
// --------------------
if (window.location.pathname.includes("story.html")) {
  let urlParams = new URLSearchParams(window.location.search);
  let storyId = urlParams.get("story");
  // Get current chapter from localStorage or default to 0 (first chapter)
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

function loadChapter(story, chapterIndex) {
  let chapter = story.chapters[chapterIndex];
  if (!chapter) {
    document.getElementById("storyContent").innerText = "Chapter not found.";
    return;
  }
  
  // Get customization details
  let userName = localStorage.getItem("userName") || "[Your Name]";
  let eyeColor = localStorage.getItem("eyeColor") || "[Eye Color]";
  
  // Replace placeholders
  let content = chapter.content
    .replace(/\[Your Name\]/g, userName)
    .replace(/\[Eye Color\]/g, eyeColor);
  
  document.getElementById("storyContent").innerHTML = content;

  // Update navigation buttons
  document.getElementById("prevChapter").style.display = chapterIndex > 0 ? "inline-block" : "none";
  document.getElementById("nextChapter").style.display = chapterIndex < story.chapters.length - 1 ? "inline-block" : "none";
}
