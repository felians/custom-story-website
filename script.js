let library = {}; // Global variable for the story library
let currentChapter = 0; // Track current chapter

document.addEventListener("DOMContentLoaded", () => {
  // Fetch library.json from the same directory
  fetch("./library.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch library.json");
      }
      return response.json();
    })
    .then(data => {
      // Assuming library.json has the structure: { "stories": { "story_key": { ... } } }
      library = data.stories || {};
      populateStoryDropdown();
    })
    .catch(error => {
      console.error("Error loading library.json:", error);
      document.getElementById("storyContainer").innerHTML = "Error loading stories.";
    });
});

function populateStoryDropdown() {
  const storySelector = document.getElementById("storySelector");
  for (let key in library) {
    if (library.hasOwnProperty(key)) {
      let option = document.createElement("option");
      option.value = key;
      option.textContent = library[key].title;
      storySelector.appendChild(option);
    }
  }
}

function loadStory() {
  const storyKey = document.getElementById("storySelector").value;
  if (!storyKey || !library[storyKey]) return;
  const story = library[storyKey];
  document.getElementById("storyTitle").textContent = story.title;
  currentChapter = 0; // Start at first chapter
  displayChapter(story);
}

function displayChapter(story) {
  if (!story || !story.chapters || story.chapters.length === 0) return;
  let chapterContent = story.chapters[currentChapter];
  // Get customization details from localStorage
  const customName = localStorage.getItem("customName") || "[Your Name]";
  const customEyeColor = localStorage.getItem("customEyeColor") || "[Eye Color]";
  // Replace placeholders in chapter content
  chapterContent = chapterContent
    .replace(/\[Your Name\]/g, customName)
    .replace(/\[Eye Color\]/g, customEyeColor);
  document.getElementById("storyContent").innerHTML = chapterContent;
  updateChapterNav(story);
}

function updateChapterNav(story) {
  const nav = document.getElementById("chapterNav");
  nav.innerHTML = ""; // Clear existing buttons

  // Create Previous Chapter button
  if (currentChapter > 0) {
    let prevButton = document.createElement("button");
    prevButton.textContent = "Previous Chapter";
    prevButton.onclick = () => {
      currentChapter--;
      displayChapter(story);
    };
    nav.appendChild(prevButton);
  }
  // Create Next Chapter button
  if (currentChapter < story.chapters.length - 1) {
    let nextButton = document.createElement("button");
    nextButton.textContent = "Next Chapter";
    nextButton.onclick = () => {
      currentChapter++;
      displayChapter(story);
    };
    nav.appendChild(nextButton);
  }
}

// Customization Popup Functions
function openCustomization() {
  document.getElementById("customPopup").style.display = "flex";
}

function closeCustomization() {
  document.getElementById("customPopup").style.display = "none";
}

function saveCustomization() {
  const nameInput = document.getElementById("customName").value;
  const eyeColorInput = document.getElementById("customEyeColor").value;
  localStorage.setItem("customName", nameInput);
  localStorage.setItem("customEyeColor", eyeColorInput);

  // Instead of alert, change popup content with confirmation and an OK button
  const popup = document.getElementById("customPopup");
  popup.innerHTML = `
    <div class="popup-content">
      <h2>Customization Saved!</h2>
      <button onclick="refreshPage()">OK</button>
    </div>
  `;
}

function refreshPage() {
  location.reload();
}
