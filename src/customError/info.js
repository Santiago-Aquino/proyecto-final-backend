// informacion que tira en consola del error
export const generateProductErrorInfo = (product) => {
  return `Algunas propiedades no estan completas:
  ---------------------------------------------------------
    * el "title" del producto era necesario ${product.title}
    * el "description" del producto era necesario ${product.description}
    * el "code" del producto era necesario ${product.code}
    * el "price" del producto era necesario ${product.price}
    * el "status" del producto era necesario ${product.status}
    * el "stock" del producto era necesario ${product.stock}
    * el "category" del producto era necesario ${product.category}
    * el "thumbanil" del producto era necesario ${product.thumbnail}`
};

export const generateUserErrorInfo = (user) => {
  return `Algunas propiedades no estan completas:
  ---------------------------------------------------------
    * el "first_name" del producto era necesario ${user.first_name}
    * el "last_name" del producto era necesario ${user.last_name}
    * el "email" del producto era necesario ${user.email}
    * el "password" del producto era necesario ${user.password}
    * el "age" del producto era necesario ${user.age}`
};