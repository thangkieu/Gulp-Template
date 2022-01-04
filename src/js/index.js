function onLoaded() {
  $("[data-toggle] .panel-block").toggle();

  const ceidsCheckboxesUrl = "[type=checkbox][name=ceids]";
  const vidsCheckboxes = "[type=checkbox][name=vids]";

  const $ceidsCheckboxes = $(ceidsCheckboxesUrl);
  const $vidsCheckboxes = $(vidsCheckboxes);

  const $formReport = $(".js-form-report");
  const $formReportName = $(".js-report-name");
  const $formReportID = $(".js-report-id");

  const $ceidsList = $(".js-report-ceids-list");
  const $vidsList = $(".js-report-vids-list");

  $(document)
    .on("click", ".js-toggle-btn", function () {
      $(this).closest("[data-toggle]").find(".panel-block").toggle({
        duration: 200,
      });
    })
    .on("click", ".js-item-select", function () {
      $(this)
        .closest(".js-item-list")
        .find(".js-item-select")
        .removeClass("active");
      $(this).addClass("active");

      // fill data
      const data = this.dataset;
      $formReportName.val(data.name);
      $formReportID.val(data.id);

      $ceidsList.empty();

      $ceidsCheckboxes.prop("checked", false);
      $vidsCheckboxes.prop("checked", false);

      (data.ceids || "").split(",").forEach((item) => {
        $ceidsList.append(`<li>${item}</li>`);
        $(`${ceidsCheckboxesUrl}[value=${item}]`).prop("checked", true);
      });

      $vidsList.empty();
      (data.vids || "").split(",").forEach((item) => {
        $vidsList.append(`<li>${item}</li>`);
        $(`${vidsCheckboxes}[value=${item}]`).prop("checked", true);
      });
    })
    .on("click", ".js-btn-report-New", function () {
      $formReport.get(0).reset();
      $ceidsList.empty();
      $vidsList.empty();

      $(".js-item-list .js-item-select").removeClass("active");
      $ceidsCheckboxes.prop("checked", false);
      $vidsCheckboxes.prop("checked", false);
    })
    .on("click", ".js-btn-vids-update", function () {
      $vidsList.empty();

      $checkboxes = $(this)
        .closest(".js-panel-vids-container")
        .find("[type=checkbox]");

      $checkboxes.each(function () {
        const value = $(this).val();
        const checked = $(this).is(":checked");

        if (checked) $vidsList.append(`<li>${value}</li>`);
      });
    })
    .on("click", ".js-btn-ceids-update", function () {
      $ceidsList.empty();

      $checkboxes = $(this)
        .closest(".js-panel-ceids-container")
        .find("[type=checkbox]");

      $checkboxes.each(function () {
        const value = $(this).val();
        const checked = $(this).is(":checked");

        if (checked) $ceidsList.append(`<li>${value}</li>`);
      });
    });
}

document.addEventListener("DOMContentLoaded", onLoaded);
