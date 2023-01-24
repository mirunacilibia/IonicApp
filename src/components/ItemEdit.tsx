import React, { useCallback, useContext, useEffect, useState } from "react";
import {
    IonButton,
    IonButtons,
    IonCheckbox,
    IonContent,
    IonDatetime,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonLoading,
    IonPage,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
import { getLogger } from "../core";
import { ItemContext } from "./ItemProvider";
import { RouteComponentProps } from "react-router";
import { Dropdown, ItemProps } from "../item/ItemProps";

const log = getLogger("ItemAddEdit");

interface ItemEditProps
    extends RouteComponentProps<{
        id?: string;
    }> {}

const ItemAddEdit: React.FC<ItemEditProps> = ({ history, match }) => {
    const { items, saving, savingError, saveItem, fetching, fetchingError, fetchItem } = useContext(ItemContext);
    const [stringValue, setStringValue] = useState("");
    const [date, setDate] = useState(new Date());
    const [booleanValue, setBooleanValue] = useState(true);
    const [dropdownValue, setDropdownValue] = useState<Dropdown>(Dropdown.Option3);
    const [numberValue, setNumberValue] = useState<number>(0);
    const [arrayValue, setArrayValue] = useState<Array<string>>(new Array<string>(""));
    const [item, setItem] = useState<ItemProps>();
    const [retry, setRetry] = useState<boolean>(false);

    //TODO: load item details if edit
    useEffect(() => {
        log("useEffect");
        const routeId = parseInt(match.params.id || '-1');
        const item = items?.find((it) => it.id === routeId);
        setItem(item);
        if (item) {
            setStringValue(item.stringValue);
            setDate(item.date);
            setDropdownValue(item.dropdownValue);
            setNumberValue(item.numberValue);
            setBooleanValue(item.booleanValue);
            setArrayValue(item.arrayValue);
        }
    }, [match.params.id, items]);

    //TODO: fetch one item
    // useEffect(() => {
    //     fetchItem && fetchItem(3).then(response => {
    //         console.log(response)
    //         response && console.log(response);
    //     });
    // }, [fetchItem, item]);

    // function for edit
    const handleSave = useCallback(() => {
        const editedItem = item
            ? { ...item, stringValue, date, booleanValue, dropdownValue, numberValue, arrayValue }
            : { stringValue, date, booleanValue, dropdownValue, numberValue, arrayValue };
        saveItem && saveItem(editedItem).then(r => history.goBack());
    }, [
        item,
        saveItem,
        stringValue,
        date,
        booleanValue,
        dropdownValue,
        numberValue,
        arrayValue,
        history,
    ]);

    log("render");

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Add a new Item</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handleSave}>Save</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonItem>
                    <IonLabel>StringValue:</IonLabel>
                    <IonInput
                        value={stringValue}
                        onIonChange={(e) => setStringValue(e.detail.value || "")}
                    />
                </IonItem>
                <IonItem>
                    <IonLabel>Date:</IonLabel>
                    <IonDatetime
                        value={date.toString()}
                        onIonChange={(e) =>
                            setDate(new Date(e.detail.value?.toString() || new Date()))
                        }
                    />
                </IonItem>
                <IonItem>
                    <IonCheckbox
                        checked={booleanValue}
                        onIonChange={(e) => setBooleanValue(e.detail.checked)}
                    />
                    <IonLabel>Boolean</IonLabel>
                </IonItem>
                <IonList>
                    <IonItem>
                        <IonSelect
                            placeholder="Select dropdownValue"
                            onIonChange={(e) => setDropdownValue(e.detail.value || "")}
                        >
                            <IonSelectOption value={Dropdown.Option1}>Option1</IonSelectOption>
                            <IonSelectOption value={Dropdown.Option2}>Option2</IonSelectOption>
                            <IonSelectOption value={Dropdown.Option3}>Option3</IonSelectOption>
                            <IonSelectOption value={Dropdown.Option4}>Option4</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                </IonList>
                <IonItem>
                    <IonLabel>Number:</IonLabel>
                    <IonInput
                        type="number"
                        value={numberValue}
                        onIonChange={(e) => setNumberValue(parseInt(e.detail.value || "0"))}
                    />
                </IonItem>
                <IonLoading isOpen={saving} />
                {savingError && (
                    <div>{savingError.message || "Failed to save item"}</div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default ItemAddEdit;
