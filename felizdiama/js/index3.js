import { render } from 'https://unpkg.com/lit-html?module';
import { $, shuffle, fillRange, makeid, randomColor } from './modules/utils.js';
import saludos from './modules/saludos.js';
import itemListTemplate from './modules/items.js';

let clickeados = 0;

const letras = [
    'f',
    'e',
    'l',
    'i',
    'z',
    'whitespace',
    'd',
    'i',
    'a',
    'whitespace',
    'm',
    'a',
    'm',
    'i',
];

const videos = [
    'mama',
    'naza',
    'noe',
    'charo',
    'ana',
    'nati',
    'mariana',
    'maca',
    // 'leo',
    'marisol',
    'vale',
    // 'ceci',
    // 'caro',
    'cris',
    'zarush',
    'marto',
    // 'facu',
];

const fotosLove = [
    'love1',
    'love2',
    'love3',
];

const fotos = fillRange(1, 14);

const getSwalOptions = video => {
    return {
        html:
            `<video style="text-center" width="320" height="240" controls> +
            <source src="media/${video}.mp4" type="video/mp4"> +
            Sorry, your browser doesnt support embedded videos. +
            </video>`,
        title: `<span style="color:${randomColor()}">Saluditos</span>&nbsp;de...`,
        confirmButtonText: saludos[Math.floor(Math.random() * saludos.length)],
        didClose: () => {
            if (clickeados >= letras.length) {
                goNext();
            }
        },
        width: 600,
        showClass: {
            popup: 'animate__animated animate__pulse'
        },
    };
};

const goNext = () => Swal.fire({
    html:
        `<video style="text-center" width="320" height="240" controls> +
        <source src="media/dante/final.mp4" type="video/mp4"> +
        Sorry, your browser doesnt support embedded videos. +
        </video>`,
    title: `<span style="color:${randomColor()}">Y los más lindos saluditos!</span>`,
    confirmButtonText: "Gracias mi amor!",
    width: 600,
    showClass: {
        popup: 'animate__animated animate__bounce'
    },
    didClose: () => {
        window.location.href = 'backstage.html';
    },
});

const fireLovePhoto = () => {
    const randomLoveImg = fotosLove[Math.floor(Math.random() * fotosLove.length)];

    Swal.fire({
        title: 'Yo también te amo!',
        text: 'Nahui ❤️',
        imageUrl: `img/${randomLoveImg}.jpg`,
        imageWidth: 400,
        imageHeight: 200,
        didClose: () => {
            if (clickeados >= letras.length) {
                goNext();
                return;
            }
        },
    })
};

const fireMacaVideo = () => {
    const swalOptions = Object.assign({}, getSwalOptions('maca'), {
        didClose: () => {
            fireLeoVideo();
        },
        confirmButtonText: 'Sigue! &rarr;',
    });
    Swal.fire(swalOptions);
};

const fireLeoVideo = () => {
    const swalOptions = Object.assign({}, getSwalOptions('leo'), {
        title: `<span style="color:${randomColor()}">Y también</span>&nbsp;de...`,
    });
    Swal.fire(swalOptions);
};

const fireValeVideo = () => {
    const swalOptions = Object.assign({}, getSwalOptions('vale'), {
        didClose: () => {
            fireCeciVideo();
        },
        confirmButtonText: 'Sigue! &rarr;',
    });
    Swal.fire(swalOptions);
};

const fireCeciVideo = () => {
    const swalOptions = Object.assign({}, getSwalOptions('ceci'), {
        didClose: () => {
            fireCaroVideo();
        },
        title: `<span style="color:${randomColor()}">Y también</span>&nbsp;de...`,
        confirmButtonText: 'Sigue! &rarr;',
    });
    Swal.fire(swalOptions);
};

const fireCaroVideo = () => {
    const swalOptions = Object.assign({}, getSwalOptions('caro'), {
        title: `<span style="color:${randomColor()}">Y también</span>&nbsp;de...`,
    });
    Swal.fire(swalOptions);
};

const viewVideo = async e => {
    const element = $(`#${e.target.id}`);
    const letra = e.target.dataset.itemLetra;
    const video = e.target.dataset.itemVideo;

    clickeados++;

    element.setAttribute("style", "transform: scaleX(-1);");

    setTimeout(() => {
        element.setAttribute("style", `background-image:url('img/letras/${letra}.png');`);
    }, 200);

    setTimeout(() => {
        if (video === 'undefined') {
            fireLovePhoto();
            return;
        }

        if (video === 'maca') {
            fireMacaVideo();
            return;
        }

        if (video === 'vale') {
            fireValeVideo();
            return;
        }

        Swal.fire(getSwalOptions(video));
    }, 750);
};

const renderItems = () => {
    shuffle(videos);
    shuffle(fotos);

    const items = letras.map(l => {
        return {
            letra: l,
            video: videos.pop(),
            foto: fotos.pop(),
            id: makeid(10),
        };
    });

    render(itemListTemplate(items.splice(0, 5), viewVideo), $("#simpleList"));
    render(itemListTemplate(items.splice(0, 5), viewVideo), $("#simpleList2"));
    render(itemListTemplate(items, viewVideo), $("#simpleList3"));
};

renderItems();