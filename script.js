// Global variables to track the current story and chapter
let currentStory = null;
let currentChapter = 0;

document.addEventListener("DOMContentLoaded", function() {
  // Fetch the library.json file to populate the story selection dropdown
  fetch("./library.json")
    .then(response => response.json())
    .then(data => {
      const storySelect = document.getElementById("storySelect");
      data.stories.forEach(story => {
        const option = document.createElement("option");
        option.value = story.id;
        option.text = story.title;
        storySelect.appendChild(option);
      });
      // Listen for story selection changes
      storySelect.addEventListener("change", function() {
        const selectedId = storySelect.value;
        if (selectedId) {
          loadStory(selectedId, data.stories);
        } else {
          document.getElementById("storyPanel").classList.add("hidden");
        }
      });
    })
    .catch(error => {
      console.error("Error loading library.json:", error);
      alert("Error loading stories.");
    });
  
  // Set up modal functionality for customization
  const customizeModal = document.getElementById("customizeModal");
  const customizeBtn = document.getElementById("customizeBtn");
  const closeModalBtn = document.getElementById("closeModal");
  
  customizeBtn.addEventListener("click", function() {
    customizeModal.classList.remove("hidden");
  });
  
  closeModalBtn.addEventListener("click", function() {
    customizeModal.classList.add("hidden");
  });
});

// Save customization settings in localStorage
function saveCustomization() {
  const userName = document.getElementById("userName").value;
  const eyeColor = document.getElementById("eyeColor").value;
  localStorage.setItem("userName", userName);
  localStorage.setItem("eyeColor", eyeColor);
  alert("Customization Saved!");
  document.getElementById("customizeModal").classList.add("hidden");
}

// Load a story based on its ID from the library data
function loadStory(storyId, stories) {
  currentStory = stories.find(s => s.id === storyId);
  if (!currentStory) {
    alert("Story not found.");
    return;
  }
  // Retrieve saved chapter progress or default to the first chapter (index 0)
  currentChapter = parseInt(localStorage.getItem(storyId + "_chapter"), 10) || 0;
  displayChapter();
  // Reveal the story panel
  document.getElementById("storyPanel").classList.remove("hidden");
}

// Display the current chapter with customized details
function displayChapter() {
  if (!currentStory) return;
  const chapter = currentStory.chapters[currentChapter];
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
  
  // Update the story title and content in the DOM
  document.getElementById("storyTitle").innerText = `${currentStory.title} - Chapter ${chapter.chapter}`;
  document.getElementById("storyContent").innerHTML = content;
  
  // Update navigation button visibility
  document.getElementById("prevChapter").style.display = currentChapter > 0 ? "inline-block" : "none";
  document.getElementById("nextChapter").style.display = currentChapter < currentStory.chapters.length - 1 ? "inline-block" : "none";
  
  // Set up event listeners for navigation buttons
  document.getElementById("prevChapter").onclick = function() {
    if (currentChapter > 0) {
      currentChapter--;
      localStorage.setItem(currentStory.id + "_chapter", currentChapter);
      displayChapter();
    }
  };
  
  document.getElementById("nextChapter").onclick = function() {
    if (currentChapter < currentStory.chapters.length - 1) {
      currentChapter++;
      localStorage.setItem(currentStory.id + "_chapter", currentChapter);
      displayChapter();
    }
  };
}
