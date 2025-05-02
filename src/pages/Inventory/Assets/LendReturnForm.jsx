import React, { useState, useEffect } from "react";
import { createAssets } from "../../../redux/Inventory/Assets/AssetsAction";
import { useForm } from "react-hook-form";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import icons from "../../../contents/Icons";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../UI/Modal/Modal";
import TextArea from "../../../UI/Input/TextArea/TextArea";
import Select from "../../../UI/Select/SingleSelect";
import { getEmployeeListEffect } from "../../../redux/common/CommonEffects";
import ModalCenter from "../../../UI/ModalCenter/ModalCenter";
import SingleCheckbox from "../../../UI/Input/CheckBoxInput/SingleCheckbox";
import formatDateForInput from "../../../UI/Date/Date";

const LendReturnForm = () => {
  return(
    <>LendReturnForm</>
  )
};
export default LendReturnForm;
