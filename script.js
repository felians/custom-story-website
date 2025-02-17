let library = {};

document.addEventListener("DOMContentLoaded", function () {
    fetch('library.json')
        .then(response => response.json())
        .then(data => {
            library = data;
            populateStoryDropdown();
        })
        .catch(error => console.error("Error loading stories:", error));
});

function populateStoryDropdown() {
    const storySelector = document.getElementById("storySelector");
    for (let story in library) {
        let option = document.createElement("option");
        option.value = story;
        option.textContent = library[story].title;
        storySelector.appendChild(option);
    }
}

function loadStory() {
    const storyKey = document.getElementById("storySelector").value;
    if (!storyKey) return;

    const story = library[storyKey];
    document.getElementById("storyTitle").textContent = story.title;
    document.getElementById("storyContent").textContent = story.chapters[0];

    updateChapterNavigation(story.chapters);
}

function updateChapterNavigation(chapters) {
    let nav = document.getElementById("chapterNav");
    nav.innerHTML = "";

    chapters.forEach((chapter, index) => {
        let btn = document.createElement("button");
        btn.textContent = `Chapter ${index + 1}`;
        btn.onclick = () => document.getElementById("storyContent").textContent = chapter;
        nav.appendChild(btn);
    });
}

function openCustomization() {
    document.getElementById("customPopup").style.display = "block";
}

function saveCustomization() {
    alert("Customization Saved!");
    location.reload();
}
