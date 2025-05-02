// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { showLeadEffect } from "../../../redux/CRM/lead/LeadEffects";
// import StatusManager from "../../../UI/StatusManager/StatusManager";
// import Breadcrumb from "../../../UI/Breadcrumps/Breadcrumps";
// import { Tooltip as ReactTooltip } from "react-tooltip";
// import "./Lead.css";
// import icons from "../../../contents/Icons";
// import { validationPatterns } from "../../../utils/Validation";

// import { useDispatch } from "react-redux";
// import Modal from "../../../UI/Modal/Modal";
// import { deleteLeadInprogress, getLeadListInProgress } from "../../../redux/CRM/lead/LeadActions";
// import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
// import Stepper from "../../../UI/Stepper/Stepper";
// import FormInput from "../../../UI/Input/FormInput/FormInput";
// import { useForm } from "react-hook-form";
// import VerticalForm from '../../../UI/Form/VerticalForm';
// import TextArea from "../../../UI/Input/TextArea/TextArea";
// const LeadDetail = () => {
//     const { uuid } = useParams();
//     const [lead, setLead] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [activeTab, setActiveTab] = useState("all");
//     const [toastData, setToastData] = useState({ show: false });
//     const [deleteLeadData, setDeleteLeadData] = useState(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const [isModalOpenActivity, setIsModalOpenActivity] = useState(false);
//     const [primaryOption, setPrimaryOption] = useState("Enquiry"); // null by default
//     const [enquiryOption, setEnquiryOption] = useState("Call");
//     const [isModalOpenNotes,setIsModalOpenNotes] = useState(false);

//     // Fetch lead details when the component mounts
//     useEffect(() => {
//         const fetchLeadDetails = async () => {
//             try {
//                 const response = await showLeadEffect({ uuid });
//                 setLead(response.data.data);
//             } catch (err) {
//                 setError(err.response?.data?.message || "Error fetching lead details");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchLeadDetails();
//     }, [uuid]);

//     const breadcrumbItems = [
//         { id: 1, label: "Home", link: "/user" },
//         { id: 2, label: "Lead", link: "/user/crm/lead" },
//         { id: 3, label: "Lead Detail" },
//     ];

//     if (loading) {
//         return <p>Loading...</p>;
//     }

//     if (error) {
//         return <p>Error: {error}</p>;
//     }

//     if (!lead) {
//         return <p>No lead data found.</p>;
//     }

//     // Handle deleting lead
//     const deleteLead = () => {
//         dispatch(deleteLeadInprogress({ ...deleteLeadData, callback: deleteLeadAction }));
//     };

//     const deleteLeadAction = (data) => {
//         // Show the success notification
//         setToastData({ show: true, message: data?.message, type: data?.status });

//         // Close the modal and trigger the page redirection after a delay
//         setIsModalOpen(false);
//         setTimeout(() => {
//             navigate("/user/crm/lead"); // Redirect to lead list page
//         }, 2000); // Delay for 2 seconds to show the notification
//     };

//     const handleLeadDelete = (rowData) => {
//         setDeleteLeadData(rowData);
//         setIsModalOpen(true);
//     };

//     const toastOnclose = () => {
//         setToastData({ ...toastData, show: false });
//     };

//     const data = [

//         {
//             type: "whatsapp",
//             mainType: "Quotation",
//             title: "Client Inquiry",
//             description: "Discussed new product options.",
//             participants: ["Client", "Sales Rep"],
//             scheduleFrom: "1 Sep 2024, 11:30 AM",
//             scheduleTo: "1 Sep 2024, 12:00 PM",
//             location: "WhatsApp",
//             createdBy: "Sales Rep",
//             attachments: [
//                 { type: "image", file: "/path/to/image.jpg", description: "Image of product" },
//                 { type: "file", file: "/path/to/quotation.pdf", description: "Quotation PDF" }
//             ]
//         },

//         {
//             type: "feildvisit",
//             mainType: "Field visit",
//             title: "Team Feedback",
//             description: "Discussed the project requirements.",
//             participants: ["Alice", "Bob"],
//             scheduleFrom: "30 Aug 2024, 3:10 AM",
//             scheduleTo: null,
//             location: null,
//             createdBy: "manager",
//         },

//         {
//             type: "files",
//             mainType: "Enquiry",
//             title: "Project Plan",
//             description: "Uploaded the detailed project plan.",
//             name: "project_plan.pdf",
//             file: "/path/to/project_plan.pdf",
//             scheduleFrom: "30 Aug 2024, 5:10 AM",
//             createdBy: "Example",
//         },
//         {
//             type: "notes",
//             mainType: " ",
//             title: "Project Notes",
//             description: "Uploaded the detailed project plan notes.",
//             scheduleFrom: "30 Aug 2024, 5:10 AM",
//             createdBy: "Ram",
//         },
//         {
//             type: "email",
//             title: "Enquiry",
//             mainType: "Enquiry",
//             subject: "Project Update",
//             description: "Sent a follow-up email regarding the project.",
//             emailTo: "client@example.com",
//             cc: ["manager@example.com"],
//             bcc: ["teamlead@example.com"],
//             scheduleFrom: "30 Aug 2024, 5:10 AM",
//             createdBy: "Example",
//         },
//         {
//             type: "call",
//             mainType: "Enquiry",
//             title: "Client Discussion",
//             description: "Discussed pricing strategy.",
//             participants: ["Client", "Manager"],
//             scheduleFrom: "29 Aug 2024, 2:00 PM",
//             scheduleTo: "29 Aug 2024, 2:30 PM",
//             location: "Zoom",
//             createdBy: "Manager",
//         },
//     ];

//     // Map type to corresponding icons
//     const typeIcons = {
//         feildvisit: <p className="feildvisit text-center rounded-full p-2">{icons.feildvisit}</p>,
//         call: <p className="call text-center rounded-full p-2 activity">{icons.call}</p>,
//         whatsapp: <p className="meeting text-center rounded-full p-2">{icons.whatsapp}</p>,
//         files: <p className="file text-center rounded-full p-2">{icons.file}</p>,
//         email: <p className="mail text-center rounded-full p-2">{icons.mail}</p>,
//         notes: <p className="notes text-center rounded-full p-2">{icons.note}</p>,

