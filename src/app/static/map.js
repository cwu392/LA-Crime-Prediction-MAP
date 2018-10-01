// Main map view
var map = L.map('mainMap').setView([34.052, -118.243], 12);

// Decorate main map view
L.tileLayer(
    'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(map);


// Plot each point on map
function createMarker(d) {
    var marker = L.circle([d['longitude'], d['latitude']], {
        radius: 60,
        fillColor: "#ff0000",
        color: "#000",
        weight: 0,
        opacity: 0,
        fillOpacity: 0.3
    });
    marker.bindPopup(
        '<p>' + d['crime_code_description'] + '</p>' +
        d['date'] + ' ' + d['time']);
    return marker;
}

// Global layers
var layers = [];

// Time range picker functions
var convertToHour = function (value) {
    return Math.floor(value / 60);
};
var convertToMinute = function (value, hour) {
    return value - hour * 60;
};
var formatHoursAndMinutes = function (hours, minutes) {
    if (hours.toString().length == 1) hours = '0' + hours;
    if (minutes.toString().length == 1) minutes = '0' + minutes;
    return hours + ':' + minutes;
};

// Initialize time range
var slider = $("#slider-time").bootstrapSlider({
    id: "slider-time",
    range: true,
    min: 0,
    max: 1440,
    step: 60,
});
slider.on("change", function (value, handle) {
    // Start time
    var values = value.value.newValue;
    var hoursStart = convertToHour(values[0]);
    var minutesStart = convertToMinute(values[0], hoursStart);
    $("#slider-time-start").html(formatHoursAndMinutes(hoursStart, minutesStart));
    // End time
    var hoursEnd = convertToHour(values[1]);
    var minutesEnd = convertToMinute(values[1], hoursEnd);
    $("#slider-time-end").html(formatHoursAndMinutes(hoursEnd, minutesEnd));

    // TODO: Efficient add/removal of layers by keeping previous state
    for (let i = 0; i < 24; i++) {
        if (i < hoursStart || i > hoursEnd) {
            // console.log("Layer " + i + " removed!");
            map.removeLayer(layers[i]);
        } else {
            // console.log("Layer " + i + " kept!");
            map.addLayer(layers[i]);
        }
    }
});


var dateRangePicker = $('#formDateRange').daterangepicker({
        locale: {
            format: 'YYYY-MM-DD'
        },
        startDate: '2013-01-01',
        endDate: '2013-12-31'
    },
    function (start, end, label) {
        console.log(start);
        console.log(end);
        console.log(label);
    });


const addLayers = function (data) {
    // Layers for each hour
    for (layer of layers) {
        map.removeLayer(layer);
    }
    layers = []
    let n = 24;
    for (let i = 0; i < n; i++) {
        layers.push(new L.FeatureGroup());
    }

    // Add to corresponding layer
    for (d of data) {
        let hour = parseInt(d['time'].substring(0, 2))
        layers[hour].addLayer(createMarker(d));
    }

    // Add all layers
    for (layer of layers) {
        map.addLayer(layer);
    }

}


$('#formDateFilter').submit(function () {
    let startDate = dateRangePicker.data('daterangepicker').startDate._d;
    let endDate = dateRangePicker.data('daterangepicker').endDate._d;
    let startDateStr = moment(startDate).format("YYYY-MM-DD");
    let endDateStr = moment(endDate).format("YYYY-MM-DD");
    let dayOfWeekPicker = $('#formDayOfWeek');
    loadData(startDateStr, endDateStr).then(addLayers)
});


// Returns Promise to load data
const loadData = async (startDate, endDate) => {
    let url = "/data?" + $.param({
        startDate: startDate,
        endDate: endDate
    });
    const response = await fetch(url);
    const json = await response.json();
    return json;
};


// Plot points when loaded
loadData().then(addLayers);