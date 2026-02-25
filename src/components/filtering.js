export function initFiltering(elements) {
  // Функция для обновления селекта продавцов
  const updateIndexes = (elements, indexes) => {
    Object.keys(indexes).forEach((elementName) => {
      if (elements[elementName]) {
        const select = elements[elementName];
        select.innerHTML = '<option value="" selected>—</option>';

        Object.values(indexes[elementName]).forEach((name) => {
          const el = document.createElement("option");
          el.textContent = name;
          el.value = name;
          select.appendChild(el);
        });
      }
    });
  };

  // Функция для очистки конкретного поля
  const clearField = (field) => {
    if (field === "date" && elements.searchByDate) {
      elements.searchByDate.value = "";
    } else if (field === "customer" && elements.searchByCustomer) {
      elements.searchByCustomer.value = "";
    } else if (field === "seller" && elements.searchBySeller) {
      elements.searchBySeller.value = "";
    }
  };

  // Функция для формирования параметров фильтрации в query
  const applyFiltering = (query, state, action) => {
    if (action && action.name === "clear") {
      const field = action.dataset?.field;
      if (field) {
        clearField(field);
      }
      return query;
    }

    const filterParams = {};

    if (elements.searchByDate && elements.searchByDate.value) {
      const dateValue = elements.searchByDate.value;
      // API принимает только полную дату в формате YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
        filterParams["filter[date]"] = dateValue;
      }
    }

    if (elements.searchByCustomer && elements.searchByCustomer.value) {
      filterParams["filter[customer]"] = elements.searchByCustomer.value;
    }

    if (elements.searchBySeller && elements.searchBySeller.value) {
      filterParams["filter[seller]"] = elements.searchBySeller.value;
    }

    if (elements.totalFrom && elements.totalFrom.value) {
      filterParams["filter[totalFrom]"] = elements.totalFrom.value;
    }

    if (elements.totalTo && elements.totalTo.value) {
      filterParams["filter[totalTo]"] = elements.totalTo.value;
    }

    if (Object.keys(filterParams).length > 0) {
      return Object.assign({}, query, filterParams);
    }

    return query;
  };

  return {
    updateIndexes,
    applyFiltering,
  };
}
