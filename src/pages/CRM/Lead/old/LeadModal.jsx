import React, { useState, useEffect } from 'react';
import Modal from '../../../UI/Modal/Modal';
import FormInput from '../../../UI/Input/FormInput/FormInput';
import VerticalForm from '../../../UI/Form/VerticalForm';
import TextArea from '../../../UI/Input/TextArea/TextArea';
import Select from '../../../UI/Select/SingleSelect';
import './Lead.css';
import { getLeadStageListEffect } from "../../../redux/CRM/lead/LeadEffects";
import { getEmployeeListEffect } from "../../../redux/common/CommonEffects";
import icons from "../../../contents/Icons";
import IconRoundedBtn from '../../../UI/Buttons/IconRoundedBtn/IconRoundedBtn';
import {padgeColorList} from '../../../contents/Colors'
const LeadModal = () => {
  const [lead, setLead] = useState(null);
  const [isModalOpenActivity, setIsModalOpenActivity] = useState(false);
  const [isModalScheduling, setIsModalScheduling] = useState(false);
  const [isModalOpenNotes, setIsModalOpenNotes] = useState(false);
  const [isModalOpenMail, setIsModalOpenMail] = useState(false);
  const [isModalOpenWhatsapp, setIsModalOpenWhatsapp] = useState(false);
  const [isModalOpenFile, setIsModalOpenFile] = useState(false);

  const [primaryOption, setPrimaryOption] = useState("Enquiry");
  const [enquiryOption, setEnquiryOption] = useState("WhatsApp");
  const [employeeList, setEmployeeList] = useState([]);
  const [stageList, setStageList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: employees }, { data: stages }] = await Promise.all([
          getEmployeeListEffect(),
          getLeadStageListEffect()
        ]);

        setEmployeeList(employees.data.map(({ name, id }) => ({ label: name, value: id })));
        setStageList(stages.data.map(({ lead_pipline_stages, id }) => ({ label: lead_pipline_stages, value: id })));
      } catch (error) {
        console.error('Error fetching data:', error);
        setEmployeeList([]);
        setStageList([]);
      }
    };
    fetchData();
  }, []);

  const FeedbackForm = (
    <div className="grid grid-cols-12 gap-2">
      <div className="col-span-12">
        <TextArea id="customer_feed_back" iconLabel={icons.textarea} label="Customer Feedback" validation={{ required: "Customer Feedback is required" }} />
      </div>
      <div className="col-span-6">
        <TextArea id="replied" iconLabel={icons.replay} label="Replied" validation={{ required: "Replied is required" }} />
      </div>
      <div className="col-span-6">
        <TextArea id="notes" iconLabel={icons.note} label="Notes" showStar={false} validation={{ required: "Notes is required" }} />
      </div>
    </div>
  );

  const FORM_CONFIG = {
    Enquiry: {
      Call: FeedbackForm,
      WhatsApp: FeedbackForm,
      Mail: FeedbackForm,
    },
    "Field Visit": [
      FeedbackForm,
      <label>Area Measurement</label>,
      <div className="grid grid-cols-12 gap-2">
        {["length", "width", "height"].map((id) => (
          <div className="col-span-3" key={id}>
            <FormInput id={id} label={id[0].toUpperCase() + id.slice(1)} type="number" iconLabel={icons[`${id}ScaleIcon`]} />
          </div>
        ))}
        <div className="col-span-3">
          <Select
            options={[{ label: 'cm', value: 'cm' }, { label: 'inch', value: 'inch' }]}
            label="Unit"
            id="unit"
            placeholder="Select Unit"
            iconLabel={icons.unit}
          />
        </div>
      </div>,
    ],
    Quotation: {
      WhatsApp: [FeedbackForm, <FormInput id="file" label="File" iconLabel={icons.filepin} type="file" />],
      Mail: [FeedbackForm, <FormInput id="file" label="File" type="file" iconLabel={icons.filepin} />],
    },
  };

  const renderForm = (primaryOption, enquiryOption) =>
    Array.isArray(FORM_CONFIG[primaryOption])
      ? FORM_CONFIG[primaryOption]
      : FORM_CONFIG[primaryOption]?.[enquiryOption] || null;

  const handleSubmit = (data) => 
  
  const actionButtons = [
    { icon: icons.whatsapp, tooltip: "Whatsapp", className: padgeColorList?.green, onClick: () => setIsModalOpenWhatsapp(true), },
    { icon: icons.mail, tooltip: "Mail", className: "mail", onClick: () => setIsModalOpenMail(true), },
    { icon: icons.file, tooltip: "File", className: "file", onClick: () => setIsModalOpenFile(true), },
    { icon: icons.note, tooltip: "Note", className: "note", onClick: () => setIsModalOpenNotes(true), },
    { icon: icons.GoNote, tooltip: "Activity", className: "feildvisit", onClick: () => setIsModalOpenActivity(true), },
    { icon: icons.schedule, tooltip: "Schedule", className: "schedule", onClick: () => setIsModalScheduling(true), },

  ];
  return (
    <div>
      {/* Action Buttons */}
      <div className="flex justify-between">
        <div className="flex gap-2">
          {actionButtons.map(({ icon, tooltip, className, onClick }, idx) => (
            <IconRoundedBtn
              key={idx}
              icon={icon}
              tooltip={tooltip}
              className={className}
              tooltipId={className}
              onClick={onClick}
            />
          ))}
        </div>
      </div>
     
      {/* Activity Modal */}
      <Modal
        isOpen={isModalOpenActivity}
        onClose={() => setIsModalOpenActivity(false)}
        title="Add Activity"
        showHeader
        size="m"
        showFooter={false}
      >
        <div>
          <div className="grid">
            <label>Main Type:</label>
            <select
              value={primaryOption}
              onChange={(e) => setPrimaryOption(e.target.value)}
              className="dropdown"
            >
              <option value="Enquiry">Enquiry</option>
              <option value="Field Visit">Field Visit</option>
              <option value="Quotation">Quotation</option>
            </select>
          </div>
          {primaryOption !== "Field Visit" && (
            <div className="chips-container flex gap-2 mb-4">
              {(primaryOption === "Enquiry" ? ["Call", "WhatsApp", "Mail"] : ["WhatsApp", "Mail"]).map(option => (
                <button
                  key={option}
                  className={`chip ${enquiryOption === option ? "active" : ""}`}
                  onClick={() => setEnquiryOption(option)}
                >
                  {icons[option.toLowerCase()]}
                  {option}
                </button>
              ))}
            </div>
          )}

          <VerticalForm onSubmit={handleSubmit}>
            {renderForm(primaryOption, enquiryOption)}
          </VerticalForm>
        </div>
      </Modal>

      {/* Notes Modal */}
      <Modal
        isOpen={isModalOpenNotes}
        onClose={() => setIsModalOpenNotes(false)}
        title="Add Notes"
        showHeader
        size="m"
        showFooter={false}
      >
        <VerticalForm>
          {/* <FormInput id="title" label="Title" validation={{ required: "Title is required" }} /> */}
          <TextArea id="notes" label="Notes" validation={{ required: "Title is required" }} />
          {/* <FormInput id="schedule_time" label="Schedule Time" type="datetime-local" /> */}
        </VerticalForm>
      </Modal>

      {/* Scheduling Modal */}
      <Modal
        isOpen={isModalScheduling}
        onClose={() => setIsModalScheduling(false)}
        title="Add Schedule"
        showHeader
        size="m"
        showFooter={false}
      >
        <VerticalForm>
          <Select
            options={stageList}
            label="Stage"
            id="lead_stage"
            placeholder="Select Stage"
            iconLabel={icons.tag}
          />
          <FormInput id="schedule_time" iconLabel={icons.calendarWDate} label="Date" type="datetime-local" />
          <Select
            options={employeeList}
            label="Referred Employee"
            id="referal_employee"
            placeholder="Select Employee"
            iconLabel={icons.referenceIcon}
          />
        </VerticalForm>
      </Modal>
      {/* mail */}
      <Modal
        isOpen={isModalOpenMail}
        onClose={() => setIsModalOpenMail(false)}
        title="Add Mail"
        showHeader
        size="m"
        showFooter={false}
      >
        <VerticalForm>
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12">
              <TextArea id="customer_feed_back" iconLabel={icons.textarea} label="Customer Feedback" validation={{ required: "Customer Feedback is required" }} />
            </div>
            <div className="col-span-6">
              <TextArea id="replied" iconLabel={icons.replay} label="Replied" validation={{ required: "Replied is required" }} />
            </div>
            <div className="col-span-6">
              <TextArea id="notes" showStar={false} iconLabel={icons.note} label="Notes" validation={{ required: "Notes is required" }} />
            </div>
            <div className="col-span-12">
              <FormInput id="file" label="File" iconLabel={icons.filepin} type="file" />
            </div></div>
        </VerticalForm>
      </Modal>
      {/* whatsapp */}
      <Modal
        isOpen={isModalOpenWhatsapp}
        onClose={() => setIsModalOpenWhatsapp(false)}
        title="Add Whatsapp"
        showHeader
        size="m"
        showFooter={false}
      >
        <VerticalForm>
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12">
              <TextArea id="customer_feed_back" iconLabel={icons.textarea} label="Customer Feedback" validation={{ required: "Customer Feedback is required" }} />
            </div>
            <div className="col-span-6">
              <TextArea id="replied" iconLabel={icons.replay} label="Replied" validation={{ required: "Replied is required" }} />
            </div>
            <div className="col-span-6">
              <TextArea id="notes" showStar={false} iconLabel={icons.note} label="Notes" validation={{ required: "Notes is required" }} />
            </div>
            <div className="col-span-12">
              <FormInput id="file" label="File" iconLabel={icons.filepin} type="file" />
            </div></div>
        </VerticalForm>
      </Modal>
      {/* file */}
      <Modal
        isOpen={isModalOpenFile}
        onClose={() => setIsModalOpenFile(false)}
        title="Add File"
        showHeader
        size="m"
        showFooter={false}
      >
        <VerticalForm>
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12">
              <TextArea id="notes" showStar={false} iconLabel={icons.note} label="Notes" validation={{ required: "Notes is required" }} />
            </div>
            <div className="col-span-12">
              <FormInput id="file" label="File" iconLabel={icons.filepin} type="file" />
            </div>
          </div>
        </VerticalForm>
      </Modal>
    </div>
  );
};

export default LeadModal;


