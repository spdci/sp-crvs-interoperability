function gOnPageLoad() {

	$(".nav-link.graph").addClass("active");

	google.charts.load('current', {
		'packages' : [ 'corechart' ]
	});
	google.charts.setOnLoadCallback(drawChart);

	function drawChart() {

		var data = google.visualization.arrayToDataTable([
				[ 'Year', 'Sales', 'Expenses' ], [ '2013', 1000, 400 ],
				[ '2014', 1170, 460 ], [ '2015', 660, 1120 ],
				[ '2016', 1030, 540 ] ]);

		var options = {
			title : 'Performance',
			hAxis : {
				title : 'Year',
				titleTextStyle : {
					color : '#333'
				}
			},
			vAxis : {
				minValue : 0
			}
		};

		var chart = new google.visualization.AreaChart(document
				.getElementById('chart_div'));
		chart.draw(data, options);
	}

	$(".bootstrap-select").removeClass("form-select form-select-sm");

	$(".graphTypeDrp").on("change", function() {
		var val = $(this).val();

		switch (val) {
		case "area":
			drawAreaChart();
			break;
		case "bar":
			drawBarChart();
			break;
		case "column":
			drawColumnChart();
			break;
		case "line":
			drawLineChart();
			break;
		default:
			// code block
		}
	});

	gHidePageLoader();
}

function drawLineChart() {
	var data = google.visualization
			.arrayToDataTable([ [ 'Year', 'Sales', 'Expenses' ],
					[ '2013', 1000, 400 ], [ '2014', 1170, 460 ],
					[ '2015', 660, 1120 ], [ '2016', 1030, 540 ] ]);

	var options = {
		title : 'Performance',
		hAxis : {
			title : 'Year',
			titleTextStyle : {
				color : '#333'
			}
		},
		vAxis : {
			minValue : 0
		}
	};
	var chart = new google.visualization.LineChart(document
			.getElementById('chart_div'));
	chart.draw(data, options);
}
function drawColumnChart() {
	var data = google.visualization
			.arrayToDataTable([ [ 'Year', 'Sales', 'Expenses' ],
					[ '2013', 1000, 400 ], [ '2014', 1170, 460 ],
					[ '2015', 660, 1120 ], [ '2016', 1030, 540 ] ]);

	var options = {
		title : 'Performance',
		hAxis : {
			title : 'Year',
			titleTextStyle : {
				color : '#333'
			}
		},
		vAxis : {
			minValue : 0
		}
	};
	var chart = new google.visualization.ColumnChart(document
			.getElementById('chart_div'));
	chart.draw(data, options);
}
function drawAreaChart() {
	var data = google.visualization
			.arrayToDataTable([ [ 'Year', 'Sales', 'Expenses' ],
					[ '2013', 1000, 400 ], [ '2014', 1170, 460 ],
					[ '2015', 660, 1120 ], [ '2016', 1030, 540 ] ]);

	var options = {
		title : 'Performance',
		hAxis : {
			title : 'Year',
			titleTextStyle : {
				color : '#333'
			}
		},
		vAxis : {
			minValue : 0
		}
	};
	var chart = new google.visualization.AreaChart(document
			.getElementById('chart_div'));
	chart.draw(data, options);
}
function drawBarChart() {
	var data = google.visualization
			.arrayToDataTable([ [ 'Year', 'Sales', 'Expenses' ],
					[ '2013', 1000, 400 ], [ '2014', 1170, 460 ],
					[ '2015', 660, 1120 ], [ '2016', 1030, 540 ] ]);

	var options = {
		title : 'Performance',
		hAxis : {
			title : 'Year',
			titleTextStyle : {
				color : '#333'
			}
		},
		vAxis : {
			minValue : 0
		}
	};
	var chart = new google.visualization.BarChart(document
			.getElementById('chart_div'));
	chart.draw(data, options);
}
