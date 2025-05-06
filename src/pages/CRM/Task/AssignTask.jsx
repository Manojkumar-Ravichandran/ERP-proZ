import React, { useEffect, useState } from "react";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import icons from "../../../contents/Icons";
import Modal from "../../../UI/Modal/Modal";
import { set } from "date-fns";
import { useForm } from "react-hook-form";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import { arrOptForDropdown, getDefaultDate } from "../../../utils/Data";
import { validationPatterns } from "../../../utils/Validation";
import Select from "../../../UI/Select/SingleSelect";
import TextArea from "../../../UI/Input/TextArea/TextArea";
import { priorityData } from "../../../contents/CRM/CRM";
import { getEmployeeListEffect } from "../../../redux/common/CommonEffects";
import { addTaskListEffect } from "../../../redux/CRM/Task/TaskEffect";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import MultiSearchableSelect from "../../../UI/Select/MultiSelector";
import MultiSelect from "../../../UI/Select/MultiSelect";

export default function AssignTask() {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [toastData, setToastData] = useState({ show: false });
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm({ defaultValues: { date: getDefaultDate() } });
  const dateWatch = watch("date");

  useEffect(() => {}, [isAddTaskOpen]);
  useEffect(() => {
    (async () => {
      const { data } = await getEmployeeListEffect();
      if (data?.data?.length > 0) {
        setEmployeeList(arrOptForDropdown(data?.data, "name", "id") || []);
      } else {
        setEmployeeList([]);
      }
    })();
  }, []);

  const assignTaskHandler = async (data) => {
    try {
      const res = await addTaskListEffect(data);
      if (res?.data?.status) {
        setValue("date", getDefaultDate());
      }
      if (res.data.status === "success") {
        setToastData({
          show: true,
          type: "success",
          message: res?.data?.message,
        });
      }
    } catch (error) {
      setToastData({
        show: true,
        type: "error",
        message: error?.data?.message,
      });
    } finally {
      setIsAddTaskOpen(false);
      reset();
    }
  };
  const toastOnclose = () => {
    setToastData(() => ({ ...toastData, show: false }));
  };
  return (
    <>
      {toastData?.show && (
        <AlertNotification
          show={toastData?.show}
          message={toastData?.message}
          onClose={toastOnclose}
          type={toastData?.type}
        />
      )}
      <IconButton
        label="Assign"
        icon={icons?.plusIcon}
        onClick={() => {
          setIsAddTaskOpen(true);
        }}
      />

      <Modal
        isOpen={isAddTaskOpen}
        onClose={() => {
          setIsAddTaskOpen(false);
        }}
        title="Assign Task"
        showFooter={false}
        size="l"
      >
        <form onSubmit={handleSubmit(assignTaskHandler)}>
          <div className="grid  grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormInput
                id="date"
                iconLabel={React.cloneElement(icons.calendarWDate, {
                  size: 20,
                })}
                label="Date"
                type="date"
                register={register}
                errors={errors}
                validation={{ required: "Date is required" }}
                min={getDefaultDate()}
              />
            </div>
            <FormInput
              id="task_name"
              iconLabel={React.cloneElement(icons.calendarWDate, { size: 20 })}
              label="Task Name"
              register={register}
              errors={errors}
              validation={{
                required: "Task name is required",
                pattern: {
                  value: validationPatterns?.spacePattern,
                  message: "Provide Valid Task Name",
                },
              }}
            />
            <Select
              options={employeeList}
              label="Manager"
              id="assigned_manager"
              placeholder="Select Manager"
              iconLabel={React.cloneElement(icons.TbUserCheck, {
                size: 20,
              })}
              register={register}
              errors={errors}
              validation={{ required: "Manager is required" }}
            />
            <div className="col-span-2">
              <MultiSelect
                id="assigned_to"
                label="Assign To"
                placeholder="Select Assignees"
                options={employeeList}
                register={register}
                value={[]}
                errors={errors}
                isMulti={true}
                onChange={(selectedValues)=>{
                  setValue("assigned_to", selectedValues);
                }}
              />
            </div>
            
            <div className="col-span-2">
              <TextArea
                id="description"
                iconLabel={React.cloneElement(icons.calendarWDate, {
                  size: 20,
                })}
                label="Task Description"
                register={register}
                errors={errors}
                showStar={false}
                placeholder={"Enter description"}
                validation={{ required: false }}
              />
            </div>

            <Select
              options={priorityData}
              label="Priority"
              id="priority"
              placeholder="Select Priority"
              iconLabel={React.cloneElement(icons.TbUserCheck, {
                size: 20,
              })}
              register={register}
              errors={errors}
              validation={{ required: "Priority is required" }}
            />

            <FormInput
              id="deadline"
              iconLabel={React.cloneElement(icons.calendarWDate, { size: 20 })}
              label="Deadline"
              type="date"
              register={register}
              errors={errors}
              validation={{ required: "DeadLine is required" }}
              min={dateWatch}
            />
          </div>
          <div className="flex gap-4 my-3">
            <IconButton label={"Cancel"} type="button" className="btn_cancel" />
            <IconButton label={"Assign"} type="submit" />
          </div>
        </form>
      </Modal>
    </>
  );
}
