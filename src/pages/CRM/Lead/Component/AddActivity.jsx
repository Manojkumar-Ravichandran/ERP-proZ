import React, { useEffect, useState } from "react";
import icons from "../../../../contents/Icons";
import Modal from "../../../../UI/Modal/Modal";
import { useForm } from "react-hook-form";
import FormInput from "../../../../UI/Input/FormInput/FormInput";
import {
  arrOptForDropdown,
  findSpecificIdDatas,
  getDefaultDateTime,
} from "../../../../utils/Data";
import Select from "../../../../UI/Select/SingleSelect";
import { getEmployeeListEffect } from "../../../../redux/common/CommonEffects";
import {
  createLeadActivityEffect,
  getLeadSourceListEffect,
  getLeadStageListEffect,
} from "../../../../redux/CRM/lead/LeadEffects";
import { getUnitEffect } from "../../../../redux/CRM/lead/LeadEffects";
import TextArea from "../../../../UI/Input/TextArea/TextArea";
import FileInput from "../../../../UI/Input/FileInput/FileInput";
import SingleCheckbox from "../../../../UI/Input/CheckBoxInput/SingleCheckbox";
import GeoMap from "../../../../UI/GeoLocation/GeoMap/GeoMap";
import IconButton from "../../../../UI/Buttons/IconButton/IconButton";
import { useDispatch, useSelector } from "react-redux";
import { setLeadDetailInprogress } from "../../../../redux/CRM/lead/LeadActions";

