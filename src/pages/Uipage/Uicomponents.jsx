import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import FormInput from '../../UI/Input/FormInput/FormInput';
import Breadcrumb from "../../UI/Breadcrumps/Breadcrumps";
import Modal from '../../UI/Modal/Modal';
import CheckBoxInput from '../../UI/Input/CheckBoxInput/CheckBoxInput';
import VerticalForm from '../../UI/Form/VerticalForm';
import TextArea from '../../UI/Input/TextArea/TextArea';
import RadioInput from '../../UI/Input/RadioInput/RadioInput';
import ChooseFile from '../../UI/Input/ChooseFile/ChooseFile';
import AlertNotification from '../../UI/AlertNotification/AlertNotification'
import MultiSelect from '../../UI/Select/MultiSelect';
import SearchableSelect from '../../UI/Select/SearchableSelect';
import Accordion from '../../UI/Accordion/Accordion';
import TabsPills from '../../UI/TabsPills/TabsPills';
import ReusableAgGrid from '../../UI/AgGridTable/AgGridTable';
import StatusManager from '../../UI/StatusManager/StatusManager';
import Select from '../../UI/Select/SingleSelect';
import StatusFilter from '../../UI/AgGridTable/TypeFilter/TypeFilter';
import DateRangePickerComponent from '../../UI/AgGridTable/DateRangePickerComponent/DateRangePickerComponent';
import icons from "../../contents/Icons";
import IconButton from "../../UI/Buttons/IconButton/IconButton";
import { IoIosAdd } from "react-icons/io";
import ExportButton from '../../UI/AgGridTable/ExportBtn/ExportBtn';
import Card from '../../UI/Card/Card';
import FormCard from '../../UI/Card/FormCard/FormCard';
import { H1, H2, H3, H4, H5, H6 } from '../../UI/Heading/Heading';
import DropdownFilter from '../../UI/AgGridTable/TypeFilter/TypeFilter';
import ActionDropdown from '../../UI/AgGridTable/ActionDropdown/ActionDropdown';
import MessageCard from '../../UI/MessageCard/MessageCard';

