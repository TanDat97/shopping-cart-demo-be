import { CoreService } from '@core';
import { CreateProductDto, GetListProductDto, UpdateProductDto } from './dto';
import { ProductRepository } from './repository';
import { AppError } from '@core/error';

export class ProductService extends CoreService {
  protected repository: ProductRepository;
  constructor() {
    super(new ProductRepository());
  }

  async getList(dto: GetListProductDto) {
    const query = this.repository.getListQuery(dto);
    const result = await this.repository.paginate(query, dto.page, dto.limit);
    return result;
  }

  async getDetail(id: number) {
    const result = await this.repository.findOneOrFail({ where: { id } });
    return result;
  }

  async create(dto: CreateProductDto) {
    const exist = await this.repository.findDuplicate(null, dto.sku).getOne();
    if (exist) {
      throw new AppError(400, { errorCode: 20001, message: 'SKU already exists!' });
    }

    const entity = this.repository.create({
      sku: dto.sku,
      name: dto.name,
      price: dto.price,
      status: dto.status,
      createdBy: this.context.user?.id,
      updatedBy: this.context.user?.id,
    });
    return this.repository.save(entity);
  }

  async update(id: number, dto: UpdateProductDto) {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      throw new AppError(404, { errorCode: 20002, message: 'Product not found!' });
    }

    const exist = await this.repository.findDuplicate(id, dto.sku).getOne();
    if (exist) {
      throw new AppError(400, { errorCode: 20001, message: 'SKU already exists!' });
    }

    return this.repository.save({ ...entity, ...dto, updatedBy: this.context.user?.id });
  }

  async delete(id: number) {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      throw new AppError(404, { errorCode: 20002, message: 'Product not found!' });
    }
    return this.repository.softDelete({ id });
  }
}
