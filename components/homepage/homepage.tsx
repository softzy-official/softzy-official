import React from 'react'
import CategoryLists from './categoryLists'
import CategoryWithImage from './categoryWithImage'
import ProductByTitle from './productByTitle'

const Homepage = () => {
  return (
    <div>
        <CategoryLists/>
        <CategoryWithImage/>
        <ProductByTitle/>
    </div>
  )
}

export default Homepage