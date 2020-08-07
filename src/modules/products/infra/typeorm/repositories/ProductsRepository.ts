import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    // TODO
    const product = this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    // TODO
    const product = await this.ormRepository.findOne({
      where: {
        name,
      },
    });
    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    // TODO
    const ids = products.map(product => product.id);

    const findProducts = await this.ormRepository.find({
      where: {
        id: In(ids),
      },
    });

    return findProducts;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    // TODO
    const ids = products.map(product => product.id);

    const findProducts = await this.ormRepository.find({
      where: {
        id: In(ids),
      },
    });

    await findProducts.forEach(async (product, index) => {
      product.quantity -= products[index].quantity;

      await this.ormRepository.save(product);
    });

    const listProductsUpdated = await this.ormRepository.find({
      where: {
        id: In(ids),
      },
    });

    return listProductsUpdated;
  }
}

export default ProductsRepository;
