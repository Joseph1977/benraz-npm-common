export interface ContactUsWidgetConfig {
  apiUrl: string; // api url
  theme: {
    buttonIcon?: string; // main button icon
    buttonColor?: string; // main button color
    buttonPosition?: ButtonPosition; // main button position
    modalWidth?: string; // modal width
    modalHeight?: string; // modal height
    modalClass?: string; // modal class
    modalAnimationDuration?: number; // modal animation duration
    header: {
      logoUrl?: string; // logo url
      logoIcon?: string; // logo material icon
      titleClass?: string; // title class
      headerBg?: string; // header background color
      headerTitleColor?: string;
    };
    headerTitle: string;
    typesIconColor?: string; // form types icons
    bgColor?: string; // modal backgroud color
    color?: string; // modal foreground color
    nextButtonClass?: string; // next button class
    previousButtonClass?: string; // previous button class
    labelColor?: string;
  };
  labels?: {
    category?: string; // category
    subject?: string; // subject
    message?: string; // message
    name?: string; // name
    email?: string; // email
    submit?: string; // submit
  };
  forms: FormConfig[]; // form configs
  userFullName?: string; // user full name
  userId?: string; // user identifier
  email?: string; // email
  additionalData?: { [key: string]: string }; // additional data
}

export interface FormConfig {
  type: FormType; // maps to enum
  title: string; // display title
  matIcon: string; // Material icon name
  description?: string; // optional description
  isActive?: boolean; // whether to show in the list
  subjects?: string[]; // optional subjects for select field
}

export enum ButtonPosition {
  BottomRight = 'bottom-right',
  BottomLeft = 'bottom-left',
}

export enum FormType {
  LeaveAMessage = 1,
  ShareFeedback = 2,
  ReportBug = 3,
}

export interface WidgetConfigApiRequest {
  message: string;
  name: string;
  email: string;
  currentPageUrl: string;
  additionalData?: { [key: string]: string };
  userId?: string;
  subject?: string;
  type: FormType;
}

export interface WidgetConfigApiResponse {
  status: boolean;
  type: FormType;
  data: any;
  error: any;
}
