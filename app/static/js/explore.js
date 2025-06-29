const imagesWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const lightBox = document.querySelector(".lightbox");
const closeBtn = lightBox.querySelector(".uil-times");
const downloadImgBtn = lightBox.querySelector(".uil-import");


// API key, pagination, and searchTerm variables
const apiKey = "38y8Z1IS5vjbZ7IOHpBIH7wuolqqKOXyl0DwBzVX0MRf1q1raDa8dA5M";
const perPage = 15;
let currentPage = 1;
let searchTerm = null;

const downloadImg = (imgURL) => {
    fetch(imgURL)
        .then(res => res.blob())
        .then(file => {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(file);
            a.download = `image_${new Date().getTime()}.jpg`;
            a.click();
        })
        .catch(() => alert("Failed to download image!"));
}

const showLightbox = (name, img) => {
    // Showing lightbox and setting img source and photographer name and button attribute
    lightBox.querySelector("img").src = img;
    lightBox.querySelector("span").innerText = name;
    downloadImgBtn.setAttribute("data-img", img);
    lightBox.classList.add("show");
    document.body.style.overflow = "hidden";
}

const hideLightbox = () => {
    lightBox.classList.remove("show");
    document.body.style.overflow = "auto";
}

const generateHTML = (images) => {
    // Generating HTML for all fetched images and adding them to the existing image wrapper
    const html = images.map(img => 
        `<li class="card" onclick="showLightbox('${img.photographer}', '${img.src.large2x}')">
            <img src="${img.src.large2x}" alt="img">
            <div class="details">
                <div class="photographer">
                    <i class="uil uil-camera"></i>
                    <span>${img.photographer}</span>
                </div>
                <button onclick="downloadImg('${img.src.large2x}'); event.stopPropagation();">
                    <i class="uil uil-import"></i>
                </button>
            </div>
        </li>`
    ).join('');
    imagesWrapper.innerHTML += html;
}

const getImages = (apiURL) => {
    // Fetching images by API call with Authorization header
    loadMoreBtn.innerText = "Loading...";
    loadMoreBtn.classList.add("disabled");

    fetch(apiURL, {
        headers: { Authorization: apiKey }
    })
    .then(res => res.json())
    .then(data => {
        generateHTML(data.photos);
        loadMoreBtn.innerText = "Load More";
        loadMoreBtn.classList.remove("disabled");
    })
    .catch(err => {
        console.error('Error fetching images:', err);
        loadMoreBtn.innerText = "Load More";
        loadMoreBtn.classList.remove("disabled");
        alert('Failed to load images!');
    });
}

const loadMoreImages = () => {
    currentPage++;
    const apiURL = searchTerm
        ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`
        : `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    getImages(apiURL);
}

const loadSearchImages = (e) => {
    if (e.target.value.trim() === "") {
        currentPage = 1;
        searchTerm = null;
        imagesWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
        return;
    }

    if (e.key === "Enter") {
        currentPage = 1;
        searchTerm = e.target.value.trim();
        imagesWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);
    }
}

// Initial image load
getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);

// Load more images on button click
loadMoreBtn.addEventListener('click', loadMoreImages);

// Search input field
searchInput.addEventListener('keyup', loadSearchImages);

// Close lightbox on button click
closeBtn.addEventListener('click', hideLightbox);
downloadImgBtn.addEventListener('click', (e) => downloadImg(e.target.dataset.img));
