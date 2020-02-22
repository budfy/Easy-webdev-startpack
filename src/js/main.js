$(function () {

  //------------------- functions for aside inputs-------------------------

  var $summRange = $("#summ-range"),
    $summInput = $("#summ-indicator"),
    $summText = $('#summ-text'),
    summInstance,
    summMin = 1,
    summMax = 10000;

  $summRange.ionRangeSlider({
    type: "single",
    min: 1,
    max: 10000,
    from: 1000,
    grid: false,
    onStart: function (data) {
      $summInput.prop("value", data.from);
      $summText.html(data.from + ' ₴');
    },
    onChange: function (data) {
      $summInput.prop("value", data.from);
      $summText.html(data.from + ' ₴');
    }
  });

  summInstance = $summRange.data("ionRangeSlider");

  $summInput.on("input", function () {
    var summ = $(this).prop("value");

    // validate
    if (summ < summMin) {
      summ = summMin;
    } else if (summ > summMax) {
      summ = summMax;
    }

    summInstance.update({
      from: summ
    });

    $summText.html(summ + ' ₴');
  });

  var $termRange = $("#term-range"),
    $termInput = $("#term-indicator"),
    termInstance,
    termMin = 1,
    termMax = 365;

  $termRange.ionRangeSlider({
    type: "single",
    min: 1,
    max: 365,
    from: 1,
    grid: false,
    onStart: function (data) {
      $termInput.prop("value", data.from);
    },
    onChange: function (data) {
      $termInput.prop("value", data.from);
    }
  });

  termInstance = $termRange.data("ionRangeSlider");

  $termInput.on("input", function () {
    var term = $(this).prop("value");

    // validate
    if (term < termMin) {
      term = termMin;
    } else if (term > termMax) {
      term = termMax;
    }

    termInstance.update({
      from: term
    });
  });

});