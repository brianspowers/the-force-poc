import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, NavLink } from 'react-router-dom';

const StyledList = styled.ul`
  box-sizing: border-box;
  list-style: none;
  margin: 0;
  padding: 10px 40px;
  display: flex;
  background-color: steelblue;

  li {
    display: block;
    margin-left: 40px;
  }
`;

const StyledNavLink = styled(NavLink)`
  color: white;
  display: block;
  text-decoration: none;
  padding: 5px 5px;
  border: 2px solid transparent;
  border-radius: 6px;

  &.active {
    border: 2px solid white;
    border-radius: 6px;
  }
`;

function App() {
  return (
    <Router>
      <div className="App">
        <StyledList>
          <li>
            <StyledNavLink to="/installed-sales">Installed Sales</StyledNavLink>
          </li>
          <li>
            <StyledNavLink to="/sales-order-entry">
              Sales Order Entry
            </StyledNavLink>
          </li>
          <li>
            <StyledNavLink to="/system-admin">System Admin</StyledNavLink>
          </li>
        </StyledList>
      </div>
    </Router>
  );
}

export default App;
