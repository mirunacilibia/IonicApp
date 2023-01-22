import './ItemDetails.css'
import React, {useCallback, useEffect, useState} from "react";
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
import {infinite, trash} from "ionicons/icons";
import {moon} from "ionicons/icons";
import ItemEdit from "./ItemEdit";
import ItemEditSamePage from "./ItemEditSamePage";

interface ItemPropsExt {
    item: ItemProps;
    onEdit: (_id?: string) => void;
    // history:
}

const ItemDetails: React.FC<ItemPropsExt> = ({ item, onEdit }) => {
    const handleEdit = useCallback(() => onEdit(item.id), [item.id, onEdit]);

    const [showMore, setShowMore] = useState(false);

    //TODO: change/delete based on requirements
    useEffect(() => {
        const el = document.querySelector('.bold');
        if (el) {
            const animation = createAnimation()
                .addElement(el)
                .duration(1000)
                .direction('alternate')
                .iterations(1)
                .keyframes([
                    {fontWeight: 'bold'},
                    {fontWeight: 'normal'},
                ]);
            animation.play();
            }
    }, [item]);

    return (
        <IonCard className="details-card">
        <IonCardHeader>
            <IonCardTitle><h1 style={{ color: "black", fontSize: "40px"}} className={`${item.booleanValue ? "bold" : ""}`}>{item.stringValue}</h1></IonCardTitle>
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
            <IonRow>
                <IonButton style={{ marginLeft: "20px", marginBottom: "30px" }} color={"light"} onClick={() => {}}> <IonIcon icon={trash} /> </IonButton>
                <IonButton style={{ marginLeft: "20px", marginBottom: "30px" }} color={"light"} onClick={() => {
                    setShowMore(!showMore);
                }}> <IonIcon icon={moon} /> </IonButton>
            </IonRow>
                {showMore &&
                    <ItemEditSamePage item={item}/>
                }
    </IonCard>
);
};

export default ItemDetails;
