import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Aplicaciones',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        children : [
            {
                id       : 'users',
                title    : 'Cuentas de Usuario',
                translate: 'NAV.USERS',
                type     : 'item',
                icon     : 'account_box',
                url      : '/apps/security/accounts'
            }
        ]
    }
];
