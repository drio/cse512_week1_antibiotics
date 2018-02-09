import React, { Component } from 'react';
import ReactDOM from "react-dom";
import { render } from 'react-dom';
import '../css/style.css';
import araleImage from '../assets/arale-drio.jpg';
import _ from 'lodash';
import * as d3 from 'd3';
import {csv} from 'd3-fetch';

const badHeader = [ "Bacteria ", "Gram Staining ", "Neomycin", "Penicilin", "Streptomycin "];
const url       = '/assets/data.csv';

const doWork = (data) => {
  console.log(data);
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