//     };

//     const steps = [
//         'New',
//         'Follow Up',
//         'Prospect',
//         'Negotiation',
//         'Won/Lost',
//     ];
//     const handleModalClose = () => setIsModalOpenActivity(false);
//     const handleNoteModelClose =() => setIsModalOpenNotes(false)
//     const handleStepChange = (stepIndex) => {
//         
//     };
//     const filteredData =
//         activeTab === "all"
//             ? data
//             : data.filter((item) => item.type === activeTab);

//     const renderEntry = (entry) => {
//         return (
//             <div key={entry.title} className="p-4 border rounded-lg mb-4 bg-gray-50 flex items-start">
//                 <div className="mr-4 text-2xl">
//                     {typeIcons[entry.type]}
//                 </div>
//                 <div>
//                     <h3 className="font-semibold text-lg">{entry.mainType}</h3>

//                     {/* <h3 className="font-semibold text-lg">{entry.title}</h3> */}
//                     <p className="text-sm text-gray-600">{entry.description}</p>
//                     {entry.type === "files" && (
//                         <>
//                             <p className="text-sm flex items-center">
//                                 <label className="text-base">{icons.filepin}</label>
//                                 <a href={entry.file} target="_blank" rel="noopener noreferrer" className="text-blue underline">
//                                     {entry.name}
//                                 </a>
//                             </p>
//                         </>
//                     )}
//                     {entry.type === "email" && (
//                         <>
//                             <p className="text-sm">
//                                 <label>Subject:</label> {entry.subject}
//                             </p>
//                             <p className="text-sm">
//                                 <label>To:</label> {entry.emailTo}
//                             </p>
//                             <p className="text-sm">
//                                 <label>CC:</label> {entry.cc.join(", ")}
//                             </p>
//                             <p className="text-sm">
//                                 <label>BCC:</label> {entry.bcc.join(", ")}
//                             </p>
//                         </>
//                     )}

//                     {entry.location && (
//                         <p className="text-sm">
//                             <label>Location:</label> {entry.location}
//                         </p>
//                     )}
//                     {/* Display attachments for WhatsApp type */}
//                     {entry.attachments && entry.type === "whatsapp" && (
//                         <div className="">
//                             {entry.attachments.map((attachment, idx) => (
//                                 <div key={idx} className="flex items-center">
//                                     {/* {attachment.type === "image" && (
//                                     <img
//                                         src={attachment.file}
//                                         alt={attachment.description}
//                                         className="w-20 h-20 object-cover rounded-md"
//                                     />
//                                 )} */}
//                                     {attachment.type === "file" && (
//                                         <p className="text-sm flex items-center">
//                                             <label className="text-base">{icons.filepin}</label>
//                                             <a
//                                                 href={attachment.file}
//                                                 target="_blank"
//                                                 rel="noopener noreferrer"
//                                                 className="text-blue underline"
//                                             >
//                                                 {attachment.description}
//                                             </a>
//                                         </p>
//                                     )}
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                     <p className="text-sm">
//                         <label>Schedule:</label> {entry.scheduleFrom}
//                         {entry.scheduleTo && ` - ${entry.scheduleTo}`}, by {entry.createdBy}
//                     </p>
//                 </div>
//             </div>
//         );
//     };

//     ///////////////////////////////////////////////////////////////////////////////////////////////////////

//     // Handle primary option change
//     const handlePrimaryOptionChange = (option) => {
//         setPrimaryOption(option);
//         if (option === "Enquiry") {
//             setEnquiryOption("Call"); // Default to Call for Enquiry
//         } else if (option === "Quotation") {
//             setEnquiryOption("WhatsApp"); // Default to WhatsApp for Quotation
//         }
//     };
//     // Handle Enquiry dropdown change
//     const handleEnquiryOptionChange = (option) => {
//         setEnquiryOption(option);
//     };

