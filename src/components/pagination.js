import { getPages } from "../lib/utils.js";

let pageCount; // временная переменная для хранения количества страниц
let elements; // элементы пагинатора
let renderButton; // функция рендера кнопок
let pageTemplate; // шаблон для кнопок страниц
let renderFunction; // функция рендера из main.js

const applyPagination = (query, state, action) => {
    const limit = state.rowsPerPage;
    let page = state.page;

    // Обработка действий
    if (action) {
        switch (action) {
            case 'prev':
                page = Math.max(1, page - 1);
                break;
            case 'next':
                page = Math.min(pageCount, page + 1);
                break;
            case 'first':
                page = 1;
                break;
            case 'last':
                page = pageCount;
                break;
        }
    }

    // Добавляем параметры к query, но не изменяем исходный объект
    return Object.assign({}, query, {
        limit,
        page
    });
}

const updatePagination = (total, { page, limit }) => {
    // Вычисляем общее количество страниц
    pageCount = Math.ceil(total / limit);

    // Получаем элементы пагинатора
    const { pages, fromRow, toRow, totalRows } = elements;

    // Получаем массив видимых страниц
    const visiblePages = getPages(page, pageCount, 5);

    // Очищаем и перерисовываем кнопки страниц
    pages.replaceChildren(
        ...visiblePages.map(pageNumber => {
            const el = pageTemplate.cloneNode(true);
            return renderButton(el, pageNumber, pageNumber === page);
        })
    );

    // Обновляем информацию о записях
    fromRow.textContent = (page - 1) * limit + 1;
    toRow.textContent = Math.min(page * limit, total);
    totalRows.textContent = total;
}

export function initPagination(paginationElements, renderPageButton, render) {
    // Сохраняем ссылки на элементы, функцию рендера кнопок и функцию рендера таблицы
    elements = paginationElements;
    renderButton = renderPageButton;
    renderFunction = render; // сохраняем функцию рендера

    // Создаем шаблон страницы для клонирования
    const { pages } = elements;
    pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.firstElementChild.remove();

    // Добавляем обработчики событий на кнопки пагинатора
    elements.firstPage?.addEventListener('click', () => {
        renderFunction('first'); // используем сохраненную функцию
    });
    
    elements.previousPage?.addEventListener('click', () => {
        renderFunction('prev');
    });
    
    elements.nextPage?.addEventListener('click', () => {
        renderFunction('next');
    });
    
    elements.lastPage?.addEventListener('click', () => {
        renderFunction('last');
    });

    // Обработчик изменения количества строк на странице
    const rowsPerPageSelect = document.querySelector('[data-name="rowsPerPage"] select');
    rowsPerPageSelect?.addEventListener('change', (e) => {
        // Находим форму и обновляем значение
        const form = document.querySelector('form[name="table"]');
        if (form) {
            const formData = new FormData(form);
            formData.set('rowsPerPage', e.target.value);
            formData.set('page', '1'); // сбрасываем на первую страницу
            
            // Отправляем данные формы (создаем событие submit)
            const event = new Event('submit', { bubbles: true });
            form.dispatchEvent(event);
        }
    });

    return {
        applyPagination,
        updatePagination: (total, query) => updatePagination(total, query)
    };
}