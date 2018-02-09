import React from "react";
import styled from "styled-components";

const margin = "5px";
//const size = "10px";

const Group = styled.div`
  border: 0px solid lightgrey;
  display: grid;
  grid: min-content 1fr / 100%;
  grid-gap: 5px;
  flex: 1 0 auto;
  margin: ${props => (props.bottom ? 0 : margin)};
  min-width: 110px;
  padding: ${margin};

  margin: 0;
`;

const GroupTitle = styled.div`
  margin-left: ${margin};
  margin: 0;
`;

const GroupContent = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Hosts = styled.div`
  display: grid;
  grid: repeat(auto-fill, ${props => props.size}px) / repeat(auto-fill, ${props => props.size}px);
  grid-gap: ${margin};
  height: auto;
  width: 100%;
`;

const SingleHost = styled.div`
  align-items: center;
  background-color: steelblue;
  display: grid;
  justify-content: center;
  min-height: ${props => props.size}px;
`;

class HostsViz extends React.Component {
  computeHostSize = (data) => {
    return `${14}px`;
  }

  render() {
    const props = this.props;
    const size = this.props.size;
    return (
      <Group bottom={props.data.hosts}>
        <GroupTitle>{props.data.name}</GroupTitle>
        <GroupContent>
          {props.data.children ? (
            props.data.children.map(c => (
              <HostsViz key={c.name} data={c} parent={props.data} size={size}/>
            ))
          ) : (
            <Hosts size={size}>
              {props.data.hosts.map((h, idx) => <SingleHost key={idx} size={size} />)}
            </Hosts>
          )}
        </GroupContent>
      </Group>
    );
  }
}

export default HostsViz;
