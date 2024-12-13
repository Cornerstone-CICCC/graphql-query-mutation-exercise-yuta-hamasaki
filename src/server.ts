import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from '@apollo/server/standalone'
import { v4 as uuidv4 } from 'uuid'

// Products dataset
let products = [
  { id: "1", productName: "Apple", price: 3.99, qty: 2 },
  { id: "2", productName: "Banana", price: 1.99, qty: 3 },
  { id: "3", productName: "Orange", price: 2.00, qty: 4 },
  { id: "4", productName: "Mango", price: 5.50, qty: 5 },
  { id: "5", productName: "Watermelon", price: 8.99, qty: 2 }
]

// Type Definitions
const typeDefs = `#graphql
  type Product {
    id: ID!,
    productName: String,
    price: Float,
    qty: Int
  }

  type Query {
    products: [Product],
    getProductById(id: ID): Product,
    getProductTotalPrice(id: ID): Float # multiply product price with its qty
    getTotalQtyOfProducts: Int # sum of all qty of all products
  }

  type Mutation {
    addProduct(productName: String, price: Float, qty: Int): Product,
    updateProduct(id: ID, productName: String, price: Float, qty: Int): Product
    deleteProduct(id: ID): Product
  }
`

// Resolvers - Finish This
const resolvers = {
  Query: {
    products: () => products,
    getProductById: (_: unknown, {id}: { id: string }) => {
      return products.find(product => product.id === id)
    },
    getProductTotalPrice: (_: unknown, {id}: { id: string }) => {
      const oneProduct = products.find(product => product.id === id)
      return oneProduct ? oneProduct.price * oneProduct.qty : 0
    },
    getTotalQtyOfProducts: () => {
      return products.reduce((total, product) => total + product.qty, 0)
    }
  },
  Mutation: {
    addProduct: (_: unknown, product: { productName: string, price: number, qty: number }) => {
      const newProduct = {
        id: uuidv4(),
        productName: product.productName,
        price:product.price,
        qty: product.qty
      }
      products.push(newProduct)
      return newProduct
    },
    updateProduct: (_: unknown, product: { id: string, productName?: string, price?: number, qty?: number }) => {
      const productId = products.findIndex(product => product.id === product.id)
      products[productId] = {
        ...products[productId],
        ...(product.productName && { productName: product.productName }),
        ...(product.price !== undefined && { price: product.price }),
        ...(product.qty !== undefined && { qty: product.qty })
      }

      return products[productId]
    },
    deleteProduct: (_: unknown, {id}: { id: string }) => {
      const productIndex = products.findIndex(product => product.id === id)
      const deletedProduct = products[productIndex]
      products.splice(productIndex, 1)
      return deletedProduct
    }
  },
}

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers
})

// Start Apollo Server
const startServer = async () => {
  const { url } = await startStandaloneServer(server)
  console.log(`Server is running on ${url}...`)
}

startServer()