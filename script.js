const data = [
	{ group: 'John', q1: 100000, q2: 94000, q3: 120000, q4: 110000 },
	{ group: 'Jane', q1: 87000, q2: 110000, q3: 140000, q4: 200000 },
	{ group: 'Thomas', q1: 43000, q2: 50000, q3: 90000, q4: 100000 },
];

// Define scales
const x = d3
	.scaleBand()
	.domain(data.map((d) => d.group))
	.range([50, 450])
	.padding(0.1);

const y = d3
	.scaleLinear()
	.domain([0, d3.max(data, (d) => Math.max(d.q1, d.q2, d.q3, d.q4))])
	.nice()
	.range([250, 50]);

// Add axes
const addAxes = (svg) => {
	svg.append('g').attr('transform', 'translate(0, 250)').call(d3.axisBottom(x));

	svg.append('g').attr('transform', 'translate(50, 0)').call(d3.axisLeft(y));
};

// Line Graph
const lineGraph = () => {
	const svg = d3.select('#charts').append('svg').attr('width', 500).attr('height', 300);

	addAxes(svg);

	const quarters = ['q1', 'q2', 'q3', 'q4'];

	quarters.forEach((quarter, i) => {
		const line = d3
			.line()
			.x((d) => x(d.group) + x.bandwidth() / 2)
			.y((d) => y(d[quarter]));

		svg.append('path').datum(data).attr('class', 'line').attr('d', line).style('stroke', d3.schemeCategory10[i]);
	});
};

lineGraph();

// Bar Graph (Stacked)
const barGraph = () => {
	const svg = d3.select('#charts').append('svg').attr('width', 500).attr('height', 300);

	addAxes(svg);

	const stack = d3.stack().keys(['q1', 'q2', 'q3', 'q4']);
	const stackedData = stack(data);

	svg
		.selectAll('.layer')
		.data(stackedData)
		.enter()
		.append('g')
		.attr('fill', (d, i) => d3.schemeCategory10[i])
		.selectAll('rect')
		.data((d) => d)
		.enter()
		.append('rect')
		.attr('x', (d) => x(d.data.group))
		.attr('y', (d) => y(d[1]))
		.attr('height', (d) => y(d[0]) - y(d[1]))
		.attr('width', x.bandwidth());
};

barGraph();

// Area Chart (Stacked)
const stackedAreaChart = () => {
	const svg = d3.select('#charts').append('svg').attr('width', 500).attr('height', 300);

	addAxes(svg);

	const stack = d3.stack().keys(['q1', 'q2', 'q3', 'q4']);
	const stackedData = stack(data);

	const area = d3
		.area()
		.x((d) => x(d.data.group) + x.bandwidth() / 2)
		.y0((d) => y(d[0]))
		.y1((d) => y(d[1]));

	svg
		.selectAll('.layer')
		.data(stackedData)
		.enter()
		.append('path')
		.attr('class', 'area')
		.attr('d', area)
		.attr('fill', (d, i) => d3.schemeCategory10[i]);
};

stackedAreaChart();

// Scatter Plot
const scatterPlot = () => {
	const svg = d3.select('#charts').append('svg').attr('width', 500).attr('height', 300);

	addAxes(svg);

	const quarters = ['q1', 'q2', 'q3', 'q4'];
	quarters.forEach((quarter, i) => {
		svg
			.selectAll('circle' + quarter)
			.data(data)
			.enter()
			.append('circle')
			.attr('cx', (d) => x(d.group) + x.bandwidth() / 2 + i * 10) // Offset each quarter slightly
			.attr('cy', (d) => y(d[quarter]))
			.attr('r', 5)
			.attr('fill', d3.schemeCategory10[i]);
	});
};

scatterPlot();

// Pie Chart
const pieChart = () => {
	const pie = d3.pie().value((d) => d.q1); // Adjust here for other quarters if needed

	const arc = d3.arc().innerRadius(0).outerRadius(100);

	const svg = d3
		.select('#charts')
		.append('svg')
		.attr('width', 300)
		.attr('height', 300)
		.append('g')
		.attr('transform', 'translate(150,150)');

	svg
		.selectAll('path')
		.data(pie(data))
		.enter()
		.append('path')
		.attr('d', arc)
		.attr('fill', (d, i) => d3.schemeCategory10[i]);
};

pieChart();

// Donut Chart
const donutChart = () => {
	const pie = d3.pie().value((d) => d.q1); // Adjust here for other quarters if needed

	const arc = d3.arc().innerRadius(50).outerRadius(100);

	const svg = d3
		.select('#charts')
		.append('svg')
		.attr('width', 300)
		.attr('height', 300)
		.append('g')
		.attr('transform', 'translate(150,150)');

	svg
		.selectAll('path')
		.data(pie(data))
		.enter()
		.append('path')
		.attr('d', arc)
		.attr('fill', (d, i) => d3.schemeCategory10[i]);
};

donutChart();
