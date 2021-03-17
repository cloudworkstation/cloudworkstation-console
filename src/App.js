import React from 'react';

import Navigation from './features/navigation/Navigation';
import InstanceTable from './features/instance/InstanceTable';
import AddInstanceButton from './features/instance/CreateInstance';
import CreateNewInstance from './features/instance/NewInstanceForm';

import './App.css';

function App() {
  return (
    <div className="App">
      <Navigation>
        <InstanceTable />
        <AddInstanceButton />
        <CreateNewInstance />
      </Navigation>
    </div>
  );
}

export default App;