import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import TableauPatrimoine from './tableauPatrimoine';

const Header = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center text-light text-center my-4 h-50 w-50 rounded-pill">
      <h1 className='fs-2'>John's Patrimoine</h1>
    </Container>
  );
};

function App() {
  return (
    <div>
      <div className='header_container'>
        <Header />
      </div>
      <div>
        <TableauPatrimoine />
      </div>
    </div>
  );
}

export default App;
