import axios from 'axios';
import { authConfig, baseUrl, getLogger, withLogs } from '../core';
import { ItemProps } from '../item/ItemProps';

const itemUrl = `http://${baseUrl}/api/item`;

export const getItems: (token: string) => Promise<ItemProps[]> = token => {
    return withLogs(axios.get(itemUrl, authConfig(token)), 'getItems');
}

//TODO: maybe add item here if we want it to load?
export const getItem: (token: string, id: number) => Promise<ItemProps> = (token, id) => {
    return withLogs(axios.get(`${itemUrl}/${id}`, authConfig(token)), 'getItem');
}

export const removeItem: (token: string, id: number) => Promise<ItemProps> = (token, id) => {
    return withLogs(axios.delete(`${itemUrl}/${id}`, authConfig(token)), 'removeItem');
}

export const createItem: (token: string, item: ItemProps) => Promise<ItemProps[]> = (token, item) => {
    return withLogs(axios.post(itemUrl, item, authConfig(token)), 'createItem');
}

export const updateItem: (token: string, item: ItemProps) => Promise<ItemProps[]> = (token, item) => {
    return withLogs(axios.put(`${itemUrl}/${item.id}`, item, authConfig(token)), 'updateItem');
}

interface MessageData {
    type: string;
    payload: ItemProps;
}

const log = getLogger('ws');

export const newWebSocket = (token: string, onMessage: (data: MessageData) => void) => {
    const ws = new WebSocket(`ws://${baseUrl}`);
    ws.onopen = () => {
        log('web socket onopen');
        ws.send(JSON.stringify({ type: 'authorization', payload: { token } }));
    };
    ws.onclose = () => {
        log('web socket onclose');
    };
    ws.onerror = error => {
        log('web socket onerror', error);
    };
    ws.onmessage = messageEvent => {
        log('web socket onmessage');
        onMessage(JSON.parse(messageEvent.data));
    };
    return () => {
        ws.close();
    }
}
