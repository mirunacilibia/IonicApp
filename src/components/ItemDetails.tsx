import './ItemDetails.css'
import React, {useCallback, useContext, useEffect, useState} from "react";
import {
    createAnimation, IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle, IonCol,
    IonDatetime, IonGrid, IonIcon, IonImg, IonInput,
    IonItem,
    IonLabel, IonLoading, IonRow
} from "@ionic/react";
import { Dropdown, ItemProps } from "../item/ItemProps";
import {infinite, trash} from "ionicons/icons";
import {moon} from "ionicons/icons";
import ItemEdit from "./ItemEdit";
import ItemEditSamePage from "./ItemEditSamePage";
import {ItemContext} from "./ItemProvider";

interface ItemPropsExt {
    item: ItemProps;
    onEdit: (_id?: number) => void;
    // history:
}

const ItemDetails: React.FC<ItemPropsExt> = ({ item, onEdit }) => {
    const handleEdit = useCallback(() => onEdit(item.id), [item.id, onEdit]);
    const { deleting, deletingError, deleteItem } = useContext(ItemContext);

    const [showMore, setShowMore] = useState(false);
    const [turnIntoInput, setTurnIntoInput] = useState(false);

    const [numberValue, setNumberValue] = useState<number>(0);

    //TODO: delete item
    const handleDelete = () => {
        console.log("delete Item");
        if (deleteItem) {
            console.log(item);
            let id = item.id;
            if(id === undefined)
                id = -1;
            deleteItem(id).then(r => console.log("deleted element ", r));
        }
    }

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
    {/*TODO: if we have a second edit page*/}
    {/*<IonCardContent onClick={handleEdit} id={item.id?.toString() || ""}>*/}
    <IonCardContent id={item.id?.toString() || ""}>
    <IonGrid>
        <IonRow>
            <IonCol className="details-container">
                <h4>Date: {item.date.toString().slice(0, 10)}</h4>
                <h4>Boolean: {item.booleanValue ? "yes" : "no"}</h4>
                <h4>Dropdown: {Dropdown[item.dropdownValue]}</h4>

                    {/*TODO: only if there is a "click to turn into input"*/}
                    <h4 onClick={() => setTurnIntoInput(!turnIntoInput)}
                        style={{ display: `${turnIntoInput ? "none" : "block"}` }}>
                        Number: {item.numberValue}
                    </h4>
                    <IonItem style={{ display: `${turnIntoInput ? "block" : "none"}` }}>
                        <IonLabel>Number:</IonLabel>
                        <IonInput
                            type="number"
                            value={numberValue}
                            onIonChange={(e) => setNumberValue(parseInt(e.detail.value || "0"))}
                        />
                    </IonItem>


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
                {/*TODO: delete if there is no delete*/}
                <IonButton style={{ marginLeft: "20px", marginBottom: "30px" }} color={"light"} onClick={handleDelete}>
                    <IonIcon icon={trash} />
                </IonButton>
                {deletingError && (
                    <div>{deletingError.message || "Failed to delete item"}</div>
                )}
                <IonLoading isOpen={deleting} message="Deleting item" />
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
