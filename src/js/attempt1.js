import React, { Component } from 'react';
import { render } from 'react-dom';
import '../css/style.css';
import araleImage from '../assets/arale-drio.jpg';
import _ from 'lodash';
import * as d3 from 'd3';

const nested_data = {
  name: "us-east-1",
  children: [
    {
      name: "c3.medium",
      hosts: _.times(22)
    },
    {
      name: "t2.large",
      hosts: _.times(12)
    },
    {
      name: "t2.tiny",
      hosts: _.times(10)
    },
  ]
};

const nested_data2 = {
  name: "regions",
  children: [
    { name: "us",
      children: [
        { name: "c3.medium", hosts: [ 1 , 2 ,3 ] },
        { name: "t2.large" , hosts: [ 1, 20 ] },
      ]
    },
    { name: "eu",
      children: [
        { name: "c3.medium", hosts: [ 1 , 5 , 6 ] },
        { name: "t2.large" , hosts: [ 1, 26 ] },
      ]
    },
  ]
};


const genSingleGrpHosts = (n_hosts) => {
  return _.times(n_hosts).map(i => {
    return {
      name: "host_" + i,
      fill: "steelblue"
    };
  })
};

const prep = (input_data) => {
  return _.map(input_data, (n_hosts, idx) => {
    return {
      name: "grp_" + idx,
      hosts: _.times(n_hosts).map(idx => idx)
    }
  })
}

const clear = () => {
  d3.selectAll('div.group-title').remove();
  d3.selectAll('div.group').remove();
  d3.selectAll('div.host').remove();
}

const renderHosts = (containerSel, hostData) => {
  containerSel
    .selectAll('div.host')
    .data(hostData)
    .enter()
      .append('div')
      .classed('host', true);
}

const createNewGroup = (parentContName, newGroupName) => {
  const parentSel = d3.select(`#${parentContName}`);

  parentSel
    .append('div')
      .attr('class', 'group-title')
      .text(newGroupName);

  return parentSel
    .append('div')
      .attr('id', newGroupName)
      .attr('class', 'group');
}

const renderNestedMode = (root_container, data) => {
    const root = d3.hierarchy(data);
    root.each((node) => {
      const parentGrpName = node.parent ? node.parent.data.name : root_container;
      const isLeaf        = node.children ? false : true;
      const hosts         = node.data.hosts ? node.data.hosts : null;
      const currGrpName   = node.data.name;

      const newGrpSel = createNewGroup(parentGrpName, currGrpName);
      if (isLeaf) renderHosts(newGrpSel, hosts);
    });
}

const renderIt = (data) => {
  clear();
  const groupingIsOff = data instanceof Array;
  const vizContainerName = 'viz-container';
  if (groupingIsOff) {
    renderHosts(d3.select(`#${vizContainerName}`), data);
  } else {
    renderNestedMode(vizContainerName, data);
  };
}

const updateInput = (input_value) => {
  if (input_value.replace(/\s+/g, '')) {
    const s_input = input_value.split(":");
    const host_groups = _.map(s_input, (i) => (i > 2000) ? 2000 : +i);
    const data = prep(host_groups);
    renderIt(data);
  } else {
    clear();
  }
}

const exposeFunc = () => {
  window.d3 = d3;
  window.updateInput = updateInput;
}

/*
window.onload = () => {
  const start_n_hosts = 5;
  exposeFunc();
  renderIt(nested_data2);
  //renderIt(_.times(8));
};
*/
