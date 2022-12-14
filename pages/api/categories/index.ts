import apiHandler, { checkAuth } from '../../../lib/apiHandler'
import prisma from '../../../lib/prisma'

interface GetAllCategoriesProps {
  select?: string
  include?: string
  productInclude?: string
  topupOnly?: boolean
  hasRequirementOnly?: boolean
  search?: string
}

export const getAllCategories = async ({
  select,
  include,
  productInclude,
  topupOnly,
  hasRequirementOnly,
  search,
}: GetAllCategoriesProps) => {
  let query: CustomObject = {
    where: {},
  }

  if (select) {
    query.select = select.split(',').reduce((acc, field) => {
      acc[field] = true
      return acc
    }, {})
  }

  if (include) {
    query.include = include.split(',').reduce((acc, field) => {
      acc[field] = true
      return acc
    }, {})
  }

  if (productInclude && query.include.products) {
    query.include.products = {
      include: productInclude.split(',').reduce((acc, field) => {
        acc[field] = true
        return acc
      }, {}),
    }
  }

  if (topupOnly) {
    query.where.isTopup = true
  }

  if (hasRequirementOnly) {
    query.where.requirement = { isNot: null }
  }

  // @ts-ignore
  let categories = await prisma.category.findMany(query)

  if (search) {
    categories = categories.filter((category) =>
      category.name.toLowerCase().includes(search.toLowerCase())
    )
  }

  return categories
}

const app = apiHandler()

export default app
  // get all categories
  .get(async (req, res) => {
    const { select, topupOnly, hasRequirementOnly, search } = req.query as {
      [key: string]: string
    }

    const categories = await getAllCategories({
      select,
      topupOnly: topupOnly == 'true' ? true : false,
      hasRequirementOnly: hasRequirementOnly == 'true' ? true : false,
      search,
    })
    res.status(200).json({ categories, length: categories.length })
  })
  // create new category
  .post(checkAuth('ADMIN'), async (req, res) => {
    if (!req.body.name) {
      throw { status: 400, message: 'Please provide name' }
    }

    req.body.slug = req.body.name.toLowerCase().replace(/ /g, '-')

    const category = await prisma.category.create({
      data: req.body,
    })

    res.status(201).json({ category })
  })
