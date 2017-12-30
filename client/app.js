require('./style.scss');

const d3 = require('d3');
const debounce = require('./debounce.js');

$(() => {
  const r = 3;
  const daysOfWeek = [
    { index: 0, label: 'Monday' },
    { index: 1, label: 'Tuesday' },
    { index: 2, label: 'Wednesday' },
    { index: 3, label: 'Thursday' },
    { index: 4, label: 'Friday' },
    { index: 5, label: 'Saturday' },
    { index: 6, label: 'Sunday' },
  ];

  const margin = { top: 0 + r, right: 5 + r, bottom: 15 + r, left: 5 + r };
  const rowHeight = 80;
  const rowGap = 5;
  const height = (rowHeight + rowGap) * 7;


  d3.json('/stats', (error, data) => {
    if (error) throw error;
    console.log(data); // eslint-disable-line

    const svgRow = d3.select('main').append('div');
    const svg = svgRow.append('svg');
    svg.attr('height', height + margin.top + margin.bottom);

    const maxTime = d3.max(data, d => d.time);
    const x = d3.scaleLinear()
      .domain([0, maxTime]);

    const canvas = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    const axisElement = canvas.append('g')
      .attr('class', 'axis axis--x');
    const axisBottom = d3.axisBottom(x)
      .ticks(20, '.0s')
      .tickSize(height);

    const voronoi = d3.voronoi()
      .x(d => d.x)
      .y(d => d.y);

    const voronoiLayer = canvas.append('g.voronoi');

    draw();
    d3.select(window).on('resize', debounce(draw, 100));

    function draw() {
      const t = d3.transition()
        .duration(750)
        .ease(d3.easeCubic);

      // Update svg to fill available width
      const width = svgRow.node().getBoundingClientRect().width;
      svg.attr('width', width + margin.right + margin.left);

      // Update x scale
      x.rangeRound([0, width]);

      // Run force simulation with this scale
      const simulation = d3.forceSimulation(data)
        .force('x', d3.forceX(d => x(d.time)).strength(1))
        .force('y', d3.forceY(d => rowHeight / 2 + (d.day - 1) * (rowHeight + rowGap)))
        .force('collide', d3.forceCollide(4));
      for (let i = 0; i < 120; i += 1) simulation.tick();

      // Render row backdrops for weekdays 
      const rows = canvas.selectAll('g.day')
        .data(daysOfWeek, d => d.index);
      const newRows = rows.enter()
        .append('g')
        .attr('class', 'day')
        .attr('transform', d => `translate(0, ${(rowHeight + rowGap) * d.index})`);
      newRows
        .append('rect')
        .attr('width', width)
        .attr('height', rowHeight);
      // Add weekday labels
      newRows
        .append('text')
        .text(d => d.label)
        .attr('text-anchor', 'end')
        .attr('x', width - margin.left)
        .attr('y', 20);
      // Update row widths and label positions
      rows.selectAll('rect')
        .transition(t)
        .attr('width', width);
      rows.selectAll('text')
        .transition(t)
        .attr('x', width - margin.left);

      // Update voronoi 
      voronoi.extent([[0, 0], [width, height]]);

      const cells = voronoiLayer
        .selectAll('g.cells')
        .data(voronoi.polygons(data), d => d.data.id);

      const newCells = cells
        .enter()
        .append('g')
        .attr('class', 'cells');
      newCells.append('path')
        .attr('d', d => `M${d.join('L')}Z`);
      newCells.append('title')
        .text(d => `${d.data.id}\n${d.data.time}`);
      newCells.append('circle')
        .attr('r', 3)
        .attr('cx', d => d.data.x)
        .attr('cy', d => d.data.y);

      cells.select('path')
        .attr('d', d => `M${d.join('L')}Z`);

      cells.select('circle')
        .transition(t)
        .attr('cx', d => d.data.x)
        .attr('cy', d => d.data.y);

      // Render x axis
      axisElement
        .transition(t)
        .call(axisBottom);
    }
  });
});
