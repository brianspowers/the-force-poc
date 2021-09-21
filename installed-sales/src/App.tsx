import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

const Wrapper = styled.div<{ bgCol?: string }>`
  display: grid;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-content: center;
  background-color: ${({ bgCol }) => bgCol ?? 'black'};
  color: white;
  font-size: 2.5rem;
`;

const StyledList = styled.ul`
  font-size: 1rem;
`;

const ColorLinks = () => {
  return (
    <StyledList>
      <li>
        <Link to="/installed-sales">Reset</Link>
      </li>
      <li>
        <Link to="/installed-sales/darkSalmon">Dark Salmon</Link>
      </li>
      <li>
        <Link to="/installed-sales/mediumSeaGreen">Medium Sea Green</Link>
      </li>
    </StyledList>
  );
};

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/installed-sales/darkSalmon">
          <Wrapper bgCol="darksalmon">
            Installed Sales <ColorLinks />
          </Wrapper>
        </Route>
        <Route path="/installed-sales/mediumSeaGreen">
          <Wrapper bgCol="mediumseagreen">
            Installed Sales <ColorLinks />
          </Wrapper>
        </Route>
        <Route>
          <Wrapper>
            Installed Sales <ColorLinks />
          </Wrapper>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