//     // Render form based on primary option and enquiry dropdown
//     const renderForm = () => {
//         if (primaryOption === "Enquiry") {
//             switch (enquiryOption) {
//                 case "Call":
//                     return (
//                         <VerticalForm>
//                             <FormInput id="title" label="Title" validation={{ required: "Title is required" }} />
//                             <TextArea id="description" label="Description" validation={{ required: "Description is required" }} />
//                             <div className="flex gap-x-2">
//                                 <FormInput id="schedule_time" label="Schedule Time" type="datetime-local" />
//                                 <FormInput id="created_by" label="Assigned By" />
//                             </div>
//                         </VerticalForm>
//                     );
//                 case "WhatsApp":
//                     return (
//                         <VerticalForm>
//                             <FormInput id="title" label="Title" validation={{ required: "Title is required" }} />
//                             <TextArea id="description" label="Description" />
//                             <FormInput id="file" label="File" type="file" />
//                             <div className="flex gap-x-2">
//                                 <FormInput id="schedule_time" label="Schedule Time" type="datetime-local" />
//                                 <FormInput id="created_by"  label="Assigned By" />
//                             </div>
//                         </VerticalForm>
//                     );
//                 case "Mail":
//                     return (
//                         <VerticalForm>
//                             <div className="flex gap-x-2">
//                                 <FormInput id="to" label="To" />
//                                 <FormInput id="from" label="From" /></div>
//                             <div className="flex gap-x-2">
//                                 <FormInput id="title" label="Title" validation={{ required: "Title is required" }} />
//                                 <FormInput id="subject" label="Subject" />
//                             </div>
//                             <TextArea id="description" label="Description" />
//                             <div className="flex gap-x-2">
//                                 <FormInput id="cc" label="CC" />
//                                 <FormInput id="bcc" label="BCC" />
//                             </div>
//                             <FormInput id="file" label="File" type="file" />
//                             <div className="flex gap-x-2">
//                                 <FormInput id="schedule_time" label="Schedule Time" type="datetime-local" />
//                                 <FormInput id="created_by"  label="Assigned By" />
//                             </div>
//                         </VerticalForm>
//                     );
//                 default:
//                     return null;
//             }
//         } else if (primaryOption === "Field Visit") {
//             return (
//                 <VerticalForm>
//                     <FormInput id="title" label="Title" validation={{ required: "Title is required" }} />
//                     <FormInput id="address" label="Address" />
//                     <TextArea id="description" label="Description" />
//                     <div className="flex gap-x-2">
//                         <FormInput id="schedule_time" label="Schedule Time" type="datetime-local" />
//                         <FormInput id="created_by"  label="Assigned By" />
//                     </div>
//                 </VerticalForm>
//             );
//         } else if (primaryOption === "Quotation") {
//             switch (enquiryOption) {
//                 case "WhatsApp":
//                     return (
//                         <VerticalForm>
//                             <FormInput id="title" label="Title" validation={{ required: "Title is required" }} />
//                             <TextArea id="description" label="Description" />
//                             <FormInput id="file" label="File" type="file" />
//                             <div className="flex gap-x-2">
//                                 <FormInput id="schedule_time" label="Schedule Time" type="datetime-local" />
//                                 <FormInput id="created_by"  label="Assigned By" />
//                             </div>
//                         </VerticalForm>
//                     );
//                 case "Mail":
//                     return (
//                         <VerticalForm>
//                             <div className="flex gap-x-2">
//                                 <FormInput id="to" label="To" />
//                                 <FormInput id="from" label="From" />
//                             </div>
//                             <div className="flex gap-x-2">
//                                 <FormInput id="title" label="Title" validation={{ required: "Title is required" }} />
//                                 <FormInput id="subject" label="Subject" />
//                             </div>
//                             <TextArea id="description" label="Description" />
//                             <div className="flex gap-x-2">
//                                 <FormInput id="cc" label="CC" />
//                                 <FormInput id="bcc" label="BCC" />
//                             </div>
//                             <FormInput id="file" label="File" type="file" />
//                             <div className="flex gap-x-2">
//                                 <FormInput id="schedule_time" label="Schedule Time" type="datetime-local" />
//                                 <FormInput id="created_by"  label="Assigned By" />
//                             </div>
//                         </VerticalForm>
//                     );
//                 default:
//                     return null;
//             }
//         }
//     };

//     return (
//         <div className="min-h-screen p-1">
//             {toastData?.show && <AlertNotification
//                 show={toastData?.show}
//                 message={toastData?.message}
//                 type={toastData?.type}
//                 onClose={toastOnclose}
//             />}
//             <Breadcrumb items={breadcrumbItems} className="p-0" />
//             <div className="border rounded-lg p-6 bg-white darkCardBg">
//                 <div className="grid grid-cols-1 lg:grid-cols-[1fr,2fr] gap-3 mb-6">
//                     <div className="bg-white p-4 rounded-lg border darkCardBg">
//                         <div className="space-y-4">
//                             <div className="flex justify-between">
//                                 <div className="flex items-center">
//                                     <p className="button pointer-events-none rounded-full h-8 w-8 flex items-center text-2xl justify-center text-white me-2">
//                                         A
//                                     </p>
//                                     <p className="text-2xl font-semibold grid">
//                                         {lead.lead_name || "John Doe"}
//                                         <span className="text-sm">{lead.lead_id || "LDID033"}</span>

//                                     </p>

//                                 </div>
//                                 <div className="flex gap-3 justify-end">
//                                     <button
//                                         type="button"
//                                         data-tooltip-id="edit-customer-btn"
//                                         className=""
//                                         onClick={() => navigate("/user/crm/lead/update-lead", { state: lead })}
//                                     >
//                                         {React.cloneElement(icons.editIcon, { size: 20 })}
//                                     </button>
//                                     <button
//                                         type="button"
//                                         data-tooltip-id="delete-customer-btn"
//                                         onClick={() => handleLeadDelete(lead)}
//                                         className=" text-red-500"
//                                         title="Delete Lead"
//                                     >
//                                         {React.cloneElement(icons.deleteIcon, { size: 20 })}
//                                     </button>
//                                 </div>
//                             </div>
//                             <div className="mt-0 ms-10 callDetail">
//                                             <p className="flex items-center pe-2">{icons.mail} <span className="ms-2 text-sm"> {lead.email || "john.doe@example.com"} </span></p>
//                                             <p className="flex items-center  pe-2">{icons.call} <span className="ms-2 text-sm">{lead.lead_contact || "+1 234 567 890"}</span></p>
//                                             <p className="flex items-center ">{icons.whatsapp} <span className="ms-2 text-sm">{lead.whatsapp_contact || "+1 234 567 890"}</span></p>
//                                         </div>
//                             {/* Lead details */}
//                             <div className="grid">
//                                 <div>
//                                     <label className="block text-sm font-medium">Stages</label>
//                                     <div className="flex items-center justify-between">
//                                         <div className="flex items-center">
//                                             <StatusManager status="warning" className="me-2" message="Enquiry" />
//                                             <StatusManager status="success" message="Active" />
//                                             <p className="ms-3" data-tooltip-id="tag">{icons.tag}</p>
//                                         </div>
//                                         <div className="flex gap-2 ">
//                                             <div className="grid p-2 justify-items-center text-center rounded-full mail"
//                                                 data-tooltip-id="mail"
//                                             >
//                                                 {icons.mail}
//                                                 {/* Mail */}
//                                             </div>
//                                             <div className="grid p-2 justify-items-center text-center rounded-full file"
//                                                 data-tooltip-id="file"
//                                                 >
//                                                 {icons.file}
//                                                 {/* File */}
//                                             </div>
//                                             <div className="grid p-2 justify-items-center text-center rounded-full note"
//                                                 data-tooltip-id="note"
//                                                 onClick={() => setIsModalOpenNotes(true)} >
//                                                 {icons.note}
//                                                 {/* Note */}
//                                             </div>
//                                             <div
//                                                 className="grid p-2 justify-items-center activity text-center rounded-full "
//                                                 data-tooltip-id="activity"
//                                                 onClick={() => setIsModalOpenActivity(true)} >
//                                                 {icons.GoNote}
//                                                 {/* Activity */}
//                                             </div>
//                                         </div>
//                                         </div>
//                                 </div>
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium">Purpose</label>
//                                 <p className="">{lead.lead_purpose || "Discuss potential partnership"}</p>
//                             </div>
//                             <hr />
//                             <div>
//                                 About Lead
//                                 <div className="flex items-center">
//                                     <label className="block text-sm font-medium">Lead Value: </label>
//                                     <p>{lead.value || "Rs 15,0000.0000"}</p></div>
//                                 <div className="flex items-center">
//                                     <label className="block text-sm font-medium">Incharge: </label>
//                                     <p>{lead.type || "owner"}</p> </div>
//                                 <div className="flex items-center">
//                                     <label className="block text-sm font-medium">Last Follow-Up Date:</label>
//                                     <p>{lead.last_followup || "15-11-2024"}</p></div>
//                                 <div className="flex items-center">
//                                     <label className="block text-sm font-medium">Next Follow-Up Date:</label>
//                                     <p>{lead.next_followup || "20-11-2024"}</p></div>

