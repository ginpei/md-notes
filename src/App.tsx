import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import firebase from './middleware/firebase';
import { createAppStore } from './models/store';
import AboutPage from './screens/AboutPage';
import HomePage from './screens/HomePage';
import NoteListPage from './screens/NoteListPage';
import NoteWritePage from './screens/NoteWritePage';
import NotFoundPage from './screens/NotFoundPage';

const App: React.FC = () => {
  const [initialized, setInitialized] = useState(false);
  const [user, setUser] = useState<firebase.User | null>(null);
  const [store] = useState(createAppStore());

  useEffect(() => {
    const auth = firebase.auth();
    return auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setInitialized(true);
    });
  }, []);

  if (!initialized) {
    return (
      <div>
        🥚
        🐣
        🐥
      </div>
    );
  }

  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route path="/" exact component={HomePage} />
            <Route path="/about" component={AboutPage} />
            {user && <Route path="/notes" exact component={NoteListPage} />}
            {user && <Route path="/notes/:id/write" component={NoteWritePage} />}
            <Route component={NotFoundPage}/>
          </Switch>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;

