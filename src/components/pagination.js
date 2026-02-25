import { getPages } from "../lib/utils.js";

let pageCount;
let elements;
let renderButton;
let pageTemplate;
let renderFunction;

const applyPagination = (query, state, action) => {
  const limit = state.rowsPerPage;
  let page = state.page;

  if (typeof action === "string") {
    switch (action) {
      case "prev":
        page = Math.max(1, page - 1);
        break;
      case "next":
        page = Math.min(pageCount, page + 1);
        break;
      case "first":
        page = 1;
        break;
      case "last":
        page = pageCount;
        break;
    }
  }

  return Object.assign({}, query, {
    limit,
    page,
  });
};

const updatePagination = (total, { page, limit }) => {
  if (!elements) return;

  pageCount = Math.ceil(total / limit);

  const { pages, fromRow, toRow, totalRows } = elements;

  if (!pages || !fromRow || !toRow || !totalRows) return;

  const visiblePages = getPages(page, pageCount, 5);

  pages.replaceChildren(
    ...visiblePages.map((pageNumber) => {
      const el = pageTemplate.cloneNode(true);
      return renderButton(el, pageNumber, pageNumber === page);
    }),
  );

  fromRow.textContent = (page - 1) * limit + 1;
  toRow.textContent = Math.min(page * limit, total);
  totalRows.textContent = total;
};

export function initPagination(paginationElements, renderPageButton, render) {
  elements = paginationElements;
  renderButton = renderPageButton;
  renderFunction = render;

  const { pages } = elements;

  if (pages && pages.firstElementChild) {
    pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.firstElementChild.remove();
  }

  if (elements.firstPage) {
    elements.firstPage.addEventListener("click", () => {
      renderFunction("first");
    });
  }

  if (elements.previousPage) {
    elements.previousPage.addEventListener("click", () => {
      renderFunction("prev");
    });
  }

  if (elements.nextPage) {
    elements.nextPage.addEventListener("click", () => {
      renderFunction("next");
    });
  }

  if (elements.lastPage) {
    elements.lastPage.addEventListener("click", () => {
      renderFunction("last");
    });
  }

  const rowsPerPageSelect = document.querySelector(
    '[data-name="rowsPerPage"] select',
  );
  if (rowsPerPageSelect) {
    rowsPerPageSelect.addEventListener("change", (e) => {
      renderFunction();
    });
  }

  return {
    applyPagination,
    updatePagination: (total, query) => updatePagination(total, query),
  };
}
