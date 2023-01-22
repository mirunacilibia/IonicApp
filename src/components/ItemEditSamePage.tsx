import './ItemEdit.css';
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

interface ItemEditProps {
    item: ItemProps;
}

const ItemAddEdit: React.FC<ItemEditProps> = ({ item }) => {
    const { items, saving, savingError, saveItem } = useContext(ItemContext);
    const [stringValue, setStringValue] = useState(item.stringValue);
    const [date, setDate] = useState(item.date);
    const [booleanValue, setBooleanValue] = useState(item.booleanValue);
    const [dropdownValue, setDropdownValue] = useState<Dropdown>(item.dropdownValue);
    const [numberValue, setNumberValue] = useState<number>(item.numberValue);
    const [arrayValue, setArrayValue] = useState<Array<string>>(item.arrayValue);
    // const [item, setItem] = useState<ItemProps>();

    // function for saving a new item - only for add
    // const handleSave = useCallback(() => {
    // 	const newItem = { stringValue, date, booleanValue, dropdownValue, numberValue };
    // 	// saveItem && saveItem(newItem).then(() => history.goBack());
    // }, [
    // 	item,
    // 	saveItem,
    // 	stringValue,
    // 	date,
    // 	booleanValue,
    // 	dropdownValue,
    // 	numberValue,
    // 	history,
    // ]);


    // function for edit
    const handleSave = useCallback(() => {
        const editedItem = item
            ? { ...item, stringValue, date, booleanValue, dropdownValue, numberValue, arrayValue }
            : { stringValue, date, booleanValue, dropdownValue, numberValue, arrayValue };
        saveItem && saveItem(editedItem);
    }, [
        item,
        saveItem,
        stringValue,
        date,
        booleanValue,
        dropdownValue,
        numberValue,
        arrayValue
    ]);

    log("render");

    return (
        <div className="edit-container">
            <IonItem>
            <IonButton size={"default"} color={"light"} onClick={handleSave}>Save</IonButton>
            </IonItem>
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
        </div>
    );
};

export default ItemAddEdit;
