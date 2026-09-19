import type { Core } from '@strapi/strapi';

const PUBLIC_PERMISSIONS = {
  'api::annonce.annonce': ['find', 'findOne'],
  'api::voiture.voiture': ['find', 'findOne'],
  'api::parking.parking': ['find', 'findOne'],
  'api::location-voiture.location-voiture': ['find', 'findOne'],
};

const AUTHENTICATED_PERMISSIONS = {
  'api::annonce.annonce': ['find', 'findOne', 'create', 'update', 'delete'],
  'api::voiture.voiture': ['find', 'findOne', 'create', 'update', 'delete'],
  'api::parking.parking': ['find', 'findOne', 'create', 'update', 'delete'],
  'api::location-voiture.location-voiture': ['find', 'findOne', 'create', 'update', 'delete'],
};

async function setPermissions(strapi: Core.Strapi, roleName: string, permissions: Record<string, string[]>) {
  const role = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: roleName } });
  if (!role) return;

  for (const [uid, actions] of Object.entries(permissions)) {
    for (const action of actions) {
      const existing = await strapi.db.query('plugin::users-permissions.permission').findOne({
        where: { action: `${uid}.${action}`, role: role.id },
      });
      if (!existing) {
        await strapi.db.query('plugin::users-permissions.permission').create({
          data: { action: `${uid}.${action}`, role: role.id },
        });
      }
    }
  }
}

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await setPermissions(strapi, 'public', PUBLIC_PERMISSIONS);
    await setPermissions(strapi, 'authenticated', AUTHENTICATED_PERMISSIONS);
  },
};
