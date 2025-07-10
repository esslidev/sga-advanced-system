export const ErrorHttpStatusCode = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  CONFLICT: 409, // مضاف لحالات مثل "already exists"
} as const;

export const ErrorTitle = {
  AUTHENTICATION_ERROR: "Authentication-related issue",
  INVALID_CREDENTIALS: "Invalid Credentials",
  LACK_OF_CREDENTIALS: "Lack of Credentials",
  TOKEN_EXPIRED: "Expired Access token",
  INVALID_SIGNUP_DATA: "Invalid Sign-up Data",
  INVALID_SIGNIN_DATA: "Invalid Sign-in Data",
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  NOT_FOUND: "Resource Not Found",
  FORBIDDEN: "Access Forbidden",
  USER_ALREADY_EXISTS: "User Already Exists",
  INVALID_EMAIL: "Invalid Email",
  INVALID_PASSWORD: "Invalid Password",

  // Visitor-related
  VISITOR_ALREADY_EXISTS: "Visitor Already Exists",
  VISITOR_DELETED: "Visitor Deleted Successfully",
  VISITOR_DELETED_PREVIOUSLY: "Visitor Previously Deleted",

  // Visit-related
  VISIT_NOT_FOUND: "Visit Not Found",
  INVALID_VISIT_DATA: "Invalid Visit Data",
} as const;

export const ErrorMessage = {
  AUTHENTICATION_ERROR:
    "Authentication error. Please provide valid credentials.",
  INVALID_CREDENTIALS: "Invalid credentials provided. Please try again.",
  LACK_OF_CREDENTIALS:
    "The request lacks authentication credentials for the target resource.",
  TOKEN_EXPIRED:
    "The token provided has expired. Please obtain a new token to continue accessing the resources.",
  INVALID_SIGNUP_DATA:
    "Invalid sign-up data. Please provide valid information for sign-up.",
  INVALID_SIGNIN_DATA:
    "Invalid sign-in data. Please provide valid information for sign-in.",
  NOT_FOUND: "The requested resource could not be found on the server.",
  FORBIDDEN:
    "You do not have the necessary permissions to access this resource.",
  USER_ALREADY_EXISTS: "User with this email or third-party ID already exists.",
  INVALID_EMAIL:
    "Invalid email provided. Please provide a valid email address.",
  INTERNAL_ERROR:
    "An internal error occurred. Please try again later or contact support.",

  INVALID_PASSWORD:
    "Invalid password provided. Password must be at least 8 characters long and contain both letters and numbers.",
  INTERNAL_SERVER_ERROR:
    "An unexpected error occurred on the server. Please try again later or contact support for assistance.",

  // Visitor-related
  VISITOR_ALREADY_EXISTS:
    "Visitor with the provided information already exists in the system.",
  VISITOR_DELETED: "The visitor has been successfully deleted from the system.",
  VISITOR_DELETED_PREVIOUSLY:
    "This visitor was previously deleted. Please contact support for further assistance.",

  // Visit-related
  VISIT_NOT_FOUND:
    "The requested visit could not be found. Please verify the visit ID.",
  INVALID_VISIT_DATA:
    "Invalid visit data provided. Please check the input and try again.",
} as const;
