
import React from 'react';
import BlankLayout from 'components/layouts/BlankLayout';
import { Route, Routes } from 'react-router-dom';
import Campaign from 'pages/campaign/Campaign';

function App() {


  return (

    <Routes>  
      <Route path="/" element={<BlankLayout />}>
          <Route
            index
            element={
              <Campaign />
            }
          />

        </Route>  
    </Routes>
    
  )
}

export default App;
