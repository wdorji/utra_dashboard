const split = window.location.href.split("/");
const currentUrl = split[split.length - 1];

$(function () {
  var smq = SMQ.Client(SMQ.wsURL("/QPCSBroker/"));

  function onNavNames(msg, ftid) {
    const navList = document.getElementsByClassName("nav__list")[0];
    for (let i = 0; i < msg.length; i++) {
      const navItem = document.createElement("li");
      navItem.className = "nav__item";
      const aElement = document.createElement("a");
      aElement.className = "nav__link";
      if (msg[i].href === currentUrl) {
        aElement.className = "active";
      }

      aElement.textContent = msg[i].name;

      aElement.href = msg[i].href;

      navItem.append(aElement);
      navList.append(navItem);
    }
  }

  smq.subscribe("nav_items_response", {
    onmsg: onNavNames,
    datatype: "json",
  });

  smq.publish("signal", "nav_names_request");

  function onParameters(msg, ftid) {
    const controlGrid = document.getElementsByClassName("controlGrid")[0];
    const uncategorised = [];
    const categorised = new Map();
    const categories = [];

    // console.log(msg);

    for (let i = 0; i < msg.length; i++) {
      if (!msg[i].category) {
        // uncategorised.push(msg[i]);
        continue;
      } else if (categorised.has(msg[i].category)) {
        categorised.get(msg[i].category).push(msg[i]);
      } else {
        categorised.set(msg[i].category, [msg[i]]);
        categories.push(msg[i].category);
      }
    }

    if (categories.length > 0) {
      for (let c = 0; c < categories.length; c++) {
        const curCategory = categories[c];

        const categoryGrid = document.createElement("div");
        categoryGrid.className = "categoryGrid";

        const categoryWrapper = document.createElement("div");
        categoryWrapper.className = "categoryWrapper";

        const categoryTitle = document.createElement("label");
        categoryTitle.className = "categoryTitle";
        categoryTitle.textContent = "Category name " + curCategory;

        categoryWrapper.append(categoryTitle);

        const categoryWidgets = categorised.get(curCategory);

        for (let i = 0; i < categoryWidgets.length; i++) {
          const widgetData = categoryWidgets[i];

          const widgetContainer = document.createElement("div");
          widgetContainer.className = "widgetContainer";

          const widgetLabel = document.createElement("label");
          widgetLabel.textContent = widgetData.name + ":";

          widgetContainer.append(widgetLabel);

          if (widgetData.widgetType === "dropdown") {
            const dropdownSelect = document.createElement("select");

            widgetData.options.forEach((element) => {
              const curOption = document.createElement("option");
              curOption.value = element;
              curOption.textContent = element;
              dropdownSelect.append(curOption);
            });
            widgetContainer.append(dropdownSelect);

            categoryGrid.append(widgetContainer);
          } else {
            const widgetInput = document.createElement("input");

            if (widgetData.widgetType == "text") {
              // console.log(
              //   widgetData.placeholder,
              //   typeof widgetData.placeholder
              // );
              widgetInput.type = "text";
              widgetInput.value = widgetData.placeholder;
              // console.log("text", widgetData.name);

              widgetContainer.append(widgetInput);
            } else if (widgetData.widgetType == "range") {
              widgetInput.id = widgetInput.name;
              widgetInput.value = widgetData.value;

              const counterWrapper = document.createElement("div");
              counterWrapper.className = "counterWrapper";
              const counterButton = document.createElement("div");
              counterButton.className = "counterButton";

              const incButton = document.createElement("a");
              incButton.innerHTML = "&#9650;";
              incButton.style.fontSize = 10;
              incButton.addEventListener("click", function () {
                widgetInput.value = +widgetInput.value + widgetData.step;
              });

              const decButton = document.createElement("a");
              decButton.innerHTML = "&#9660;";
              decButton.style.fontSize = 10;
              decButton.addEventListener("click", function () {
                widgetInput.value = +widgetInput.value - widgetData.step;
              });

              counterWrapper.append(widgetInput);
              counterButton.append(incButton);
              counterButton.append(decButton);
              counterWrapper.append(counterButton);
              widgetContainer.append(counterWrapper);
            } else {
              widgetInput.type = "checkbox";
              widgetInput.checked = widgetData.checked;
              widgetContainer.append(widgetInput);
            }

            categoryGrid.append(widgetContainer);
          }
        }
        categoryWrapper.append(categoryGrid);
        controlGrid.append(categoryWrapper);
      }
    }
  }

  smq.subscribe("parameters_response", {
    onmsg: onParameters,
    datatype: "json",
  });

  smq.publish("signal", "parameters_request");
});
