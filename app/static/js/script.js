const accordionToggle = document.querySelectorAll(".accordion--header");
const accordionContent = document.querySelectorAll(".accordion--content");
const accordionIcon = document.querySelectorAll(".accordion--icon i");

accordionContent.forEach(content => content.style.height = "0px");

for (let i = 0; i < accordionToggle.length; i++) {
    accordionToggle[i].addEventListener("click", () => {
        const content = accordionContent[i];

        if (content.style.height === "0px" || content.style.height === "") {
            content.style.height = content.scrollHeight + "px";
            accordionIcon[i].classList.replace("ri-add-line", "ri-subtract-fill");
        } else {
            content.style.height = "0px";
            accordionIcon[i].classList.replace("ri-subtract-fill", "ri-add-line");
        }

        // Close all other accordions
        for (let j = 0; j < accordionContent.length; j++) {
            if (j !== i) {
                accordionContent[j].style.height = "0px";
                accordionIcon[j].classList.replace("ri-subtract-fill", "ri-add-line");
            }
        }
    });
}

// Typewriter effect for home headline
const typewriterWords = [
    'Explore Stunning Ideas...',
    'Generate Unique Art...',
    'Save Your Favorite Styles...',
    'Design. Iterate. Inspire...',
    'Turn Prompts into Masterpieces...',
    'Bring Concepts to Life...',
  ];
  
let twIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterSpan = document.querySelector('.typewriter');

function typewriterTick() {
  if (!typewriterSpan) return;
  const currentWord = typewriterWords[twIndex];
  if (isDeleting) {
    charIndex--;
    typewriterSpan.textContent = currentWord.substring(0, charIndex);
  } else {
    charIndex++;
    typewriterSpan.textContent = currentWord.substring(0, charIndex);
  }

  let delay = 90;
  if (!isDeleting && charIndex === currentWord.length) {
    delay = 1200;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    twIndex = (twIndex + 1) % typewriterWords.length;
    delay = 600;
  }
  setTimeout(typewriterTick, delay);
}

document.addEventListener('DOMContentLoaded', function() {
  if (typewriterSpan) typewriterTick();
});
// typewriter effect end