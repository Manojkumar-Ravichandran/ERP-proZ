import React, { useEffect, useState } from "react";
import icons from "../../../contents/Icons";
import './Master.css'
import { useSelector } from "react-redux";
const CardListMaster = () => {
    const cardDatas = useSelector(state=>state?.inventoryMaster)

    return (
        <>
            <div className="grid grid-cols-4 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <div className="darkCardBg p-5 rounded-lg flex justify-between items-center">
                    <div>
                        <p className="font-bold">No Of Inventory</p>
                        <p>{cardDatas?.no_inventory ||0}</p>
                    </div>
                    <div className="text-3xl top-clr">{icons.profit}</div>
                </div>
                <div className="darkCardBg p-5 rounded-lg flex justify-between items-center">
                    <div>
                        <p className="font-bold">Volume  Occupied</p>
                        <p>{cardDatas?.volume_occupied ||0}</p>
                    </div>
                    <div className="text-3xl top-clr">{icons.house}</div>
                </div>
                <div className="darkCardBg p-5 rounded-lg flex justify-between items-center">
                    <div>
                        <p className="font-bold">Material In / Out</p>
                        <p>{cardDatas?.material_in ||0} / {cardDatas?.material_out ||0}</p>
                    </div>
                    <div className="text-3xl top-clr">{icons.materialInOut}</div>
                </div>
                <div className="darkCardBg p-5 rounded-lg flex justify-between items-center">
                    <div>
                        <p className="font-bold">Assets</p>
                        <p>{cardDatas?.asset_count ||0}</p>
                    </div>
                    <div className="text-3xl top-clr">{icons.assets}</div>
                </div>
            </div>
        </>
    )
}
export default CardListMaster;