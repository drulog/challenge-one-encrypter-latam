const storage = window.localStorage,
    message = getSelector('#message'),
    result = getSelector('#result'),
    list = getSelector('#list'),
    form = getSelector('#form'),
    defaults = {
        e: 'enter',
        i: 'imes',
        a: 'ai',
        o: 'ober',
        u: 'ufat',
    }

let keys = null, configParameters = false

function init() {
    if (!storage.getItem('keys')) {
        storage.setItem('keys', JSON.stringify(defaults))
    }

    keys = JSON.parse(storage.getItem('keys'))

    onclick('.encrypt', encrypt)
    onclick('.decrypt', decrypt)
    onclick('.reset', reset)
    onclick('.copy', copy)
    onclick('.config', parameters)

    append(keys)

    form.addEventListener("submit", submit)
    list.addEventListener("click", click)

}

function onclick(name, event) {
    document.querySelectorAll(name).forEach(elemento => {
        elemento.addEventListener('click', event);
    });
}
function getSelector(selector) {
    return document.querySelector(`${selector}`)
}

function add(key, value) {
    keys = { ...keys, [key]: value }
    storage.setItem('keys', JSON.stringify(keys))
}

function reset() {
    storage.setItem('keys', JSON.stringify(defaults))
    keys = defaults
    append(keys)
}

function click(event) {
    if (event.target.classList.contains("delete")) {
        var listItem = event.target.parentNode;
        var claveElemento = listItem.querySelector(".key");
        var clave = claveElemento.innerText;

        delete keys[clave];
        storage.setItem('keys', JSON.stringify(keys))
        list.innerHTML = '';
        append(keys)
    }
}

function submit(event) {
    event.preventDefault();
    var keyInput = getSelector("#claveInput").value;
    var valueInput = getSelector("#valorInput").value;

    if (keyInput.length === 1 && keyInput && valueInput) {
        add(keyInput, valueInput);
        append(keys)
        form.reset();
    }
}

function append(items) {
    list.innerHTML = '';
    for (var key in items) {
        if (items.hasOwnProperty(key)) {
            const value = items[key]
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                    <span class="key"><strong>${key}</strong></span> <span class="value">${value}</span> <button class="delete">x</button>
                `;
            list.appendChild(listItem);
        }
    }
}

function copy() {
    const text = result.value
    const notification = getSelector('.notification');

    setTimeout(function () {
        alertaCopiado.classList.remove('show');
    }, 2500);

    navigator.clipboard.writeText(text)
        .then(() => {
            notification.classList.add('show');

            setTimeout(function () {
                notification.classList.remove('show');
            }, 2500);
        })
        .catch((error) => {
            console.error("Error copying text: ", error);
        });

}


function parameters(event) {

    const content = getSelector('.content');
    const parameters = getSelector('.parameters');

    if (configParameters) {
        parameters.classList.remove('show');
        content.classList.remove('close');
        configParameters = false

        event.target.innerHTML = 'config'
    } else {
        parameters.classList.add('show');
        content.classList.add('close');
        configParameters = true
        event.target.innerHTML = 'close'
    }

}

function encrypt() {
    let text = message.value,
        encrypted = ''

    for (let letter of text) {
        if (letter in keys) {
            encrypted += keys[letter];

        } else {
            encrypted += letter
        }
    }

    result.innerText = encrypted
}

function decrypt() {

    let text = message.value,
        decrypted = '',
        count = 0


    while (count < text.length) {
        let letter = text[count],
            exist = false;

        Object.entries(keys).forEach(([key, value]) => {
            const lengthValue = value.length
            const subtext = text.substr(count, lengthValue)

            if (subtext === value) {
                letter = key
                exist = true
                count += lengthValue
            }
        })

        decrypted += letter
        !exist && count++
    }

    result.innerText = decrypted
}


init()