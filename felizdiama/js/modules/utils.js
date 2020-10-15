export function $(selector, scope = document) {
    return scope.querySelector(selector);
}

export function $$(selector, scope = document) {
    return Array.from(scope.querySelectorAll(selector));
}

export function listen(type, selector, callback) {
    document.addEventListener(type, event => {
        const target = event.target.closest(selector);

        if (target) {
            callback(event, target);
        }
    });
}

export function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export const fillRange = (start, end) => {
    return Array(end - start + 1).fill().map((item, index) => start + index);
};

export const makeid = length => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};


export const randomColor = () => Math.floor(Math.random() * 16777215).toString(16);
