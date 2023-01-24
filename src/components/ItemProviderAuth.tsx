import React, {Dispatch, SetStateAction, useCallback, useContext, useEffect, useReducer, useState} from 'react';
import PropTypes from 'prop-types';
import { getLogger } from '../core';
import { ItemProps } from '../item/ItemProps';
import { createItem, getItems, newWebSocket, updateItem, getItem, removeItem } from './ItemApiAuth';
import { AuthContext } from '../auth';
import {Network} from "@capacitor/network";
import {Preferences} from "@capacitor/preferences";

const log = getLogger('ItemProvider');

type SaveItemFn = (item: ItemProps) => Promise<any>;

type GetItemFn = (id: number) => Promise<any>;

type DeleteItemFn = (id: number) => Promise<any>;

export interface ItemsState {
    items?: ItemProps[],
    fetching: boolean,
    fetchingError?: Error | null,
    saving: boolean,
    savingError?: Error | null,
    saveItem?: SaveItemFn,
    fetchItem?: GetItemFn,
    deleting: boolean,
    deletingError?: Error | null,
    deleteItem?: DeleteItemFn,
    setRerender?: Dispatch<SetStateAction<boolean>>,
    rerender?: boolean
}

interface ActionProps {
    type: string,
    payload?: any,
}

const initialState: ItemsState = {
    fetching: false,
    saving: false,
    deleting: false,
};

//TODO: delete if not necessary
let isConnected = true;
Network.addListener("networkStatusChange", status => {
    isConnected = status.connected;
    
})
const Storage = Preferences;

const FETCH_ITEMS_STARTED = 'FETCH_ITEMS_STARTED';
const FETCH_ITEMS_SUCCEEDED = 'FETCH_ITEMS_SUCCEEDED';
const FETCH_ITEMS_FAILED = 'FETCH_ITEMS_FAILED';

const FETCH_ITEM_STARTED = 'FETCH_ITEM_STARTED';
const FETCH_ITEM_SUCCEEDED = 'FETCH_ITEM_SUCCEEDED';
const FETCH_ITEM_FAILED = 'FETCH_ITEM_FAILED';

const SAVE_ITEM_STARTED = 'SAVE_ITEM_STARTED';
const SAVE_ITEM_SUCCEEDED = 'SAVE_ITEM_SUCCEEDED';
const SAVE_ITEM_FAILED = 'SAVE_ITEM_FAILED';

const DELETE_ITEM_STARTED = 'DELETE_ITEM_STARTED';
const DELETE_ITEM_SUCCEEDED = 'DELETE_ITEM_SUCCEEDED';
const DELETE_ITEM_FAILED = 'DELETE_ITEM_FAILED';

const reducer: (state: ItemsState, action: ActionProps) => ItemsState =
    (state, { type, payload }) => {
        switch (type) {
            case FETCH_ITEMS_STARTED:
                return { ...state, fetching: true, fetchingError: null };
            case FETCH_ITEMS_SUCCEEDED:
                return { ...state, items: payload.items, localItems: payload.items, fetching: false };
            case FETCH_ITEMS_FAILED:
                return { ...state, items: payload.items, fetchingError: payload.error, fetching: false };


            case FETCH_ITEM_STARTED:
                return { ...state, fetching: true, fetchingError: null };
            case FETCH_ITEM_SUCCEEDED:
                return { ...state, item: payload.item, fetching: false };
            case FETCH_ITEM_FAILED:
                return { ...state, fetchingError: payload.error, fetching: false };


            case SAVE_ITEM_STARTED:
                return { ...state, savingError: null, saving: true };
            case SAVE_ITEM_SUCCEEDED:
                const items = [...(state.items || [])];
                const item = payload.item;
                const index = items.findIndex(it => it.id === item.id);
                if (index === -1) {
                    items.splice(0, 0, item);
                } else {
                    items[index] = item;
                }
                return { ...state, items, saving: false };
            case SAVE_ITEM_FAILED:
                return { ...state, items: payload.items, savingError: payload.error, saving: false };


            case DELETE_ITEM_STARTED:
                return { ...state, deletingError: null, deleting: true };
            case DELETE_ITEM_SUCCEEDED:
                return { ...state, deleting: false };
            case DELETE_ITEM_FAILED:
                return { ...state, deletingError: payload.error, deleting: false };


            default:
                return state;
        }
    };