//                             </div>

//                             {/* <div>
//                                 <label className="block text-sm font-medium">Address</label>
//                                 <p className=""> {lead.door_no || "N/A"}, {lead.main_location || "N/A"}, {lead.district_name || "N/A"}, {lead.state_name || "N/A"}, {lead.pincode || "N/A"}</p>
//                             </div> */}
//                         </div>
//                     </div>
//                     {/* Tab content */}

//                     <div className="">
//                     <Stepper steps={steps} onStepChange={handleStepChange} />
//                     <div className="bg-white p-4 border rounded-lg darkCardBg">
//                         <div className="space-y-4">
//                             {/* Tab Navigation */}
//                             <nav className="flex border-b border-gray-300 mb-4 text-lg overflow-x-auto">
//                                 {[
//                                     "all",
//                                     "call",
//                                     "files",
//                                     "email",
//                                     "whatsapp",
//                                     "feildvisit",
//                                     "notes"
//                                 ].map((tab) => (
//                                     <button
//                                         key={tab}
//                                         className={`px-4 py-2 text-left whitespace-nowrap ${activeTab === tab ? "font-semibold" : ""
//                                             }`}
//                                         style={{
//                                             color:
//                                                 activeTab === tab
//                                                     ? "var(--primary-color)"
//                                                     : "inherit",
//                                             borderBottom:
//                                                 activeTab === tab
//                                                     ? "2px solid var(--primary-color)"
//                                                     : "none",
//                                         }}
//                                         onClick={() => setActiveTab(tab)}
//                                     >
//                                         {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                                     </button>
//                                 ))}
//                             </nav>

//                             {/* Tab Content */}
//                             <div>
//                                 {filteredData.length > 0 ? (
//                                     filteredData.map((entry) => renderEntry(entry))
//                                 ) : (
//                                     <p className="text-gray-500">No data available for this tab.</p>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div></div>
//             <Modal
//                 isOpen={isModalOpen}
//                 onClose={() => setIsModalOpen(false)} // Using onClose to handle modal close
//                 title="Delete Lead"
//                 showFooter={true}
//                 footerButtons={[

//                     {
//                         text: "Cancel",
//                         onClick: () => setIsModalOpen(false),
//                         className: "cancel-btn"
//                     },
//                     {
//                         text: "Delete",
//                         onClick: deleteLead,
//                         className: "bg-red-500 text-white p-2 rounded"
//                     }
//                 ]}
//             >
//                 <p>Are you sure you want to delete this lead?</p>
//             </Modal>
//             {/* activity from */}
//             <Modal
//                 isOpen={isModalOpenActivity}
//                 onClose={handleModalClose}
//                 title={
//                     primaryOption === "Enquiry" ? (
//                         <div className="modal-header">
//                             <span>Add Activity (Enquiry)</span>
//                             <select
//                                 value={enquiryOption}
//                                 onChange={(e) => handleEnquiryOptionChange(e.target.value)}
//                                 style={{ marginLeft: "10px" }}
//                             >
//                                 <option value="Call">Call</option>
//                                 <option value="WhatsApp">WhatsApp</option>
//                                 <option value="Mail">Mail</option>
//                             </select>
//                         </div>
//                     ) : primaryOption === "Field Visit" ? (
//                         "Add Activity (Field Visit)"
//                     ) : primaryOption === "Quotation" ? (
//                         <div className="modal-header">
//                             <span>Add Activity (Quotation)</span>
//                             <select
//                                 value={enquiryOption}
//                                 onChange={(e) => handleEnquiryOptionChange(e.target.value)}
//                                 style={{ marginLeft: "10px" }}
//                             >
//                                 <option value="WhatsApp">WhatsApp</option>
//                                 <option value="Mail">Mail</option>
//                             </select>
//                         </div>
//                     ) : "Add Activity"
//                 }
//                 showHeader={true}
//                 showFooter={false}
//                 size="m"
//                 closeButtonText="Dismiss"
//             >
//                 {/* Primary options or dynamic forms */}
//                 {!primaryOption ? (
//                     <div className="options flex justify-around">
//                         <button className="primaryOption" onClick={() => handlePrimaryOptionChange("Enquiry")}>
//                          {icons.enquiry}   Enquiry
//                         </button>
//                         <button className="primaryOption" onClick={() => handlePrimaryOptionChange("Field Visit")}>
//                           {icons.feildvisit}  Field Visit
//                         </button>
//                         <button className="primaryOption" onClick={() => handlePrimaryOptionChange("Quotation")}>
//                           {icons.quotationIcon}  Quotation
//                         </button>
//                     </div>
//                 ) : (
//                     <div>
//                         {/* Render form based on selection */}
//                         {renderForm()}

