import React from "react";
import CustomTextInput from "./components/CustomTextInput";
import "./VisitorDataEntry.css";
import CustomButton from "./components/CustomButton/CustomButton";

const VisitorDataEntryPage = () => {
  return (
    <div className="page">
      <div className="division">
        <CustomTextInput name="رقم البطاقة الوطنية" type="text" />
      </div>
      <div className="division">
        <CustomTextInput name="الإسم الشخصي" type="text" />
        <CustomTextInput name="الإسم العائلي" type="text" />
        <CustomTextInput name="تاريخ الزيارة" type="date" isCentered />
        <CustomTextInput name="ساعة الزيارة" type="time" isCentered />
        <CustomTextInput name="القسم " type="text" />
        <CustomTextInput name="سبب الزيارة" type="text" />
      </div>
      <div className="division buttonDivision">
        <CustomButton name="التسجيل" isInsert={true} />
        <CustomButton name="الإلغاء" />
      </div>
    </div>
  );
};

export default VisitorDataEntryPage;