export default function Uicomponents() {
  //Breadcrumb
  const breadcrumbItems = [
    { label: 'Home', link: '/user' },
    { label: 'Home', link: '/user' },
    { label: 'CRM Lead' },
  ];
  //model
  const [isModalOpen, setModalOpen] = useState(false);
  const handleModalClose = () => setModalOpen(false);

  //cheackbox
  const [singleSelected, setSingleSelected] = useState([]);
  const [multiSelected, setMultiSelected] = useState([]);

  const options = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' }
  ];
  //forminput
  const onSubmit = async (data) => {
    // Simulate an API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
  };
  // Radio options
  // Use the useForm hook
  const { register, formState: { errors } } = useForm();
  const radioOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' }
  ];
  //fileupload
  const handleFileChange = (selectedFile) => {
    
  };
  const handleFileRemove = () => {
    
  };
  // AlertNotification
  const [showAlert, setShowAlert] = useState(false);

  const showAlertNotification = () => {
    setShowAlert(true);
  };

  const closeAlertNotification = () => {
    setShowAlert(false);
  };
  // selection
  const selectOptions = [
    { value: 'alaska', label: 'Alaska' },
    { value: 'hawaii', label: 'Hawaii' },
    { value: 'california', label: 'California' },
    { value: 'nevada', label: 'Nevada' },
    { value: 'oregon', label: 'Oregon' },
    { value: 'washington', label: 'Washington' },
  ];
  // const [singleSelectValue, setSingleSelectValue] = useState("");
  // const [selectedValues, setSelectedValues] = useState([]);
  // const [selectedValue, setSelectedValue] = useState('');
  //Accordion
  const items = [
    {
      title: 'Section 1',
      content: 'This is the content for section 1.'
    },
    {
      title: 'Section 2',
      content: 'This is the content for section 2.'
    },
    {
      title: 'Section 3',
      content: 'This is the content for section 3.'
    }
  ];
  //tabspills
  const tabsData = [
    {
      label: 'Home',
      content: (
        <>
          <p>Icing pastry pudding oat cake. Lemon drops cotton candy caramels cake caramels sesame snaps powder. Bear claw candy topping.</p>
          <p>Tootsie roll fruitcake cookie. Dessert topping pie. Jujubes wafer carrot cake jelly. Bonbon jelly-o jelly-o ice cream jelly beans candy canes cake bonbon. Cookie jelly beans marshmallow jujubes sweet.</p>
        </>
      )
    },
    { label: 'Profile', content: <p>Here’s your profile information.</p> },
    { label: 'Settings', content: <p>Adjust your preferences here.</p> },
  ];
  // table
  const [rowData, setRowData] = useState([]);
  const [paginationPageSize, setPaginationPageSize] = useState(10); // Default page size
  const statusOptions = [
    { value: 'All', label: 'All' },
    { value: 'Applied', label: 'Applied' },
    { value: 'Professional', label: 'Professional' },
    { value: 'Resigned', label: 'Resigned' },
    { value: 'Rejected', label: 'Rejected' },
  ];

  const statusMap = {
    Applied: 'info',
    Professional: 'success',
    Resigned: 'warning',
    Rejected: 'error',
  };
  const onFilterChanged = (filterModel) => {
    // Handle filter changes if needed
    
  };
  // Action
  const handleAction = (action) => {
    switch (action) {
      case 'view':
        
        break;
      case 'edit':
        
        break;
      case 'delete':
        
        break;
      default:
        
    }
  };
  const option = [
    { label: 'View', action: 'view', icon: icons.viewIcon },
    { label: 'Edit', action: 'edit', icon: icons.editIcon },
    { label: 'Delete', action: 'delete', icon: icons.deleteIcon },
  ];
  const columnDefs = [
    { headerName: 'Name', field: 'name', sortable: true, filter: true },
    { headerName: 'Email', field: 'email', sortable: true, filter: true },
    { headerName: 'Phone', field: 'phone', sortable: true, filter: true },
    { headerName: 'Contact Name', field: 'contactName', sortable: true, filter: true },
    { headerName: 'Company Name', field: 'companyName', sortable: true, filter: true },
    { headerName: 'Create Date', field: 'createDate', sortable: true, filter: true },
    {
      headerName: 'Status',
      field: 'status',
      sortable: false,
      filter: true,
      filterParams: {
        filterOptions: statusOptions.map(option => option.value),
      },
      cellRenderer: (params) => {
        const statusClass = statusMap[params.value] || 'info';
        return <StatusManager status={statusClass} message={params.value} />;
      },
    },
    {
      headerName: 'Action',
      field: 'action',
      cellRenderer: (params) => (
        <ActionDropdown options={option} onAction={handleAction}
        />
      ),
      pinned: 'right'
    }
  ];


  useEffect(() => {
    // Simulate fetching data
    const fetchData = () => {
      const data = [
        { name: "John Doe", email: "john.doe@example.com", phone: "123-456-7890", contactName: "Jane Smith", companyName: "Example Inc.", createDate: "2024-01-15", status: "Applied" },
        { name: "Jane Smith", email: "jane.smith@example.com", phone: "987-654-3210", contactName: "John Doe", companyName: "Example LLC", createDate: "2024-01-20", status: "Professional" },
        { name: "Alice Johnson", email: "alice.johnson@example.com", phone: "555-0123-4567", contactName: "Bob Brown", companyName: "Tech Solutions", createDate: "2024-01-25", status: "Resigned" },
        { name: "Bob Brown", email: "bob.brown@example.com", phone: "555-7654-3210", contactName: "Alice Johnson", companyName: "Tech Innovations", createDate: "2024-01-28", status: "Rejected" },
        { name: "Charlie Black", email: "charlie.black@example.com", phone: "444-321-0987", contactName: "David White", companyName: "Design Studio", createDate: "2024-02-01", status: "Applied" },
        { name: "David White", email: "david.white@example.com", phone: "444-654-1234", contactName: "Charlie Black", companyName: "Creative Solutions", createDate: "2024-02-05", status: "Rejected" },
        { name: "Emily Davis", email: "emily.davis@example.com", phone: "333-456-7890", contactName: "Frank Green", companyName: "Finance Corp", createDate: "2024-02-10", status: "Professional" },
        { name: "Frank Green", email: "frank.green@example.com", phone: "333-789-0123", contactName: "Emily Davis", companyName: "Wealth Management", createDate: "2024-02-15", status: "Resigned" },
        { name: "Grace Lee", email: "grace.lee@example.com", phone: "222-234-5678", contactName: "Hank Blue", companyName: "Marketing Agency", createDate: "2024-02-20", status: "Professional" },
        { name: "Grace Lee", email: "grace.lee@example.com", phone: "222-234-5678", contactName: "Hank Blue", companyName: "Marketing Agency", createDate: "2024-02-20", status: "Professional" },
        { name: "Grace Lee", email: "grace.lee@example.com", phone: "222-234-5678", contactName: "Hank Blue", companyName: "Marketing Agency", createDate: "2024-02-20", status: "Professional" },
        { name: "Grace Lee", email: "grace.lee@example.com", phone: "222-234-5678", contactName: "Hank Blue", companyName: "Marketing Agency", createDate: "2024-02-20", status: "Professional" },
      ];
      setRowData(data);
      setPaginationPageSize(10);
    };

    fetchData();
  }, []);
  // date range filter
  const [dates, setDates] = useState({
    startDate: null,
    endDate: null
  });
  const [focusedInput, setFocusedInput] = useState(null);
  const handleDatesChange = ({ startDate, endDate }) => {
    setDates({ startDate, endDate });
  }
  // 
  const handleSaveDateTime = (newDateTime) => {
    
  };
  return (
    <>
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
      </div>

      <p className='text-center text-xl'>Components</p>
      {/* Breadcrumb */}
      <p>Breadcrumb</p>
      <Breadcrumb items={breadcrumbItems} />
      {/* Modal */}
      <p>Modal</p>
      <div>
        <button onClick={() => setModalOpen(true)} className='button rounded-md text-white p-3'>Open Modal</button>
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title="Custom Modal"
          showHeader={true}
          showFooter={true}
          size="m"
          closeButtonText="Dismiss"
          footerButtons={[
            { text: "Cancel", onClick: handleModalClose, className: "cancel-btn" },
            { text: "Save", onClick: () => alert("Saved"), className: "save-btn" }
          ]}
        >
          <p>This is a customizable modal body!</p>
        </Modal>
      </div>
      {/* Checkbox */}
      <div className='py-3'>
        <h2>Single Select</h2>
        <CheckBoxInput
          options={options}
          selectedValues={singleSelected}
          onChange={setSingleSelected}
          isMultiSelect={false}
          validation={{ required: "You must select an option." }}
        />

        <h2>Multi Select</h2>
        <CheckBoxInput
          options={options}
          selectedValues={multiSelected}
          onChange={setMultiSelected}
          isMultiSelect={true}
          validation={{ required: "At least one option must be selected." }}
        />
      </div>
      {/* FormInput */}
      <VerticalForm onSubmit={onSubmit}>
        <FormInput
          id="firstName"
          label="First Name"
          placeholder="Enter your first name"
          validation={{ required: "First name is required" }}
        />
        <FormInput
          id="lastName"
          label="Last Name"
          placeholder="Enter your last name"
          validation={{ required: "Last name is required" }}
        />
        <TextArea
          id="description"
          label="Description"
          placeholder="Enter a description"
          validation={{ required: "Description is required" }}
        />
        <RadioInput
          id="gender"
          label="Gender"
          options={radioOptions}
          register={register}
          validation={{
            required: "Please select a gender",
          }}
          errors={errors}
        />
        <ChooseFile
          label="Choose a file"
          onChange={handleFileChange}
          onRemove={handleFileRemove}
          accept=".jpg,.png"
        />
      </VerticalForm>
      {/* AlertNotification */}
      <div className='py-3'>
        <h1>AlertNotification</h1>
        <button className='button text-white p-2' onClick={showAlertNotification}>Show Alert</button>
        {showAlert && (
          <AlertNotification
            show={true}
            message="This is an info alert!"
            type="info"
            onClose={closeAlertNotification}
            duration={9000}
          />
        )}
      </div>
      {/* Tabs&pills */}
      <div className="App">
        <h1 className='py-2'>Tabs</h1>
        <TabsPills tabs={tabsData} variant="tabs" />
      </div>
      {/* Accordion */}
      <div className='py-3'>
        <h1>Accordion Component</h1>
        <Accordion items={items} singleOpen={false} />
      </div>
      <div className='bg-white rounded-lg px-3 py-5 flex darkCardBg items-center justify-between'>
        <div className='flex items-center'>
          <div className='me-3'>
            <IconButton
              type="button"
              label="Create Lead"
              icon={IoIosAdd}  // Pass the icon component directly, not as an object
              iconPosition="left"
              className=""
            />
          </div>
          <div>
            <ExportButton label="Export" data={rowData} filename="my_data" />

          </div>
        </div>
        <div className='flex items-center'>
          <div class="flex items-center justify-center p-4">
            <div class="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search..."
                class="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                {icons.searchIcon}

              </div>
            </div>
          </div>
          <div>
            <DateRangePickerComponent className="darkCardBg"
              startDate={dates.startDate}
              endDate={dates.endDate}
              onDatesChange={handleDatesChange}
              focusedInput={focusedInput}
              onFocusChange={setFocusedInput}
            />
          </div>
        </div>
      </div>
      {/* table */}
      <div className="table-container">
        <ReusableAgGrid
          key={columnDefs.length}
          rowData={rowData}
          columnDefs={columnDefs}
          onGridReady={(params) => params.api.sizeColumnsToFit()}
          onFilterChanged={onFilterChanged}
          defaultColDef={{ resizable: true, filter: false }}
          pagination={true}
          paginationPageSize={10}
          className="ag-theme-alpine"

        />
      </div>
      {/* card form */}
      <FormCard title="User Registration" subtitle="Fill in your details below">
        <VerticalForm onSubmit={onSubmit}>
          <FormInput
            id="name"
            label="Name"
            placeholder="Enter your name"
            validation={{ required: "enter your name" }}
          />
          <FormInput
            id="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            validation={{
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: "Invalid email address"
              }
            }}
          />
          <FormInput
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            validation={{ required: "Password is required" }}
          />
          <Select
            id="status"
            label="Status"
            placeholder="Select a status"
            options={selectOptions}
            register={register}
            validation={{ required: "Status is required" }}
            errors={errors}
          />
          <MultiSelect
            id="multistatus"
            label="multistatus"
            register={register}
            placeholder='select option'
            options={selectOptions}
            validation={{ required: 'At least one option is required' }}
            errors={errors}
            isMulti={true}
          />

          <SearchableSelect
            options={selectOptions}
            label="Choose an Option"
            id="selectOption"
            validation={{ required: "This field is required" }}
            register={register}
            errors={errors}
          />

          <CheckBoxInput
            options={options}
            selectedValues={singleSelected}
            onChange={setSingleSelected}
            isMultiSelect={false}
            validation={{ required: "You must select an option." }}
            register={register}
            errors={errors}
            id="singleselect"
          />

          <h2>Multi Select</h2>
          <CheckBoxInput
            options={options}
            selectedValues={multiSelected}
            onChange={setMultiSelected}
            isMultiSelect={true}
            validation={{ required: "At least one option must be selected." }}
            register={register}
            errors={errors}
            id="multiselect"
          />
        </VerticalForm>
      </FormCard>
      <div>
        <Card
          title="Card Title"
          content="This is a reusable card component with customizable content."
          image="https://prium.github.io/phoenix/v1.19.0/assets/img//generic/66.jpg"
          footer={<IconButton
            type="button"
            label="Click Here"
            className=""
          />}
          titleSize="24px"
          contentSize="16px"
        />
      </div>

      <div>
        <H1>Custom H1 Heading</H1>
        <H2>Custom H2 Heading</H2>
        <H3>Custom H3 Heading</H3>
        <H4>Custom H4 Heading</H4>
        <H5>Custom H5 Heading</H5>
        <H6>Custom H6 Heading</H6>
      </div>
    </>
  );
}
