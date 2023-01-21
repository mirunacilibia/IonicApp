import './ItemDetails.css'
import React, {useCallback, useEffect} from "react";
import {
    createAnimation, IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle, IonCol,
    IonDatetime, IonGrid, IonIcon, IonImg,
    IonItem,
    IonLabel, IonRow
} from "@ionic/react";
import { Dropdown, ItemProps } from "../item/ItemProps";
import {trash} from "ionicons/icons";

interface ItemPropsExt {
    item: ItemProps;
    onEdit: (_id?: string) => void;
}

const ItemDetails: React.FC<ItemPropsExt> = ({ item, onEdit }) => {
    const handleEdit = useCallback(() => onEdit(item.id), [item.id, onEdit]);

    return (
        <IonCard className="details-card">
        <IonCardHeader>
            <IonCardTitle><h1 className="text">{item.stringValue}</h1></IonCardTitle>
        </IonCardHeader>
    <IonCardContent onClick={handleEdit} id={item.id}>
    <IonGrid>
        <IonRow>
            <IonCol className="details-container">
                <h4>Date: {item.date.toString().slice(0, 10)}</h4>
                <h4>Boolean: {item.booleanValue ? "yes" : "no"}</h4>
                <h4>Dropdown: {Dropdown[item.dropdownValue]}</h4>
                <h4>Number: {item.numberValue}</h4>
                <h4>Array</h4>
                <div className="array-container">
                    {item.arrayValue.map((value: string) =>
                        <h4 key={value}>{value}</h4>
                    )}
                </div>
            </IonCol>
    </IonRow>
    </IonGrid>
    </IonCardContent>
    <IonButton style={{ marginLeft: "20px", marginBottom: "30px" }} color={"light"} onClick={() => {}}> <IonIcon icon={trash} /> </IonButton>
    </IonCard>
);
};

export default ItemDetails;