//                         {/* Back button to reset to primary options */}
//                         <button className="text-blue absolute -mt-8 underline flex items-center" onClick={() => setPrimaryOption(null)}>{icons.backarrow} Back</button>
//                     </div>
//                 )}
//             </Modal>
//             {/* activity end form */}
//             {/* note model */}
//             <Modal
//                 isOpen={isModalOpenNotes}
//                 onClose={handleNoteModelClose}
//                 title=""
//                 showHeader={true}
//                 showFooter={false}
//                 size="m"
//                 closeButtonText="Dismiss"
//             >
//                 <div>
//                     dsjzcxksdnxkcz
//                 </div>
//             </Modal>
//             {/* end note model */}
//             <ReactTooltip id="edit-customer-btn" place="bottom" content="Edit Lead" />
//             <ReactTooltip id="delete-customer-btn" place="bottom" content="Delete Lead" />
//             <ReactTooltip id="mail" place="bottom" content="Mail" />
//             <ReactTooltip id="file" place="bottom" content="File" />
//             <ReactTooltip id="note" place="bottom" content="Note" />
//             <ReactTooltip id="activity" place="bottom" content="Activity" />
//             <ReactTooltip id="tag" place="top" content="Tag" />
//         </div>
//     );
// };

// export default LeadDetail;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { showLeadEffect } from "../../../../redux/CRM/lead/LeadEffects";
import StatusManager from "../../../../UI/StatusManager/StatusManager";
import Breadcrumb from "../../../../UI/Breadcrumps/Breadcrumps";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "./Lead.css";
import icons from "../../../../contents/Icons";
import { validationPatterns } from "../../../../utils/Validation";

