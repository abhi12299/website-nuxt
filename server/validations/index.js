const Joi = require('@hapi/joi')

function validatePost({
  title,
  headerImageURL,
  metaKeywords,
  metaDescription,
  postedDate = Date.now(),
  body,
  published = 0
}) {
  const schema = Joi.object({
    title: Joi.string().required(),
    headerImageURL: Joi.string().allow(''),
    metaDescription: Joi.string().allow(''),
    postedDate: Joi.number(),
    body: Joi.string().required(),
    published: Joi.number().valid(0, 1),
    metaKeywords: Joi.array().items(Joi.string().allow(''))
  })

  const { error } = schema.validate({
    title,
    headerImageURL,
    metaDescription,
    postedDate,
    body,
    published,
    metaKeywords
  })
  return error
}

function validateSetPublished(body) {
  const schema = Joi.object({
    _id: Joi.string().required(),
    published: Joi.number()
      .valid(0, 1)
      .required()
  })
  const { error } = schema.validate(body)
  return error
}

function validateDeleteMedia(body) {
  const schema = Joi.object({
    _id: Joi.string().required()
  })
  const { error } = schema.validate(body)
  return error
}

function validateGetMedia(query) {
  const schema = Joi.object({
    skip: Joi.string()
      .regex(/^\d+$/)
      .default('0'),
    limit: Joi.string()
      .regex(/^\d+$/)
      .default('20'),
    sortBy: Joi.string().regex(/^(usedInPublishedPosts|createdAt)$/),
    sortOrder: Joi.string()
      .regex(/^(-1|1)$/)
      .default('-1')
  })

  const { error } = schema.validate(query)
  return error
}

const validateGetPosts = (query) => {
  const schema = Joi.object({
    skip: Joi.string().regex(/^\d+$/),
    limit: Joi.string().regex(/^\d+$/),
    sortBy: Joi.string().regex(/^(postedDate)$/),
    sortOrder: Joi.string().regex(/^(-1|1)$/),
    published: Joi.string().regex(/^(1|0|all)$/)
  })

  const { error } = schema.validate(query)
  return error
}

const validateGetPost = (query) => {
  const schema = Joi.object({
    id: Joi.string().required()
  })

  const { error } = schema.validate(query)
  return error
}

const validateEditPost = ({
  title,
  headerImageURL,
  metaKeywords,
  metaDescription,
  body
}) => {
  const schema = Joi.object({
    title: Joi.string(),
    headerImageURL: Joi.string().allow(''),
    metaDescription: Joi.string().allow(''),
    body: Joi.string(),
    metaKeywords: Joi.array().items(Joi.string().allow('')),
    keepOldId: Joi.bool()
  })
  const { error } = schema.validate({
    title,
    headerImageURL,
    metaDescription,
    body,
    metaKeywords
  })
  return error
}

const validateSearchSuggestions = (query) => {
  const schema = Joi.object({
    q: Joi.string().required(),
    sortBy: Joi.string().regex(/^(postedDate)$/i),
    sortOrder: Joi.string().regex(/^(1|-1)$/i),
    published: Joi.string().regex(/^(1|0|all)$/i)
  })
  const { error } = schema.validate(query)
  return error
}

const validateSearch = (query) => {
  const schema = Joi.object({
    q: Joi.string().required(),
    sortBy: Joi.string().regex(/^(postedDate)$/i),
    sortOrder: Joi.string().regex(/^(1|-1)$/i),
    published: Joi.string().regex(/^(1|0|all)$/i),
    skip: Joi.number().min(0),
    limit: Joi.number()
      .min(1)
      .max(20)
  })
  const { error } = schema.validate(query)
  return error
}

const validateGetLatestPosts = (query) => {
  const schema = Joi.object({
    limit: Joi.number()
      .integer()
      .min(1)
      .max(5)
  })

  const { error } = schema.validate(query)
  return error
}

const validateGetAllPosts = (query) => {
  const schema = Joi.object({
    limit: Joi.number()
      .integer()
      .min(1)
      .max(10),
    skip: Joi.number()
      .integer()
      .min(0),
    keywords: Joi.alternatives().try(
      Joi.string(),
      Joi.array().items(Joi.string())
    )
  })

  const { error } = schema.validate(query)
  return error
}

const validateSubscribe = (body) => {
  const schema = Joi.object({
    email: Joi.string()
      .trim()
      .email()
      .required()
  })
  const { error } = schema.validate(body)
  return error
}

const validateContactMe = (body) => {
  const schema = Joi.object({
    email: Joi.string()
      .trim()
      .email()
      .required(),
    name: Joi.string()
      .trim()
      .required(),
    message: Joi.string()
      .trim()
      .required()
  })
  const { error } = schema.validate(body)
  return error
}

module.exports = {
  validatePost,
  validateSetPublished,
  validateDeleteMedia,
  validateGetMedia,
  validateGetPosts,
  validateGetPost,
  validateEditPost,
  validateSearchSuggestions,
  validateSearch,
  validateGetLatestPosts,
  validateGetAllPosts,
  validateSubscribe,
  validateContactMe
}
