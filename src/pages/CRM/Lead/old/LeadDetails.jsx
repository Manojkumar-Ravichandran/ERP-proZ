import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { showLeadEffect } from "../../../redux/CRM/lead/LeadEffects";
import {
  getLeadStageListInprogress,
  getLeadSourceListInprogress,
  deleteLeadInprogress,
  createLeadActivityInprogress,
} from "../../../redux/CRM/lead/LeadActions";
import { getEmployeeListEffect } from "../../../redux/common/CommonEffects";
import { convertToIST, formatDateToYYYYMMDD, getCurrentDateTime, TformatDateToYYYYMMDDWTime } from "../../../utils/Date";
import { arrOptForDropdown, findFirstLetter } from "../../../utils/Data";
import { activityData, stageBadgeColor } from "../../../contents/BadgeColor";

import StatusManager from "../../../UI/StatusManager/StatusManager";
import Breadcrumb from "../../../UI/Breadcrumps/Breadcrumps";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import IconOnlyBtn from "../../../UI/Buttons/IconOnlyBtn/IconOnlyBtn";
import IconRoundedBtn from "../../../UI/Buttons/IconRoundedBtn/IconRoundedBtn";
import ProfileCircle from "../../../UI/ProfileCircle/ProfileCircle";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Modal from "../../../UI/Modal/Modal";

