import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import {ItemProvider} from "./components/ItemProvider";
import ItemEdit from "./components/ItemEdit";
import {AuthProvider, Login, PrivateRoute} from "./auth";
import React from "react";

setupIonicReact();

//TODO: Select which app type you need: with or without auth
const App: React.FC = () => (
  <IonApp>
    <ItemProvider>
    <IonReactRouter>
      <IonRouterOutlet>
          <Route exact path="/items" component={Home}/>
          <Route exact path="/item/:id" component={ItemEdit}/>
          <Route exact path="/item" component={ItemEdit}/>
        <Route exact path="/">
          <Redirect to="/items" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
      </ItemProvider>
  </IonApp>
);

//TODO: Select which app type you need: with or without auth
// const App: React.FC = () => (
//     <IonApp>
//         <IonReactRouter>
//             <IonRouterOutlet>
//                 <AuthProvider>
//                     <Route path="/login" component={Login} exact={true} />
//                     <ItemProvider>
//                         {/*@ts-ignore*/}
//                         <PrivateRoute path="/items" component={Home} exact={true} />
//                         {/* @ts-ignore*/}
//                         <PrivateRoute path="/item" component={ItemEdit} exact={true} />
//                         {/*@ts-ignore*/}
//                         <PrivateRoute path="/item/:id" component={ItemEdit} exact={true} />
//                     </ItemProvider>
//                     <Route exact path="/" render={() => <Redirect to="/items" />} />
//                 </AuthProvider>
//             </IonRouterOutlet>
//         </IonReactRouter>
//     </IonApp>
// );

export default App;
