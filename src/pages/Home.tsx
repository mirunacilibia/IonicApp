import {
    IonBadge,
    IonButton, IonButtons,
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon, IonInfiniteScroll, IonInfiniteScrollContent,
    IonLoading,
    IonPage, IonSearchbar, IonSelect, IonSelectOption,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import './Home.css';
import {Dropdown, ItemProps} from "../item/ItemProps";
import ItemDetails from "../components/ItemDetails";
import {getLogger} from "../core";
import React, {useContext, useEffect, useState} from "react";
import {ItemContext} from "../components/ItemProvider";
import {RouteComponentProps} from "react-router";
import {add, logOut} from "ionicons/icons";
import {AuthContext} from "../auth";
import {Redirect} from "react-router-dom";
import { Network } from '@capacitor/network';
import ItemEdit from "../components/ItemEdit";

let isConnectedInitially = true;
Network.addListener("networkStatusChange", status => {
	isConnectedInitially = status.connected;
})

const log = getLogger('ItemList');

const Home: React.FC<RouteComponentProps> = ({ history }) => {

    const { items, fetching, fetchingError, fetchItem, rerender, setRerender } = useContext(ItemContext);

    //TODO: delete if not necessary
    const [isConnected, setIsConnected] = useState<boolean>(isConnectedInitially)
    Network.addListener("networkStatusChange", status => {
        setIsConnected(status.connected);
    })

    //TODO: Update/Delete based on requirements
    const pageSize = 3;
    const [filter, setFilter] = useState<Dropdown>();
    const [search, setSearch] = useState<string>();
    const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);
    const [position, setPosition] = useState<number>(pageSize);
    const [filteredItems, setFilteredItems] = useState<ItemProps[]>([]);

    const getOne = () => {
        fetchItem && fetchItem(3).then(response => {
            console.log(response)
            response && console.log(response);
        });
    };

    useEffect(() =>{
        if(items?.length || fetchingError){
            // sort function
            if(items && items.length > 0) {
                const sortedArray: ItemProps[] = items.sort((n1, n2) => {
                    if (n1.date > n2.date) {
                        return 1;
                    }
                    if (n1.date < n2.date) {
                        return -1;
                    }
                    return 0;
                });
                setFilteredItems(sortedArray.slice(0, position));
            }
        }
    }, [items]);

    useEffect(() =>{
        if(items && search === ""){
            log("delete search");
            setFilteredItems(items.slice(0, position));
        }
        if(items && search){
            log("search");
            setPosition(items.length);
            setTimeout(() => {
                setFilteredItems(items.filter((item: ItemProps) => item.stringValue.startsWith(search)));
            }, 2000);
        }
    }, [search]);

    useEffect(() =>{
        if(filter && items){
            log("filter");
            setPosition(items.length);
            setFilteredItems(items.filter((item: ItemProps) => Dropdown[item.dropdownValue] === filter.toString()));
        }
    }, [filter]);

    async function searchNext($event: CustomEvent<void>) {
        if(items && position < items.length) {
            log("pagination");
            setFilteredItems(items.slice(0, position + pageSize));
            setPosition(position + pageSize);
        } else {
            setDisableInfiniteScroll(true);
        }
        await ($event.target as HTMLIonInfiniteScrollElement).complete();
    }

    //TODO: Remove if not auth
    const { logout } = useContext(AuthContext);
    const handleLogout = () => {
        // logout?.();
        // return <Redirect to={{pathname: "/login"}} />;
        getOne();
    }

    log('render');

    const retryLoadItems = () => {
        setRerender && setRerender(!rerender);
    };


    return (
    <IonPage>
        {/*//TODO: Remove if not auth*/}
        <IonFab vertical="top" horizontal="end" style={{"height": "20px"}}>
            <IonFabButton onClick={() => handleLogout()} color="light">
                <IonIcon icon={logOut} />
            </IonFabButton>
        </IonFab>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle className="header">ItemsList</IonTitle>
            {/*TODO: delete if not necessary*/}
            <IonBadge className="status-badge" color = { isConnected ? "primary" : "danger" }>Network status: { isConnected ? "Online" : "Offline" }</IonBadge>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
          {/*TODO: Remove/Change based on requirements*/}
          <IonLoading isOpen={fetching} message="Fetching items" />
          <IonSearchbar
              value={search}
              debounce={1000}
              onIonChange={e => setSearch(e.detail.value!)}>
          </IonSearchbar>
          <IonSelect
              value={filter}
              placeholder="Select dropdown value"
              onIonChange={(e) => setFilter(e.detail.value || "")}
          >
              {Object.values(Dropdown).filter(x => typeof x === "string").map((item) =>
                  <IonSelectOption value={item}>
                      {item}
                  </IonSelectOption>
              )}
          </IonSelect>
          { filteredItems &&
              filteredItems.map((item: ItemProps) =>
                  <div>
                      <ItemDetails key={item.id} item={item} onEdit={(id) => history.push(`/item/${id}`)}/>
                  </div>

          )}
          {/*TODO: Delete if not pagination*/}
          <IonInfiniteScroll threshold="100px" disabled={disableInfiniteScroll}
                             onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
              <IonInfiniteScrollContent
                  loadingText="Loading more items...">
              </IonInfiniteScrollContent>
          </IonInfiniteScroll>
          {fetchingError && (
              <div>
                    {fetchingError.message || 'Failed to fetch items'}
                    <IonButton onClick={retryLoadItems}>Retry</IonButton>
              </div>
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