import icons from "../../../contents/Icons";
import { validationPatterns } from "../../../utils/Validation";
import "./Lead.css";
import Stepper from "../../../UI/Stepper/Stepper";
import VerticalForm from "../../../UI/Form/VerticalForm";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import TextArea from "../../../UI/Input/TextArea/TextArea";
import SearchableSelect from "../../../UI/Select/SearchableSel";
import MessageCard from "../../../UI/MessageCard/MessageCard";
const LeadDetail = () => {
  const { uuid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { leadStageList, leadSourceList } = useSelector((state) => state.lead);

  const [lead, setLead] = useState(null);
  const [leadFollowupData, setLeadFollowupData] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [toastData, setToastData] = useState({ show: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpenNotes, setIsModalOpenNotes] = useState(false);
  const [isModalOpenActivity, setIsModalOpenActivity] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stageList, setStageList] = useState([]);
  const [sourceList, setSourceList] = useState([]);
  const [deleteLeadData, setDeleteLeadData] = useState(null);
  const [primaryOption, setPrimaryOption] = useState(2); // null by default
  const [enquiryOption, setEnquiryOption] = useState("Phone");
 
  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 2, label: "Lead", link: "/user/crm/lead" },
    { id: 3, label: "Lead Detail" },
  ];

  useEffect(() => {
    const fetchLeadDetails = async () => {
      try {
        const response = await showLeadEffect({ uuid });
        setLead(response.data.data);
        setLeadFollowupData(response?.data?.followup_data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching lead details");
      } finally {
        setLoading(false);
      }
    };
    fetchLeadDetails();
  }, [uuid]);

  useEffect(() => {
    if (leadSourceList?.data?.length === 0) {
      dispatch(getLeadSourceListInprogress({}));
    }
  }, []);
  useEffect(() => {
    if (leadStageList?.data?.length === 0) {
      dispatch(getLeadStageListInprogress({}));
    }
  }, []);
  useEffect(() => {
    if (employeeList?.length === 0) {
      (async () => {
        const { data } = await getEmployeeListEffect();
        setEmployeeList(
          data.data.map((list) => ({
            label: list.name,
            value: list.id,
          }))
        );
      })();
    }
  }, []);

  // useEffect(() => {
  //   const controller = new AbortController(); // Create an abort controller
  //   const signal = controller.signal;

  //   if (leadSourceList?.data?.length === 0) {
  //     dispatch(getLeadSourceListInprogress({}));
  //   }

  //   if (leadStageList?.data?.length === 0) {
  //     dispatch(getLeadStageListInprogress({}));
  //   }

  //   if (employeeList?.length === 0) {
  //     (async () => {
  //       try {
  //         const { data } = await getEmployeeListEffect({ signal }); // Pass signal to the API call
  //         setEmployeeList(
  //           data.data.map((list) => ({
  //             label: list.name,
  //             value: list.id,
  //           }))
  //         );
  //       } catch (error) {
  //         if (signal.aborted) {
  //           
  //         } else {
  //           console.error("Failed to fetch employee list:", error);
  //         }
  //       }
  //     })();
  //   }

  //   return () => {
  //     controller.abort(); // Abort ongoing API calls when unmounting
  //   };
  // }, [leadSourceList?.data, leadStageList?.data, employeeList, dispatch]);
  const getLeadSourceList = () => {
    if (leadSourceList?.data?.length === 0) {
      dispatch(getLeadSourceListInprogress({}));
    }
  };
  useEffect(() => {
    getLeadSourceList();
    setStageList(
      arrOptForDropdown(leadStageList?.data, "lead_pipline_stages", "id")
    );
  }, [leadStageList]);
  useEffect(() => {
    setSourceList(arrOptForDropdown(leadSourceList?.data, "lead_source", "id"));
  }, [leadSourceList]);

  // const stageList = arrOptForDropdown(leadStageList?.data, "lead_pipline_stages", "id");
  // const sourceList = arrOptForDropdown(leadSourceList?.data, "lead_source", "id");

  const toastOnclose = () => setToastData({ ...toastData, show: false });

  const handleLeadDelete = () => setIsModalOpen(true);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  const handleStepChange = (stepIndex) => {
    // 
  };
  // Handle deleting lead
  const deleteLead = () => {
    dispatch(
      deleteLeadInprogress({ ...deleteLeadData, callback: deleteLeadAction })
    );
  };

  const deleteLeadAction = (data) => {
    // Show the success notification
    setToastData({ show: true, message: data?.message, type: data?.status });

    // Close the modal and trigger the page redirection after a delay
    setIsModalOpen(false);
    setTimeout(() => {
      navigate("/user/crm/lead"); // Redirect to lead list page
    }, 2000); // Delay for 2 seconds to show the notification
  };

  const handleModalClose = () => setIsModalOpenActivity(false);

  // Handle primary option change
  const handlePrimaryOptionChange = (option) => {
    getLeadSourceList();
    setPrimaryOption(option);
    if (option == 2) {
      setEnquiryOption("Phone"); // Default to Phone for Enquiry
    } else if (option == 4) {
      setEnquiryOption("WhatsApp"); // Default to WhatsApp for Quotation
    }
  };

  const sourceOptions = {
    2: ["Phone", "WhatsApp", "Mail"],
    4: ["WhatsApp", "Mail"],
  };

  // Handle Enquiry dropdown change
  const handleEnquiryOptionChange = (option) => {
    setEnquiryOption(option);
  };
  const ScheduleTimeGroup = ({
    register,
    errors,
    setValue,
    prefix = "",
    assigned = true,
  }) => (
    <div className="flex gap-x-2">
      <FormInput
        id={`${prefix}schedule_time`}
        label="Schedule Time"
        type="datetime-local"
        validation={{ required: "Time is required" }}
        register={register}
        errors={errors}
      />
      {assigned && (
        <SearchableSelect
          label="Assigned By"
          id="next_assign"
          options={employeeList}
          placeholder="Select Employee"
          validation={{ required: "Assignee is required" }} // Validation
          showStar={true}
          register={register} // Passing register directly
          errors={errors} // Passing errors directly
          setValue={setValue} // Passing setValue directly
        />
      )}
    </div>
  );

  const FORM_CONFIG = {
    2: {
      Phone: [
       
        <TextArea
          id="description"
          label="Description"
          validation={{ required: "Description is required" }}
        />,
        <ScheduleTimeGroup assigned={false} />,
        <p className="font-semibold mt-2">Next Due Details</p>,
        <ScheduleTimeGroup prefix="next-" />,
      ],
      WhatsApp: [
        <TextArea
          id="description"
          label="Description"
          validation={{ required: "Text field is required" }}
        />,
        <FormInput id="file" label="File" type="file" />,
        <ScheduleTimeGroup assigned={false} />,
        <p className="font-semibold mt-2">Next Due Details</p>,
        <ScheduleTimeGroup prefix="next-" />,
      ],
      Mail: [
        // <div className="flex gap-x-2">
        //   <FormInput id="to" label="To" />
        //   <FormInput id="from" label="From" />
        // </div>,
        <div className="">          
          <FormInput id="subject" label="Subject" />
        </div>,
        <div className="flex gap-x-2">
          <FormInput id="cc" label="CC" />
          <FormInput id="bcc" label="BCC" />
        </div>,
        <div className="">
          <TextArea id="description" label="Description" />
          <FormInput id="file" label="File" type="file" />
        </div>,
        <ScheduleTimeGroup assigned={false} />,
        <p className="font-semibold mt-2">Next Due Details</p>,
        <ScheduleTimeGroup prefix="next-" />,
      ],
    },
    3: [
     
      <FormInput id="address" label="Address" />,
      <TextArea id="description" label="Description" />,
      <ScheduleTimeGroup assigned={false} />,
      <p className="font-semibold mt-2">Next Due Details</p>,
      <ScheduleTimeGroup prefix="next-" />,
    ],
    4: {
      WhatsApp: [
        <TextArea id="description" label="Description" />,
        <FormInput id="file" label="File" type="file" />,
        <ScheduleTimeGroup assigned={false} />,
        <p className="font-semibold mt-2">Next Due Details</p>,
        <ScheduleTimeGroup prefix="next-" />,
      ],
      Mail: [
        // <div className="flex gap-x-2">
        //   <FormInput id="to" label="To" />,
        //   <FormInput id="from" label="From" />
        // </div>,
        <div className="">
          <FormInput id="subject" label="Subject" />
        </div>,
        <div className="flex gap-x-2">
          <FormInput id="cc" label="CC" />
          <FormInput id="bcc" label="BCC" />
        </div>,
        <div className="">
          <TextArea id="description" label="Description" />
          <FormInput id="file" label="File" type="file" />
        </div>,
        <ScheduleTimeGroup assigned={false} />,
        <p className="font-semibold mt-2">Next Due Details</p>,
        <ScheduleTimeGroup prefix="next-" />,
      ],
    },
  };

  const handleSubmit = (data) => {   
    const selectedSource = sourceList.find(
      (list) => list.label === enquiryOption
    );
    TformatDateToYYYYMMDDWTime(data?.schedule_time)
    const payload = {
      // ...data,
      primaryOption,
      enquiryOption,
      lead_source_id: selectedSource.value,
      stages_id: primaryOption,
      message: data?.description,
      lead_id: lead?.id,
      date: TformatDateToYYYYMMDDWTime(data?.schedule_time),
      next_followup: TformatDateToYYYYMMDDWTime(data["next-schedule_time"]),
      next_assign: data?.next_assign,
    };
    dispatch(createLeadActivityInprogress({ ...payload }));
  };

  const renderForm = (primaryOption, enquiryOption) => {
    const config = FORM_CONFIG[primaryOption];
    return Array.isArray(config) ? config : config?.[enquiryOption] || null;
  };
// message card date handle
const handleSaveDateTime = (newDateTime) => {
  
};
  return (
    <>
      {toastData?.show && (
        <AlertNotification
          show={toastData?.show}
          message={toastData?.message}
          type={toastData?.type}
          onClose={toastOnclose}
        />
      )}
      <div className="min-h-screen p-1">
        <Breadcrumb items={breadcrumbItems} className="p-0" />

        <div className="border rounded-lg p-6 bg-white darkCardBg">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,2fr] gap-3 mb-6">
            <div className="bg-white p-4 rounded-lg border darkCardBg">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <ProfileCircle letter={findFirstLetter(lead?.lead_name)} />
                    <p className="text-2xl font-semibold grid">
                      {lead?.lead_name}
                      <span className="text-sm">{lead?.lead_id}</span>
                    </p>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <IconOnlyBtn
                      type="button"
                      tooltipId="edit-customer-btn"
                      onClick={() =>
                        navigate("/user/crm/lead/update-lead", { state: lead })
                      }
                      icon={icons.editIcon}
                      tooltip="Edit Lead"
                    />
                    <IconOnlyBtn
                      type="button"
                      tooltipId="delete-customer-btn"
                      className="text-red-500"
                      onClick={handleLeadDelete}
                      icon={icons.deleteIcon}
                      tooltip="Delete Lead"
                    />
                  </div>
                </div>
                <div className="mt-1 ms-10 callDetail">
                  <p className="flex items-center pe-2">
                    {icons.mail}
                    <span className="ms-2 text-sm">{lead?.email}</span>
                  </p>
                  <p className="flex items-center pe-2">
                    {icons.call}
                    <span className="ms-2 text-sm">{lead?.lead_contact}</span>
                  </p>
                  <p className="flex items-center">
                    {icons.whatsapp}
                    <span className="ms-2 text-sm">
                      {lead?.whatsapp_contact}
                    </span>
                  </p>
                </div>

                <div className="grid">
                  <div>
                    <label className="block text-sm font-medium">Stages</label>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <StatusManager
                          status={stageBadgeColor[lead?.stage_name]}
                          className="me-2"
                          message={lead?.stage_name}
                        />
                        <StatusManager status="success" message="Active" />
                        <p className="ms-3" data-tooltip-id="tag">
                          {icons.tag}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <IconRoundedBtn
                          icon={icons.mail}
                          tooltip="Mail"
                          tooltipId="mail"
                          className="mail"
                        />
                        <IconRoundedBtn
                          icon={icons.file}
                          tooltip="File"
                          tooltipId="file"
                          className="file"
                        />
                        <IconRoundedBtn
                          icon={icons.note}
                          tooltip="Note"
                          tooltipId="note"
                          className="note"
                          onClick={() => setIsModalOpenNotes(true)}
                        />
                        <IconRoundedBtn
                          icon={icons.GoNote}
                          tooltip="Activity"
                          tooltipId="activity"
                          className="activity"
                          onClick={() => setIsModalOpenActivity(true)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium">Purpose</label>
                  <p>{lead?.lead_purpose}</p>
                </div>
                <hr />
                <div>
                  About Lead
                  <div className="flex items-center">
                    <label className="block text-sm font-medium">
                      Lead Value:
                    </label>
                    <p>{lead?.lead_value || "00"}</p>
                  </div>
                  <div className="flex items-center">
                    <label className="block text-sm font-medium">
                      Incharge:
                    </label>
                    <p>{lead?.incharge_name}</p>
                  </div>
                  <div className="flex items-center">
                    <label className="block text-sm font-medium">
                      Last Follow-Up Date:
                    </label>
                    <p>{lead?.last_followup}</p>
                  </div>
                  <div className="flex items-center">
                    <label className="block text-sm font-medium">
                      Next Follow-Up Date:
                    </label>
                    <p>{convertToIST(lead?.next_followup)}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="">
              <Stepper
                steps={stageList}
                activeStep={lead.stage_id}
                onStepChange={handleStepChange}
              />

              {/* <div className="border">
                <div className="p-2">
                  <div
                    key="23"
                    className="p-4 border rounded-lg mb-4 bg-gray-50  items-start"
                  >
                    <div className="grid grid-cols-3 gap-1 items-center">
                      <div>
                        <div className="feildvisit text-center rounded-full p-3 w-10 h-10">
                          {icons.newIcon}
                        </div>
                      </div>
                      <label htmlFor="" className="font-semibold text-lg">
                        New
                      </label>
                      <div className="font-semibold text-lg">
                        <label>Next Follow up Date</label>
                        <br />
                        <span className="text-sm">{convertToIST(lead?.next_followup)}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3">
                      <div></div>
                      <div className="">
                        <label className="">Assigned By</label>
                        <span>{lead?.next_assign_name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
              <div>
      <MessageCard
        title="Project Plan Update"
        description="Update the detailed project plan notes. This includes all the necessary details, milestones, and action items for the upcoming weeks. Ensure the notes are precise and well-documented for better clarity."
        linkText="Project Link"
        linkIcon={icons.GoNote}
        scheduledDate="1 Sep 2024, 12:30 AM"
        scheduledBy="Manager"
        onSaveDateTime={handleSaveDateTime}
      />
      {
        leadFollowupData?.length>0&&<>
          {leadFollowupData.map(followup=>(
            <MessageCard
            title={followup?.stages_name}
            description={followup?.message}
            linkIcon={activityData.icons[followup?.lead_source_name]}
            // iconColor ={}

            
            />
          ))}
        </>
      }


            <MessageCard
              title="New"
              description={lead?.lead_purpose}
              linkIcon={icons.newIcon}
              scheduledDate={getCurrentDateTime(lead?.next_followup)}
              scheduledBy={lead?.incharge_name}
              onSaveDateTime={handleSaveDateTime}
              reschedule={leadFollowupData.length==0}
            />
          </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // Using onClose to handle modal close
        title="Delete Lead"
        showFooter={true}
        footerButtons={[
          {
            text: "Cancel",
            onClick: () => setIsModalOpen(false),
            className: "cancel-btn",
          },
          {
            text: "Delete",
            onClick: deleteLead,
            className: "bg-red-500 text-white p-2 rounded",
          },
        ]}
      >
        <p>Are you sure you want to delete this lead?</p>
      </Modal>
      <Modal
        isOpen={isModalOpenActivity}
        onClose={handleModalClose}
        title="Add Activity"
        showHeader={true}
        showFooter={false}
        size="m"
        closeButtonText="Dismiss"
      >
        <div className="grid">
          <label>Main Type:</label>
          <select
            value={primaryOption}
            onChange={(e) => handlePrimaryOptionChange(e.target.value)}
            className="dropdown"
          >
            {stageList.map((list) => (
              <>
                {list?.value !== 1 && (
                  <option value={list.value}>{list.label}</option>
                )}
              </>
            ))}
          </select>
        </div>
        <div>
          {primaryOption == 2 && (
            <>
              <Chips
                options={sourceOptions[2]}
                activeOption={enquiryOption}
                onOptionChange={handleEnquiryOptionChange}
              />
            </>
          )}

          {primaryOption == 4 && (
            <>
              <Chips
                options={sourceOptions[4]}
                activeOption={enquiryOption}
                onOptionChange={handleEnquiryOptionChange}
              />
            </>
          )}
        </div>
        <VerticalForm onSubmit={handleSubmit}>
          {renderForm(primaryOption, enquiryOption)}
        </VerticalForm>
      </Modal>
    </>
  );
};

export default LeadDetail;

const Chips = ({ options, activeOption, onOptionChange }) => {
  return (
    <div className="chips-container flex gap-2 mb-4">
      {options.map((option) => (
        <button
          key={option}
          className={`chip ${activeOption === option ? "active" : ""}`}
          onClick={() => onOptionChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