export default function AddActivity({ leadData }) {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [leadSourceList, setLeadSourceList] = useState([]);
  const [sourceList, setSourceList] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [communicationMode, setCommunicationMode] = useState();
  const [stageList, setStageList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [editDimension, setEditDimension] = useState(false);
  const [toastData, setToastData] = useState(false);
  const dispatch = useDispatch();
  const currentLocations = useSelector(
    (state) => state?.common?.location?.location
  );
  const {
    register,
    formState: { errors },
    control,
    setValue,
    watch,
    reset,
    handleSubmit,
  } = useForm();

  const stage = watch("pipeline_id");
  const dimension = watch("editDimension");
  useEffect(() => {
    setEditDimension(dimension);
  }, [dimension]);

  useEffect(() => {
    if (stage == 2) {
      const payload = [
        {
          label: "Email",
          value: 5,
        },
        {
          label: "Direct",
          value: 6,
        },
        {
          label: "Phone",
          value: 7,
        },
        {
          label: "WhatsApp",
          value: 8,
        },
        // {
        //   label: "Message",
        //   value: 9,
        // },
      ];

      setLeadSourceList(payload);
      setCommunicationMode(5);
    } else if (stage == 3) {
      const payload = [
        {
          label: "Direct",
          value: 6,
        },
      ];

      setLeadSourceList(payload);
      setCommunicationMode(6);
    } else if (stage == 4) {
      const payload = [
        {
          label: "Email",
          value: 5,
        },
        {
          label: "Phone",
          value: 7,
        },
        {
          label: "WhatsApp",
          value: 8,
        },
        // {
        //   label: "Message",
        //   value: 9,
        // },
      ];

      setLeadSourceList(payload);
      setCommunicationMode(5);
    } else {
      const payload = [
        {
          label: "Email",
          value: 5,
        },
        {
          label: "Direct",
          value: 6,
        },
        {
          label: "Phone",
          value: 7,
        },
        {
          label: "WhatsApp",
          value: 8,
        },
        // {
        //   label: "Message",
        //   value: 9,
        // },
      ];

      setLeadSourceList(payload);
      setCommunicationMode(5);
    }
  }, [stage]);

  const addScheduleHandler = async (data) => {

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "send_msg") {
        formData.append(key, value ? 1 : 0);
      } else if (key == "date") {
        formData.append(key, value.replace("T", " "));
      } else if (key == "schedule_time") {
        formData.append(key, value.replace("T", " "));
      } else if (key == "file_url") {
        if (value?.length > 0) {
          formData.append(key, value[0]); // Appending the file
        } else {
          formData.append(key, ""); // Appending the file
        }
      } else if (key == "notes") {
        formData.append(key, value || "");
      } else {
        formData.append(key, value);
      }
    });
    formData.append("mode_communication", communicationMode);
    formData.append("lead_id", leadData?.id);
    if (data?.pipeline_id == 3) {
      formData.append("latitude", currentLocations[0]);
      formData.append("longitude", currentLocations[1]);
    }
    try {
      const result = await createLeadActivityEffect(formData);
      if (result.data.status === "success") {
        setToastData({
          show: true,
          type: result?.data?.status,
          message: result?.data?.message,
        });
        setIsModelOpen(false);
      }
    } catch (error) {
      setToastData({
        show: true,
        type: error?.data?.status,
        message: error?.data?.message,
      });
    } finally {
      setIsLoading(false);
      setIsModelOpen(false);
      reset();
      // <DetailsCall uuid ={leadData.uuid} />
      const payloads = {
        uuid: leadData.uuid,
        stages: "",
        is_schedule: 0,
      };
      dispatch(setLeadDetailInprogress({ ...payloads }));
    }
  };
  const openModel = () => {
    setIsModelOpen(true);
    setValue("date", getDefaultDateTime());
    setValue("pipeline_id", 2);
    setValue("send_msg", true);
  };
  useEffect(() => {
    const mapToOptions = (data) =>
      data.map(({ name, id }) => ({ label: name, value: id }));

    const fetchData = async () => {
      try {
        const [
          { data: employees },
          { data: stages },
          { data: sources },
          { data: units },
        ] = await Promise.all([
          getEmployeeListEffect(),
          getLeadStageListEffect(),
          getLeadSourceListEffect(),
          getUnitEffect(),
        ]);

        setEmployeeList(mapToOptions(employees.data));
        setStageList(
          mapToOptions(stages.data.filter(({ name }) => name !== "New"))
        );
        setSourceList(mapToOptions(sources.data));
        setUnitList(arrOptForDropdown(units.data?.data, "unit_name", "id"));
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error);
      }
    };

    fetchData();
  }, []);

  const FeedbackForm = (
    <div className="grid grid-cols-12 gap-2">
      <div className="col-span-12">
        <TextArea
          id="customer_reply"
          iconLabel={icons.textarea}
          label="Lead Insights / Inquiries"
          validation={{ required: "Customer Feedback is required" }}
          register={register}
          errors={errors}
        />
      </div>
      <div className="col-span-12">
        <TextArea
          id="content_reply"
          iconLabel={icons.replay}
          label="Our Reply"
          validation={{ required: "Our Reply is required" }}
          register={register}
          errors={errors}
        />
      </div>
      <div className="col-span-12">
        <TextArea
          id="notes"
          iconLabel={icons.note}
          label="Notes"
          validation={{ required: false }}
          register={register}
          errors={errors}
          showStar={false}
        />
      </div>
      {communicationMode == 8 && (
        <>
          <div className="col-span-12">
            <SingleCheckbox
              id="send_msg"
              label="Send to WhatsApp"
              register={register}
              errors={errors}
              validation={{
                required: false,
              }}
            />
          </div>
          <div className="col-span-12">
            <FileInput
              id="file_url"
              label="File"
              iconLabel={icons.filepin}
              type="file"
              register={register}
              errors={errors}
              showStar={false}
              validation={{
                required: false,
              }}
            />
          </div>
        </>
      )}
      {communicationMode == 5 && (
        <>
          <div className="col-span-12">
            <SingleCheckbox
              id="send_msg"
              label="Send to Mail"
              register={register}
              errors={errors}
              validation={{
                required: false,
              }}
            />
          </div>
          <div className="col-span-12">
            <FileInput
              id="file_url"
              label="File"
              iconLabel={icons.filepin}
              type="file"
              register={register}
              showStar={false}
              errors={errors}
              validation={{
                required: false,
              }}
            />
          </div>
        </>
      )}

      {stage == 3 && (
        <>
          <div className="col-span-12">
            <SingleCheckbox
              id="editDimension"
              label="Add Area Dimension Details"
              register={register}
              errors={errors}
              validation={{
                required: false,
              }}
            />
          </div>
          {dimension && (
            <>
              <div className="col-span-12">
                <label>Area Measurement</label>
              </div>
              <div className="col-span-12">
                <div className="grid grid-cols-12 gap-2">
                  {["length", "width", "height"].map((id) => (
                    <div className="col-span-6" key={id}>
                      <FormInput
                        id={id}
                        label={id[0].toUpperCase() + id.slice(1)}
                        type="number"
                        iconLabel={icons[`${id}ScaleIcon`]}
                        register={register}
                        errors={errors}
                      />
                    </div>
                  ))}
                  <div className="col-span-6">
                    <Select
                      options={unitList}
                      label="Unit"
                      id="unit"
                      placeholder="Select Unit"
                      iconLabel={icons.unit}
                      register={register}
                      errors={errors}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="col-span-12 mt-3">
            <GeoMap />
          </div>
        </>
      )}
      <div className="col-span-12">
        <p className="font-semibold">Next Schedule Details</p>
      </div>
      <div className="col-span-12">
        <FormInput
          id="schedule_time"
          iconLabel={React.cloneElement(icons.calendarWDate, { size: 20 })}
          label="Date & Time"
          type="datetime-local"
          register={register}
          errors={errors}
          showStar={false}
          validation={{ required: false }}
          min={getDefaultDateTime()}
        />
      </div>
      <div className="col-span-12">
        <Select
          options={employeeList}
          label="Assignee"
          id="assignee"
          placeholder="Select Employee"
          iconLabel={React.cloneElement(icons.referenceIcon, { size: 20 })}
          register={register}
          errors={errors}
          showStar={false}
          validation={{ required: false }}
        />
      </div>
    </div>
  );
  const FORM_CONFIG = {
    Enquiry: {
      Phone: FeedbackForm,
      WhatsApp: FeedbackForm,
      Email: FeedbackForm,
      Direct: FeedbackForm,
    },
    "Field Visit": [FeedbackForm],
    Quotation: {
      WhatsApp: [FeedbackForm],
      Email: [FeedbackForm],
    },
  };

  const renderForm = (primaryOption, enquiryOption) => {
    return Array.isArray(FORM_CONFIG[primaryOption])
      ? FORM_CONFIG[primaryOption]
      : FORM_CONFIG[primaryOption]?.[enquiryOption] || null;
  };

  return (
    <div>
      <button
        onClick={() => {
          openModel();
        }}
      >
        {icons.edit} hi
      </button>
      <Modal
        isOpen={isModelOpen}
        onClose={() => setIsModelOpen(false)}
        title="Add Activity"
        showHeader
        size="m"
        showFooter={false}
      >
        <form onSubmit={handleSubmit(addScheduleHandler)}>
          <FormInput
            id="date"
            iconLabel={React.cloneElement(icons.calendarWDate, { size: 20 })}
            label="Date & Time"
            type="datetime-local"
            register={register}
            errors={errors}
            validation={{ required: "Schedule Date & Time is required" }}
            max={getDefaultDateTime()}
            min={getDefaultDateTime(2)}
          />
          <Select
            options={stageList}
            label="Purpose"
            id="pipeline_id"
            register={register}
            errors={errors}
            validation={{ required: "Purpose is required" }}
            placeholder="Select Stage"
            iconLabel={React.cloneElement(icons.tag, { size: 20 })}
          />
          <div className="flex my-4 gap-3">
            {leadSourceList.map((option) => (
              <button
                key={option?.value}
                className={`chip ${
                  communicationMode == option?.value ? "active" : ""
                } `}
                onClick={() => setCommunicationMode(option?.value)}
                type="button"
              >
                {icons[option?.label.toLowerCase()]}
                {option?.label}
              </button>
            ))}
          </div>

          {renderForm(
            findSpecificIdDatas(stageList, Number(stage))?.label,
            findSpecificIdDatas(sourceList, communicationMode)?.label
          )}

          <div className="flex gap-3 mt-3">
            <IconButton
              type="button"
              icon={React.cloneElement(icons.cancelIcon, { size: "20px" })}
              label="Cancel"
              className="px-4 py-2 btn_cancel"
              onClick={() => {
                // setIsModalOpenWhatsapp(false);
                reset();
              }}
              // disabled={whatsappLoading}
            />
            <IconButton
              type="submit"
              icon={React.cloneElement(icons.plusIcon, { size: "20px" })}
              label="Add Activity"
              className="px-4 py-2"
              loading={loading}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
