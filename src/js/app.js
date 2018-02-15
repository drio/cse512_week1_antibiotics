import React, { Component } from 'react';
import ReactDOM from "react-dom";
import { render } from 'react-dom';
import '../css/style.css';
import araleImage from '../assets/arale-drio.jpg';
import _ from 'lodash';
import * as d3 from 'd3';
import {csv} from 'd3-fetch';

window.d3 = d3;

const badHeader   = [ "Bacteria ", "Gram Staining ", "Neomycin", "Penicilin", "Streptomycin "];
const tableHeader = [ "Bacteria", "Penicilin", "Streptomycin", "Neomycin", "Gran Staining"];
const url         = '/assets/data.csv';

const buildTable = (data) => {
  const table = d3.select('#table').append('table');
  table
    .append('thead')
    .selectAll('th')
    .data(tableHeader)
      .enter()
      .append('th')
      .text((d) => d);

    table
      .append('tbody')
      .selectAll('tr')
      .data(data)
      .enter()
      .append('tr')
        .selectAll('td')
        .data((row) => _.values(row))
          .enter()
          .append('td')
          .text((d) => d);
}

const renderViz = (entry) => {
  const {Penicilin, Streptomycin, Neomycin} = entry;
  const antiAmounts = [Penicilin, Streptomycin, Neomycin];
  const min = d3.min(antiAmounts),
        max = d3.max(antiAmounts);
  const width = 800,
        height = 40;

  // scales
  const logScale = d3.scaleLog()
    .domain([min, max])
    .range([0, width]);

  const logAxis = d3.axisBottom(logScale).ticks(10, "1.1s");

  const svg = d3.select("#attempt1").append("svg")
    .attr("width", width)
    .attr("height", height)

  svg.append("g")
    .attr("transform", "translate(10,20)")
    .call(logAxis);

  svg.append("g")
    .attr("transform", "translate(10,20)")
  .selectAll("circle")
    .data(antiAmounts)
    .enter()
    .append("circle")
      .attr("cx", (d) => logScale(d))
      .attr("cy", (d) => 0)
      .attr("r", (d) => 4)
      .style("fill", "indianred");
}

const doWork = (data) => {
  buildTable(data);
  _.each(data, d => {
    console.log(d.Bacteria);
    renderViz(d);
  });
}

const loadData = () => {
  return csv(url).then((data) => {
    return _.map(data, (row) => {
      const newObj = {};
      _.each(_.keys(row), (key) => {
        const stringVal = key == badHeader[0] || key == badHeader[1];
        newObj[key.replace(/\s+/g,'')] = stringVal ? row[key] : +row[key];
      })
      return newObj;
    });
  });
};

window.onload = () => {
  loadData().then((data) => doWork(data));
};
