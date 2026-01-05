import type { Schema, Struct } from '@strapi/strapi';

export interface ProductColor extends Struct.ComponentSchema {
  collectionName: 'components_product_colors';
  info: {
    description: 'Color options for products';
    displayName: 'Color';
    icon: 'palette';
  };
  attributes: {
    codigoHex: Schema.Attribute.String & Schema.Attribute.Required;
    imagemCor: Schema.Attribute.Media<'images'>;
    nome: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
  };
}

export interface ProductSize extends Struct.ComponentSchema {
  collectionName: 'components_product_sizes';
  info: {
    description: 'Size options for products';
    displayName: 'Size';
    icon: 'ruler';
  };
  attributes: {
    disponivel: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    nome: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'product.color': ProductColor;
      'product.size': ProductSize;
    }
  }
}