export const ItemContext = React.createContext<ItemsState>(initialState);

interface ItemProviderProps {
    children: PropTypes.ReactNodeLike,
}

export const ItemProvider: React.FC<ItemProviderProps> = ({ children }) => {
    const { token } = useContext(AuthContext);
    const [state, dispatch] = useReducer(reducer, initialState);
    const { items, fetching, fetchingError, saving, savingError, deleting, deletingError } = state;
    useEffect(wsEffect, [token]);
    const saveItem = useCallback<SaveItemFn>(saveItemCallback, [token]);
    const fetchItem = useCallback<GetItemFn>(getItemCallback, [token]);
    const deleteItem = useCallback<DeleteItemFn>(deleteItemCallback, [token]);
    const [rerender, setRerender] = useState(false);
    useEffect(getItemsEffect, [token, rerender]);
    const value = { items, fetching, fetchingError, saving, savingError, deleting, deletingError, saveItem, fetchItem, deleteItem, setRerender, rerender };

    log('returns');
    return (
        <ItemContext.Provider value={value}>
            {children}
        </ItemContext.Provider>
    );

    function getItemsEffect() {
        let canceled = false;
        fetchItems();
        return () => {
            canceled = true;
        }

        async function fetchItems() {
            try {
                // TODO: if not local storage
                if (!token?.trim()) {
                    return;
                }
                try {
                    log('fetchItems started');
                    dispatch({ type: FETCH_ITEMS_STARTED });
                    const items = await getItems(token);
                    await Storage.set({
                        key: "items",
                        value: JSON.stringify({items})
                    });
                    log('fetchItems succeeded');
                    if (!canceled) {
                        dispatch({ type: FETCH_ITEMS_SUCCEEDED, payload: { items } });
                    }
                } catch (error) {
                    log('fetchItems failed');
                    dispatch({ type: FETCH_ITEMS_FAILED, payload: { error } });
                }
                //TODO: local storage
                // if(isConnected) {
                //     try {
                //         log('fetchItems started');
                //         dispatch({ type: FETCH_ITEMS_STARTED });
                //
                //         const { keys } = await Storage.keys();
                //         for(let i = 0; i < keys.length; i ++)
                //             if(keys[i] !== 'token'){
                //                 const ret = await Storage.get({key: keys[i]});
                //                 const result = JSON.parse(ret.value || '{}');
                //                 result._id = keys[i].split("_")[1];
                //                 log(result);
                //                 await saveItem(result);
                //                 await Storage.remove({key: keys[i]});
                //             }
                //
                //         const items = await getItems(token);
                //         log('fetchItems succeeded');
                //         if (!canceled) {
                //             dispatch({ type: FETCH_ITEMS_SUCCEEDED, payload: { items } });
                //         }
                //     } catch (error) {
                //         log('fetchItems failed');
                //         dispatch({ type: FETCH_ITEMS_FAILED, payload: { error } });
                //     }
                // }
                // else {
                //     try {
                //         log('fetchItems started');
                //         dispatch({ type: FETCH_ITEMS_STARTED });
                //
                //         const { keys } = await Storage.keys();
                //         let allItems = []
                //         for(let i = 0; i < keys.length; i ++)
                //             if(keys[i] !== 'token'){
                //                 const ret = await Storage.get({key: keys[i]});
                //                 const result = JSON.parse(ret.value || '{}');
                //                 allItems.push(result)
                //             }
                //
                //         const items = allItems;
                //         log('fetchItems succeeded');
                //         if (!canceled) {
                //             dispatch({ type: FETCH_ITEMS_SUCCEEDED, payload: { items } });
                //         }
                //     } catch (error) {
                //         log('fetchItems failed');
                //         dispatch({ type: FETCH_ITEMS_FAILED, payload: { error } });
                //     }
                // }
            } catch (error) {
                log('fetchItems failed');
                const ret = await Storage.get({key: 'items'})
                const items = JSON.parse(ret.value || '[]').items;
                dispatch({ type: FETCH_ITEMS_FAILED, payload: { error, items } });
            }
        }
    }

    async function saveItemCallback(item: ItemProps) {
        // TODO: if not local storage
        try {
            log('saveItem started');
            dispatch({ type: SAVE_ITEM_STARTED });
            const savedItem = await (item.id ? updateItem(token, item) : createItem(token, item));
            log('saveItem succeeded');
            dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { item: savedItem } });
        } catch (error) {
            log('saveItem failed');

            //TODO: if we need to automatically try again - else - only what it is in the catch
            alert("Save Item failed. Trying again...")
            log('saveItem trying again');

            try {
                log('saveItem started');
                dispatch({ type: SAVE_ITEM_STARTED });
                const savedItem = await (item.id ? updateItem(token, item) : createItem(token, item));
                log('saveItem succeeded');
                dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { item: savedItem } });
            } catch (error) {
                log('saveItem failed');
                const ret = await Storage.get({key: 'items'})
                const items = JSON.parse(ret.value || '[]').items;
                const index = items.findIndex((it: ItemProps) => it.id === item.id);
                if (index === -1) {
                    items.splice(0, 0, item);
                } else {
                    items[index] = item;
                }
                await Storage.set({
                    key: "items",
                    value: JSON.stringify({items})
                });
                dispatch({ type: SAVE_ITEM_FAILED, payload: { error, items } });
            }
        }
        //TODO: local storage
        // if (isConnected) {
        //     try {
        //         log('saveItem started');
        //         dispatch({type: SAVE_ITEM_STARTED});
        //         const savedItem = await (item.id ? updateItem(token, item) : createItem(token, item));
        //         log('saveItem succeeded');
        //         dispatch({type: SAVE_ITEM_SUCCEEDED, payload: {item: savedItem}});
        //     } catch (error) {
        //         log('saveItem failed');
        //         dispatch({type: SAVE_ITEM_FAILED, payload: {error}});
        //     }
        // } else {
        //     try {
        //         log('saveItem started');
        //         dispatch({type: SAVE_ITEM_STARTED});
        //
        //         await Storage.set({
        //             key: "item_" + item.id,
        //             value: JSON.stringify({
        //                 stringValue: item.stringValue,
        //                 date: item.date,
        //                 booleanValue: item.booleanValue,
        //                 dropdownValue: item.dropdownValue,
        //                 arrayValue: item.arrayValue,
        //                 numberValue: item.numberValue,
        //             })
        //         });
        //
        //         alert("You are offline. This action will be done when the server is up");
        //
        //         log('saveItem succeeded');
        //         dispatch({type: SAVE_ITEM_SUCCEEDED, payload: {item: item}});
        //     } catch (error) {
        //         log('saveItem failed');
        //         dispatch({type: SAVE_ITEM_FAILED, payload: {error}});
        //     }
        // }
    }

    async function getItemCallback(id: number) {
        try {
            log('fetchItem started');
            dispatch({ type: FETCH_ITEM_STARTED });
            const item = await getItem(token, id);
            log('fetchItem succeeded');
            dispatch({ type: FETCH_ITEM_SUCCEEDED, payload: { item } });
            return item;
        } catch (error) {
            const ret = await Storage.get({key: 'items'})
            const items = JSON.parse(ret.value || '[]').items;
            const item = items.find((itm: ItemProps) => itm.id == id);
            dispatch({ type: FETCH_ITEM_FAILED, payload: { error, item } });
            return item;
        }
    }

    async function deleteItemCallback(id: number) {
        try {
            log('deleteItem started');
            dispatch({ type: DELETE_ITEM_STARTED });
            const item = await removeItem(token, id);
            log('deleteItem succeeded');
            dispatch({ type: DELETE_ITEM_SUCCEEDED, payload: { item } });
        } catch (error) {
            log('deleteItem failed');
            dispatch({ type: DELETE_ITEM_FAILED, payload: { error } });
        }
    }

function wsEffect() {
        let canceled = false;
        log('wsEffect - connecting');
        let closeWebSocket: () => void;
        if (token?.trim()) {
            closeWebSocket = newWebSocket(token, message => {
                if (canceled) {
                    return;
                }
                const { type, payload: item } = message;
                log(`ws message, item ${type}`);
                if (type === 'created' || type === 'updated') {
                    dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { item } });
                }
            });
        }
        return () => {
            log('wsEffect - disconnecting');
            canceled = true;
            closeWebSocket?.();
        }
    }
};
