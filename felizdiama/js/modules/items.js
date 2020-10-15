import { html } from 'https://unpkg.com/lit-html?module';

//style="background-image:url('img/fotos/${item.foto}.jpg')"
// style="background-image:url('http://placekitten.com/g/200/300')"

const itemTemplate = (item, clickHandler) => {
    const handler = {
        handleEvent(e) {
            clickHandler(e);
        },
        capture: false,
        passive: false,
        once: true,
    };

    return html`
<div
    data-item-video=${item.video}
    data-item-letra=${item.letra}
    id="${item.id}"
    class="card"
    style="background-image:url('img/fotos/${item.foto}.jpg')"
    @click=${handler}
></div>`
};

export default (items, clickHandler) => html`
    ${items.map(
    item =>
        html`
                ${itemTemplate(item, clickHandler)}
            `
)}`;
