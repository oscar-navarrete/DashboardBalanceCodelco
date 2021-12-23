export interface Componente {
    icon: string;
    name: string;
    redirectTo: string;
}

export interface Options {
    title: string;
    icon: string;
    description: string;
    redirectTo: string;
    items: number;
    locked: number;
}

export interface ProfileForm {
    fieldName: string;
    fieldTitle: string;
    fieldValue: string;
    fieldDescription: string;
    // tslint:disable-next-line: ban-types
    // onEdit: Function;
    icon: string;
}


export interface MessageNotification {
    message_id: string;
    sender_username: string;
    sender_fullname: string;
    sender_imageUrl: string;
    sender_datetime: Date;
    sender_message: string;
    sender_subject: string;
    sender_read: boolean;
}
