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
    'i',
];

const videos = [
    //'mama',
    //'naza',

    'noe',
    'charo',
    'ana',
    'nati',
    'mariana',

    //'facu',
    //'marto',

    'maca',
    // 'leo',

    'marisol',

    //'ceci',
    //'vale',
    //'caro',

    'cris',
    'zarush',
];

const fotos = fillRange(1, 15);

const goNext = () => {
    Swal.fire({
        html: '<iframe width="100%" height="300" src="//www.youtube.com/embed/MG-B-imarjo?wmode=transparent&amp;iv_load_policy=3&amp;autoplay=1" frameborder="0"></iframe>',
        confirmButtonText: 'Mas?! &rarr;',
        didClose: () => {
            window.location.href = 'index3.html';
        },
    });
};

const fireMacaVideo = () => {
    Swal.fire({
        html:
            `<video id="myVideo"style="text-center" width="320" height="240" controls> +
            <source src="/media/maca.mp4" type="video/mp4"> +
            Sorry, your browser doesnt support embedded videos. +
            </video>`,
        title: `<span style="color:${randomColor()}">Saluditos</span>&nbsp;de...`,
        confirmButtonText: 'Sigue! &rarr;',
        didClose: () => {
            fireLeoVideo();
        },
        width: 600,
        showClass: {
            popup: 'animate__animated animate__pulse'
        },
    });
};

const fireLeoVideo = () => {
    Swal.fire({
        html:
            `<video id="myVideo"style="text-center" width="320" height="240" controls> +
            <source src="/media/leo.mp4" type="video/mp4"> +
            Sorry, your browser doesnt support embedded videos. +
            </video>`,
        title: `<span style="color:${randomColor()}">Y también</span>&nbsp;de...`,
        confirmButtonText: saludos[Math.floor(Math.random() * saludos.length)],
        didClose: () => {
            if (clickeados >= letras.length) {
            // if (clickeados >= 2) {
                goNext();
            }

        },
        width: 600,
        showClass: {
            popup: 'animate__animated animate__pulse'
        },
    });
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
        if (video === 'maca') {
            fireMacaVideo();
            return;
        }

        Swal.fire({
            html:
                `<video id="myVideo"style="text-center" width="320" height="240" controls> +
                <source src="/media/${video}.mp4" type="video/mp4"> +
                Sorry, your browser doesnt support embedded videos. +
                </video>`,
            title: `<span style="color:${randomColor()}">Saluditos</span>&nbsp;de...`,
            confirmButtonText: saludos[Math.floor(Math.random() * saludos.length)],
            didClose: () => {
                if (clickeados >= letras.length) {
                // if (clickeados >= 2) {
                    goNext();
                }

            },
            width: 600,
            showClass: {
                popup: 'animate__animated animate__pulse'
            },
        });
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