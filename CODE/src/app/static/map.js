// Main map view
var map = L.map('mainMap').setView([34.052, -118.243], 12);
var COLOR_CODES = {1: "#e41a1c", 2: "#377eb8", 3: "#4daf4a",
    4: "#984ea3", 5: "#ff7f00", 6: "#aaaa00"}
// Decorate main map view
L.tileLayer(
    'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(map);


// var colorScale = ["#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84",
// 		              "#fc8d59", "#ef6548", "#d7301f", "#b30000", "#7f0000"];
// var colorScale = ["#fdd49e", "#fc8d59", "#ef6548", "#b30000", "#7f0000"];
var colorScale = ["#ffffff", "#fc8d59", "#ef6548", "#b30000", "#7f0000"];

var crime_mapping = {1: 100, 2: 60, 3: 40, 4: 30, 5: 10, 6: 5};
// var crime_mapping = {1: 1, 2:1, 3:1, 4:1, 5:1, 6:1}

var model = [0.28589417, 0.29183202, 0.27645071, 0.27915093, 0.28353795,
       0.26946787, 0.2797979 , 0.28661911, 0.27657558, 0.2779643 ,
       0.28218571, 0.27759844, 0.27846543, 0.28900045, 0.28668343,
       0.28703075, 0.28802073, 0.27533912, 0.27988424, 0.29215508,
       0.27994451, 0.2834143 , 0.28872595, 0.28180168, 0.27105842,
       0.27944198, 0.29016376, 0.27277653, 0.28691556, 0.29788344,
       0.27369073, 0.28318927, 0.29252296, 0.27381372, 0.28548063,
       0.29777053, 0.28575391, 0.28965183, 0.28187948, 0.28321394,
       0.28671383, 0.28316803, 0.29590834, 0.29532006, 0.28375286,
       0.29097553, 0.28760258, 0.28982283, 0.29831746, 0.29353104,
       0.29397323, 0.29914246, 0.28829168, 0.28773753, 0.30331279,
       0.29922944, 0.29049128, 0.31465552, 0.30552762, 0.29145975,
       0.31172458, 0.30676414, 0.29674682, 0.32721256, 0.32031679,
       0.30036344, 0.32206641, 0.31875915, 0.30974067, 0.32826028,
       0.33101509, 0.32041577, 0.33235068, 0.32787374, 0.31657419,
       0.32995739, 0.34058271, 0.33245347, 0.34327045, 0.33870094,
       0.32539294, 0.33915128, 0.33985372, 0.33386718, 0.34958105,
       0.3527378 , 0.34334782, 0.35027711, 0.34951181, 0.34774494];

results = new Array(1135);
real_startDate = Date();
real_endDate = Date();
data_for_each_day = new Array(1135);
for(var i = 0; i < 1135; i ++) {
    data_for_each_day[i] = new Array(90);
}

shape_layer_ids = [];
var mode = 0;
function showPred() {
    mode = 1;
    var x = document.getElementById("dayOfWeekDiv");
    var y = document.getElementById("timePickers");
    // var z = document.getElementById("timeBinPickerDiv");
    var z = document.getElementById("radioButtons");

    x.style.display = "none";
    y.style.display = "none";
    z.style.display = "block";
    document.getElementById("colorScale").style.display = "none";

}

function showLabel() {
    mode = 0;
    // var x = document.getElementById("dayOfWeekDiv");
    // x.style.display = "block";
    var x = document.getElementById("dayOfWeekDiv");
    var y = document.getElementById("timePickers");
    // var z = document.getElementById("timeBinPickerDiv");
    var z = document.getElementById("radioButtons");
    x.style.display = "block";
    y.style.display = "block";
    z.style.display = "none";
    document.getElementById("colorScale").style.display = "block";


}

var shpfile = new L.Shapefile("/static/crime-in-los-angeles/LAPD_Reporting_Districts", {
	onEachFeature: function(feature, layer) {
        layer.options.weight = 0;
        layer.options.fillOpacity = 0.45;
        // console.log(feature)
        // console.log(layer.options)
		if (feature.properties) {
			layer.bindPopup(Object.keys(feature.properties).map(function(k) {
				// console.log(k + ": " + feature.properties[k]);
				return k + ": " + feature.properties[k];
			}).join("<br />"), {
				maxHeight: 200
			});
		}
	}
});

shpfile.addTo(map);
shpfile.once("data:loaded", function() {
	console.log("finished loaded shapefile");
    // console.log(Object.keys(shpfile._layers));
    var keys = Object.keys(shpfile._layers);
    for(var i = 0; i < keys.length; i ++) {
        shape_layer_ids.push(parseInt(keys[i]));
    }
    shape_layer_ids = Set(shape_layer_ids);
    // console.log(shape_layer_ids);
    $('#formSubmitButton').click();
});

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
var sliderTimeRange = $("#slider-time-range").bootstrapSlider({
    id: "slider-time-range",
    range: true,
    min: 0,
    max: 1440,
    value: [0, 1440],
    step: 60,
}).on("change", function (value, handle) {
    // Start time
    if (value.value == null) {
        value = {value: {newValue: JSON.parse("[" + this.value + "]")}};
    }
    var values = value.value.newValue;
    var hoursStart = convertToHour(values[0]);
    var minutesStart = convertToMinute(values[0], hoursStart);
    $("#slider-time-range-start").html(formatHoursAndMinutes(hoursStart, minutesStart));
    // End time
    var hoursEnd = convertToHour(values[1]);
    var minutesEnd = convertToMinute(values[1], hoursEnd);
    $("#slider-time-range-end").html(formatHoursAndMinutes(hoursEnd, minutesEnd));

    for (layer of layers) {
        map.removeLayer(layer);
    }

    for (layer of hr_layers){
    	map.removeLayer(layer);
    }

    // TODO: Efficient add/removal of layers by keeping previous state
    if(mode == 0) {
      for (let i = 0; i < 24; i++) {
          if (i >= hoursStart && i <= hoursEnd) {
              //console.log("Layer " + i + " added!");
              //map.removeLayer(layers[i]);
              map.addLayer(layers[i]);
          }
          //else {
              // console.log("Layer " + i + " kept!");
          //    map.addLayer(layers[i]);
          //}
      }
    }

});

// Initialize time bin
var sliderTimeBin = $("#slider-time-bin").bootstrapSlider({
    id: "slider-time-bin",
    range: false,
    enabled: false,
    min: 0,
    max: 1440,
    value: 0,
    step: 60,
}).on("change", function(value, handle) {
    if (value.value == null) {
        value = {value: {newValue: this.value}};
    }
    var minutes = value.value.newValue;
    var hour = convertToHour(minutes);
    var minute = convertToMinute(minutes, hour);
    $("#slider-time-bin-hour").html(formatHoursAndMinutes(hour, minute));

    for (layer of layers) {
        map.removeLayer(layer);
    }

    for (layer of hr_layers){
    	map.removeLayer(layer);
    }

    // TODO: Efficient add/removal of layers by keeping previous state
    for (let i = 0; i < 24; i++) {
        if (i == hour) {
            map.addLayer(hr_layers[i]);
        }
        //else {
            //layers[i].eachLayer(function(e){
            //    console.log(e.getLatLng());
            //    console.log(e.getPopup().getContent());
            //});
            //map.removeLayer(layers[i]);
        //}
    }
});

// Initialize date range picker
var dateRangePicker = $('#formDateRange').daterangepicker({
        locale: {
            format: 'YYYY-MM-DD'
        },
        startDate: '2013-01-01',
        endDate: '2013-01-08'
    },
    function (start, end, label) {
        // console.log(start);
        // console.log(end);
        // console.log(label);
    });


function parseDayOfWeek(dayOfWeek) {
    switch (dayOfWeek) {
        case 0:
            return 'Sun';
        case 1:
            return 'Mon';
        case 2:
            return 'Tue';
        case 3:
            return 'Wed';
        case 4:
            return 'Thu';
        case 5:
            return 'Fri';
        case 6:
            return 'Sat';
        default:
            return 'Unknown';
    }
}

// Radio button chooser
var radioButtons = $('input[type=radio][name=time-radios]').change(function() {
    if (this.value == 'time-range') {
        sliderTimeRange.bootstrapSlider('enable');
        sliderTimeBin.bootstrapSlider('disable');
        sliderTimeRange.trigger("change");
    }
    else if (this.value == 'time-bin') {
        sliderTimeRange.bootstrapSlider('disable');
        sliderTimeBin.bootstrapSlider('enable');
        sliderTimeBin.trigger("change");
    }
});

// Global layers
var layers = [];
var hr_layers = [];
var pt_dict = {};
var hrly_pt_dict = {};

// var dayOfWeekValues = [];
// $('#formDayOfWeek .active').each(function(){
//     dayOfWeekValues.push(parseInt($(this).attr('data')));
// });

// var crime_code = [];
// $('#btnFilter').click(function(){
//     crime_code.push(parseInt($(this).attr('value')));
// });
// console.log(crime_code)

// $('#btnFilter').click(function(){
// 	// var CheckArr = new Array();
//   var crime_code = [];
//   $('input[type=checkbox]').each(function () {
//     if ($(this).is(':checked')) {
//       crime_code.push(parseInt($(this).attr('value')));
//     }
//     console.log(crime_code)
//   });
// })

// Plot each point on map
function createMarker(d) {

    var marker = L.circle([d['latitude'], d['longitude']], {
        radius: 100,
        fillColor: COLOR_CODES[d['crime_code']],
        color: "#000",
        weight: 0,
        opacity: 0,
        fillOpacity: 0.57
    });

    var marker2 = L.circle([d['latitude'], d['longitude']], {
        radius: 100,
        fillColor: COLOR_CODES[d['crime_code']],
        color: "#000",
        weight: 0,
        opacity: 0,
        fillOpacity: 0.57
    });

    let k = d['latitude'] + ',' + d['longitude'];
    if(k in pt_dict) {
        pt_dict[k] = pt_dict[k] + '<br>' +
            '<b>' + d['crime_code_description'] + '</b>' +
            '<p>' + d['date'] + ' ' + d['time'] + ' ' +
            parseDayOfWeek(d['day_of_week']) + '</p>';
    }
    else {
        pt_dict[k] = '<b>' + d['crime_code_description'] + '</b>' +
        '<p>' + d['date'] + ' ' + d['time'] + ' ' +
        parseDayOfWeek(d['day_of_week']) + '</p>';
    }

    let h = parseInt(d['time'].substring(0, 2));
    if(h in hrly_pt_dict){
    	if(k in hrly_pt_dict[h]) {
	        hrly_pt_dict[h][k] = hrly_pt_dict[h][k] + '<br>' +
	            '<b>' + d['crime_code_description'] + '</b>' +
	            '<p>' + d['date'] + ' ' + d['time'] + ' ' +
	            parseDayOfWeek(d['day_of_week']) + '</p>';
    	}
    	else {
	        hrly_pt_dict[h][k] = '<b>' + d['crime_code_description'] + '</b>' +
	        '<p>' + d['date'] + ' ' + d['time'] + ' ' +
	        parseDayOfWeek(d['day_of_week']) + '</p>';
    	}
    }
    else{
    	let curr_pt = '<b>' + d['crime_code_description'] + '</b>' +
        '<p>' + d['date'] + ' ' + d['time'] + ' ' +
        parseDayOfWeek(d['day_of_week']) + '</p>';
    	hrly_pt_dict[h] = {k: curr_pt};
    }

    marker.bindPopup(pt_dict[k]);
    marker2.bindPopup(hrly_pt_dict[h][k]);

    return [marker, marker2];
}


// $('#btnFilter').click(function(){
// 	var CheckArr = new Array();
//   $('input[type=checkbox]').each(function () {
//     if ($(this).is(':checked')) {
//       if (!isNaN($(this).attr('value'))){CheckArr.push(parseInt($(this).attr('value')))}
//     }
//   });
//   console.log(CheckArr);
// })



// var kk1=$('#checkboxes input:checked')
// console.log(kk1)

// console.log(selected)

function addLayers(data) {
    // console.log("ADDING LAYERS");
    // console.log(real_startDate);
    // console.log(real_endDate);
    for(var i = 0; i < 1135; i ++) {
        results[i] = 0;
        for(var j = 0; j < 90; j ++) {
            data_for_each_day[i][j] = 0;
        }
    }

    var selected = [];
    $('#checkboxes input:checked').each(function() {
        selected.push(parseInt($(this).attr('value')));
    })
    // console.log(data)
    // Layers for each hour
    for (layer of layers) {
        map.removeLayer(layer);
    }

    layers = [];
    hr_layers = [];
    pt_dict = {};
    hrly_pt_dict = {};

    let n = 24;
    for (let i = 0; i < n; i++) {
        layers.push(new L.FeatureGroup());
        hr_layers.push(new L.FeatureGroup());
    }
    var radio_button_val = $("input[name=show_type]:checked").val();
    // Add to corresponding layer


    for (d of data) {
      // console.log(selected)
      // console.log(d['crime_code'])
      // console.log(selected.includes(d['crime_code']))
      if (selected.includes(d['crime_code'])){
            // console.log(selected)
            // console.log(d['crime_code'])
            let hour = parseInt(d['time'].substring(0, 2))
              // if (d['crime_code'] in selected){
              //   console.log(selected)
            markers = createMarker(d);
            layers[hour].addLayer(markers[0]);
            hr_layers[hour].addLayer(markers[1]);
            // console.log(d['date']);

            // console.log((date - real_startDate) / (1000 * 60 * 60 * 24));
            // For each point, add to its district
            if(d.district < 0 || d.district > 1135) {
                // console.log(d.district);
                continue;
            }

            if(mode == 1 && radio_button_val == "prediction") {
                let date = new Date(d['date']);
                let date_diff = parseInt((date - real_startDate) / (1000 * 60 * 60 * 24));
                data_for_each_day[d.district - 1][date_diff] += crime_mapping[d.crime_code];
            } else {
                results[d.district - 1] += crime_mapping[d.crime_code];
            }
        }
    }

    if(mode == 1 && radio_button_val == "prediction") {
        for(var i = 0; i < 1135; i ++) {
            for(var j = 0; j < 90; j ++) {
                results[i] += data_for_each_day[i][j] * model[j];
            }
        }
    }

    var color = d3.scale.quantize()
                    .domain([0, Math.max.apply(null, results)])
                    .range(colorScale);

    map.eachLayer(function(layer){
        // console.log(layer._leaflet_id);
        if(shape_layer_ids.includes(layer._leaflet_id)) {
            var val = results[layer.feature.properties.OBJECTID - 1];
            // var val = last_week_pred[layer.feature.properties.OBJECTID - 1];
            layer.setStyle({color: color(val)});
        }
    });

    // Add all layers to map

    if(mode == 0) {
        for (layer of layers) {
            map.addLayer(layer);
        }
    }

}

Date.prototype.addDays = function(days) {
  var dat = new Date(this.valueOf());
  dat.setDate(dat.getDate() + days);
  return dat;
}

// Refresh data on form date submission
$('#formDateFilter').submit(function () {
    // console.log("mode" + mode);
    let startDate = dateRangePicker.data('daterangepicker').startDate._d;
    let endDate = dateRangePicker.data('daterangepicker').endDate._d;

    var radio_button_val = $("input[name=show_type]:checked").val();


    // In prediction mode
    if(mode == 1) {
        // prediction part (load last 3 months data)
        if(radio_button_val == "prediction") {
            endDate = startDate.addDays(-1);
            startDate = startDate.addDays(-90);
        }
        // label part (load next one month data)
        else {
            endDate = startDate.addDays(31);
            startDate = startDate.addDays(1);
        }
        real_startDate = startDate;
        real_endDate = endDate;
    }

    // console.log(startDate);
    // console.log(endDate);

    // console.log($("input[name=show_type]:checked").val());

    let startDateStr = moment(startDate).format("YYYY-MM-DD");
    let endDateStr = moment(endDate).format("YYYY-MM-DD");
    let dayOfWeekPicker = $('#formDayOfWeek');
    var dayOfWeekValues = [];
    var crimeCode = [];
    $('#formDayOfWeek .active').each(function(){
        dayOfWeekValues.push(parseInt($(this).attr('data')));
    });
    // console.log(dayOfWeekValues)
    loadData(startDateStr, endDateStr, dayOfWeekValues).then(addLayers).then(function() {
        var value = $('input[type=radio][name=time-radios]:checked').val();
        if (value == 'time-range') {
            sliderTimeRange.bootstrapSlider('enable');
            sliderTimeBin.bootstrapSlider('disable');
            sliderTimeRange.trigger("change");
        }
        else if (value == 'time-bin') {
            sliderTimeRange.bootstrapSlider('disable');
            sliderTimeBin.bootstrapSlider('enable');
            sliderTimeBin.trigger("change");
        }
    });
});

// Returns Promise to load data
const loadData = async (startDate, endDate, dayOfWeek) => {
    let url = "/data?" + $.param({
        startDate: startDate,
        endDate: endDate,
        dayOfWeek: JSON.stringify(dayOfWeek)
    });

    return $.getJSON(url).fail( function(d, textStatus, error) {
        console.error("getJSON failed, status: " + textStatus + ", error: "+error)
    });
};


// After data load, add the layers
$(document).ready(function() {
    $('#formSubmitButton').click();
});
