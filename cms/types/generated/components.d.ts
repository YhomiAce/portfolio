import type { Schema, Struct } from '@strapi/strapi';

export interface SharedBullet extends Struct.ComponentSchema {
  collectionName: 'components_shared_bullets';
  info: {
    description: '';
    displayName: 'Bullet';
    icon: 'bulletList';
  };
  attributes: {
    text: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 600;
      }>;
  };
}

export interface SharedEducation extends Struct.ComponentSchema {
  collectionName: 'components_shared_educations';
  info: {
    description: '';
    displayName: 'Education';
    icon: 'book';
  };
  attributes: {
    endYear: Schema.Attribute.Integer;
    institution: Schema.Attribute.String & Schema.Attribute.Required;
    qualification: Schema.Attribute.String & Schema.Attribute.Required;
    startYear: Schema.Attribute.Integer;
  };
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_links';
  info: {
    description: '';
    displayName: 'Link';
    icon: 'link';
  };
  attributes: {
    kind: Schema.Attribute.Enumeration<
      ['github', 'linkedin', 'email', 'website', 'other']
    > &
      Schema.Attribute.DefaultTo<'other'>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    url: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
  };
}

export interface SharedStat extends Struct.ComponentSchema {
  collectionName: 'components_shared_stats';
  info: {
    description: '';
    displayName: 'Stat';
    icon: 'chartBubble';
  };
  attributes: {
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    value: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 20;
      }>;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'shared.bullet': SharedBullet;
      'shared.education': SharedEducation;
      'shared.link': SharedLink;
      'shared.stat': SharedStat;
    }
  }
}
