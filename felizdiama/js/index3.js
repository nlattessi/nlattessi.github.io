import { render } from 'https://unpkg.com/lit-html?module';
import { $, shuffle, fillRange, makeid, randomColor } from './modules/utils.js';
import saludos from './modules/saludos.js';
import itemListTemplate from './modules/items.js';

let clickeados = 0;

const letras = [
    't',
    'e',
    'a',
    'm',
    'o',
];

const videos = [
    'dante/gusta_bailar',
    'dante/gusta_cocinar',
    'dante/gusta_despertar',
    'dante/gusta_sentarme_silla',
    'dante/gusta_ponerle_besitos',
];

const fotos = fillRange(20, 24);

const fireLastVideo = () => Swal.fire({
    html:
        `<video style="text-center" width="320" height="240" controls> +
        <source src="/media/dante/final.mp4" type="video/mp4"> +
        Sorry, your browser doesnt support embedded videos. +
        </video>`,
    title: `<span style="color:${randomColor()}">Y los más lindos saluditos!</span>`,
    confirmButtonText: "Gracias mi amor!",
    width: 600,
    showClass: {
        popup: 'animate__animated animate__bounce'
    },
    didClose: () => {
        window.location.href = '/backstage.html';
    },
});

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
        Swal.fire({
            html:
                `<video id="myVideo"style="text-center" width="320" height="240" controls> +
                <source src="/media/${video}.mp4" type="video/mp4"> +
                Sorry, your browser doesnt support embedded videos. +
                </video>`,
            title: `<span style="color:${randomColor()}">Me gusta...</span>`,
            confirmButtonText: saludos[Math.floor(Math.random() * saludos.length)],
            didClose: () => {
                if (clickeados >= letras.length) {
                // if (clickeados >= 2) {
                    fireLastVideo();
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

    render(itemListTemplate(items.splice(0, 2), viewVideo), $("#simpleList"));
    render(itemListTemplate(items, viewVideo), $("#simpleList2"));
};

renderItems();