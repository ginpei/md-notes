import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { acSetCurrentUser, connectCurrentUser } from './models/CurrentUser';
import { createAppStore } from './models/store';
import AboutPage from './screens/AboutPage';
import HomePage from './screens/HomePage';
import InitializingPage from './screens/InitializingPage';
import LoginPage from './screens/LoginPage';
import LogoutPage from './screens/LogoutPage';
import NoteListPage from './screens/NoteListPage';
import NoteViewPage from './screens/NoteViewPage';
import NoteWritePage from './screens/NoteWritePage';
import NotFoundPage from './screens/NotFoundPage';

const App: React.FC = () => {
  const [initialized, setInitialized] = useState(false);
  const [user, setUser] = useState<firebase.User | null>(null);
  const [store] = useState(createAppStore());

  useEffect(() => {
    return connectCurrentUser(
      (currentUser) => {
        setUser(currentUser);
        store.dispatch(acSetCurrentUser(currentUser));
        setInitialized(true);
      },
    );
  }, []);

  if (!initialized) {
    return (
      <InitializingPage/>
    );
  }

  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route path="/" exact component={HomePage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/logout" component={LogoutPage} />
            {user && <Route path="/notes/:id/write" component={NoteWritePage} />}
            {user && <Route path="/notes/:id" component={NoteViewPage} />}
            {user && <Route path="/notes" component={NoteListPage} />}
            <Route component={NotFoundPage}/>
          </Switch>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;

