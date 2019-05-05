import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import AboutPage from './screens/AboutPage';
import HomePage from './screens/HomePage';
import NoteWritePage from './screens/NoteWritePage';
import NotFoundPage from './screens/NotFoundPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/notes/:id/write" component={NoteWritePage} />
          <Route component={NotFoundPage}/>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;

