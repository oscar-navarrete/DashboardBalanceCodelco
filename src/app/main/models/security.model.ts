import { FuseUtils } from '@fuse/utils';

export class User
{
    id: string;
    name: string;
    lastName: string;
    avatar: string;
    nickname: string;
    username: string;
    jobTitle: string;
    email: string;
    phone: string;
    address: string;
    birthday: string;
    notes: string;
    groups: any;
    enabled: boolean;
    locked: boolean;
    group: string;
    prefix: string;
    neverExpire: boolean;
    changeNext: boolean;
    domainUser: string;


    constructor(user)
    {
        {
            this.id = user.id || FuseUtils.generateGUID();
            this.name = user.name || '';
            this.lastName = user.lastName || '';
            this.avatar = user.avatar || 'assets/images/avatars/profile.jpg';
            this.nickname = user.nickname || '';
            this.username = user.username || '';
            this.jobTitle = user.jobTitle || '';
            this.email = user.email || '';
            this.phone = user.phone || '';
            this.address = user.address || '';
            this.birthday = user.birthday || '';
            this.notes = user.notes || '';
            this.groups = user.groups || {};
            this.enabled = user.enabled;
            this.locked = user.locked;
            this.group = user.group;
            this.prefix = user.prefix;
            this.changeNext = user.changeNext;
            this.neverExpire = user.neverExpire;
            this.domainUser = user.domainUser;
        }
    }
}

export class UserGroup
{
    id: string;
    name: string;
    description: string;
    members: number;
    users: any;
    enabled: boolean;
    
    constructor(userGroup)
    {
        {
            this.id = userGroup.id || FuseUtils.generateGUID();
            this.name = userGroup.name || '';
            this.description = userGroup.description || '';
            this.members = userGroup.members;
            this.users = userGroup.users;
            this.enabled = userGroup.enabled;
        }
    }
}


export class Feature
{
    id: string;
    name: string;
    title: string;
    icon: string;
    route: string;
    system: string;
    systemName: string;
    groups: any;
    description: string;
    enabled: boolean;
    group: string;

    constructor(feature)
    {
        {
            this.id = feature.id || FuseUtils.generateGUID();
            this.name = feature.name || '';
            this.title = feature.title || '';
            this.icon = feature.icon || '';
            this.route = feature.route || '';
            this.system = feature.system || '';
            this.systemName = feature.systemName || '';
            this.description = feature.description || '';
            this.enabled = feature.enabled;
            this.group = feature.group;
            this.groups = feature.groups || {};
        }
    }
}

export class FeatureGroup
{
    id: string;
    name: string;
    description: string;
    enabled: number;


    constructor(userGroup)
    {
        {
            this.id = userGroup.id || FuseUtils.generateGUID();
            this.name = userGroup.name || '';
            this.description = userGroup.description || '';
            this.enabled = userGroup.enabled ;
        }
    }
}


export class System
{
    id: string;
    name: string;

    constructor(userGroup)
    {
        {
            this.id = userGroup.id || FuseUtils.generateGUID();
            this.name = userGroup.name || '';
        }
    }
}


export class Favorites
{
    id: string;
    title: string;
    type: string;
    icon: string;
    url: string;
    constructor(favorites)
    {
        {
            this.id = favorites.id;
            this.title = favorites.title;
            this.type = favorites.type;
            this.icon = favorites.icon;
            this.url = favorites.url;
        }
    }
}

export class Features
{
    id: string;
    title: string;
    type: string;
    icon: string;
    url: string;
    constructor(features)
    {
        {
            this.id = features.id;
            this.title = features.title;
            this.type = features.type;
            this.icon = features.icon;
            this.url = features.url;
        }
    }
}

export class Notification {
    recipient: string;
    subject: string;
    message: string;
    constructor(notification) {
        this.recipient = notification.recipient;
        this.subject = notification.subject;
        this.message = notification.message;
    }
}

export interface NotificationMessage {
    message_id: string;
    sender_username: string;
    sender_fullname: string;
    sender_imageUrl: string;
    sender_datetime: Date;
    sender_message: string;
    sender_subject: string;
}


