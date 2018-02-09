import _ from 'lodash';
import Chance from 'chance';

/*
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

*/

const chance = new Chance();

const generateHostName = () => chance.word({length: 7});

const key_values = {
  region: ['europe-east', 'us-east', 'asia-north'],
  'instance-type': ['tiny-a', 'tiny-b', 'tiny-c', 'small', 'regular', 'big'],
  az: ['europe', 'us', 'china'],
  hostname: generateHostName,
  environment: ['production', 'staging'],
}

const valuesForTag = (tagName) => {
  // TODO: DRY
  return (tagName == 'hostname' || !key_values[tagName]) ? [] : key_values[tagName];
};

const listTags = () => {
  return _.filter(_.keys(key_values), tagName => tagName != 'hostname');
};

const findHostsWith = (tagNames, tagValues, hosts) => {
  const tagInstance = _.zipObject(tagNames, tagValues);
  return _.filter(hosts, (h) => {
    return _.isEqual(_.pick(h, tagNames), tagInstance);
  });
};

export const buildTree = (opts) => {
  const {node, tags=[], tagsPath=[], valuesPath=[], hosts=[]} = opts;
  if (tags.length > 0) {
    let tagName = tags[0];
    valuesForTag(tagName).forEach(value => {
      node.children.push({name: value, children: []});
      buildTree({
        node      : _.last(node.children),
        tags      : tags.slice(1),
        tagsPath  : _.concat(tagsPath, tagName),
        valuesPath: _.concat(valuesPath, value),
        hosts     : hosts
      });
    });
  }
  else {
    delete node.children;
    node.hosts = _.times(findHostsWith(tagsPath, valuesPath, hosts).length);
  }
}

export const createHosts = (n_hosts) => {
  return _.times(n_hosts).map( i => {
    const host = {};
    listTags().forEach((key) => {
      let values = key_values[key];
      let rand_val = typeof values == "function" ?
        values() :
        chance.pickone(values);
      host[key] = rand_val;
    });
    return host;
  })
}
