const auth = "563492ad6f91700001000001d56283265a7545e294031c4a63437141";
const gallery = document.querySelector('.gallery');
const searchInput = document.querySelector('.search-input');
const searchForm = document.querySelector('.search-form');
const moreBtn = document.querySelector('.more-btn');

let searchValue;
let page = 1;
let fetchLink;
let currentSearch;

/*  EVENT LISTENERS  */
searchInput.addEventListener('input', updateInput);
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchPhotos(searchValue);
})
moreBtn.addEventListener('click', loadMore);

/* FUNCTIONS */
function updateInput(e) {
    searchValue = e.target.value;
}

async function fetchAPi(url){
    const dataFetch = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: auth
        }
    });
    const data = await dataFetch.json();
    return data;
}

function generatePhotos(data) {
    data.photos.forEach(photo => {
        const galleryImg = document.createElement('div');
        galleryImg.classList.add('gallery-img');
        galleryImg.innerHTML = 
            `
            <div class="photo-info">
                <div class="photo-info-left">
                    <p class="photographer">${photo.photographer}</p>
                    <p class="size-text">Tamaño original: ${photo.width} x ${photo.height}</p>
                </div>
                <div class="download-options">
                    <a class="download-btn" href="${photo.src.original}" target="_blank">
                        <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><path d="M336,176h40a40,40,0,0,1,40,40V424a40,40,0,0,1-40,40H136a40,40,0,0,1-40-40V216a40,40,0,0,1,40-40h40" style="fill:none;stroke:#b8c1ec;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/><polyline points="176 272 256 352 336 272" style="fill:none;stroke:#b8c1ec;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/><line x1="256" y1="48" x2="256" y2="336" style="fill:none;stroke:#b8c1ec;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/></svg>
                        <span>Original</span>
                    </a>
                    <div class="size-options">
                        <a href="${photo.src.large}" title="940x650" target="_blank">Grande</a>
                        <a href="${photo.src.medium}" title="350px altura" target="_blank">Med</a>
                        <a href="${photo.src.small}" title="130px altura" target="_blank">Pequeña</a>
                    </div>
                </div>
            </div>
            <img src="${photo.src.large}"/>`
        ;
        gallery.appendChild(galleryImg);
    })
}

async function curatedPhotos() {
    fetchLink = "https://api.pexels.com/v1/curated?per_page=12?page=1";
    const data = await fetchAPi(fetchLink);
    generatePhotos(data);
}

async function searchPhotos(query) {
    currentSearch = searchValue;
    clear();
    fetchLink = `https://api.pexels.com/v1/search?query=${query}&per_page=12&page=1&locale=es_ES`;
    const data = await fetchAPi(fetchLink);
    generatePhotos(data);
}

function clear() {
    gallery.innerHTML = "";
    searchInput.value = "";
}

async function loadMore() {
    page++;
    console.log(page);
    if (currentSearch) {
        fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}&per_page=12&page=${page}&locale=es_ES`;
    } else {
        fetchLink = `https://api.pexels.com/v1/curated?per_page=12&page=${page}`;
    }

    const data = await fetchAPi(fetchLink);
    generatePhotos(data);
}

curatedPhotos();