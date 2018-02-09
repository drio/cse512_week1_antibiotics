import _ from 'lodash';
import d3_iconarray from 'd3-iconarray';

export const renderMatrix = (n_hosts) => {
  const layout = d3_iconarray.layout();
  const data = d3.range(0, n_hosts, 1);
  const grid = layout(data);

  const width = 800,
        height = 800,
        margin = {top:10, bottom:10, left:10, right:10 },
        maxInputDomain = layout.maxDimension(data.length),
        maxOutputRange = width-(margin.left+margin.right),
        squareSize = (maxOutputRange / maxInputDomain) - 4;

  const arrayScale = d3_iconarray.scale()
    .domain([ 0, maxInputDomain])
    .range([0, maxOutputRange]);

  d3.select('svg').remove();
  const svg = d3.select('#viz-container')
      .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox","0 0 " + width + " " + height)
        .classed("svg-content-responsive", true)
      .append('g')
        .attr('transform','translate('+margin.left+','+margin.top+')');

  svg.selectAll('g')
    .data(grid)
      .enter()
    .append('g').attr('transform', d => {
      return 'translate('+arrayScale(d.position.x)+','+arrayScale(d.position.y)+')'
    })
    .call(parent => {
      parent.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', squareSize)
        .attr('width', squareSize)
        .attr('fill', 'steelblue')
    })

  d3.select(self.frameElement).style("height", height + "px");
}
