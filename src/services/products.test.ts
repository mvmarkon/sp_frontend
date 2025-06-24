import { productsService } from './products';
import api from './api'; // Importa la instancia de axios configurada

vi.mock('./api'); // Mockea el módulo api.ts

describe('productsService', () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada prueba
    vi.clearAllMocks();
  });

  it('should fetch products successfully', async () => {
    const mockProducts = [{ id: 1, name: 'Test Product 1' }, { id: 2, name: 'Test Product 2' }];
    (api.get as vi.Mock).mockResolvedValue({ data: { results: mockProducts, count: 2 } });

    const products = await productsService.getProducts();
    expect(products).toEqual({ results: mockProducts, count: 2 });
    expect(api.get).toHaveBeenCalledWith('/products/', { params: undefined });
  });

  it('should fetch a single product successfully', async () => {
    const mockProduct = { id: 1, name: 'Test Product' };
    (api.get as vi.Mock).mockResolvedValue({ data: mockProduct });

    const product = await productsService.getProduct(1);
    expect(product).toEqual(mockProduct);
    expect(api.get).toHaveBeenCalledWith('/products/1/');
  });

  it('should create a product successfully', async () => {
    const newProductData = { name: 'New Product', price: 100, stock: 10 };
    const createdProduct = { id: 3, ...newProductData };
    (api.post as vi.Mock).mockResolvedValue({ data: createdProduct });

    const product = await productsService.createProduct(newProductData);
    expect(product).toEqual(createdProduct);
    expect(api.post).toHaveBeenCalledWith('/products/', expect.any(FormData), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  });

  it('should update a product successfully', async () => {
    const updatedProductData = { name: 'Updated Product' };
    const updatedProduct = { id: 1, name: 'Updated Product', price: 100, stock: 10 };
    (api.patch as vi.Mock).mockResolvedValue({ data: updatedProduct });

    const product = await productsService.updateProduct(1, updatedProductData);
    expect(product).toEqual(updatedProduct);
    expect(api.patch).toHaveBeenCalledWith('/products/1/', expect.any(FormData), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  });

  it('should delete a product successfully', async () => {
    (api.delete as vi.Mock).mockResolvedValue({});

    await productsService.deleteProduct(1);
    expect(api.delete).toHaveBeenCalledWith('/products/1/');
  });

  it('should fetch low stock products successfully', async () => {
    const mockLowStockProducts = [{ id: 1, name: 'Low Stock Product' }];
    (api.get as vi.Mock).mockResolvedValue({ data: mockLowStockProducts });

    const lowStockProducts = await productsService.getLowStockProducts();
    expect(lowStockProducts).toEqual(mockLowStockProducts);
    expect(api.get).toHaveBeenCalledWith('/products/low-stock/');
  });
});