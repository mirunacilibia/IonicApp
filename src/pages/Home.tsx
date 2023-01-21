import {
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon,
    IonLoading,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import './Home.css';
import {Dropdown, ItemProps} from "../item/ItemProps";
import ItemDetails from "../components/ItemDetails";
import {getLogger} from "../core";
import {useContext} from "react";
import {ItemContext} from "../components/ItemProvider";
import {RouteComponentProps} from "react-router";
import {add} from "ionicons/icons";

const log = getLogger('ItemList');

const Home: React.FC<RouteComponentProps> = ({ history }) => {

    const { items, fetching, fetchingError } = useContext(ItemContext);

    log('render');

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar >
          <IonTitle className="header">ItemsList</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
          <IonLoading isOpen={fetching} message="Fetching items" />
          { items &&
              items.map((item: ItemProps) =>
              <ItemDetails key={item.id} item={item} onEdit={(id) => history.push(`/item/${id}`)} />
          )}
          {fetchingError && (
              <div>{fetchingError.message || 'Failed to fetch items'}</div>
          )}
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
              <IonFabButton onClick={() => history.push("/item")} color="light">
                  <IonIcon icon={add} />
              </IonFabButton>
          </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Home;
