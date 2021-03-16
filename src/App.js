import React from 'react';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import Navigation from './features/navigation/Navigation';
import InstanceTable from './features/instance/InstanceTable';

import './App.css';

const fabStyle = {
  right: 20,
  bottom: 20,
  position: 'fixed'
};

function App() {
  return (
    <div className="App">
      <Navigation>
        <InstanceTable />
        <Fab color="primary" aria-label="add" style={fabStyle}>
          <AddIcon />
        </Fab>
      </Navigation>
    </div>
  );
}

export default App;