export const SuccessHttpStatusCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  ACCEPTED: 202,
} as const;

export const SuccessTitle = {
  VISITOR_CREATED: "Visitor Created Successfully",
  VISITOR_UPDATED: "Visitor Updated Successfully",
  VISITOR_DELETED: "Visitor Deleted Successfully",
  OPERATION_SUCCESSFUL: "Operation Successful",
} as const;

export const SuccessMessage = {
  VISITOR_CREATED: "The visitor has been successfully created in the system.",
  VISITOR_UPDATED: "The visitor details have been successfully updated.",
  VISITOR_DELETED: "The visitor has been successfully deleted from the system.",
  OPERATION_SUCCESSFUL: "The operation was completed successfully.",
} as const;
