import React from "react";
import "./VisitorDataEntry.css";
import CustomTextInput from "../../components/common/CustomTextInput/CustomTextInput";
import CustomButton from "../../components/common/CustomButton/CustomButton";

const VisitorDataEntryPage = () => {
  return (
    <div className="page visitorDataEntryPage">
      <h1 className="title">تحصيل الزيارة</h1>
      <div className="divisions">
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
    </div>
  );
};

export default VisitorDataEntryPage;