import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../../UI/Modal/Modal";
import {
  deleteLeadInprogress,
  getLeadListInProgress,
  getLeadSourceListInprogress,
  getLeadStageListInprogress,
} from "../../../../redux/CRM/lead/LeadActions";
import AlertNotification from "../../../../UI/AlertNotification/AlertNotification";
import Stepper from "../../../../UI/Stepper/Stepper";
import FormInput from "../../../../UI/Input/FormInput/FormInput";
import { useForm } from "react-hook-form";
import VerticalForm from "../../../../UI/Form/VerticalForm";
import TextArea from "../../../../UI/Input/TextArea/TextArea";
const LeadDetail = () => {
  const { uuid } = useParams();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [toastData, setToastData] = useState({ show: false });
  const [deleteLeadData, setDeleteLeadData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModalOpenActivity, setIsModalOpenActivity] = useState(false);
  const [primaryOption, setPrimaryOption] = useState("Enquiry"); // null by default
  const [enquiryOption, setEnquiryOption] = useState("Call");
  const [isModalOpenNotes, setIsModalOpenNotes] = useState(false);
  const [stageList, setStageList] = useState([]);
  const [sourceList, setSourceList] = useState([]);
  const {leadStageList,leadSourceList} =useSelector(state=>state.lead)

  // Fetch lead details when the component mounts
  useEffect(() => {
    const fetchLeadDetails = async () => {
      try {
        const response = await showLeadEffect({ uuid });
        setLead(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching lead details");
      } finally {
        setLoading(false);
      }
    };
    fetchLeadDetails();
  }, [uuid]);

  useEffect(()=>{
    if(leadStageList?.data?.length==0){
      dispatch(getLeadStageListInprogress({}))
    }
    if(leadSourceList?.data?.length==0){
      dispatch(getLeadSourceListInprogress({}))
    }

  },[])
  useEffect(()=>{
   
    setStageList(leadStageList.data.map((list) => ({
      label: list.lead_pipline_stages,
      value: list.id,
    })))

  },[leadStageList])
  useEffect(()=>{
    setSourceList(leadSourceList.data.map((list) => ({
      label: list.lead_source,
      value: list.id,
    })))

  },[leadSourceList])
  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 2, label: "Lead", link: "/user/crm/lead" },
    { id: 3, label: "Lead Detail" },
  ];

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!lead) {
    return <p>No lead data found.</p>;
  }

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

  const handleLeadDelete = (rowData) => {
    setDeleteLeadData(rowData);
    setIsModalOpen(true);
  };

  const toastOnclose = () => {
    setToastData({ ...toastData, show: false });
  };

  const data = [
    {
      type: "whatsapp",
      mainType: "Quotation",
      title: "Client Inquiry",
      description: "Discussed new product options.",
      participants: ["Client", "Sales Rep"],
      scheduleFrom: "1 Sep 2024, 11:30 AM",
      scheduleTo: "1 Sep 2024, 12:00 PM",
      location: "WhatsApp",
      createdBy: "Sales Rep",
      attachments: [
        {
          type: "image",
          file: "/path/to/image.jpg",
          description: "Image of product",
        },
        {
          type: "file",
          file: "/path/to/quotation.pdf",
          description: "Quotation PDF",
        },
      ],
    },

    {
      type: "feildvisit",
      mainType: "Field visit",
      title: "Team Feedback",
      description: "Discussed the project requirements.",
      participants: ["Alice", "Bob"],
      scheduleFrom: "30 Aug 2024, 3:10 AM",
      scheduleTo: null,
      location: null,
      createdBy: "manager",
    },

    {
      type: "files",
      mainType: "Enquiry",
      title: "Project Plan",
      description: "Uploaded the detailed project plan.",
      name: "project_plan.pdf",
      file: "/path/to/project_plan.pdf",
      scheduleFrom: "30 Aug 2024, 5:10 AM",
      createdBy: "Example",
    },
    {
      type: "notes",
      mainType: " ",
      title: "Project Notes",
      description: "Uploaded the detailed project plan notes.",
      scheduleFrom: "30 Aug 2024, 5:10 AM",
      createdBy: "Ram",
    },
    {
      type: "email",
      title: "Enquiry",
      mainType: "Enquiry",
      subject: "Project Update",
      description: "Sent a follow-up email regarding the project.",
      emailTo: "client@example.com",
      cc: ["manager@example.com"],
      bcc: ["teamlead@example.com"],
      scheduleFrom: "30 Aug 2024, 5:10 AM",
      createdBy: "Example",
    },
    {
      type: "call",
      mainType: "Enquiry",
      title: "Client Discussion",
      description: "Discussed pricing strategy.",
      participants: ["Client", "Manager"],
      scheduleFrom: "29 Aug 2024, 2:00 PM",
      scheduleTo: "29 Aug 2024, 2:30 PM",
      location: "Zoom",
      createdBy: "Manager",
    },
  ];

  // Map type to corresponding icons
  const typeIcons = {
    feildvisit: (
      <p className="feildvisit text-center rounded-full p-2">
        {icons.feildvisit}
      </p>
    ),
    call: (
      <p className="call text-center rounded-full p-2 activity">{icons.call}</p>
    ),
    whatsapp: (
      <p className="meeting text-center rounded-full p-2">{icons.whatsapp}</p>
    ),
    files: <p className="file text-center rounded-full p-2">{icons.file}</p>,
    email: <p className="mail text-center rounded-full p-2">{icons.mail}</p>,
    notes: <p className="notes text-center rounded-full p-2">{icons.note}</p>,
  };

  const steps = ["New", "Follow Up", "Prospect", "Negotiation", "Won/Lost"];
  const handleModalClose = () => setIsModalOpenActivity(false);
  const handleNoteModelClose = () => setIsModalOpenNotes(false);
  const handleStepChange = (stepIndex) => {
    // 
  };
  const filteredData =
    activeTab === "all" ? data : data.filter((item) => item.type === activeTab);

  const renderEntry = (entry) => {
    return (
      <div
        key={entry.title}
        className="p-4 border rounded-lg mb-4 bg-gray-50 flex items-start"
      >
        <div className="mr-4 text-2xl">{typeIcons[entry.type]}</div>
        <div>
          <h3 className="font-semibold text-lg">{entry.mainType}</h3>

          {/* <h3 className="font-semibold text-lg">{entry.title}</h3> */}
          <p className="text-sm text-gray-600">{entry.description}</p>
          {entry.type === "files" && (
            <>
              <p className="text-sm flex items-center">
                <label className="text-base">{icons.filepin}</label>
                <a
                  href={entry.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue underline"
                >
                  {entry.name}
                </a>
              </p>
            </>
          )}
          {entry.type === "email" && (
            <>
              <p className="text-sm">
                <label>Subject:</label> {entry.subject}
              </p>
              <p className="text-sm">
                <label>To:</label> {entry.emailTo}
              </p>
              <p className="text-sm">
                <label>CC:</label> {entry.cc.join(", ")}
              </p>
              <p className="text-sm">
                <label>BCC:</label> {entry.bcc.join(", ")}
              </p>
            </>
          )}

          {entry.location && (
            <p className="text-sm">
              <label>Location:</label> {entry.location}
            </p>
          )}
          {/* Display attachments for WhatsApp type */}
          {entry.attachments && entry.type === "whatsapp" && (
            <div className="">
              {entry.attachments.map((attachment, idx) => (
                <div key={idx} className="flex items-center">
                  {/* {attachment.type === "image" && (
                                    <img
                                        src={attachment.file}
                                        alt={attachment.description}
                                        className="w-20 h-20 object-cover rounded-md"
                                    />
                                )} */}
                  {attachment.type === "file" && (
                    <p className="text-sm flex items-center">
                      <label className="text-base">{icons.filepin}</label>
                      <a
                        href={attachment.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue underline"
                      >
                        {attachment.description}
                      </a>
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
          <p className="text-sm">
            <label>Schedule:</label> {entry.scheduleFrom}
            {entry.scheduleTo && ` - ${entry.scheduleTo}`}, by {entry.createdBy}
          </p>
        </div>
      </div>
    );
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////

  // Handle primary option change
  const handlePrimaryOptionChange = (option) => {
    setPrimaryOption(option);
    if (option === "Enquiry") {
      setEnquiryOption("Call"); // Default to Call for Enquiry
    } else if (option === "Quotation") {
      setEnquiryOption("WhatsApp"); // Default to WhatsApp for Quotation
    }
  };
  // Handle Enquiry dropdown change
  const handleEnquiryOptionChange = (option) => {
    setEnquiryOption(option);
  };

  const ScheduleTimeGroup = ({ register, errors, prefix = "" }) => (
    <div className="flex gap-x-2">
      <FormInput
        id={`${prefix}schedule_time`}
        label="Schedule Time"
        type="datetime-local"
        validation={{ required: "Time is required" }}
        register={register}
        errors={errors}
      />
      <FormInput
        id={`${prefix}created_by`}
        label="Assigned By"
        validation={{ required: "Assigned by is required" }}
        register={register}
        errors={errors}
      />
    </div>
  );
  const FORM_CONFIG = {
    Enquiry: {
      Call: [
        <FormInput
          id="title"
          label="Title"
          validation={{ required: "Title is required" }}
        />,
        <TextArea
          id="description"
          label="Description"
          validation={{ required: "Description is required" }}
        />,
        <ScheduleTimeGroup />,
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
        <ScheduleTimeGroup />,
        <p className="font-semibold mt-2">Next Due Details</p>,
        <ScheduleTimeGroup prefix="next-" />,
      ],
      Mail: [
        <div className="flex gap-x-2">
          <FormInput id="to" label="To" />,
          <FormInput id="from" label="From" />
        </div>,
        <div className="flex gap-x-2">
          <FormInput
            id="title"
            label="Title"
            validation={{ required: "Title is required" }}
          />
          ,
          <FormInput id="subject" label="Subject" />
        </div>,
        <div className="flex gap-x-2">
          <FormInput id="cc" label="CC" />,
          <FormInput id="bcc" label="BCC" />
        </div>,
        <div className="flex gap-x-2">
          <TextArea id="description" label="Description" />,
          <FormInput id="file" label="File" type="file" />
        </div>,
        <ScheduleTimeGroup />,
        <p className="font-semibold mt-2">Next Due Details</p>,
        <ScheduleTimeGroup prefix="next-" />,
      ],
    },
    "Field Visit": [
      <FormInput
        id="title"
        label="Title"
        validation={{ required: "Title is required" }}
      />,
      <FormInput id="address" label="Address" />,
      <TextArea id="description" label="Description" />,
      <ScheduleTimeGroup />,
      <p className="font-semibold mt-2">Next Due Details</p>,
      <ScheduleTimeGroup prefix="next-" />,
    ],
    Quotation: {
      WhatsApp: [
        <TextArea id="description" label="Description" />,
        <FormInput id="file" label="File" type="file" />,
        <ScheduleTimeGroup />,
        <p className="font-semibold mt-2">Next Due Details</p>,
        <ScheduleTimeGroup prefix="next-" />,
      ],
      Mail: [
        <div className="flex gap-x-2">
          <FormInput id="to" label="To" />,
          <FormInput id="from" label="From" />
        </div>,
        <div className="flex gap-x-2">
          <FormInput
            id="title"
            label="Title"
            validation={{ required: "Title is required" }}
          />
          ,
          <FormInput id="subject" label="Subject" />
        </div>,
        <div className="flex gap-x-2">
          <FormInput id="cc" label="CC" />,
          <FormInput id="bcc" label="BCC" />
        </div>,
        <div className="flex gap-x-2">
          <TextArea id="description" label="Description" />,
          <FormInput id="file" label="File" type="file" />
        </div>,
        <ScheduleTimeGroup />,
        <p className="font-semibold mt-2">Next Due Details</p>,
        <ScheduleTimeGroup prefix="next-" />,
      ],
    },
  };

  const renderForm = (primaryOption, enquiryOption) => {
    const config = FORM_CONFIG[primaryOption];
    return Array.isArray(config) ? config : config?.[enquiryOption] || null;
  };

  const handleSubmit = (data) => {
    const payload ={
      ...data,
      primaryOption,
      enquiryOption
    }
    
  };

  return (
    <div className="min-h-screen p-1">
      {toastData?.show && (
        <AlertNotification
          show={toastData?.show}
          message={toastData?.message}
          type={toastData?.type}
          onClose={toastOnclose}
        />
      )}
      <Breadcrumb items={breadcrumbItems} className="p-0" />
      <div className="border rounded-lg p-6 bg-white darkCardBg">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,2fr] gap-3 mb-6">
          <div className="bg-white p-4 rounded-lg border darkCardBg">
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <p className="button pointer-events-none rounded-full h-8 w-8 flex items-center text-2xl justify-center text-white me-2">
                    A
                  </p>
                  <p className="text-2xl font-semibold grid">
                    {lead.lead_name || "John Doe"}
                    <span className="text-sm">{lead.lead_id || "LDID033"}</span>
                  </p>
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    data-tooltip-id="edit-customer-btn"
                    className=""
                    onClick={() =>
                      navigate("/user/crm/lead/update-lead", { state: lead })
                    }
                  >
                    {React.cloneElement(icons.editIcon, { size: 20 })}
                  </button>
                  <button
                    type="button"
                    data-tooltip-id="delete-customer-btn"
                    onClick={() => handleLeadDelete(lead)}
                    className=" text-red-500"
                    title="Delete Lead"
                  >
                    {React.cloneElement(icons.deleteIcon, { size: 20 })}
                  </button>
                </div>
              </div>
              <div className="mt-1 ms-10 callDetail flex gap-3">
                <p className="flex items-center pe-2">
                  {icons.mail}{" "}
                  <span className="ms-2 text-sm">
                    {" "}
                    {lead.email || "john.doe@example.com"}{" "}
                  </span>
                </p>
                <p className="flex items-center  pe-2">
                  {icons.call}{" "}
                  <span className="ms-2 text-sm">
                    {lead.lead_contact || "+1 234 567 890"}
                  </span>
                </p>
                <p className="flex items-center ">
                  {icons.whatsapp}{" "}
                  <span className="ms-2 text-sm">
                    {lead.whatsapp_contact || "+1 234 567 890"}
                  </span>
                </p>
              </div>
              {/* Lead details */}
              <div className="grid">
                <div>
                  <label className="block text-sm font-medium">Stages</label>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <StatusManager
                        status="warning"
                        className="me-2"
                        message="Enquiry"
                      />
                      <StatusManager status="success" message="Active" />
                      <p className="ms-3" data-tooltip-id="tag">
                        {icons.tag}
                      </p>
                    </div>
                    <div className="flex gap-2 ">
                      <div
                        className="grid p-2 justify-items-center text-center rounded-full mail"
                        data-tooltip-id="mail"
                      >
                        {icons.mail}
                        {/* Mail */}
                      </div>
                      <div
                        className="grid p-2 justify-items-center text-center rounded-full file"
                        data-tooltip-id="file"
                      >
                        {icons.file}
                        {/* File */}
                      </div>
                      <div
                        className="grid p-2 justify-items-center text-center rounded-full note"
                        data-tooltip-id="note"
                        onClick={() => setIsModalOpenNotes(true)}
                      >
                        {icons.note}
                        {/* Note */}
                      </div>
                      <div
                        className="grid p-2 justify-items-center activity text-center rounded-full "
                        data-tooltip-id="activity"
                        onClick={() => setIsModalOpenActivity(true)}
                      >
                        {icons.GoNote}
                        {/* Activity */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Purpose</label>
                <p className="">
                  {lead.lead_purpose || "Discuss potential partnership"}
                </p>
              </div>
              <hr />
              <div>
                About Lead
                <div className="flex items-center">
                  <label className="block text-sm font-medium">
                    Lead Value:{" "}
                  </label>
                  <p>{lead.value || "Rs 15,0000.0000"}</p>
                </div>
                <div className="flex items-center">
                  <label className="block text-sm font-medium">
                    Incharge:{" "}
                  </label>
                  <p>{lead.type || "owner"}</p>{" "}
                </div>
                <div className="flex items-center">
                  <label className="block text-sm font-medium">
                    Last Follow-Up Date:
                  </label>
                  <p>{lead.last_followup || "15-11-2024"}</p>
                </div>
                <div className="flex items-center">
                  <label className="block text-sm font-medium">
                    Next Follow-Up Date:
                  </label>
                  <p>{lead.next_followup || "20-11-2024"}</p>
                </div>
              </div>

              {/* <div>
                                <label className="block text-sm font-medium">Address</label>
                                <p className=""> {lead.door_no || "N/A"}, {lead.main_location || "N/A"}, {lead.district_name || "N/A"}, {lead.state_name || "N/A"}, {lead.pincode || "N/A"}</p>
                            </div> */}
            </div>
          </div>
          {/* Tab content */}

          <div className="">
            <Stepper steps={steps} onStepChange={handleStepChange} />
            <div className="bg-white p-4 border rounded-lg darkCardBg">
              <div className="space-y-4">
                {/* Tab Navigation */}
                <nav className="flex border-b border-gray-300 mb-4 text-lg overflow-x-auto">
                  {[
                    "all",
                    "call",
                    "files",
                    "email",
                    "whatsapp",
                    "feildvisit",
                    "notes",
                  ].map((tab) => (
                    <button
                      key={tab}
                      className={`px-4 py-2 text-left whitespace-nowrap ${
                        activeTab === tab ? "font-semibold" : ""
                      }`}
                      style={{
                        color:
                          activeTab === tab
                            ? "var(--primary-color)"
                            : "inherit",
                        borderBottom:
                          activeTab === tab
                            ? "2px solid var(--primary-color)"
                            : "none",
                      }}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>

                {/* Tab Content */}
                <div>
                  {filteredData.length > 0 ? (
                    filteredData.map((entry) => renderEntry(entry))
                  ) : (
                    <p className="text-gray-500">
                      No data available for this tab.
                    </p>
                  )}
                </div>
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
      {/* activity from */}
      <Modal
        isOpen={isModalOpenActivity}
        onClose={handleModalClose}
        title="Add Activity"
        showHeader={true}
        showFooter={false}
        size="m"
        closeButtonText="Dismiss"
      >
        <div>
          {/* Main Type Dropdown */}
          <div className="grid">
            <label>Main Type:</label>
            <select
              value={primaryOption}
              onChange={(e) => handlePrimaryOptionChange(e.target.value)}
              className="dropdown"
            >
              <option value="Enquiry">Enquiry</option>
              <option value="Field Visit">Field Visit</option>
              <option value="Quotation">Quotation</option>
            </select>
          </div>

          {/* Chips for Sub-Options */}
          {primaryOption === "Enquiry" && (
            <div className="chips-container flex gap-2 mb-4">
              <button
                className={`chip ${enquiryOption === "Call" ? "active" : ""}`}
                onClick={() => handleEnquiryOptionChange("Call")}
              >
                Call
              </button>
              <button
                className={`chip ${
                  enquiryOption === "WhatsApp" ? "active" : ""
                }`}
                onClick={() => handleEnquiryOptionChange("WhatsApp")}
              >
                WhatsApp
              </button>
              <button
                className={`chip ${enquiryOption === "Mail" ? "active" : ""}`}
                onClick={() => handleEnquiryOptionChange("Mail")}
              >
                Mail
              </button>
            </div>
          )}

          {primaryOption === "Quotation" && (
            <div className="chips-container flex gap-2 mb-4">
              <button
                className={`chip ${
                  enquiryOption === "WhatsApp" ? "active" : ""
                }`}
                onClick={() => handleEnquiryOptionChange("WhatsApp")}
              >
                WhatsApp
              </button>
              <button
                className={`chip ${enquiryOption === "Mail" ? "active" : ""}`}
                onClick={() => handleEnquiryOptionChange("Mail")}
              >
                Mail
              </button>
            </div>
          )}

          {/* Render Form Based on Selection */}
          {/* {renderForm()} */}
          <VerticalForm onSubmit={handleSubmit}>
            {renderForm(primaryOption, enquiryOption)}
          </VerticalForm>
        </div>
      </Modal>
      {/* activity end form */}
      {/* note model */}
      <Modal
        isOpen={isModalOpenNotes}
        onClose={handleNoteModelClose}
        title="Add Notes"
        showHeader={true}
        showFooter={false}
        size="m"
        closeButtonText="Dismiss"
      >
        <VerticalForm>
          <FormInput
            id="title"
            label="Title"
            validation={{ required: "Title is required" }}
          />
          <TextArea id="description" label="Description" />
          <div className="flex gap-x-2">
            <FormInput
              id="schedule_time"
              label="Schedule Time"
              type="datetime-local"
              validation={{ required: "Time is required" }}
            />
            <FormInput
              id="created_by"
              label="Assigned By"
              validation={{ required: "Assigned by is required" }}
            />
          </div>
        </VerticalForm>
      </Modal>
      {/* end note model */}
      <ReactTooltip id="edit-customer-btn" place="bottom" content="Edit Lead" />
      <ReactTooltip
        id="delete-customer-btn"
        place="bottom"
        content="Delete Lead"
      />
      <ReactTooltip id="mail" place="bottom" content="Mail" />
      <ReactTooltip id="file" place="bottom" content="File" />
      <ReactTooltip id="note" place="bottom" content="Note" />
      <ReactTooltip id="activity" place="bottom" content="Activity" />
      <ReactTooltip id="tag" place="top" content="Tag" />
    </div>
  );
};

export default LeadDetail;
