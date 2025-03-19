import { productDesignsData } from './product-designs.data';
import { usersData } from './users.data';

export const favoriteDesignsData = [
  {
    id: 'fav001',
    userId: usersData.users.find(user => user.email === 'customer@gmail.com')?.id,
    designId: productDesignsData.productDesigns.find(design => design.id === 'design001')?.id,
    createdAt: new Date(),
  },
  {
    id: 'fav002',
    userId: usersData.users.find(user => user.email === 'manager@gmail.com')?.id,
    designId: productDesignsData.productDesigns.find(design => design.id === 'design002')?.id,
    createdAt: new Date(),
  },
]; 