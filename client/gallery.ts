///////////////////////////////////////
// Gallery
const btnShowGallery: HTMLElement = document.querySelector( '.btnShowGallery');
const btnPrev: HTMLElement = document.querySelector('.previous');
const btnNext: HTMLElement = document.querySelector('.next');
const btnPages: NodeListOf<HTMLButtonElement> = document.querySelector('#pages').querySelectorAll('button');

// Will be recorded in the getGallery
let currentPage: number = 1;
let maxPage: number;
const url: string = "127.0.0.1:2000";


async function getGallery(i: number) {
  try {
    cleanGallery();
    const responseGallery = await fetch(
      `http://${url}/gallery?page=${i}`,
      {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      }
    );

    const resultGallery = await responseGallery.json();
    currentPage = resultGallery.page;
    maxPage = resultGallery.total;
    localStorage.setItem('page', resultGallery.page);

    updateURLParams();

    // Rendering images
    const images: string[] = resultGallery.objects;

    images.forEach((src: string) => {
      const img: HTMLImageElement = document.createElement('img');
      img.src = `${src}`;
      img.width = 300;
      img.id = 'img';

      document.querySelector('#imgs').append(img);
    });
  } catch (error) {
    alert(`Error:${error}`);
    localStorage.setItem('page', '1');
    await getGallery(1);
  }
}

btnShowGallery.addEventListener('click', element => {
  element.preventDefault();

  if (localStorage.getItem('token')) {
    getGallery(<number>(localStorage.getItem('page') || currentPage));
  }
});

function cleanGallery() {
  document.querySelectorAll<HTMLImageElement>('#img').forEach(element => element.remove());
}

btnNext.addEventListener('click', element => {
  element.preventDefault();

  nextPage();
});

btnPrev.addEventListener('click', element => {
  element.preventDefault();

  prevPage();
});

function nextPage() {
  if (currentPage === maxPage) {
    currentPage = 1;
  } else {
    currentPage++;
  }

  getGallery(currentPage);
}

function prevPage() {
  if (currentPage === 1) {
    currentPage = maxPage;
  } else {
    currentPage--;
  }

  getGallery(currentPage);
}

btnPages.forEach(element => {
  element.addEventListener('click', () => {
    getGallery(Number(element.innerHTML));
  });
});

// get value from URL
function getPageParameter() {
  const urlParams = new URLSearchParams(window.location.search);

  return urlParams.get('page');
}

// handle page load event
window.onload = function () {
  const pageNumber = getPageParameter();
  if (pageNumber !== null) {
    getGallery(Number(pageNumber));
  }
};

// generate new url
function updateURLParams() {
  const params = new URLSearchParams(window.location.search);
  params.set('page', String(currentPage));
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.pushState({}, '', newUrl);
}

export {};
