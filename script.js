// Load story list on index page
document.addEventListener("DOMContentLoaded", function () {
    fetch("library.json") // <-- Updated here
        .then(response => response.json())
        .then(data => {
            let storyList = document.getElementById("storyList");
            if (storyList) {
                data.stories.forEach(story => {
                    let li = document.createElement("li");
                    let a = document.createElement("a");
                    a.href = `story.html?story=${story.id}`;
                    a.innerText = story.title;
                    li.appendChild(a);
                    storyList.appendChild(li);
                });
            }
        });
});

// Load selected story and chapters
if (window.location.pathname.includes("story.html")) {
    let urlParams = new URLSearchParams(window.location.search);
    let storyId = urlParams.get("story");
    let currentChapter = parseInt(localStorage.getItem(storyId + "_chapter")) || 0;

    fetch("library.json") // <-- Updated here
        .then(response => response.json())
        .then(data => {
            let story = data.stories.find(s => s.id === storyId);
            if (!story) return;

            document.getElementById("storyTitle").innerText = story.title;
            loadChapter(story, currentChapter);

            document.getElementById("nextChapter").addEventListener("click", () => {
                if (currentChapter < story.chapters.length - 1) {
                    currentChapter++;
                    localStorage.setItem(storyId + "_chapter", currentChapter);
                    loadChapter(story, currentChapter);
                }
            });

            document.getElementById("prevChapter").addEventListener("click", () => {
                if (currentChapter > 0) {
                    currentChapter--;
                    localStorage.setItem(storyId + "_chapter", currentChapter);
                    loadChapter(story, currentChapter);
                }
            });
        });
}
